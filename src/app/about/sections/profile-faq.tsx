"use client";

import React from "react";
import { FaqSection } from "@components/ui/faq";
import FAQPageStructuredData from "@components/data-structured/faq-page";
import {
    PERSON_NAME,
    PERSON_ALTERNATE_NAME,
    PERSON_RELEGIEN_NAME,
    PERSON_JOB_TITLE,
    CONTACT_EMAIL,
    COMPANY_NAME,
    GITHUB_URL,
    LINKEDIN_URL,
    NEXT_PUBLIC_APP_URL,
    UNIVERSITY_NAME,
    ADDRESS_LOCALITY,
    ADDRESS_COUNTRY,
} from "@lib/constants";

const PROFILE_FAQS = [
    {
        question: `Who is ${PERSON_NAME}?`,
        answer: `${PERSON_NAME} (also known as ${PERSON_ALTERNATE_NAME} or ${PERSON_RELEGIEN_NAME}) is a ${PERSON_JOB_TITLE} and Freelance UI/UX Designer based in ${ADDRESS_LOCALITY}, Cambodia. He is the creator of pphat.me and specializes in building modern, performant web applications with a focus on user experience.`,
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

export function ProfileFaq() {
    return (
        <>
            <FAQPageStructuredData items={PROFILE_FAQS} />
            <FaqSection
                title={`About ${PERSON_NAME}`}
                description={`Everything you want to know about ${PERSON_NAME} (${PERSON_ALTERNATE_NAME}) — his work, skills, background, and how to get in touch.`}
                items={PROFILE_FAQS}
            />
        </>
    );
}
