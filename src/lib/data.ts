import { config } from "dotenv"
config()

import {
    name,
    description,
    domain,
    positions
} from "../../whoiam.data.json"

export const appName = name || "LEAT Sophat"
export const appPositions = positions || ["Senior Front-end Developer.", "UI/UX Designer."]
export const appDescriptions =  description || "Hello! I’m Sophat LEAT, also known as PPhat, and I’m thrilled to have you here.\nThis portfolio showcases my journey, projects, and passions as a developer and creator. Explore my work, check out my skills, and feel free to connect if you’d like to collaborate or learn more.\nLet’s build something amazing together!"
export const currentDomain = process.env.NEXT_PUBLIC_APP_URL?.trim() || domain || "https://pphat.netlify.app"