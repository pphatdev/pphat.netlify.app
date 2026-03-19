import React from "react"
import Link from "next/link"
import { GridPattern } from "@components/ui/grid-pattern"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { BlurFade } from "@components/ui/blur-fade"
import { BackgroundBeamsWithCollision } from "@components/ui/background-beams-with-collision"
import { RainbowGlow } from "@components/ui/rainbow-glow"
import { Button } from "../ui"
import { Input } from "@components/ui/input"
import { Search, X } from "lucide-react"

interface PostsHeroProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onClearSearch: () => void;
}

export const PostsHero = React.memo(({ searchQuery, onSearchChange, onClearSearch }: PostsHeroProps) => {
    const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    }, [onSearchChange]);

    const pageDescription = "Read my blog posts about web development, design, and technology.";

    return (
        <div className="min-h-36 sm:min-h-60 flex bg-linear-to-b from-primary/10 pt-14 sm:pt-24 to-background flex-col overflow-clip relative items-start justify-center">
            <RainbowGlow className="opacity-10"/>
            <BackgroundBeamsWithCollision className="flex items-center absolute -z-1 pointer-events-none max-w-5xl left-1/2 -translate-x-1/2 mx-auto justify-center w-full h-full" />
            <div className="absolute inset-y-0 left-1/3 right-0 pointer-events-none" aria-hidden="true">
                <GridPattern
                    width={30}
                    height={30}
                    x={-1}
                    y={-1}
                    strokeDasharray={"4 2"}
                    className={"mask-[radial-gradient(300px_circle_at_center,white,transparent)] absolute w-full "}
                />
            </div>
            <div className="w-full px-4 pt-4 sm:px-5 flex flex-col max-w-5xl mx-auto ">
                <BlurFade delay={0.6} inView className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                    <div className="space-y-2 max-w-2xl">
                        <h1 className="text-3xl font-bold sm:text-5xl xl:text-6xl/none"> Blo<span className="text-left bg-background bg-clip-text bg-no-repeat text-transparent bg-linear-to-r  from-sky-500 via-teal-500 to-green-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">gs</span> </h1>
                        <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                            {pageDescription}
                        </p>
                    </div>
                    <div className="relative w-full sm:max-w-[18rem]">
                        <Input
                            type="text"
                            placeholder="Search blogs..."
                            value={searchQuery}
                            onChange={handleInputChange}
                            className="pl-4 pr-20 h-10 rounded-full border-input bg-background/90 hover:bg-background transition-all"
                        />
                        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center rounded-full ring-1 bg-secondary/5 ring-foreground/5 gap-1">
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClearSearch}
                                    className="h-8 w-8 rounded-full"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                            <div className="h-8 w-8 rounded-full flex items-center justify-center">
                                <Search className="text-muted-foreground w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </BlurFade>
                <BlurFade delay={0.5} inView className="flex max-sm:order-first max-sm:mb-5 flex-col items-start justify-start">
                    <Button asChild>
                        <Link href="/">
                            <ArrowLeftIcon className="w-4 h-4" /> Back to Home
                        </Link>
                    </Button>
                </BlurFade>
            </div>
        </div>
    );
});

PostsHero.displayName = 'PostsHero';