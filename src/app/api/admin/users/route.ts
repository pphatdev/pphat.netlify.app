import { NextRequest, NextResponse } from 'next/server';
import { requireUserSession, getApiToken } from '@lib/auth';
import { apiListUsers } from '@lib/api-client';

export async function GET(request: NextRequest) {
    try {
        const session = await requireUserSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = await getApiToken();
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await apiListUsers(token);

        const userList = (result.data || []).map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            image: '',
            role: user.role,
        }));

        return NextResponse.json(userList);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}
