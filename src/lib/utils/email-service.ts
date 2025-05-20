/**
 * Email service utilities for handling contact form submissions
 * This file contains SERVER-SIDE ONLY code
 */
import { EmailData } from '@lib/types/email';
import nodemailer from 'nodemailer';

/**
 * Send a contact form email using Gmail
 * This function runs on the server-side only (in API routes or Server Actions)
 */
export async function sendContactEmail(data: EmailData): Promise<boolean> {
    try {
        return await sendWithGmail(data);
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
}

/**
 * Implementation using Gmail via Nodemailer
 */
async function sendWithGmail(data: EmailData): Promise<boolean> {
    try {
        // Create a transporter with Gmail settings
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // Format the HTML content for better presentation
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Contact Form Submission</h2>

                <div style="margin: 20px 0;">
                <p><strong>From:</strong> ${data.name} (${data.from})</p>
                <p><strong>Subject:</strong> ${data.subject}</p>
                </div>

                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h3 style="margin-top: 0; color: #555;">Message:</h3>
                <div style="line-height: 1.5;">${data.message.replace(/\n/g, '<br/>')}</div>
                </div>

                <div style="font-size: 12px; color: #777; margin-top: 30px; padding-top: 10px; border-top: 1px solid #eee;">
                <p>This email was sent from the contact form on your website.</p>
                </div>
            </div>
    `;

        // Format the email message
        const mailOptions = {
            from: {
                name: 'Contact Form',
                address: process.env.GMAIL_USER || 'noreply@example.com',
            },
            to: data.to,
            replyTo: data.from,
            subject: `[Contact Form] ${data.subject}`,
            text: `Name: ${data.name}\nEmail: ${data.from}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`,
            html: htmlContent,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Gmail error:', error);
        return false;
    }
}
