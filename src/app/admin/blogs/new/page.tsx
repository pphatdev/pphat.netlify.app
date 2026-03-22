import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PostEditorForm } from '@components/admin/post-editor-form';
import { Button } from '@components/ui/button';

export default function AdminNewBlogPage() {
    return (
        <section className="relative bg-linear-to-t from-background to-background/30">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-4 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="relative space-y-5">
                <Button asChild variant="outline" className="h-9 rounded-full px-3 text-xs uppercase tracking-[0.18em]">
                    <Link href="/admin/blogs">
                        <ArrowLeft className="size-3.5" />
                        Back to blogs
                    </Link>
                </Button>
                <div className="space-y-3">
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Create a New Blog Post</h1>
                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                        Draft, refine, and publish a new blog post from one workspace. Every entry is saved to SQLite and immediately available in your admin workflow.
                    </p>
                </div>

                <PostEditorForm />
            </div>
        </section>
    );
}