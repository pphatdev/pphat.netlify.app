import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { appName, NEXT_PUBLIC_API, NEXT_PUBLIC_APP_URL, PERSON_NAME } from '@lib/constants';
import { NavigationBar } from '@components/navbar/navbar';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { ArrowLeftIcon, Calendar, Clock, ExternalLink, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import "../../../styles/code-block-node.css"
import { GridPattern } from '@components/ui/grid-pattern';
import ArticleStructuredData from '@components/data-structured/article';
import BreadcrumbStructuredData from '@components/breadcrumb-structured-data';
import { MarkdownRenderer } from '@components/ui/markdown-renderer';
import { ScrollToTopButton } from '@components/ui/scroll-to-top-button';
import { PostCoverImage } from '@components/ui/post-cover-image';
import Footer from 'src/components/layouts/footer';

interface Params {
    params: Promise<{ slug: string; }>;
}

interface RemotePost {
    id?: string | number;
    slug?: string;
    title?: string;
    content?: string;
    excerpt?: string;
    tags?: string[] | string;
    featured_image?: string;
    published?: boolean;
    published_date?: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    is_featured?: boolean;
    view_count?: number;
    status?: boolean;
    is_deleted?: boolean;
    created_date?: string;
    updated_date?: string;
}

interface NormalizedPost {
    id: string;
    slug: string;
    title: string;
    content: string;
    description: string;
    tags: string[];
    authors: { name: string; profile: string; url: string }[];
    thumbnail: string;
    published: boolean;
    createdAt: string;
    updatedAt?: string;
    visitorCount: number;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    isFeatured: boolean;
}

function normalizeTags(tags: RemotePost['tags']): string[] {
    if (Array.isArray(tags)) return tags.filter(Boolean);
    if (typeof tags === 'string') {
        return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    }
    return [];
}

function normalizeThumbnail(imagePath?: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    if (imagePath.startsWith('/')) return `https://phat.website${imagePath}`;
    return imagePath;
}

async function getPostBySlugFromApi(slug: string): Promise<NormalizedPost | null> {
    const response = await fetch(`${NEXT_PUBLIC_API}/v1/api/articles/${encodeURIComponent(slug)}`, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 60 },
    });

    if (response.status === 404) return null;
    if (!response.ok) return null;

    const payload = (await response.json()) as unknown;
    const post = payload && typeof payload === 'object' && 'data' in payload
        ? ((payload as { data?: RemotePost }).data ?? null)
        : (payload as RemotePost);

    if (!post) return null;

    return {
        id: String(post.id ?? post.slug ?? slug),
        slug: post.slug ?? slug,
        title: post.title ?? '',
        content: post.content ?? '',
        description: post.excerpt ?? '',
        tags: normalizeTags(post.tags),
        authors: [{ name: PERSON_NAME, profile: '', url: NEXT_PUBLIC_APP_URL }],
        published: post.published ?? true,
        createdAt: post.published_date ?? post.created_date ?? post.updated_date ?? new Date().toISOString(),
        updatedAt: post.updated_date,
        thumbnail: post.featured_image?.replace(/^https?:\/\/[^\/]+/, '') || '',
        visitorCount: post.view_count ?? 0,
        metaTitle: post.meta_title ?? post.title ?? '',
        metaDescription: post.meta_description ?? post.excerpt ?? '',
        metaKeywords: post.meta_keywords ?? '',
        isFeatured: post.is_featured ?? false,
    };
}

async function getPublishedPostSlugsFromApi(): Promise<string[]> {
    const response = await fetch(`${NEXT_PUBLIC_API}/v1/api/articles?page=1&limit=99999`, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 60 },
    });

    if (!response.ok) return [];

    const payload = (await response.json()) as { data?: RemotePost[] };
    const posts = Array.isArray(payload.data) ? payload.data : [];

    return posts
        .filter((post) => (post.status ?? true) && !(post.is_deleted ?? false) && (post.published ?? true) && !!post.slug)
        .map((post) => String(post.slug));
}

export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params;
    const post = await getPostBySlugFromApi(params.slug);
    console.log(post);
    

    if (!post) {
        return {
            title: `Post Not Found`,
            description: 'The requested article could not be found'
        };
    }

    return {
        title: `${post.title}`,
        description: post.description,
        authors: post.authors?.map(author => ({
            name: author.name,
            url: author.url
        })) || [{
            name: appName,
            url: NEXT_PUBLIC_APP_URL
        }],
        openGraph: {
            title: `${post.title}`,
            description: post.description,
            type: 'article',
            url: `${NEXT_PUBLIC_APP_URL}/posts/${post.slug}`,
            images: post.thumbnail ? [{ url: post.thumbnail.replace(/^https?:\/\/[^\/]+/, '') }] : undefined,
            publishedTime: post.createdAt,
            authors: post.authors?.map(author => author.name),
        },
        twitter: {
            card: 'summary_large_image',
            title: `${post.title}`,
            description: post.description,
            images: post.thumbnail ? [{ url: post.thumbnail.replace(/^https?:\/\/[^\/]+/, '') }] : undefined,
        }
    };
}

export async function generateStaticParams() {
    const slugs = await getPublishedPostSlugsFromApi();
    return slugs.map((slug) => ({ slug }));
}

export default async function PostDetail(props: Params) {
    const params = await props.params;
    const post = await getPostBySlugFromApi(params.slug);

    if (!post) {
        return (
            <>
                <GridPattern
                    width={30}
                    height={30}
                    x={-1}
                    y={-1}
                    className={"mask-[linear-gradient(to_bottom_right,white,transparent,transparent)] "}
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
    return (
        <>
            <ArticleStructuredData
                title={post.title}
                description={post.description || ''}
                slug={post.slug}
                thumbnail={post.thumbnail ? post.thumbnail.replace(/^https?:\/\/[^\/]+/, '') : undefined}
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
                    className={"mask-[linear-gradient(to_bottom_right,white,transparent,transparent)] "}
                />
            </div>
            <article className="max-w-5xl sm:px-4 mx-auto max-sm:pt-0 sm:mt-16 py-8">
                {/* Header */}
                <div className="mb-6">
                    {post.thumbnail && (
                        <div className="relative w-full h-full max-xs:max-h-96 md:h-116 mb-6 max-sm:rounded-none max-xs:rounded-b-4xl rounded-2xl overflow-hidden">
                            <PostCoverImage
                                src={post.thumbnail}
                                alt={post.title}
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
                                <Link href={`/admin/blogs/${post.id}`}>
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
                                        <Link rel="noopener noreferrer" target='_blank' href={author.url === "" ? String(author.profile).replace('.png', '') : author.url} key={index} className="flex items-center space-x-2">
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
            <Footer />
            <ScrollToTopButton />
        </>
    );
}
