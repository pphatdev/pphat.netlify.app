import { FaqSection } from "@components/sections/faq";
import FAQPageStructuredData from "@components/data-structured/faq-page";
import {
    PERSON_NAME,FAQS,
    PERSON_ALTERNATE_NAME,
} from "@lib/constants";


export const HomeFAQSection = () => {
    return (
        <>
            <FAQPageStructuredData items={FAQS} />
            <FaqSection
                title="Frequently Asked Questions"
                description={`Everything you want to know about ${PERSON_NAME} (${PERSON_ALTERNATE_NAME}) — his work, skills, background, and how to get in touch.`}
                items={FAQS}
            />
        </>
    );
}