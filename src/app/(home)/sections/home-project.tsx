"use client";
import { BentoGrid } from "@components/ui/bento-grid";
import { BookAIcon, CheckCircle, Globe, TrendingUp, Video } from "lucide-react";


export const HomeProjects = () => {
    return (
        <section id="section-projects" className="max-w-5xl flex flex-col items-center justify-start min-h-screen mx-auto">
            <div className="p-5 pb-1 mt-5">
                <h2 className="mb-4 text-center max-md:text-3xl text-5xl tracking-tight font-bold font-default">{`What I've been working on`}</h2>
                <p className="mb-5 text-center text-foreground/500 tracking-normal">
                    {`Ever since I was a kid, I've been fascinated by technology.`}
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
            }/>
        </section>
    );
};
