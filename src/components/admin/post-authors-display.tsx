import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import type { PostEntry } from '@lib/content';

interface PostAuthorsDisplayProps {
    authors: PostEntry['authors'];
    compact?: boolean;
}

export function PostAuthorsDisplay({ authors, compact = false }: PostAuthorsDisplayProps) {
    if (!authors || authors.length === 0) {
        return null;
    }

    if (compact) {
        // Show only first 2 authors with +N indicator
        return (
            <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                    {authors.slice(0, 2).map((author, index) => (
                        <div key={index} className="ring-1 ring-background">
                            <Avatar className="size-6">
                                {author.profile && <AvatarImage src={author.profile} alt={author.name} />}
                                <AvatarFallback className="text-xs">
                                    {author.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    ))}
                </div>
                {authors.length > 2 && (
                    <span className="text-xs font-medium text-muted-foreground">+{authors.length - 2}</span>
                )}
                <span className="text-xs text-muted-foreground">
                    {authors.length === 1 ? authors[0].name : `${authors.length} authors`}
                </span>
            </div>
        );
    }

    // Show all authors
    return (
        <div className="flex flex-wrap items-center gap-2">
            {authors.map((author, index) => (
                <div key={index} className="flex items-center gap-2 rounded-full bg-foreground/5 px-2 py-1">
                    <Avatar className="size-5">
                        {author.profile && <AvatarImage src={author.profile} alt={author.name} />}
                        <AvatarFallback className="text-xs font-semibold">
                            {author.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-foreground">{author.name}</span>
                </div>
            ))}
        </div>
    );
}
