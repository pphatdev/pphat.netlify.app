import Link from 'next/link';
import { Button } from '@components/ui/button';

export function AdminPageHeader({
    title,
    description,
    action,
    actionHref,
}: {
    title: string;
    description: string;
    action?: string;
    actionHref?: string;
}) {
    return (
        <div className="flex gap-4 pb-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
            {action && actionHref ? (
                <Button asChild className="mt-0 h-10 bg-primary/10 border border-primary px-4">
                    <Link href={actionHref}>{action}</Link>
                </Button>
            ) : null}
        </div>
    );
}