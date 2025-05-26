"use client";

import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { defaultExtensions } from '@components/ui/extensions';
import { cn } from '@lib/utils';
import { JSONContent } from 'novel';

interface NovelRendererProps {
    content: string | JSONContent;
    className?: string;
}

export function NovelRenderer({ content, className }: NovelRendererProps) {
    // Parse content if it's a string
    const parsedContent = React.useMemo(() => {
        if (typeof content === 'string') {
            try {
                return JSON.parse(content);
            } catch {
                // If parsing fails, treat as plain text
                return {
                    type: 'doc',
                    content: [
                        {
                            type: 'paragraph',
                            content: [
                                {
                                    type: 'text',
                                    text: content,
                                },
                            ],
                        },
                    ],
                };
            }
        }
        return content;
    }, [content]);

    const editor = useEditor({
        extensions: defaultExtensions,
        content: parsedContent,
        editable: false,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-lg dark:prose-invert max-w-none',
                    'prose-headings:font-bold prose-headings:tracking-tight',
                    'prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:leading-tight',
                    'prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:leading-tight',
                    'prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:leading-snug',
                    'prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6 prose-h4:leading-snug',
                    'prose-h5:text-lg prose-h5:mb-2 prose-h5:mt-5 prose-h5:leading-normal',
                    'prose-h6:text-base prose-h6:mb-2 prose-h6:mt-4 prose-h6:leading-normal prose-h6:font-semibold',
                    'prose-p:mb-4 prose-p:leading-relaxed',
                    'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
                    'prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:pl-4 prose-blockquote:italic',
                    'prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono',
                    'prose-pre:bg-transparent prose-pre:p-0 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:border-0',
                    'prose-img:rounded-lg prose-img:shadow-md',
                    'prose-ul:list-disc prose-ol:list-decimal',
                    'prose-li:mb-1',
                    '[&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:outline-none',
                    // Code block specific styles
                    '[&_pre[class*="language-"]]:bg-muted [&_pre[class*="language-"]]:border [&_pre[class*="language-"]]:border-border',
                    '[&_pre[class*="language-"]]:rounded-lg [&_pre[class*="language-"]]:p-4 [&_pre[class*="language-"]]:my-6',
                    '[&_pre[class*="language-"]]:overflow-x-auto [&_pre[class*="language-"]]:font-mono [&_pre[class*="language-"]]:text-sm',
                    '[&_code[class*="language-"]]:bg-transparent [&_code[class*="language-"]]:text-foreground',
                    className
                ),
            },
        },
    });

    if (!editor) {
        return (
            <div className={cn('animate-pulse', className)}>
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-muted rounded mb-4 w-1/2"></div>
            </div>
        );
    }

    return (
        <div className={cn('novel-renderer', className)}>
            <EditorContent editor={editor} />
        </div>
    );
}

// Helper function to extract plain text from content for SEO/descriptions
export function extractTextFromContent(content: JSONContent | string): string {
    let parsedContent: JSONContent;

    if (typeof content === 'string') {
        try {
            parsedContent = JSON.parse(content);
        } catch {
            return content;
        }
    } else {
        parsedContent = content;
    }

    if (!parsedContent || typeof parsedContent !== 'object') return '';

    let text = '';

    if (parsedContent.type === 'text' && parsedContent.text) {
        return parsedContent.text;
    }

    if (parsedContent.content && Array.isArray(parsedContent.content)) {
        for (const node of parsedContent.content) {
            text += extractTextFromContent(node) + ' ';
        }
    }

    return text.trim();
}
