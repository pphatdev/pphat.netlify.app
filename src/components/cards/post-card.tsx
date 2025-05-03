import { Badge } from "@components/ui/badge";
import { Post } from "../../lib/types/interfaces";
import Link from "next/link";
import Image from 'next/image';
import { Share2Icon } from "lucide-react";

export const PostCard = ({ post }: { post: Post }) => {
    const sharePost = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (navigator.share) {
            navigator.share({
                url: post.slug,
                title: post.title
            }).catch(err => console.error('Error sharing:', err));
        }
    };

    return (
        <div className="col-span-1 relative duration-300 hover:translate-y-1 overflow-hidden bg-foreground/5 group font-sans rounded-2xl mb-4 ring-1 ring-foreground/10 hover:ring-primary hover:ring-2 transition-all ease-in-out h-full" role="article" tabIndex={-1}>
            <Image
                src={post.thumbnail}
                width={200}
                height={200}
                alt={post.title}
                className="w-full aspect-video object-cover"
            />
            <Link href={post.slug ?? '#'} className="inset-0 z-0 absolute" aria-label={post.title} />

            <div className="p-4 relative pointer-events-none">
                <div className="flex items-center gap-2 mb-2">
                    <time dateTime={new Date(post.createdAt).toISOString()} className="text-xs text-foreground/50 font-sans">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
                </div>

                <div className="flex z-50 flex-wrap gap-2 pointer-events-auto my-2">
                    {post.tags.slice(0, 3).map((tag, index) => (
                        <Link key={index} href={`?tag=${tag}`} className="text-xs font-sans">
                            <Badge variant="outline" className="bg-foreground/5 text-foreground/80 hover:bg-foreground/10 hover:text-primary transition-all duration-200 ease-in-out">{tag}</Badge>
                        </Link>
                    ))}
                </div>

                <h2 className="z-10 font-semibold font-sans tracking-wide line-clamp-1 pb-1">{post.title}</h2>
                <p className='font-normal text-sm z-10 line-clamp-4 text-foreground/80'>{post.content}</p>

                <div className="absolute pointer-events-auto rounded-full right-3 top-3 flex z-50">
                    <div className='bg-foreground/5 z-50 ring-1 w-fit ml-auto ring-foreground/10 justify-end flex rounded-full p-1'>
                        <button
                            aria-label={`Share ${post.title}`}
                            type="button"
                            onClick={sharePost}
                            className="flex cursor-pointer rounded-full p-2 hover:ring hover:text-primary ring-foreground/20 outline-none hover:bg-foreground/10 transition-all items-center justify-center"
                        >
                            <Share2Icon className="size-4" aria-hidden="true" />
                            <span className="sr-only">Share this post</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};