import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@lib/auth';

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || !user.backendToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/v1/api/dashboard`, {
            headers: {
                'Authorization': `Bearer ${user.backendToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log(response);


        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to fetch dashboard data' }));
            return NextResponse.json(error, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Dashboard init error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
