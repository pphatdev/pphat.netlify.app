import { config } from "dotenv"
config()

export const appName = "LEAT Sophat"
export const appTitle = "PPhat Dev"
export const appPositions = ["Senior Front-end Developer.", "UI/UX Designer."]
export const appDescriptions = "Hello! I’m Sophat LEAT, also known as PPhat, and I’m thrilled to have you here. This portfolio showcases my journey, projects, and passions as a developer and creator. Explore my work, check out my skills, and feel free to connect if you’d like to collaborate or learn more.\nLet’s build something amazing together!"
export const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://pphat.top"