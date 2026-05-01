'use client';

import Link from 'next/link';

export type TrafficItem = {
    label: string;
    visitors: number;
    thumbnail?: string;
    type: 'Blog' | 'Project';
    status: 'Published' | 'Draft';
    href: string;
};

function formatCompact(value: number) {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: value >= 1000 ? 1 : 0,
    }).format(value);
}

export function AdminTrafficSpotlight({ items }: { items: TrafficItem[] }) {
    if (items.length === 0) {
        return (
            <div className="flex min-h-48 items-center justify-center rounded-3xl border border-dashed border-border/70 bg-background/50 text-sm text-muted-foreground">
                Publish content to unlock visitor insights.
            </div>
        );
    }

    const max = Math.max(...items.map((i) => i.visitors), 1);

    return (
        <div className="space-y-2">
            {items.map((item, index) => {
                const pct = item.visitors === 0 ? 0 : Math.max(3, Math.round((item.visitors / max) * 100));
                const isDraft = item.status === 'Draft';

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3.5 transition-all hover:border-border hover:bg-muted/40 hover:shadow-sm"
                    >
                        {/* Thumbnail or Rank */}
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-background/80 flex items-center justify-center">
                            {item.thumbnail ? (
                                <img src={item.thumbnail} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                            ) : (
                                <span className="text-xs font-semibold tabular-nums text-muted-foreground transition-colors group-hover:text-foreground">
                                    {index + 1}
                                </span>
                            )}
                        </div>

                        {/* Title + progress bar */}
                        <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex min-w-0 items-center gap-2">
                                <p className={`min-w-0 truncate text-sm font-medium leading-none text-foreground${isDraft ? ' opacity-50' : ''}`}>
                                    {item.label}
                                </p>
                                <span
                                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                                        item.type === 'Blog'
                                            ? 'bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                                            : 'bg-teal-500/12 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400'
                                    }`}
                                >
                                    {item.type}
                                </span>
                                {isDraft && (
                                    <span className="shrink-0 rounded-full border border-border/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                        Draft
                                    </span>
                                )}
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
                                <div
                                    className={`h-1.5 rounded-full transition-[width] duration-500 ${
                                        item.type === 'Blog' ? 'bg-blue-600' : 'bg-teal-600'
                                    }${isDraft ? ' opacity-35' : ''}`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>

                        {/* Visit count */}
                        <div className="shrink-0 text-right">
                            <p className="text-sm font-semibold tabular-nums text-foreground">{formatCompact(item.visitors)}</p>
                            <p className="text-[11px] leading-none text-muted-foreground">visits</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}