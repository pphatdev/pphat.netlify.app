import Image from "next/image";
import Link from "next/link";

export const Article = (
    { title, date, description, image, link }:
    { title: string; date: Date; description: string; image: string; link: string }
) => {
    return (
        <article className="relative group">
            <div className="absolute -inset-y-2.5 transition-colors -inset-x-4 md:-inset-y-4 md:-inset-x-4 sm:rounded-2xl group-hover:bg-foreground/5"></div>

            <svg viewBox="0 0 9 9" stroke="currentColor" className="hidden absolute right-full mr-6 top-2 text-primary/20 md:mr-12 w-[calc(0.5rem+1px)] h-[calc(0.5rem+1px)] overflow-visible sm:block">
                <circle cx="4.5" cy="4.5" r="4.5" strokeWidth="1" className="fill-primary"></circle>
            </svg>

            <div className="relative flex items-start justify-start gap-5">

                <div className="h-full shrink-0">
                    <Image src={image} alt="Avatar" className="object-cover w-32 h-20 rounded-md sm:h-32 sm:w-44" width={100} height={100} />
                </div>

                <div className="relative w-full">
                    <h3 className="pt-5 text-base font-semibold tracking-tight line-clamp-2 sm:line-clamp-1 text-foreground lg:pt-0"> {title} </h3>
                    <p className="hidden mt-2 mb-3 sm:block line-clamp-2"> {description} </p>
                    <Link className="flex items-center text-sm font-medium text-primary" href={link}>
                        <span className="absolute -inset-y-2.5 -inset-x-4 md:-inset-y-4 md:-inset-x-6 sm:rounded-2xl"></span>
                        <span className="relative text-xs sm:text-sm">
                            Read more<span className="sr-only">, {description}</span>
                        </span>
                        <svg className="relative mt-px overflow-visible ml-2.5 text-primary" width="3" height="6" viewBox="0 0 3 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M0 0L3 3L0 6"></path>
                        </svg>
                    </Link>
                </div>
            </div>

            <dl className="absolute left-[9.2rem] sm:left-[12.2rem] -top-1 lg:left-auto lg:right-full lg:mr-[calc(6.5rem+1px)]">
                <dt className="sr-only">Date</dt>
                <dd className="text-xs leading-6 sm:text-sm whitespace-nowrap dark:text-slate-400">
                    <time dateTime={date.toISOString()}>
                        {date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} {' '}
                        {date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </time>
                </dd>
            </dl>
        </article>
    )
}
