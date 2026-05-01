'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { Badge } from '@components/ui/badge';

export function AdminDashboardLiveTraffic({ initialValue = 0 }: { initialValue?: number }) {
    const [count, setCount] = useState(initialValue);
    const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

    useEffect(() => {
        const eventSource = new EventSource('/api/dashboard/live-traffic');

        eventSource.onopen = () => {
            setStatus('connected');
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (typeof data.count === 'number') {
                    setCount(data.count);
                }
            } catch (error) {
                console.error('Error parsing traffic data:', error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            setStatus('error');
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div className="flex items-center gap-3 rounded-2xl bg-primary/5 px-4 py-3">
            <div className="relative flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Activity className="size-5" />
                {status === 'connected' && (
                    <span className="absolute -right-0.5 -top-0.5 flex size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex size-3 rounded-full bg-emerald-500"></span>
                    </span>
                )}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">Live Visitors</p>
                    <Badge variant="outline" className={`h-5 rounded-full px-1.5 text-[10px] uppercase tracking-wider ${
                        status === 'connected' ? 'border-emerald-500/50 text-emerald-600' : 
                        status === 'error' ? 'border-destructive/50 text-destructive' : 'text-muted-foreground'
                    }`}>
                        {status}
                    </Badge>
                </div>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                    {count.toLocaleString()}
                </p>
            </div>
        </div>
    );
}
