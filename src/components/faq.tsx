import React from "react";
import { FaqSection } from "@components/ui/faq";

const DEMO_FAQS = [
    {
        question: "What makes your platform unique?",
        answer: "Our platform stands out through its intuitive design, powerful automation capabilities, and seamless integration options. We've focused on creating a user experience that combines simplicity with advanced features.",
    },
    {
        question: "How does the pricing structure work?",
        answer: "We offer flexible, transparent pricing tiers designed to scale with your needs. Each tier includes a core set of features, with additional capabilities as you move up. All plans start with a 14-day free trial.",
    },
    {
        question: "What kind of support do you offer?",
        answer: "We provide comprehensive support through multiple channels. This includes 24/7 live chat, detailed documentation, video tutorials, and dedicated account managers for enterprise clients.",
    },
];

export default function FaqSectionDemo() {
    return (
        <>
            <FaqSection
                title="Frequently Asked Questions"
                description="Everything you need to know about our platform"
                items={DEMO_FAQS}
                // contactInfo={{
                //     title: "Still have questions?",
                //     description: "We're here to help you",
                //     buttonText: "Contact Support"
                // }}
            />
        </>
    );
}