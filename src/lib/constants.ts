/**
 * Application constants
 */
import { config } from 'dotenv';
config()

// Contact information
export const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'info.sophat@gmail.com';
export const CONTACT_PHONE = process.env.CONTACT_PHONE || '+855 96918 3363';
export const CONTACT_LOCATION = process.env.CONTACT_LOCATION || 'Phnom Penh, Cambodia';

// Personal information
export const PERSON_NAME = process.env.PERSON_NAME || "Leat Sophat";
export const PERSON_ALTERNATE_NAME = process.env.PERSON_ALTERNATE_NAME || "PPhat";
export const PERSON_JOB_TITLE = process.env.PERSON_JOB_TITLE || "Senior Front-end Developer";
export const PERSON_IMAGE = process.env.PERSON_IMAGE || "/assets/avatars/hero.webp";

// Address information
export const ADDRESS_STREET = process.env.ADDRESS_STREET || "Street 123, Sangkat Kamboul";
export const ADDRESS_LOCALITY = process.env.ADDRESS_LOCALITY || "Phnom Penh";
export const ADDRESS_REGION = process.env.ADDRESS_REGION || "Phnom Penh";
export const ADDRESS_POSTAL_CODE = process.env.ADDRESS_POSTAL_CODE || "120905";
export const ADDRESS_COUNTRY = process.env.ADDRESS_COUNTRY || "KH";

// Company information
export const COMPANY_NAME = process.env.COMPANY_NAME || "TURBOTECH CO., LTD";
export const COMPANY_URL = process.env.COMPANY_URL || "https://turbotech.com.kh/";

// Social media links
export const GITHUB_URL = process.env.GITHUB_URL || "https://github.com/pphatdev";
export const LINKEDIN_URL = process.env.LINKEDIN_URL || "https://kh.linkedin.com/in/pphatdev";
export const TWITTER_URL = process.env.TWITTER_URL || "https://x.com/pphatdev";
export const FIGMA_URL = process.env.FIGMA_URL || "https://figma.com/@PPhat";

// Education
export const UNIVERSITY_NAME = process.env.UNIVERSITY_NAME || "Royal University of Phnom Penh";

export const appName = "LEAT Sophat"
export const appTitle = "PPhat Dev"
export const appPositions = ["Senior Front-end Developer.", "UI/UX Designer."]
export const appDescriptions = "Hello! I'm Sophat LEAT, also known as PPhat, and I'm thrilled to have you here. This portfolio showcases my journey, projects, and passions as a developer and creator. Explore my work, check out my skills, and feel free to connect if you'd like to collaborate or learn more.\nLet's build something amazing together!"
export const currentDomain = process.env.NEXT_PUBLIC_APP_URL || "https://pphat.netlify.app"