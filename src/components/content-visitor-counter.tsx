'use client';

import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

type ContentVisitorType = 'blog' | 'post' | 'project';

interface ContentVisitorCounterProps {
    type: ContentVisitorType;
    slug: string;
    initialCount?: number;
    className?: string;
}

export function ContentVisitorCounter({
    type,
    slug,
    initialCount = 0,
    className,
}: ContentVisitorCounterProps) {
    const [visitorCount, setVisitorCount] = useState(initialCount);

    useEffect(() => {
        let active = true;

        async function updateVisitorCount() {
            try {
                const response = await fetch(
                    '/api/visitors',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type, slug }),
                    }
                );

                if (!response.ok) {
                    return;
                }

                const payload = await response.json();

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