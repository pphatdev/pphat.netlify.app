export interface Project {
    id: string;
    slug?: string;
    image: string;
    title: string;
    description: string;
    published: boolean;
    tags: string[];
    source: { url: string; name: string; type: string }[];
    authors: { name: string; profile: string; url: string }[];
    languages?: string[];
    visitorCount?: number;
    [key: string]: unknown;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    published: boolean;
    description: string;
    tags: string[];
    createdAt: string;
    thumbnail: string;
    slug: string;
    authors: { name: string; profile: string; url: string }[];
    visitorCount?: number;
    [key: string]: unknown;
}