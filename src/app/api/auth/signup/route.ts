import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { apiRegister } from '@lib/api-client';

const signupSchema = z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email(),
    password: z.string().min(8).max(128),
});

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();
        const parsedPayload = signupSchema.safeParse(payload);

        if (!parsedPayload.success) {
            return NextResponse.json(
                { error: 'Invalid signup payload', issues: parsedPayload.error.flatten() },
                { status: 400 }
            );
        }

        const result = await apiRegister({
            name: parsedPayload.data.name,
            email: parsedPayload.data.email,
            password: parsedPayload.data.password,
        });

        const user = result.data;

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        const status = (error as { status?: number }).status || 500;
        const message = status === 409 ? 'Email is already registered' : 'Failed to create account';
        return NextResponse.json({ error: message }, { status });
    }
}