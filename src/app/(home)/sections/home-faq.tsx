import { FaqSection } from "@components/ui/faq";

export const HomeFAQSection = () => {
    const data = [
        {
            question: "What is the platform about?",
            answer: "This platform is designed to streamline my workflow and enhance productivity. It offers a range of features that cater to both developers and non-developers, making it versatile for various use cases, also for my personal projects.",
        },
        {
            question: "What technologies are used?",
            answer: "The platform is built with Next.js 15.2.4, TailwindCSS 4.1.1, TypeScript 5, and React 19. It also includes various UI components from Radix UI and other modern libraries for enhanced functionality."
        },
        {
            question: "How can I contribute?",
            answer: "You can contribute by submitting issues, feature requests, or pull requests on the GitHub repository. Your feedback and contributions are always welcome!"
        }
    ];

    return (
        <FaqSection
            title="Frequently Asked Questions"
            description="Everything about this projects."
            items={data}
        />
    );
}