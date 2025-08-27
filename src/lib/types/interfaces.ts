export interface Project {
    id: string;
    image: string;
    title: string;
    description: string;
    published: boolean;
    tags: string[];
    source: { url: string; name: string; type: string }[];
    authors: { name: string; profile: string; url: string }[];
    languages?: string[];
    [key: string]: unknown;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    published: boolean;
    description: string;
    tags: string[];
    createdAt: Date;
    thumbnail: string;
    slug: string;
    authors: { name: string; profile: string; url: string }[];
    [key: string]: unknown;
}

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: User;
    message?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}