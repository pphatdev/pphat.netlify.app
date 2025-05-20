/**
 * Application constants
 */
import { config } from 'dotenv';
config()

// Contact information
export const CONTACT_EMAIL = process.env.GMAIL_USER || 'info.sophat@gmail.com';
export const CONTACT_PHONE = process.env.CONTACT_PHONE || '+855 12 345 678';
export const CONTACT_LOCATION = process.env.CONTACT_LOCATION || 'Phnom Penh, Cambodia';

export const appName = "LEAT Sophat"
export const appTitle = "PPhat Dev"
export const appPositions = ["Senior Front-end Developer.", "UI/UX Designer."]
export const appDescriptions = "Hello! I'm Sophat LEAT, also known as PPhat, and I'm thrilled to have you here. This portfolio showcases my journey, projects, and passions as a developer and creator. Explore my work, check out my skills, and feel free to connect if you'd like to collaborate or learn more.\nLet's build something amazing together!"
export const currentDomain = process.env.NEXT_PUBLIC_APP_URL || "https://pphat.netlify.app"