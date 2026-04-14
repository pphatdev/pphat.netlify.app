"use client";

import { FaqSection } from "@components/sections/faq";
import FAQPageStructuredData from "@components/data-structured/faq-page";
import { FAQS, PERSON_ALTERNATE_NAME, PERSON_NAME, } from "@lib/constants";

export function ProfileFaq() {
    return (
        <>
            <FAQPageStructuredData items={FAQS} />
            <FaqSection
                title={`About ${PERSON_NAME}`}
                description={`Everything you want to know about ${PERSON_NAME} (${PERSON_ALTERNATE_NAME}) — his work, skills, background, and how to get in touch.`}
                items={FAQS}
            />
        </>
    );
}
