import { Badge } from "@components/ui/badge";
import { Post } from "@lib/db/post";
import Link from "next/link";
import Image from 'next/image';
import { Share2Icon, TagIcon } from "lucide-react";
import * as React from 'react';
import { cn } from "@lib/utils";

export const PostCard = ({ post, actionChildren, className, isAdmin = false }: { post: Post, actionChildren?: React.ReactNode, className?: string, isAdmin?: boolean}) => {
    const sharePost = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (navigator.share) {
            navigator.share({
                url: `/posts/${post.slug}`,
                title: post.title
            }).catch(err => console.error('Error sharing:', err));
        }
    };

    return (
        <div className={cn("relative duration-300 group flex flex-col gap-0 hover:translate-y-1 overflow-hidden bg-foreground/5 group font-sans rounded-3xl mb-4 ring-foreground/10 hover:ring-primary hover:ring-2 transition-all ease-in-out h-full", className)} role="article" tabIndex={-1}>

            <Image
                src={post.thumbnail}
                width={512}
                height={512}
                alt={post.title}
                className="w-full h-40 aspect-video object-cover rounded-b-xl"
            />

            <div className="absolute transition-opacity lg:opacity-0 bg-background/50 group-hover:opacity-100 pointer-events-auto rounded-full right-3 top-3 flex z-50">
                <div className='bg-foreground/5 z-50 ring-1 w-fit ml-auto ring-foreground/10 justify-end flex rounded-full p-1'>
                    {actionChildren
                        ? actionChildren
                        : <>
                            {/* <Link href={''} className="flex cursor-pointer rounded-full p-2 hover:ring hover:text-background ring-foreground/20 outline-none hover:bg-foreground/10 transition-all items-center justify-center">
                                <TagIcon className="size-4" />
                            </Link> */}
                            <button
                                aria-label={`Share ${post.title}`}
                                type="button"
                                onClick={sharePost}
                                className="flex cursor-pointer rounded-full p-2 hover:ring hover:text-background ring-foreground/20 outline-none hover:bg-foreground/10 transition-all items-center justify-center"
                            >
                                <Share2Icon className="size-4" aria-hidden="true" />
                                <span className="sr-only">Share this post</span>
                            </button>
                        </>
                    }
                </div>
            </div>

            <Link href={`/posts/${post.slug ?? '#'}`} className="inset-0 z-0 absolute" aria-label={post.title} />

            <div className="px-4 pb-4 pt-2 w-full flex flex-col relative pointer-events-none">

                <div className="flex z-50 justify-start items-center flex-wrap gap-2 pointer-events-auto mt-2">
                    {post.tags.slice(0, 3).map((tag, index) => (
                        <Link key={index} href={`?tag=${tag}`} className="text-xs font-sans">
                            <Badge variant="outline" className="bg-foreground/5 text-foreground/80 hover:bg-foreground/10 hover:text-primary transition-all duration-200 ease-in-out">{tag}</Badge>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2 my-2">
                    <time dateTime={new Date(post.createdAt).toISOString()} className="text-xs text-foreground/50 font-sans">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
                </div>
                {isAdmin && post.published && (
                    <div className="size-2.5 absolute top-5 right-3 bg-primary rounded-full"></div>
                )}

                <h2 className="z-10 font-semibold font-sans tracking-wide line-clamp-1 pb-1">{post.title}</h2>
                <p className='font-normal text-sm z-10 line-clamp-4 text-foreground/80'>{post.description || ""}</p>
            </div>
        </div>
    );
};