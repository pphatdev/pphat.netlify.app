import React from 'react';
import { db, Post } from '@lib/db/post';
import Link from 'next/link';
import { Metadata } from 'next';
import { appName, currentDomain } from '@lib/constants';
import { NavigationBar } from '@components/navbar/navbar';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { ArrowLeftIcon, Calendar, Clock, Edit, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { NovelRenderer } from '@components/ui/novel-renderer';
import Image from 'next/image';
import "../../../styles/code-block-node.css"
import { GridPattern } from '@components/ui/grid-pattern';

interface Params {
    params: Promise<{ slug: string; }>;
}

export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params;
    const posts = db.query<Post>('posts', (post) => post.slug === params.slug);
    const post = posts[0];

    if (!post) {
        return {
            title: `Post Not Found | ${appName}`,
            description: 'The requested article could not be found'
        };
    }

    // Extract plain text from content for description
    let description = '';
    try {
        const content = JSON.parse(post.content);
        description = extractTextFromContent(content).substring(0, 160);
    } catch {
        description = post.content.substring(0, 160);
    }

    return {
        title: `${post.title} | ${appName}`,
        description,
        authors: post.authors?.map(author => ({
            name: author.name,
            url: author.url
        })) || [{
            name: appName,
            url: currentDomain
        }],
        openGraph: {
            title: `${post.title} | ${appName}`,
            description,
            type: 'article',
            url: `${currentDomain}/posts/${post.slug}`,
            images: post.thumbnail ? [{ url: post.thumbnail.toString() }] : undefined,
            publishedTime: post.createdAt,
            authors: post.authors?.map(author => author.name),
        },
        twitter: {
            card: 'summary_large_image',
            title: `${post.title} | ${appName}`,
            description,
            images: post.thumbnail ? [{ url: post.thumbnail.toString() }] : undefined,
        }
    };
}

function extractTextFromContent(content: any): string {
    if (!content) return '';

    let text = '';

    if (content.type === 'text') {
        return content.text || '';
    }

    if (content.content && Array.isArray(content.content)) {
        content.content.forEach((node: any) => {
            text += extractTextFromContent(node) + ' ';
        });
    }

    return text.trim();
}

export default async function PostDetail(props: Params) {
    const params = await props.params;
    const posts = db.query<Post>('posts', (post) => post.slug === params.slug);
    const post = posts[0];

    if (!post) {
        return (
            <>
                <NavigationBar className='sticky' />
                <div className="container mx-auto py-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
                    <p className="text-muted-foreground mb-8">
                        The article you're looking for doesn't exist.
                    </p>
                    <Button asChild>
                        <Link href="/posts">Back to Posts</Link>
                    </Button>
                </div>
            </>
        );
    }

    const createdDate = new Date(post.createdAt);

    return (
        <>
            <NavigationBar className='fixed' />
            <div className="absolute inset-y-0 left-0 right-0 pointer-events-none opacity-60" aria-hidden="true">
                <GridPattern
                    width={30}
                    height={30}
                    x={-1}
                    y={-1}
                    className={"[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] "}
                />
            </div>
            <article className="max-w-5xl sm:px-4 mx-auto max-xs:pt-0 sm:mt-16 py-8">
                {/* Header */}
                <div className="mb-8">
                    {post.thumbnail && (
                        <div className="relative w-full h-full max-xs:max-h-96 md:h-[29rem] mb-6 max-xs:rounded-none max-xs:rounded-b-4xl rounded-2xl overflow-hidden">
                            <Image
                                src={post.thumbnail}
                                alt={post.title}
                                width={800}
                                height={450}
                                loading='lazy'
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="space-y-4 max-xs:px-3">

                        <Link href="/" className="hover:bg-foreground/5 text-primary max-sm:px-3 max-sm:pr-4 max-sm:bg-foreground/5 font-sans transition-all duration-300 max-sm:mt-0 mt-7 items-center max-sm:ring hover:ring w-fit ring-foreground/10 justify-start flex rounded-full hover:px-4 p-1.5">
                            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Articles
                        </Link>


                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap max-sm:justify-center  gap-2">
                            {post.tags?.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex max-sm:flex-col items-center justify-between gap-4">
                            <div className="flex max-xs:flex-col max-sm:items-center max-sm:justify-center w-full items-center space-x-4">
                                {post.authors?.map((author, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={author.profile} alt={author.name} />
                                            <AvatarFallback>
                                                <User className="w-4 h-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="text-sm">
                                            <p className="font-medium">{author.name}</p>
                                        </div>
                                    </div>
                                ))}

                                <Separator orientation="vertical" className="h-6" />

                                <div className="flex items-center justify-between max-xs:mt-5 gap-4">
                                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <time dateTime={post.createdAt} className='whitespace-nowrap'>
                                            {createdDate.toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </time>
                                    </div>

                                    <div className="flex items-center space-x-1 text-sm text-muted-foreground whitespace-nowrap">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatDistanceToNow(createdDate)} ago</span>
                                    </div>
                                </div>
                            </div>

                            {/* <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/posts/${post.id}/edit`}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Post
                                </Link>
                            </Button> */}
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Content */}
                <div className="prose prose-lg mx-auto dark:prose-invert  max-xs:px-3">
                    <NovelRenderer content={post.content} />
                </div>

                <Separator className="my-8" />

                {/* Footer */}
                <div className="flex items-center mx-auto justify-between max-xs:px-3">
                    <div className="flex flex-wrap gap-2">
                        {post.tags?.map((tag) => (
                            <Badge key={tag} variant="outline">
                                #{tag}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/posts">← All Posts</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/admin/posts/${post.slug}/edit`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>
            </article>
        </>
    );
}
