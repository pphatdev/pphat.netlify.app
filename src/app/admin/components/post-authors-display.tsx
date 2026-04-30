"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export function PostAuthorsDisplay({ authors }: { authors: { name: string; profile: string; url: string }[] }) {
    const router = useRouter();

    if (!authors || authors.length === 0) {
        return null;
    }

    const handleAuthorClick = (e: React.MouseEvent, url: string) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {authors.map((author) => (
                <span
                    key={author.profile}
                    onClick={(e) => handleAuthorClick(e, author.url)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-foreground/5 p-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-foreground/10"
                    role="link"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            router.push(author.url);
                        }
                    }}
                >
                    <Image width={100} height={100} src={author.profile} alt={author.name} className="size-6 rounded-full" />
                </span>
            ))}
        </div>
    );
}
