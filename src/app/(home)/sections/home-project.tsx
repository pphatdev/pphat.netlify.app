"use client";
import { BentoGrid } from "@components/ui/bento-grid";
import { BookAIcon, CheckCircle, Globe, TrendingUp, Video } from "lucide-react";


export const HomeProjects = () => {
    return (
        <section id="section-projects" className="max-w-5xl mx-auto border-x divide-y mt-5 rounded-4xl">
            <div className="p-8 my-5">
                <h2 className="mb-4 text-left max-md:text-xl text-5xl font-bold">{`What I've been working on`}</h2>
                <p className="mb-5 text-left text-sm text-zinc-500">
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
