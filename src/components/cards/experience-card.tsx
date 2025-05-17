import Image from "next/image";

interface SkillsType {
    title: string;
    icon: string;
}

interface ExperienceCardProps {
    title: string;
    date: string;
    skills: SkillsType[];
}

export const ExperienceCard = (
    { title, date, skills }: ExperienceCardProps
) => {

    return (
        <article className="relative group">
            <div className="absolute -inset-y-2.5 transition-colors -inset-x-4 md:-inset-y-4 md:-inset-x-4 sm:rounded-2xl group-hover:bg-foreground/5"></div>

            <svg viewBox="0 0 9 9" stroke="currentColor" className="hidden absolute right-full mr-6 top-2 text-primary/20 md:mr-12 w-[calc(0.5rem+1px)] h-[calc(0.5rem+1px)] overflow-visible sm:block">
                <circle cx="4.5" cy="4.5" r="4.5" strokeWidth="1" className="fill-primary"></circle>
            </svg>

            <div className="relative flex items-start justify-start gap-5">

                {/* <div className="h-full shrink-0">
                    <Image src={image} alt="Avatar" className="object-cover w-32 h-20 rounded-md sm:h-32 sm:w-44" width={100} height={100} />
                </div> */}

                <div className="relative w-full">
                    <div className="inline-flex space-x-3 items-center">
                        <h2 className="pt-5 text-base font-semibold tracking-tight line-clamp-2 sm:line-clamp-1 text-foreground lg:pt-0"> {title} </h2>
                    </div>
                    {/* <p className="mt-2 mb-3 sm:block line-clamp-2 text-foreground/80"> {description} </p> */}

                    <p className="text-xs my-2 font-medium">+ Skills</p>
                    <div className="flex gap-2 flex-wrap">
                        {skills.map(({ icon, title }, key) => {
                            return (
                                <div key={key} className="flex shrink-0 w-fit shadow-card pr-3 shadow-primary/5 bg-background rounded-lg items-center justify-center border text-foreground/5 bg-[size:8px_8px] bg-top-left bg-[image:repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)]">
                                    {icon && (<Image src={icon} width={32} height={32} alt={title} className="size-7 px-1.5" />)}
                                    <span className="text-xs text-foreground">{title}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <dl className="absolute max-sm:left-0 pointer-events-none -top-1 lg:left-auto lg:right-full lg:mr-[calc(6.5rem+1px)]">
                <dt className="sr-only">Date</dt>
                <dd className="text-xs leading-6 font-medium sm:text-sm whitespace-nowrap text-foreground/50">
                    {date}
                </dd>
            </dl>
        </article>
    )
}
