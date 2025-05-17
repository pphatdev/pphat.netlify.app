'use client'

import { ExperienceCard } from "@components/cards/experience-card"
import Image from "next/image";
import React from "react";

export const AboutTimeline = () => {

    const experiences = [
        {
            title: "TURBOTECH CO., LTD",
            companyLogo: "assets/brands/org/turbotech.png",
            works: [
                {
                    date: "Oct 2022 - Present",
                    title: "Senior Frontend Developer",
                    skills: [
                        { title: "Figma", icon: "assets/brands/language/figma.svg" },
                        { title: "Laravel", icon: "assets/brands/language/laravel.svg" },
                        { title: "React", icon: "assets/brands/language/react.svg" },
                        { title: "Next.js", icon: "assets/brands/language/nextjs.svg" },
                        { title: "Tailwind CSS", icon: "assets/brands/language/tailwind.svg" },
                        { title: "Typescript", icon: "assets/brands/language/typescript.svg" },
                        { title: "Node.js", icon: "assets/brands/language/nodejs.svg" },
                        { title: "Express.js", icon: "assets/brands/language/express.svg" },
                        { title: "PostgreSQL", icon: "assets/brands/language/pgsql.svg" },
                        { title: "MySQL", icon: "assets/brands/language/mysql.svg" },
                    ]
                },
                {
                    date: "Oct 2020 - Oct 2022",
                    title: "Junior Frontend Developer",
                    skills: [
                        { title: "JavaScript", icon: "assets/brands/language/javascript.svg" },
                        { title: "JQuery", icon: "assets/brands/language/jquery.svg" },
                        { title: "HTML", icon: "assets/brands/language/html.svg" },
                        { title: "CSS", icon: "assets/brands/language/css.svg" },
                        { title: "Sass", icon: "assets/brands/language/sass.svg" },
                        { title: "Tailwind CSS", icon: "assets/brands/language/tailwind.svg" },
                        { title: "Bootstrap", icon: "assets/brands/language/bootstrap.svg" },
                        { title: "PHP", icon: "assets/brands/language/php.svg" },
                        { title: "MySQL", icon: "assets/brands/language/mysql.svg" },
                        { title: "Laravel", icon: "assets/brands/language/laravel.svg" },
                    ]
                },
                {
                    date: "Nov 2019 - Oct 2020",
                    title: "Content Writing Officer & UI/UX Designer",
                    skills: [
                        { title: "Ms.Word", icon: "assets/brands/office/word.svg" },
                        { title: "Ms.Excel", icon: "assets/brands/office/excel.svg" },
                        { title: "Ms.Powerpoint", icon: "assets/brands/office/powerpoint.svg" },
                        { title: "Figma", icon: "assets/brands/language/figma.svg" },
                        { title: "Adobe XD", icon: "assets/brands/language/xd.svg" },
                    ]
                }
            ]
        }
    ]

    return (
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
            <h1 className="font-medium text-2xl">Experience</h1>
            <div className="relative sm:pb-12 sm:ml-[calc(2rem+1px)] mt-10 md:ml-[calc(3.5rem+1px)] lg:ml-[max(calc(14.5rem+1px),calc(100%-48rem))]">
                <div className="hidden absolute top-3 bottom-0 right-full mr-7 md:mr-[3.25rem] w-px bg-foreground/20 sm:block"> </div>
                <div className="space-y-16">
                    {experiences.map(({ works, title, companyLogo }, index) => (
                        <div key={index} className="flex flex-col">
                            {/* <div className="flex gap-2 items-center pb-10">
                                <h2 className="text-lg font-bold text-foreground/80"> @ {title} </h2>
                                {companyLogo && <Image src={`/${companyLogo}`} alt="Avatar" className="object-cover size-4 rounded-md" width={32} height={32} />}
                            </div> */}
                            <div className="flex flex-col gap-5 space-y-12">
                                {works.map((item, index) => (
                                    <ExperienceCard
                                        key={index}
                                        date={item.date}
                                        title={item.title}
                                        skills={item.skills}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}