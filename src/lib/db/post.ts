import path from 'path';
import { JsonDB } from './jsondb';

export interface Post extends Record<string, unknown> {
    title: string;
    content: string;
    slug: string;
    published: boolean;
    createdAt: string;
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