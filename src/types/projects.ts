import { UUID } from "crypto";

export type Contributor = {
    name: string;
    profile: string;
    url: string;
    [key: string]: any; // Allow additional properties
}

type Tag = {
    id: number;
    tag: string;
    description: string;
}

type Language = {
    id: number;
    name: string;
    description: string;
}

type Data = {
    id: UUID;
    title: string;
    slug: string;
    description: string;
    tags: Tag[];
    thumbnail: string;
    published: boolean;
    contributors: Contributor[];
    languages: Language[];
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}

export type QueryParams = {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
}

export type ProjectResponse = {
    data: Data[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export type Details = {
    content: string;
    demoUrl: string;
    repoUrl: string;
    techStack: string[];
    status: string;
};

type Pagination = {
    next: string | null;
    prev: string | null;
}

export interface ProjectDetailResponse {
    data: Data & {
        details: Details;
    };
    navigation: Pagination;
}