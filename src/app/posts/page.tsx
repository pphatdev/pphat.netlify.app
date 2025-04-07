'use client';
import InfiniteScroll from '@components/infinit-scroll';
import { useState, useEffect } from 'react';
import originData from 'public/data/post.json';
import { staticPaginationJSON } from '@lib/functions/pagination-list';
import { Spinner } from '@components/ui/loading';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
    id: number;
    title: string;
    content: string;
    slug: string;
    published: boolean;
    createdAt: string;
}

const PostCard = ({ post, index }: { post: Post, index: number }) => {
    return (
        <div
            className="col-span-1 relative bg-foreground/5 font-default rounded-lg p-4 mb-4 ring-1 ring-foreground/10 hover:ring-primary hover:ring-2 transition-all duration-200 ease-in-out flex flex-col h-full"
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
                <Button
                    variant="outline"
                    size="icon"
                    className="z-10 cursor-pointer bg-foreground/5 rounded-full size-7 p-1.5"
                    aria-label="Post options"
                    aria-haspopup="menu"
                >
                    <EllipsisVertical aria-hidden="true" />
                </Button>
            </header>

            <h2 className="text-lg font-medium line-clamp-1 pb-1">{post.title}</h2>
            <p className='font-normal line-clamp-3 text-foreground/80'>{post.content}</p>

            <div className='bg-foreground/5 ring-1 ring-foreground/10 flex gap-3 rounded-lg p-2 mt-4'>
                <Image
                    className='rounded-lg'
                    src={`https://github.com/pphatdev.png`}
                    alt={post.title}
                    width={36}
                    height={36}
                    priority={index < 3} // Prioritize first visible images
                    loading={index < 3 ? "eager" : "lazy"}
                />
            </div>

            <footer className="mt-auto pt-2">
                <div className="text-sm text-muted-foreground mt-2">
                    Published: {post.published ? 'Yes' : 'No'}
                </div>
                <div className="text-sm text-muted-foreground">
                    Created At: {new Date(post.createdAt).toLocaleDateString()}
                </div>
            </footer>
        </div>
    );
};

const InfiniteScrollDemo = () => {

    const limit = 9;
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => { next(); }, []);

    const next = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const { posts: postData } = originData;
            const { data } = staticPaginationJSON(
                postData,
                postData.length,
                {
                    page: page,
                    limit: limit,
                    search: null,
                    sort: 'asc',
                }
            );

            setPosts((prev) => [...prev, ...(data as Post[])]);
            setPage((prev) => prev + 1);

            if (data.length < limit) setHasMore(false);

        } catch (error) {
            console.error('Error fetching posts:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-full flex flex-col max-w-5xl mx-auto overflow-y-auto p-4 sm:px-10">
            <h1 className='mb-4'>Posts</h1>
            <article className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[500px] relative">
                {posts.map((post, index) => (<PostCard key={index} post={post} index={index} />))}
                <InfiniteScroll hasMore={hasMore} isLoading={loading} next={next} threshold={1}>
                    {hasMore && (
                        <div className='col-span-full flex justify-center items-center'>
                            <Spinner variant={'bars'} />
                        </div>
                    )}
                </InfiniteScroll>
            </article>
        </main>
    );
};

export default InfiniteScrollDemo;
