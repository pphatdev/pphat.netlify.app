/**
 * Types for email functionality
 */

/**
 * Interface for email data
 */
export interface EmailData {
    to: string;
    from: string;
    name: string;
    subject: string;
    message: string;
}
