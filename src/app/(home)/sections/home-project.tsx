"use client";
import { GradientLines } from "@components/background/gradient-line";
import { BentoGrid } from "@components/ui/bento-grid";
import { BookAIcon, CheckCircle, Globe, TrendingUp, Video } from "lucide-react";


export const HomeProjects = () => {
    return (
        <section id="section-projects" className="max-w-5xl flex flex-col items-center justify-start min-h-screen mx-auto">
            <GradientLines className="top-1/2 -z-[1] md:h-[100px]" />
            <div className="mt-5 w-full">
                <h2 className="max-md:mb-3 px-5 w-full py-3 max-md:text-3xl text-5xl tracking-tighter font-bold font-sans">
                    {`What I've been `} <span className="text-left bg-background  bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r from-sky-500 via-teal-500 to-green-500 [text-shadow:0_0_rgba(0,0,0,0.1)]"> working on</span>
                </h2>
                <p className="max-md:mb-0 w-full px-5 my-5 text-left text-foreground/500 tracking-normal">
                    {`I've worked on a variety of projects, from simple websites to complex web applications. Here are a few of my favorites.`}
                </p>
            </div>
            <BentoGrid items={
                [
                    {
                        title: "Nintrea eLibrary",
                        meta: "v0.1",
                        description: "A website for searching and reading books online. It is a web application that allows users to search for books, read them online. It is designed to be user-friendly and easy to navigate, making it a great resource for anyone looking to read books online.",
                        icon: <BookAIcon className="w-4 h-4 text-blue-500" />,
                        status: "Upcoming",
                        tags: ["NextJs@15", "TailwindCss@4"],
                        colSpan: 2,
                        hasPersistentHover: true,
                    },
                    {
                        title: "Nintrea Website",
                        meta: "v0.1",
                        description: "Nintrea official website. Developed with Next.js and Tailwind CSS.",
                        icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
                        status: "Upcoming",
                        tags: ["NextJs@15", "TailwindCss@3"],
                    },
                    {
                        title: "Sample NodeJS API",
                        meta: "v1",
                        description: "A template project for NodeJS API. It is a simple and easy to use template for creating RESTful APIs using Node.js and Express.js.",
                        icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
                        status: "Upcoming",
                        tags: ["NodeJS", "ExpressJs@4", "TypeScript", "PostgreSQL"],
                        colSpan: 3,
                    },
                ]
            } />
            <GradientLines className="bottom-0 -z-[1]" />
        </section>
    );
};
