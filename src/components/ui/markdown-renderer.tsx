import { isValidElement } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@lib/utils';
import { MarkdownCodeBlock } from '@components/ui/markdown-code-block';
import { MarkdownImage } from '@components/ui/markdown-image';
import { MarkdownGallery } from '@components/ui/markdown-gallery';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

const DEFAULT_HEADING_ID = 'heading';
const CODE_FONT_FAMILY = '"Fira Code", "JetBrains Mono", "Source Code Pro", "Cascadia Code", monospace';

type MarkdownTreeNode = {
    type?: string;
    tagName?: string;
    value?: string;
    properties?: Record<string, unknown>;
    children?: MarkdownTreeNode[];
};

function extractTextFromTree(node: MarkdownTreeNode | undefined): string {
    if (!node) {
        return '';
    }

    if (node.type === 'text' || node.type === 'raw') {
        return typeof node.value === 'string' ? node.value : '';
    }

    if (!Array.isArray(node.children)) {
        return '';
    }

    return node.children.map(extractTextFromTree).join('');
}

function extractTextFromReactNode(node: ReactNode): string {
    if (typeof node === 'string' || typeof node === 'number') {
        return String(node);
    }

    if (Array.isArray(node)) {
        return node.map(extractTextFromReactNode).join('');
    }

    if (isValidElement<{ children?: ReactNode }>(node)) {
        return extractTextFromReactNode(node.props.children);
    }

    return '';
}

function visitTree(node: MarkdownTreeNode | undefined, visitor: (currentNode: MarkdownTreeNode) => void) {
    if (!node) {
        return;
    }

    visitor(node);

    if (!Array.isArray(node.children)) {
        return;
    }

    for (const child of node.children) {
        visitTree(child, visitor);
    }
}

function rehypeHeadingIds() {
    return (tree: MarkdownTreeNode) => {
        const headingCounts = new Map<string, number>();

        visitTree(tree, (node) => {
            if (!node.tagName || !/^h[1-6]$/i.test(node.tagName)) {
                return;
            }

            const existingId = node.properties?.id;
            if (typeof existingId === 'string' && existingId.length > 0) {
                return;
            }

            const baseId = createHeadingId(extractTextFromTree(node));
            const count = headingCounts.get(baseId) ?? 0;
            headingCounts.set(baseId, count + 1);

            const uniqueId = count === 0 ? baseId : `${baseId}-${count + 1}`;
            node.properties = {
                ...node.properties,
                id: uniqueId,
            };
        });
    };
}

function createHeadingId(text: string): string {
    const slug = text
        .trim()
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    return slug || DEFAULT_HEADING_ID;
}

function createMarkdownComponents(): Components {
    return {
        pre({ children }) {
            return <>{children}</>;
        },
        code({ className, children, ...props }) {
            const languageMatch = /language-([a-z0-9-]+)/i.exec(className || '');
            const codeText = extractTextFromReactNode(children).replace(/\n$/, '');
            const isBlock = Boolean(languageMatch) || codeText.includes('\n');

            if (!isBlock) {
                return (
                    <code
                        className={cn('rounded bg-muted px-1 py-0.5 font-mono text-sm', className)}
                        style={{ fontFamily: CODE_FONT_FAMILY }}
                        {...props}
                    >
                        {children}
                    </code>
                );
            }

            return (
                <MarkdownCodeBlock
                    code={codeText}
                    language={languageMatch?.[1]}
                    className={className}
                >
                    {children}
                </MarkdownCodeBlock>
            );
        },
        img({ src, alt, ...props }) {
            const safeSrc = typeof src === 'string' ? src : undefined;
            return <MarkdownImage src={safeSrc} alt={alt} {...props} />;
        },
        div({ className, children, ...props }) {
            const classValue = typeof className === 'string' ? className : '';
            const isGallery = classValue.includes('blog-gallery') || classValue.includes('md-gallery');

            if (isGallery) {
                const galleryProps = props as HTMLAttributes<HTMLDivElement> & {
                    'data-columns'?: string;
                    'data-captions'?: string;
                    'data-layout'?: string;
                };

                return (
                    <MarkdownGallery
                        className={className}
                        data-columns={galleryProps['data-columns']}
                        data-captions={galleryProps['data-captions']}
                        layout={galleryProps['data-layout']}
                    >
                        {children}
                    </MarkdownGallery>
                );
            }

            return (
                <div className={className} {...props}>
                    {children}
                </div>
            );
        }
    };
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    const markdownComponents = createMarkdownComponents();

    return (
        <div
            className={cn(
                'prose dark:prose-invert max-w-none',
                'prose-headings:font-bold prose-headings:tracking-tight',
                'prose-h1:mt-2 prose-h1:text-3xl prose-h1:font-medium prose-h1:tracking-tight prose-h1:text-gray-950 dark:prose-h1:text-white',
                'prose-h2:mb-6 prose-h2:text-lg prose-h2:font-semibold prose-h2:tracking-tight prose-h2:text-gray-950 dark:prose-h2:text-white',
                'prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:leading-snug',
                'prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6 prose-h4:leading-snug',
                'prose-h5:text-lg prose-h5:mb-2 prose-h5:mt-5 prose-h5:leading-normal',
                'prose-h6:text-base prose-h6:mb-2 prose-h6:mt-4 prose-h6:leading-normal prose-h6:font-semibold',
                'prose-p:mt-6 prose-p:text-base/7 prose-p:text-gray-700 dark:prose-p:text-gray-300',
                'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
                'prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:pl-4 prose-blockquote:italic',
                'prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono',
                'prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0 prose-pre:shadow-none prose-pre:ring-0 prose-pre:rounded-none prose-pre:text-inherit prose-pre:overflow-visible',
                'prose-pre:before:content-none prose-pre:after:content-none',
                'prose-img:rounded-lg prose-img:shadow-md',
                'prose-ul:list-disc prose-ol:list-decimal',
                'prose-li:mb-0',
                className
            )}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHeadingIds, rehypeHighlight]}
                components={markdownComponents}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
