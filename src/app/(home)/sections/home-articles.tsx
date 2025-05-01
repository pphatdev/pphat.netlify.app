import { Title } from "@components/ui/title";

export const HomeArticles = () => {
    const title = ["I write", "about technology"]
    const description = `Ever since I was a kid, I've been fascinated by technology. I love learning about new advancements and how they can be applied to solve real-world problems. I enjoy sharing my knowledge and insights with others through writing.`
    return (
        <section id="section-projects" className="max-w-5xl relative flex flex-col items-center justify-start min-h-[85vh] mx-auto">
            <Title as='h2' title={title} description={description}/>
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