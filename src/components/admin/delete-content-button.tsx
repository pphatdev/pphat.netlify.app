"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@components/ui/button';

export function DeleteContentButton({
    endpoint,
    label,
    redirectTo,
}: {
    endpoint: string;
    label: string;
    redirectTo: string;
}) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        if (!window.confirm(`Delete ${label}? This cannot be undone.`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(endpoint, { method: 'DELETE' });
            const payload = await response.json().catch(() => ({}));

            if (!response.ok) {
                toast.error(payload.error || `Failed to delete ${label}`);
                return;
            }

            toast.success(`${label} deleted`);
            router.push(redirectTo);
            router.refresh();
        } catch (error) {
            console.error('Delete failed', error);
            toast.error(`Failed to delete ${label}`);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Button
            type="button"
            variant="destructive"
            className="mt-0 h-10 px-4"
            disabled={isDeleting}
            onClick={handleDelete}
        >
            {isDeleting ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            Delete
        </Button>
    );
}