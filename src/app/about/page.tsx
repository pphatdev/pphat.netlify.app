import { NavigationBar } from "@components/navbar/navbar";
import { AboutMeHero } from "@components/heros/about-hero";
import { AboutTimeline } from "./sections/timeline";
import { BlurFade } from '@components/ui/blur-fade';
import { Metadata } from "next";
import { appName, currentDomain } from "@lib/constants";
import AboutStructuredData from "@components/about-structured-data";
import { getOgImageMetadata } from "@lib/utils/og-image";
import { SectionNavigation } from '../../components/section-navigation';

const appPositions = ["I'm a Senior Front-end Developer", "and a Freelance UI/UX Designer."];
const description = `My name is <span className="text-primary font-semibold">Leat Sophat</span>, also known as <span className="text-primary font-semibold">PPhat</span>.
    I'm a Senior Front-end Developer at <a href="https://turbotech.com.kh/" target="_blank" rel="noopener noreferrer">TURBOTECH CO., LTD</a>, and as a Freelance UI/UX Designer.
    I'm from <a href="https://en.wikipedia.org/wiki/Phnom_Penh" target="_blank" rel="noopener noreferrer">Phnom Penh, Cambodia</a>.

    I started my career as a Front-end Developer in 2021, and I have a passion for creating beautiful and functional user interfaces. I love to learn new technologies and improve my skills every day. I am also a big fan of open-source projects and I enjoy contributing to the community. I believe that sharing knowledge is the key to success in this field.
`;

const aboutDescription = "I'm Leat Sophat (PPhat), a Senior Front-end Developer and Freelance UI/UX Designer from Phnom Penh, Cambodia. Learn more about my journey, skills, and experience.";

// Generate OG image metadata for this page
const ogImage = getOgImageMetadata({
    title: `${appName} | About Me`,
    subtitle: "Senior Front-end Developer & UI/UX Designer",
    description: aboutDescription
});

export const metadata: Metadata = {
    title: `${appName} | About Me`,
    description: aboutDescription,
    authors: [{
        url: currentDomain,
        name: appName,
    }],
    generator: appName,
    openGraph: {
        type: "profile",
        url: currentDomain + "/about",
        title: `${appName} | About Me`,
        description: aboutDescription,
        siteName: appName,
        images: [ogImage],
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