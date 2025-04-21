import { Badge } from "@components/ui/badge";
// import { Button } from "@components/ui/button";
import { Post } from "@lib/db/post";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const PostCard = ({ post, index }: { post: Post, index: number }) => {
    return (
        <div
            className="col-span-1 relative bg-foreground/5 font-sans rounded-lg p-4 mb-4 ring-1 ring-foreground/10 hover:ring-primary hover:ring-2 transition-all duration-200 ease-in-out flex flex-col h-full"
            role="article"
            tabIndex={-1}
        >
            <Link
                href={`/posts/${post.slug}`}
                className="absolute z-0 inset-0"
                aria-label={`Read full article: ${post.title}`}
                title={post.title}
            />
            <header className='mb-2 relative flex justify-between items-center'>
                <Badge>Badge</Badge>
                {/* <Button
                    variant="outline"
                    size="icon"
                    className="z-10 cursor-pointer bg-foreground/5 rounded-full size-7 p-1.5"
                    aria-label="Post options"
                    aria-haspopup="menu"
                >
                    <EllipsisVertical aria-hidden="true" />
                </Button> */}
                <div className="text-sm inline-flex gap-1 items-center text-muted-foreground">
                    <Calendar className="size-4" /> <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            </header>

            <h2 className="text-lg font-medium line-clamp-1 pb-1">{post.title}</h2>
            <p
                className='font-normal line-clamp-3 text-foreground/80'
                id="main-content"
                data-lcp="true"
                style={{ contentVisibility: 'auto' }}>
                {post.content}
            </p>

            <div className='bg-foreground/5 ring-1 ring-foreground/10 flex gap-3 rounded-lg p-2 mt-4'>
                <Image
                    className='rounded-lg w-full aspect-video object-cover'
                    src={`https://github.com/pphatdev.png`}
                    alt={post.title}
                    width={36}
                    height={36}
                    priority={index < 3}
                    loading={index < 3 ? "eager" : "lazy"}
                />
            </div>
        </div>
    );
};