import { NextRequest, NextResponse } from 'next/server';
import { requireUserSession } from '@lib/auth';
import { db, initializeDatabase } from '@lib/db/client';
import { users } from '@lib/db/schema';

export async function GET(request: NextRequest) {
    try {
        const session = await requireUserSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await initializeDatabase();
        
        // Fetch all users (editors and admins can be moderators)
        const allUsers = await db.select().from(users);
        
        const userList = allUsers.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
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
