import { Badge } from "@components/ui/badge";
import { Title } from "@components/ui/title";
import { cn } from "@lib/utils";
import {
    IconCloud,
    IconEaseInOut,
    IconRouteAltLeft,
    IconTerminal2,
} from "@tabler/icons-react";

export function HomeFeatureSection() {
    const features = [
        {
            title: "Web Development",
            description: "Built with the latest and greatest technologies.",
            icon: <IconTerminal2 />,
        },
        {
            title: "Design Application",
            description: "A design system that is easy to use and customize.",
            icon: <IconEaseInOut />,
        },
        {
            title: "Web Hosting",
            description: "Hosted on the cloud with 99.9% uptime.",
            icon: <IconCloud />,
        },
        {
            title: "Multi-tenant Architecture",
            description: "Built with a multi-tenant architecture for scalability.",
            icon: <IconRouteAltLeft />,
        },
    ];

    const title = ["What I can", "do for you"];
    const description = `I can help you build your next project from scratch. I have experience in web development, design, and cloud hosting. I can help you with everything from the initial design to the final deployment.`;

    return (
        <div className="max-w-5xl flex flex-col py-10 items-center my-20 justify-start mx-auto">
            <div className="block w-full px-5 py-3 ">
                <Badge variant="outline" className='py-1.5 px-3'>Feature</Badge>
            </div>
            <Title as='h2' title={title} description={description} className="col-span-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 px-5 lg:grid-cols-4 relative z-10 pt-10 max-w-5xl mx-auto">
                {features.map((feature, index) => (
                    <Feature key={feature.title} {...feature} index={index} />
                ))}
            </div>
        </div>
    );
}

const Feature = ({
    title,
    description,
    icon,
    index,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
}) => {
    return (
        <div
            className={cn(
                "flex flex-col lg:border-r max-md:border-t border-dashed py-10 relative group/feature from-foreground/80",
                (index === 0 || index === 4) && "lg:border-l border-foreground/10",
                index < 4 && "lg:border-b border-foreground/10"
            )}
        >
            {index < 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-primary/10 via-primary/10 to-transparent pointer-events-none" />
            )}
            {index >= 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-primary/10 via-primary/10 to-transparent pointer-events-none" />
            )}
            <div className="mb-4 relative z-10 max-sm:px-5 px-10 group-hover/feature:text-primary text-primary/80">
                {icon}
            </div>
            <div className="text-lg font-bold mb-2 relative z-10 max-sm:px-5 px-10">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-background/30 group-hover/feature:bg-primary transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block font-semibold text-foreground">
                    {title}
                </span>
            </div>
            <p className="text-sm text-foreground/80 max-w-xs relative z-10 max-sm:px-5 px-10">
                {description}
            </p>
        </div>
    );
};
