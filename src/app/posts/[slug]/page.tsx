import React from 'react';
import { getPostBySlug, getPublishedPosts, type PostEntry } from '@lib/content';
import Link from 'next/link';
import { Metadata } from 'next';
import { appName, NEXT_PUBLIC_APP_URL } from '@lib/constants';
import { NavigationBar } from '@components/navbar/navbar';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { ArrowLeftIcon, Calendar, Clock, ExternalLink, Pencil, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import "../../../styles/code-block-node.css"
import { GridPattern } from '@components/ui/grid-pattern';
import ArticleStructuredData from '@components/data-structured/article';
import BreadcrumbStructuredData from '@components/breadcrumb-structured-data';
import { MarkdownRenderer } from '@components/ui/markdown-renderer';
import { ScrollToTopButton } from '@components/ui/scroll-to-top-button';

interface Params {
    params: Promise<{ slug: string; }>;
}

const GITHUB_REPO_URL = process.env.NEXT_PUBLIC_GITHUB_REPO_URL || 'https://github.com/pphatdev/pphat.me';

export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params;
    const post = getPostBySlug(params.slug);

    if (!post) {
        return {
            title: `Post Not Found | ${appName}`,
            description: 'The requested article could not be found'
        };
    }

    return {
        title: `${post.title} | ${appName}`,
        description: post.description,
        authors: post.authors?.map(author => ({
            name: author.name,
            url: author.url
        })) || [{
            name: appName,
            url: NEXT_PUBLIC_APP_URL
        }],
        openGraph: {
            title: `${post.title} | ${appName}`,
            description: post.description,
            type: 'article',
            url: `${NEXT_PUBLIC_APP_URL}/posts/${post.slug}`,
            images: post.thumbnail ? [{ url: post.thumbnail.toString() }] : undefined,
            publishedTime: post.createdAt,
            authors: post.authors?.map(author => author.name),
        },
        twitter: {
            card: 'summary_large_image',
            title: `${post.title} | ${appName}`,
            description: post.description,
            images: post.thumbnail ? [{ url: post.thumbnail.toString() }] : undefined,
        }
    };
}

export async function generateStaticParams() {
    const posts = getPublishedPosts();
    return posts.map(post => ({ slug: post.slug }));
}

export default async function PostDetail(props: Params) {
    const params = await props.params;
    const post = getPostBySlug(params.slug);

    if (!post) {
        return (
            <>
                <GridPattern
                    width={30}
                    height={30}
                    x={-1}
                    y={-1}
                    className={"[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] "}
                />
                <NavigationBar className='sticky' />
                <div className="container flex min-h-svh flex-col justify-center items-center mx-auto py-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
                    <p className="text-muted-foreground mb-8">
                        The article you're looking for doesn't exist.
                    </p>

                    <Button asChild className='ring'>
                        <Link href="/posts">
                            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Blogs
                        </Link>
                    </Button>
                </div>
            </>
        );
    }

    const createdDate = new Date(post.createdAt);
    const postDirectory = post.filePath.split('/').slice(0, -1).join('/');
    const editPostDirectoryUrl = `${GITHUB_REPO_URL}/tree/main/content/${postDirectory}/index.mdx`;

    return (
        <>
            <ArticleStructuredData
                title={post.title}
                description={post.description || ''}
                slug={post.slug}
                thumbnail={post.thumbnail}
                authors={post.authors || []}
                tags={post.tags || []}
                createdAt={post.createdAt}
                updatedAt={post.updatedAt}
                content={post.content}
            />
            <BreadcrumbStructuredData items={[
                { name: 'Home', url: NEXT_PUBLIC_APP_URL, position: 1 },
                { name: 'Posts', url: `${NEXT_PUBLIC_APP_URL}/posts`, position: 2 },
                { name: post.title, url: `${NEXT_PUBLIC_APP_URL}/posts/${post.slug}`, position: 3 },
            ]} />

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
                <div className="mb-6">
                    {post.thumbnail && (
                        <div className="relative w-full h-full max-xs:max-h-96 md:h-[29rem] mb-6 max-xs:rounded-none max-xs:rounded-b-4xl rounded-2xl overflow-hidden">
                            <Image
                                src={post.thumbnail}
                                alt={post.title}
                                width={800}
                                height={450}
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                                className="w-full h-full object-cover"
                                unoptimized={post.thumbnail?.startsWith('http')}
                            />

                            <div className="absolute w-full hidden bottom-3 left-1/2 transform -translate-x-1/2 max-sm:flex flex-wrap max-sm:justify-center  gap-2">
                                {post.tags?.map((tag) => (
                                    <Badge key={tag} variant="secondary">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                        </div>
                    )}

                    <div className="space-y-4 max-xs:px-3 relative">

                        <div className="flex justify-between items-center gap-2 flex-wrap">
                            <Button asChild>
                                <Link href="/posts">
                                    <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Blogs
                                </Link>
                            </Button>

                            <Button asChild>
                                <Link href={editPostDirectoryUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4 ml-2" /> Edit Post
                                </Link>
                            </Button>

                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            {post.title}
                        </h1>

                        <div className="hidden sm:flex flex-wrap max-sm:justify-center  gap-2">
                            {post.tags?.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex mt-5 max-sm:flex-col items-center justify-between gap-4">
                            <div className="flex max-xs:flex-col max-sm:items-center max-sm:justify-center w-full items-center space-x-4">
                                <div className='flex gap-5 flex-wrap border-t sm:py-3 border-background'>
                                    {post.authors?.map((author, index) => (
                                        <Link rel="noopener noreferrer" target='_blank' href={ author.url === "" ? String(author.profile).replace('.png', '') : author.url } key={index} className="flex items-center space-x-2">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={author.profile} alt={author.name} />
                                                <AvatarFallback>
                                                    <User className="w-4 h-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="text-sm">
                                                <p className="font-medium">{author.name}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <Separator orientation="vertical" className="h-6" />

                                <div className="flex items-center justify-between max-xs:mt-5 gap-4">
                                    <div className="flex items-center space-x-1 max-sm:text-xs text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <time dateTime={post.createdAt} className='whitespace-nowrap'>
                                            {createdDate.toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </time>
                                    </div>

                                    <div className="flex items-center space-x-1 max-sm:text-xs text-sm text-muted-foreground whitespace-nowrap">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatDistanceToNow(createdDate)} ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Content */}
                <div className="mx-auto max-xs:px-3">
                    <MarkdownRenderer content={post.content} />
                </div>

                {/* <Separator className="my-8" /> */}

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
                        {/* <Button variant="outline" asChild>
                            <Link href="/posts">← All Posts</Link>
                        </Button> */}

                        <Button asChild>
                            <Link href="/posts">
                                <ArrowLeftIcon className="w-4 h-4 mr-2" /> All Blogs
                            </Link>
                        </Button>
                    </div>
                </div>
            </article>
            <ScrollToTopButton />
        </>
    );
}
