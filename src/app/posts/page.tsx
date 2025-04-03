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

interface Post {
    id: number;
    title: string;
    content: string;
    slug: string;
    published: boolean;
    createdAt: string;
}

const PostCard = ({ post }: { post: Post }) => {
    return (
        <article
            className="col-span-1 relative bg-background font-default rounded-lg shadow-md p-4 mb-4 ring-1 ring-foreground/10 hover:ring-2 transition-all duration-200 ease-in-out"
            role="article"
            tabIndex={-1}
        >
            <Link href={`/posts/${post.slug}`} className="absolute inset-0"/>
            <header className='mb-2 relative'>
                <Badge>Badge</Badge>
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 z-10 cursor-pointer rounded-full size-7 p-1.5"
                    aria-label="Post options"
                    aria-haspopup="menu"
                >
                    <EllipsisVertical aria-hidden="true" />
                </Button>
            </header>
            <h2 className="text-lg font-medium line-clamp-1 pb-1">{post.title}</h2>
            <p className='font-thin'>{post.content}</p>

            <div className='bg-foreground/5 ring-1 ring-foreground/10 flex gap-3 rounded-lg p-2 mt-4'>
                <Avatar className='rounded-lg'>
                    <AvatarImage src="assets/icons/favicon-32x32.png" alt="@pphatdev" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>

            <footer>
                <div className="text-sm text-muted-foreground mt-2">
                    Published: {post.published ? 'Yes' : 'No'}
                </div>
                <div className="text-sm text-muted-foreground">
                    Created At: {new Date(post.createdAt).toLocaleDateString()}
                </div>
            </footer>
        </article>
    );
};

const InfiniteScrollDemo = () => {

    const limit = 30;
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);

    // Load initial data when component mounts
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
        <main className="w-full flex flex-col max-w-5xl mx-auto overflow-y-auto p-4 @sm:px-10">
            <article className="grid grid-cols-1 @xs:grid-cols-2 @lg:grid-cols-3 gap-4">
                <h1 className='col-span-full'>Posts</h1>
                {posts.map((post, index) => (
                    <PostCard key={index} post={post} />
                ))}
                <InfiniteScroll hasMore={hasMore} isLoading={loading} next={next} threshold={1}>
                    {hasMore && (
                        <div className='col-span-full flex items-center justify-center overflow-hidden'>
                            <Spinner variant={'bars'} />
                        </div>
                    )}
                </InfiniteScroll>
            </article>
        </main>
    );
};

export default InfiniteScrollDemo;
