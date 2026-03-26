export function PostAuthorsDisplay({
    authors,
    compact,
}: {
    authors: { name: string; profile: string; url: string }[];
    compact?: boolean;
}) {
    if (!authors || authors.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                By:
            </span>
            {authors.map((author) =>
                compact ? (
                    <span
                        key={author.profile}
                        className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                        title={author.profile}
                    >
                        <span className="truncate">{author.name}</span>
                    </span>
                ) : (
                    <a
                        key={author.profile}
                        href={author.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-foreground/10"
                        title={author.profile}
                    >
                        <span className="truncate">{author.name}</span>
                    </a>
                )
            )}
        </div>
    );
}
