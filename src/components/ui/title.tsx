import { cn } from "@lib/utils";

export const Title = ({ as = 'h2', title, description, className }: {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
    title: string[],
    description?: string
    className?: string
}) => {

    const Heading = as;
    const lastWord = title[title.length - 1];
    // middle words are all the words except the last one
    const middleWords = title.slice(0, title.length - 1).join(' ');

    return (
        <div className={cn(className)}>
            <Heading className="max-md:mb-3 px-5 w-full py-3 max-md:text-3xl text-5xl tracking-tighter font-bold font-sans">
                {middleWords} <span className="text-left bg-background  bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r from-sky-500 via-teal-500 to-green-500 [text-shadow:0_0_rgba(0,0,0,0.1)]"> {lastWord}</span>
            </Heading>

            {description && <p className="max-md:mb-0 px-5 my-5 text-left text-foreground/90 tracking-normal [&>*]:hover:transition-all [&>a]:text-primary [&>a]:hover:font-semibold"
                dangerouslySetInnerHTML={
                    { __html: description.replace(/\n/g, '<br />'), }
                }
            />}
        </div>
    );
}