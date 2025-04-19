export const HomeArticles = () => {
    return (
        <section id="section-projects" className="max-w-5xl flex flex-col items-center justify-start min-h-screen mx-auto">
            <h2 className="mb-4 text-center max-md:text-3xl text-5xl tracking-tight font-bold font-default">I write about technology</h2>
            <p className="mb-10 text-center text-zinc-500 tracking-normal">
                {`Ever since I was a kid, I've been fascinated by technology.`}
            </p>
            <div className="grid w-full px-8 grid-cols-1 gap-4 md:grid-cols-4">
                {[
                    {
                        id: 1,
                        title: "The",
                        width: "md:col-span-1",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 2,
                        title: "First",
                        width: "md:col-span-2",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 3,
                        title: "Rule",
                        width: "md:col-span-1",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    // {
                    //     id: 4,
                    //     title: "Of",
                    //     width: "md:col-span-3",
                    //     height: "h-60",
                    //     bg: "bg-neutral-100 dark:bg-neutral-800",
                    // },
                    // {
                    //     id: 5,
                    //     title: "F",
                    //     width: "md:col-span-1",
                    //     height: "h-60",
                    //     bg: "bg-neutral-100 dark:bg-neutral-800",
                    // },
                    // {
                    //     id: 6,
                    //     title: "Club",
                    //     width: "md:col-span-2",
                    //     height: "h-60",
                    //     bg: "bg-neutral-100 dark:bg-neutral-800",
                    // },
                    // {
                    //     id: 7,
                    //     title: "Is",
                    //     width: "md:col-span-2",
                    //     height: "h-60",
                    //     bg: "bg-neutral-100 dark:bg-neutral-800",
                    // },
                    // {
                    //     id: 8,
                    //     title: "You",
                    //     width: "md:col-span-1",
                    //     height: "h-60",
                    //     bg: "bg-neutral-100 dark:bg-neutral-800",
                    // },
                    // {
                    //     id: 9,
                    //     title: "Do NOT TALK about",
                    //     width: "md:col-span-2",
                    //     height: "h-60",
                    //     bg: "bg-neutral-100 dark:bg-neutral-800",
                    // },
                    // {
                    //     id: 10,
                    //     title: "F Club",
                    //     width: "md:col-span-1",
                    //     height: "h-60",
                    //     bg: "bg-neutral-100 dark:bg-neutral-800",
                    // },
                ].map((box) => (
                    <div
                        key={box.id}
                        className={`${box.width} ${box.height} ${box.bg} flex items-center justify-center rounded-lg p-4 shadow-sm`}
                    >
                        <h2 className="text-xl font-medium">{box.title}</h2>
                    </div>
                ))}
            </div>
        </section>
    );
};
