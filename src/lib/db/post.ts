import path from 'path';
import { JsonDB } from './jsondb';

export interface Post extends Record<string, unknown> {
    id: string | number;
    title: string;
    content: string;
    slug: string;
    excerpt?: string;
    published: boolean;
    tags: string[];
    authors?: Array<{
        name: string;
        profile: string;
        url: string;
    }> | null;
    featured_image: string;
    updated_date: string;
}
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

const db = new JsonDB({
    dbPath: path.join(process.cwd(), 'public/data', 'post.json'),
    defaultData: {
        posts: [],
        postDetail: []
    }
});

export { db };