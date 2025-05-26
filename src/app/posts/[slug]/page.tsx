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
import { Calendar, Clock, Edit, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { NovelRenderer } from '@components/ui/novel-renderer';
import Image from 'next/image';
import "../../../styles/code-block-node.css"

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
                <NavigationBar className='sticky'/>
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
            <NavigationBar  className='sticky'/>
            <article className="container max-w-4xl mx-auto py-8">
                {/* Header */}
                <div className="mb-8">
                    {post.thumbnail && (
                        <div className="relative w-full h-64 md:h-96 mb-6 rounded-lg overflow-hidden">
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

                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {post.tags?.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center space-x-4">
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

                                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <time dateTime={post.createdAt}>
                                        {createdDate.toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </time>
                                </div>

                                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatDistanceToNow(createdDate)} ago</span>
                                </div>
                            </div>

                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/posts/${post.id}/edit`}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Post
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <NovelRenderer content={post.content} />
                </div>

                <Separator className="my-8" />

                {/* Footer */}
                <div className="flex items-center justify-between">
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
