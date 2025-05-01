"use client";
import { GradientLines } from "@components/background/gradient-line";
import { BentoGrid } from "@components/ui/bento-grid";
import { Title } from "@components/ui/title";
import { BookAIcon, CheckCircle, Globe, TrendingUp, Video } from "lucide-react";


export const HomeProjects = () => {
    const title = ["What I've been", "working on"]
    const description = `I've worked on a variety of projects, from simple websites to complex web applications. Here are a few of my favorites.`
    return (
        <section id="section-projects" className="max-w-5xl flex flex-col items-center justify-start min-h-screen mx-auto">
            <GradientLines className="top-1/2 -z-[1] md:h-[100px]" />
            <div className="mt-5 w-full">
                <Title as='h2' title={title} description={description} />
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
