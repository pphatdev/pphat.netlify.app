
export interface Project {
    id: string;
    image: string;
    title: string;
    description: string;
    published: boolean;
    tags: string[];
    source: { url: string; name: string, type: string }[];
    authors: { name: string; profile: string; url: string }[];
    languages?: string[];
    [key: string]: any;
}
