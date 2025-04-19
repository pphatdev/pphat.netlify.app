import { cn } from "@lib/utils";

export const GradientLines = ({ className, }: { className?: string; }) => {
    return (
        <svg
            width="166"
            height="298"
            viewBox="0 0 166 298"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('pointer-events-none absolute inset-x-0 bottom-0 aspect-square h-[100px] w-full md:h-[200px]', className)}
        >
            <line y1="-0.5" x2="406" y2="-0.5" transform="matrix(0 1 1 0 1 -108)" stroke="url(#paint0_linear_254_143)" />
            <line y1="-0.5" x2="406" y2="-0.5" transform="matrix(0 1 1 0 34 -108)" stroke="url(#paint1_linear_254_143)" />
            <line y1="-0.5" x2="406" y2="-0.5" transform="matrix(0 1 1 0 67 -108)" stroke="url(#paint2_linear_254_143)" />
            <line y1="-0.5" x2="406" y2="-0.5" transform="matrix(0 1 1 0 100 -108)" stroke="url(#paint3_linear_254_143)" />
            <line y1="-0.5" x2="406" y2="-0.5" transform="matrix(0 1 1 0 133 -108)" stroke="url(#paint4_linear_254_143)" />
            <line y1="-0.5" x2="406" y2="-0.5" transform="matrix(0 1 1 0 166 -108)" stroke="url(#paint5_linear_254_143)" />
            <defs>
                {[...Array(6)].map((_, i) => (
                    <linearGradient
                        key={i}
                        id={`paint${i}_linear_254_143`}
                        x1="-7.42412e-06"
                        y1="0.500009"
                        x2="405"
                        y2="0.500009"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="white" />
                        <stop offset="1" stopOpacity="0" />
                    </linearGradient>
                ))}
            </defs>
        </svg>
    );
};

export const bgGradientLine45deg = `bg-[size:8px_8px] bg-[image:repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)]`