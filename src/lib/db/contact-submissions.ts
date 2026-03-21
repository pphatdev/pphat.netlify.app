import { eq } from 'drizzle-orm';
import { db, initializeDatabase } from './client';
import { contactSubmissions } from './schema';

export type ContactDeliveryStatus = 'pending' | 'delivered' | 'failed' | 'spam';

export interface CreateContactSubmissionInput {
    name: string;
    email: string;
    subject: string;
    message: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    deliveryStatus?: ContactDeliveryStatus;
    isSpam?: boolean;
}

export async function createContactSubmission(input: CreateContactSubmissionInput): Promise<{
    id: string;
    createdAt: string;
}> {
    await initializeDatabase();

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await db.insert(contactSubmissions).values({
        id,
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        deliveryStatus: input.deliveryStatus ?? 'pending',
        isSpam: input.isSpam ?? false,
        createdAt,
    });

    return { id, createdAt };
}

export async function updateContactSubmissionStatus(
    id: string,
    deliveryStatus: ContactDeliveryStatus
): Promise<void> {
    await initializeDatabase();

    await db
        .update(contactSubmissions)
        .set({
            deliveryStatus,
            deliveredAt: deliveryStatus === 'delivered' ? new Date().toISOString() : null,
        })
        .where(eq(contactSubmissions.id, id));
}