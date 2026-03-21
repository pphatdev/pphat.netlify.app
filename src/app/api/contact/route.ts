import { NextRequest, NextResponse } from 'next/server';
import {
    createContactSubmission,
    updateContactSubmissionStatus,
} from '@lib/db/contact-submissions';
import { sendContactEmail } from '@lib/utils/email-service';
import { CONTACT_EMAIL } from '../../../lib/constants';

// Simple rate limiting for spam prevention
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;
const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();

export async function POST(request: NextRequest) {
    try {
        // Get client IP for rate limiting
        const forwardedFor = request.headers.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

        // Check rate limit
        const now = Date.now();
        const ipData = ipRequestCounts.get(ip);

        if (ipData && now - ipData.timestamp < RATE_LIMIT_WINDOW) {
            if (ipData.count >= MAX_REQUESTS_PER_WINDOW) {
                return NextResponse.json(
                    { error: 'Too many requests. Please try again later.' },
                    { status: 429 }
                );
            }

            ipRequestCounts.set(ip, {
                count: ipData.count + 1,
                timestamp: ipData.timestamp
            });
        } else {
            ipRequestCounts.set(ip, { count: 1, timestamp: now });
        }

        // Process form data
        const formData = await request.json();
        const name = typeof formData.name === 'string' ? formData.name.trim() : '';
        const email = typeof formData.email === 'string' ? formData.email.trim() : '';
        const subject = typeof formData.subject === 'string' ? formData.subject.trim() : '';
        const message = typeof formData.message === 'string' ? formData.message.trim() : '';

        // Validate the form data
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Please fill in all required fields' },
                { status: 400 }
            );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Please provide a valid email address' },
                { status: 400 }
            );
        }

        const userAgent = request.headers.get('user-agent');

        // Basic spam detection
        const spamTriggers = /viagra|casino|lottery|crypto|bitcoin|earn money|make money fast|\$\d+,\d+ a day/i;
        if (spamTriggers.test(message)) {
            await createContactSubmission({
                name,
                email,
                subject,
                message,
                ipAddress: ip,
                userAgent,
                deliveryStatus: 'spam',
                isSpam: true,
            });

            // Silent fail for likely spam
            return NextResponse.json({
                success: true,
                message: `Your message has been sent to ${CONTACT_EMAIL}!`
            });
        }

        const submission = await createContactSubmission({
            name,
            email,
            subject,
            message,
            ipAddress: ip,
            userAgent,
            deliveryStatus: 'pending',
            isSpam: false,
        });

        // Send the email using Gmail
        const success = await sendContactEmail({
            to: CONTACT_EMAIL,
            from: email,
            name,
            subject,
            message
        });

        if (!success) {
            await updateContactSubmissionStatus(submission.id, 'failed');
            throw new Error('Failed to send email');
        }

        await updateContactSubmissionStatus(submission.id, 'delivered');

        // Return a success response
        return NextResponse.json({
            success: true,
            message: `Your message has been sent to ${CONTACT_EMAIL}!`
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'An error occurred while sending your message. Please try again later.' },
            { status: 500 }
        );
    }
}
