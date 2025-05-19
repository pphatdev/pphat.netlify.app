/**
 * Application constants
 */

import { configDotenv } from "dotenv";

configDotenv();

// Contact information
export const CONTACT_EMAIL = process.env.GMAIL_USER || 'info.sophat@gmail.com';
export const CONTACT_PHONE = process.env.CONTACT_PHONE || '+855 12 345 678';
export const CONTACT_LOCATION = process.env.CONTACT_LOCATION || 'Phnom Penh, Cambodia';
