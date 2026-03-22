"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@lib/utils';
import { Label } from '@components/ui/label';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@components/ui/command';

interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
}

interface ModeratorSelectorProps {
    selectedModeratorIds: string[];
    onModeratorChange: (moderatorIds: string[], selectedModerators: User[]) => void;
}

export function ModeratorSelector({ selectedModeratorIds, onModeratorChange }: ModeratorSelectorProps) {
    const { data: session } = useSession();
    const [moderators, setModerators] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const currentUserId = session?.user?.id;

    useEffect(() => {
        const fetchModerators = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/admin/users');
                if (!response.ok) throw new Error('Failed to fetch moderators');
                const data = await response.json();
                setModerators(
                    Array.isArray(data)
                        ? data.filter((user): user is User => typeof user?.id === 'string' && user.id !== currentUserId)
                        : []
                );
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load moderators');
            } finally {
                setLoading(false);
            }
        };

        fetchModerators();
    }, [currentUserId]);

    useEffect(() => {
        if (selectedModeratorIds.length === 0 || !currentUserId || !selectedModeratorIds.includes(currentUserId)) {
            return;
        }

        const nextIds = selectedModeratorIds.filter((id) => id !== currentUserId);
        const nextModerators = moderators.filter((moderator) => nextIds.includes(moderator.id));
        onModeratorChange(nextIds, nextModerators);
    }, [currentUserId, moderators, onModeratorChange, selectedModeratorIds]);

    function toggleModerator(moderatorId: string, checked: boolean) {
        const nextIds = checked
            ? Array.from(new Set([...selectedModeratorIds, moderatorId]))
            : selectedModeratorIds.filter((id) => id !== moderatorId);
        const nextModerators = moderators.filter((moderator) => nextIds.includes(moderator.id));

        onModeratorChange(nextIds, nextModerators);
    }

    function clearAll() {
        onModeratorChange([], []);
    }

    const selectedModerators = moderators.filter((moderator) => selectedModeratorIds.includes(moderator.id));

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <Label htmlFor="moderator-options">Moderators (Optional, multiple)</Label>
                {selectedModeratorIds.length > 0 && (
                    <Button type="button" variant="link" size="sm" className="mt-0 px-0 text-xs text-muted-foreground" onClick={clearAll}>
                        Clear all
                    </Button>
                )}
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button id="moderator-options" type="button" variant="outline" role="combobox" className="mt-0 min-h-10 w-full shadow-none justify-between rounded-xl px-3 py-2">
                        <span className="flex flex-wrap items-center gap-1.5 text-left">
                            {selectedModerators.length === 0 ? (
                                <span className="text-sm text-muted-foreground">Select moderators...</span>
                            ) : (
                                selectedModerators.slice(0, 2).map((moderator) => (
                                    <Badge key={moderator.id} variant="secondary" className="max-w-40 truncate">
                                        {moderator.name}
                                    </Badge>
                                ))
                            )}
                            {selectedModerators.length > 2 && (
                                <Badge variant="outline">+{selectedModerators.length - 2}</Badge>
                            )}
                        </span>
                        <ChevronsUpDown className="size-4 shrink-0 opacity-60" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-90 p-0">
                    <Command>
                        <CommandInput placeholder="Search moderators..." />
                        <CommandList>
                            {loading && <div className="px-3 py-2 text-sm text-muted-foreground">Loading...</div>}
                            {error && <div className="px-3 py-2 text-sm text-destructive">{error}</div>}
                            {!loading && !error && (
                                <>
                                    <CommandEmpty>No moderators found.</CommandEmpty>
                                    <CommandGroup>
                                        {moderators.map((user) => {
                                            const selected = selectedModeratorIds.includes(user.id);
                                            return (
                                                <CommandItem
                                                    key={user.id}
                                                    value={`${user.name} ${user.email}`}
                                                    onSelect={() => toggleModerator(user.id, !selected)}
                                                    className="gap-2"
                                                >
                                                    <Check className={cn('size-4', selected ? 'opacity-100' : 'opacity-0')} />
                                                    <Avatar className="size-6">
                                                        {user.image && <AvatarImage src={user.image} alt={user.name} />}
                                                        <AvatarFallback className="text-xs">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex min-w-0 flex-col">
                                                        <span className="truncate text-sm font-medium">{user.name}</span>
                                                        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                                    </div>
                                                </CommandItem>
                                            );
                                        })}
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
