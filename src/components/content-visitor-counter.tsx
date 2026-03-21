'use client';

import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

type ContentVisitorType = 'post' | 'project';

interface ContentVisitorCounterProps {
    type: ContentVisitorType;
    slug: string;
    initialCount?: number;
    className?: string;
}

const SESSION_PREFIX = 'visitor-counted';

export function ContentVisitorCounter({
    type,
    slug,
    initialCount = 0,
    className,
}: ContentVisitorCounterProps) {
    const [visitorCount, setVisitorCount] = useState(initialCount);

    useEffect(() => {
        let active = true;
        const storageKey = `${SESSION_PREFIX}:${type}:${slug}`;

        async function updateVisitorCount() {
            try {
                const alreadyCounted = sessionStorage.getItem(storageKey) === '1';

                const response = await fetch(
                    alreadyCounted
                        ? `/api/visitors?type=${encodeURIComponent(type)}&slug=${encodeURIComponent(slug)}`
                        : '/api/visitors',
                    alreadyCounted
                        ? { method: 'GET', cache: 'no-store' }
                        : {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type, slug }),
                        }
                );

                if (!response.ok) {
                    return;
                }

                const payload = await response.json();

                if (!alreadyCounted) {
                    sessionStorage.setItem(storageKey, '1');
                }

                if (active && typeof payload.visitorCount === 'number') {
                    setVisitorCount(payload.visitorCount);
                }
            } catch (error) {
                console.error('Failed to update visitor count:', error);
            }
        }

        updateVisitorCount();

        return () => {
            active = false;
        };
    }, [slug, type]);

    return (
        <div className={className}>
            <Eye className='w-4 h-4' />
            <span>{visitorCount.toLocaleString()} visitors</span>
        </div>
    );
}