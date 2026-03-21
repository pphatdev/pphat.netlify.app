import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { createUser, getUserByEmail } from '@lib/db/auth-users';

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

        const existingUser = await getUserByEmail(parsedPayload.data.email);
        if (existingUser) {
            return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
        }

        const passwordHash = await hash(parsedPayload.data.password, 12);
        const user = await createUser({
            email: parsedPayload.data.email,
            name: parsedPayload.data.name,
            passwordHash,
            provider: 'credentials',
        });

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
        return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }
}