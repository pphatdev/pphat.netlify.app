import Link from 'next/link';
import { ArrowLeft, BookOpenText, CheckCircle2, Sparkles } from 'lucide-react';
import { PostEditorForm } from '@components/admin/post-editor-form';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';

export default function AdminNewBlogPage() {
    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-linear-to-br from-background via-background to-muted/40 p-6 sm:p-8">
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
                        <Badge variant="outline" className="rounded-full bg-background/90 px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                            Editorial Studio
                        </Badge>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Compose a New Blog Story</h1>
                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                            Draft, refine, and publish from one workspace. Every entry is saved to SQLite and immediately available in your admin workflow.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3 py-1.5">
                            <Sparkles className="size-3.5 text-primary" />
                            Fast markdown drafting
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3 py-1.5">
                            <BookOpenText className="size-3.5 text-primary" />
                            Structured metadata
                        </span>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <PostEditorForm />

                <aside className="space-y-4 xl:sticky xl:top-6 xl:h-fit">
                    <Card className="rounded-2xl border-border/70 bg-background/85 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Publishing Checklist</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ol className="space-y-2.5 text-sm text-muted-foreground">
                                <li className="inline-flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                                    Write a clear title and short summary.
                                </li>
                                <li className="inline-flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                                    Add thumbnail path and useful tags.
                                </li>
                                <li className="inline-flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                                    Keep as draft until final review.
                                </li>
                            </ol>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}