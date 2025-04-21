import { config } from "dotenv"
config()

export const appName = "LEAT Sophat"
export const appPositions = ["Senior Front-end Developer.", "UI/UX Designer."]
export const appDescriptions = "Welcome to my portfolio - Thoughts from a wandering mind. Currently I work as a Senior Front-end Developer at TurboTech, and as a Freelancer UI/UX designer. In my free time, I enjoy designing side projects and developing them."
export const currentDomain = process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://pphat.netlify.app"