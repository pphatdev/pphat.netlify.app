"use client";

import { useDeferredValue, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import {
    Bold,
    Code2,
    Eye,
    Heading1,
    ImageIcon,
    Italic,
    Link2,
    List,
    ListOrdered,
    PencilLine,
    Pilcrow,
    Quote,
    Rows3,
} from 'lucide-react';
import { MarkdownRenderer } from '@components/ui/markdown-renderer';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { Textarea } from '@components/ui/textarea';
import { cn } from '@lib/utils';

type EditorMode = 'write' | 'split' | 'preview';

type SelectionTransform = {
    value: string;
    selectionStart: number;
    selectionEnd: number;
};

type MarkdownEditorProps = {
    id: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
    previewClassName?: string;
};

function wrapSelection(source: string, start: number, end: number, prefix: string, suffix = prefix, fallback = 'text'): SelectionTransform {
    const selectedText = source.slice(start, end);
    const insertText = selectedText || fallback;
    const nextValue = `${source.slice(0, start)}${prefix}${insertText}${suffix}${source.slice(end)}`;
    const selectionStart = start + prefix.length;
    const selectionEnd = selectionStart + insertText.length;

    return {
        value: nextValue,
        selectionStart,
        selectionEnd,
    };
}

function prefixSelectedLines(source: string, start: number, end: number, prefix: string): SelectionTransform {
    const blockStart = source.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
    const nextLineBreak = source.indexOf('\n', end);
    const blockEnd = nextLineBreak === -1 ? source.length : nextLineBreak;
    const selectedBlock = source.slice(blockStart, blockEnd);
    const prefixedBlock = selectedBlock
        .split('\n')
        .map((line) => `${prefix}${line}`)
        .join('\n');
    const nextValue = `${source.slice(0, blockStart)}${prefixedBlock}${source.slice(blockEnd)}`;

    return {
        value: nextValue,
        selectionStart: start + prefix.length,
        selectionEnd: end + prefix.length * selectedBlock.split('\n').length,
    };
}

function insertBlock(source: string, start: number, end: number, before: string, after = '', fallback = ''): SelectionTransform {
    const selectedText = source.slice(start, end) || fallback;
    const needsLeadingBreak = start > 0 && source[start - 1] !== '\n';
    const needsTrailingBreak = end < source.length && source[end] !== '\n';
    const prefix = needsLeadingBreak ? `\n${before}` : before;
    const suffix = needsTrailingBreak ? `${after}\n` : after;
    const nextValue = `${source.slice(0, start)}${prefix}${selectedText}${suffix}${source.slice(end)}`;
    const selectionStart = start + prefix.length;
    const selectionEnd = selectionStart + selectedText.length;

    return {
        value: nextValue,
        selectionStart,
        selectionEnd,
    };
}

export function MarkdownEditor({
    id,
    value,
    onChange,
    placeholder = 'Write in Markdown...',
    required = false,
    className,
    previewClassName,
}: MarkdownEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [mode, setMode] = useState<EditorMode>('split');
    const deferredValue = useDeferredValue(value);
    const wordCount = deferredValue.trim().length === 0 ? 0 : deferredValue.trim().split(/\s+/).length;

    function updateValue(nextValue: string) {
        onChange(nextValue);
    }

    function applyTransform(transform: (source: string, start: number, end: number) => SelectionTransform) {
        const textarea = textareaRef.current;
        if (!textarea) {
            return;
        }

        const result = transform(value, textarea.selectionStart, textarea.selectionEnd);
        updateValue(result.value);

        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
        });
    }

    function handleTabKey(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key !== 'Tab') {
            return;
        }

        event.preventDefault();
        applyTransform((source, start, end) => {
            const indent = '    ';
            const selectedText = source.slice(start, end);

            if (selectedText.includes('\n')) {
                return prefixSelectedLines(source, start, end, indent);
            }

            const nextValue = `${source.slice(0, start)}${indent}${source.slice(end)}`;
            const nextCursor = start + indent.length;

            return {
                value: nextValue,
                selectionStart: nextCursor,
                selectionEnd: nextCursor,
            };
        });
    }

    return (
        <div className={cn('overflow-hidden rounded-3xl border border-border/70 bg-background/80', className)}>
            <div className="flex flex-col gap-3 border-b border-border/70 bg-muted/30 px-3 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <Button type="button" variant="ghost" size="sm" className="mt-0 rounded-lg px-2.5" onClick={() => applyTransform((source, start, end) => wrapSelection(source, start, end, '**', '**', 'bold text'))}>
                            <Bold className="size-4" />
                            Bold
                        </Button>
                        <Button type="button" variant="ghost" size="sm" className="mt-0 rounded-lg px-2.5" onClick={() => applyTransform((source, start, end) => wrapSelection(source, start, end, '*', '*', 'italic text'))}>
                            <Italic className="size-4" />
                            Italic
                        </Button>
                        <Button type="button" variant="ghost" size="sm" className="mt-0 rounded-lg px-2.5" onClick={() => applyTransform((source, start, end) => wrapSelection(source, start, end, '`', '`', 'code'))}>
                            <Code2 className="size-4" />
                            Code
                        </Button>
                        <Button type="button" variant="ghost" size="sm" className="mt-0 rounded-lg px-2.5" onClick={() => applyTransform((source, start, end) => wrapSelection(source, start, end, '[', '](https://)', 'link text'))}>
                            <Link2 className="size-4" />
                            Link
                        </Button>
                        <Button type="button" variant="ghost" size="sm" className="mt-0 rounded-lg px-2.5" onClick={() => applyTransform((source, start, end) => wrapSelection(source, start, end, '![', '](https://)', 'alt text'))}>
                            <ImageIcon className="size-4" />
                            Image
                        </Button>
                        <Separator orientation="vertical" className="mx-1 hidden h-7 sm:block" />
                        <Button type="button" variant="ghost" size="sm" className="mt-0 rounded-lg px-2.5" onClick={() => applyTransform((source, start, end) => prefixSelectedLines(source, start, end, '# '))}>
                            <Heading1 className="size-4" />
                            H1
                        </Button>
                        <Button type="button" variant="ghost" size="sm" className="mt-0 rounded-lg px-2.5" onClick={() => applyTransform((source, start, end) => prefixSelectedLines(source, start, end, '- '))}>
                            <List className="size-4" />
                            List
                        </Button>
                        <Button type="button" variant="ghost" size="sm" className="mt-0 rounded-lg px-2.5" onClick={() => applyTransform((source, start, end) => prefixSelectedLines(source, start, end, '1. '))}>
                            <ListOrdered className="size-4" />
                            Ordered
                        </Button>
                        <Button type="button" variant="ghost" size="sm" className="mt-0 rounded-lg px-2.5" onClick={() => applyTransform((source, start, end) => prefixSelectedLines(source, start, end, '> '))}>
                            <Quote className="size-4" />
                            Quote
                        </Button>
                        <Button type="button" variant="ghost" size="sm" className="mt-0 rounded-lg px-2.5" onClick={() => applyTransform((source, start, end) => insertBlock(source, start, end, '```ts\n', '\n```', 'const example = true;'))}>
                            <Pilcrow className="size-4" />
                            Block
                        </Button>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-background/80 p-1">
                        <Button type="button" variant={mode === 'write' ? 'outline' : 'ghost'} size="sm" className="mt-0 rounded-lg px-2.5" onClick={() => setMode('write')}>
                            <PencilLine className="size-4" />
                            Write
                        </Button>
                        <Button type="button" variant={mode === 'split' ? 'outline' : 'ghost'} size="sm" className="mt-0 rounded-lg px-2.5" onClick={() => setMode('split')}>
                            <Rows3 className="size-4" />
                            Split
                        </Button>
                        <Button type="button" variant={mode === 'preview' ? 'outline' : 'ghost'} size="sm" className="mt-0 rounded-lg px-2.5" onClick={() => setMode('preview')}>
                            <Eye className="size-4" />
                            Preview
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <p>Markdown shortcuts: Tab indents, preview is live, and content saves as plain markdown.</p>
                    <p>{wordCount} words · {deferredValue.length} characters</p>
                </div>
            </div>

            <div className={cn('grid min-h-128 gap-0', mode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1')}>
                {mode !== 'preview' ? (
                    <div className={cn('flex min-h-128 flex-col', mode === 'split' && 'border-b border-border/70 lg:border-r lg:border-b-0')}>
                        <div className="border-b border-border/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            Markdown
                        </div>
                        <Textarea
                            ref={textareaRef}
                            id={id}
                            value={value}
                            onChange={(event) => updateValue(event.target.value)}
                            onKeyDown={handleTabKey}
                            placeholder={placeholder}
                            required={required}
                            spellCheck={false}
                            className="min-h-112 flex-1 resize-none rounded-none border-0 bg-transparent px-4 py-4 font-mono text-sm leading-7 shadow-none focus-visible:ring-0"
                        />
                    </div>
                ) : null}

                {mode !== 'write' ? (
                    <div className="flex min-h-128 flex-col bg-muted/10">
                        <div className="border-b border-border/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            Preview
                        </div>
                        <div className="h-full overflow-y-auto px-4 py-4">
                            {deferredValue.trim().length > 0 ? (
                                <MarkdownRenderer content={deferredValue} className={cn('min-h-112', previewClassName)} />
                            ) : (
                                <div className="flex min-h-112 items-center justify-center rounded-xl border border-dashed border-border/70 bg-background/60 px-6 text-center text-sm text-muted-foreground">
                                    Start writing to preview the rendered markdown.
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}