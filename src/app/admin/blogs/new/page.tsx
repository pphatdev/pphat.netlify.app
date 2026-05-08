import Link from 'next/link';
import { IconArrowLeft, IconFileText } from '@tabler/icons-react';
import { getCurrentUser } from '@lib/auth';
import { AdminPageHeader } from '../../components/page-header';
import { Button } from '@components/ui/button';
import { Input } from 'src/components/ui';

export default async function NewPostPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Button asChild variant="ghost" size="sm" className="-ml-2 h-8 gap-1.5 text-muted-foreground hover:text-foreground">
                    <Link href="/admin/blogs">
                        <IconArrowLeft className="size-3.5" />
                        Back to Blogs
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col gap-4 items-center justify-center rounded-3xl border border-dashed border-border/70 p-5 bg-background">
                <input type="text" placeholder="Title your blog post..." className="w-full pb-2 text-2xl px-2 font-bold appearance-none border-b border-transparent focus:border-primary/30 outline-none focus:ring-0" />
                <textarea placeholder="Describe your blog post..." className="w-full min-h-[100px] px-2 font-normal text-sm resize-none appearance-none focus:border-b outline-none focus:ring-0" />
            </div>

            {/* <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-background/50 px-6 py-24 text-center">
                <div className="size-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 ring-1 ring-primary/10">
                    <IconFileText className="size-8 text-primary/60" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">Post Editor</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    This is where the post editor will be implemented. You'll be able to draft, format, and publish your content from here.
                </p>
                <Button variant="outline" className="mt-8 rounded-full px-6" disabled>
                    Editor Coming Soon
                </Button>
            </div> */}
        </div>
    );
}
