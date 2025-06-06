import { NavigationBar } from "@components/navbar/navbar";
import { AboutMeHero } from "@components/heros/about-hero";
import { AboutTimeline } from "./sections/timeline";
import { BlurFade } from '@components/ui/blur-fade';
import { Metadata } from "next";
import { appName, NEXT_PUBLIC_APP_URL } from "@lib/constants";
import AboutStructuredData from "@components/about-structured-data";

const appPositions = ["I'm a Senior Front-end Developer", "and a Freelance UI/UX Designer."];
const description = `My name is <span className="text-primary font-semibold">Leat Sophat</span>, also known as <span className="text-primary font-semibold">PPhat</span>.
    I'm a Senior Front-end Developer at <a href="https://turbotech.com.kh/" target="_blank" rel="noopener noreferrer">TURBOTECH CO., LTD</a>, and as a Freelance UI/UX Designer.
    I'm from <a href="https://en.wikipedia.org/wiki/Phnom_Penh" target="_blank" rel="noopener noreferrer">Phnom Penh, Cambodia</a>.

    I started my career as a Front-end Developer in 2021, and I have a passion for creating beautiful and functional user interfaces. I love to learn new technologies and improve my skills every day. I am also a big fan of open-source projects and I enjoy contributing to the community. I believe that sharing knowledge is the key to success in this field.
`;

const aboutDescription = "I am Leat Sophat (PPhat), a Senior Front-end Developer and Freelance UI/UX Designer from Phnom Penh, Cambodia. Learn more about my journey, skills, and experience.";

export const metadata: Metadata = {
    title: `About ${appName}`,
    description: aboutDescription,
    authors: [{
        url: NEXT_PUBLIC_APP_URL,
        name: appName,
    }],
    generator: appName,
    openGraph: {
        type: "profile",
        url: NEXT_PUBLIC_APP_URL + "/about",
        title: `${appName}`,
        description: aboutDescription,
        siteName: appName,
        images: [
            { url: `${NEXT_PUBLIC_APP_URL}/assets/screenshots/about-light.png`, },
            { url: `${NEXT_PUBLIC_APP_URL}/assets/screenshots/about-dark.png`, },
        ],
    },
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    }
};


const AboutPage = () => {
    return (
        <main className="w-full flex flex-col gap-7 pb-5">
            <AboutStructuredData />
            <AboutMeHero description={description} appPositions={appPositions} />
            <NavigationBar />

            <section id="experience">
                <BlurFade delay={1}>
                    <AboutTimeline />
                </BlurFade>
            </section>

            {/* <SectionNavigation sections={[ 'about-hero', 'experience', ]}/> */}
        </main>
    )
};


export default AboutPage;