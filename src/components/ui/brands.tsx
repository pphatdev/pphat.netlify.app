"use client";

import * as React from "react";
import { cn } from "@lib/utils";
import Image from "next/image";

interface Brand {
    name: string;
    logo: string;
}

interface BrandsGridProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    brands: Brand[];
    imageHeight?: number;
}

export const BrandsGrid = React.forwardRef<HTMLDivElement, BrandsGridProps>(
    ({
        className,
        title = "Trusted and loved by fast-growing companies worldwide",
        brands,
        imageHeight = 56, // 14 * 4 = 56px (h-14)
        ...props
    }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("py-24", className)}
                {...props}
            >
                <div className="max-w-xs mx-auto grid grid-cols-2 items-center md:grid-cols-3 md:max-w-lg lg:grid-cols-6 lg:max-w-3xl">
                    {brands.map((brand) => (
                        <div key={brand.name} className="flex items-center justify-center p-4">
                            <div className="relative h-[56px] w-full">
                                <Image
                                    src={brand.logo}
                                    alt={`${brand.name} logo`}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
);

BrandsGrid.displayName = "BrandsGrid";