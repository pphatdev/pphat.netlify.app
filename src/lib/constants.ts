/**
 * Application constants
 */

// Contact information
export const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'info.sophat@gmail.com';
export const CONTACT_PHONE = process.env.CONTACT_PHONE || '+855 96918 3363';
export const CONTACT_LOCATION = process.env.CONTACT_LOCATION || 'Phnom Penh, Cambodia';

// Personal information
export const PERSON_NAME = process.env.PERSON_NAME || "Sophat LEAT";
export const PERSON_ALTERNATE_NAME = process.env.PERSON_ALTERNATE_NAME || "PPhat";
export const PERSON_RELEGIEN_NAME = process.env.PERSON_RELEGIEN_NAME || "LEAT Sophat";
export const PERSON_SHORT_NAME = process.env.PERSON_SHORT_NAME || "Sophat";
export const PERSON_KHMER_NAME = process.env.PERSON_KHMER_NAME || "លាត សុផាត";
export const PERSON_NAME_VARIANTS = [
	"Sophat LEAT",
	"LEAT Sophat",
	"PPhat",
	"Sophat",
	"លាត សុផាត"
];
export const PERSON_GIVEN_NAME = process.env.PERSON_GIVEN_NAME || "Sophat";
export const PERSON_FAMILY_NAME = process.env.PERSON_FAMILY_NAME || "LEAT";
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
export const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pphat.me"

export const FAQS = [
    {
        question: `Who is ${PERSON_NAME}?`,
        answer: `${PERSON_NAME} also known as ${PERSON_ALTERNATE_NAME} or ${PERSON_RELEGIEN_NAME} (if you can read Khmer: ${PERSON_KHMER_NAME}) is a ${PERSON_JOB_TITLE} and Freelance UI/UX Designer based in ${ADDRESS_LOCALITY}, Cambodia. He is the creator of pphat.me and specializes in building modern, performant web applications with a focus on user experience.`,
    },
    {
        question: `What does ${PERSON_NAME} do professionally?`,
        answer: `${PERSON_NAME} works as a ${PERSON_JOB_TITLE} at ${COMPANY_NAME} and operates as a Freelance UI/UX Designer. He builds responsive, accessible web interfaces and designs intuitive digital experiences for clients, combining technical expertise with a strong design background.`,
    },
    {
        question: `What technologies does ${PERSON_NAME} specialize in?`,
        answer: `${PERSON_NAME} specializes in React, Next.js, TypeScript, and Tailwind CSS on the front-end. He also works with Node.js, Express, PostgreSQL, and MongoDB on the back-end. For design he uses Figma and the Adobe Creative Suite, and he deploys projects on Netlify and Vercel.`,
    },
    {
        question: `Where is ${PERSON_NAME} based?`,
        answer: `${PERSON_NAME} is based in ${ADDRESS_LOCALITY}, ${ADDRESS_COUNTRY === "KH" ? "Cambodia" : ADDRESS_COUNTRY}. He works both on-site at ${COMPANY_NAME} and remotely as a freelancer for clients around the world.`,
    },
    {
        question: `How many years of experience does ${PERSON_NAME} have?`,
        answer: `${PERSON_NAME} started his career as a Front-end Developer in 2021, giving him 5+ years of professional experience in web development and UI/UX design. He has worked on a wide range of projects from productivity tools to creative web experiments.`,
    },
    {
        question: `Where did ${PERSON_NAME} study?`,
        answer: `${PERSON_NAME} studied at ${UNIVERSITY_NAME}. His academic background combined with self-driven learning and real-world project experience has shaped him into a well-rounded developer and designer.`,
    },
    {
        question: `What is PPhat.me?`,
        answer: `PPhat.me is the personal portfolio website of ${PERSON_NAME} (${PERSON_ALTERNATE_NAME}). It showcases his projects, skills, blog posts, and career journey as a ${PERSON_JOB_TITLE} and UI/UX Designer. The site is built with Next.js and deployed on Netlify.`,
    },
    {
        question: `How can I contact ${PERSON_NAME}?`,
        answer: `You can contact ${PERSON_NAME} via email at ${CONTACT_EMAIL}, connect with him on LinkedIn at ${LINKEDIN_URL}, or explore his open-source work on GitHub at ${GITHUB_URL}. You can also reach out directly through the contact page at ${NEXT_PUBLIC_APP_URL}/contact.`,
    },
];