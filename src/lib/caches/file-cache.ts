import fs from 'fs-extra';
import path from 'path';

interface FileCacheOptions {
    cacheDir?: string;
    ttl?: number;
}

interface CacheData<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

export class FileCache {
    private cacheDir: string;
    private ttl: number;

    constructor(options: FileCacheOptions = {}) {
        this.cacheDir = options.cacheDir || 'build/cache';
        this.ttl = options.ttl || 3600; // 1 hour default
        this.init();
    }

    private init(): void {
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir, { recursive: true });
        }
    }

    private getCacheFilePath(key: string): string {
        const filePath = path.resolve(this.cacheDir, `${key}.json`);
        const relative = path.relative(this.cacheDir, filePath);
        if (relative.startsWith('..') || path.isAbsolute(relative)) {
            throw new Error('Invalid cache key');
        }
        return filePath;
    }

    async set<T>(key: string, data: T): Promise<void> {
        const cacheData: CacheData<T> = {
            data,
            timestamp: Date.now(),
            ttl: this.ttl
        };
        await fs.writeJson(this.getCacheFilePath(key), cacheData);
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const filePath = this.getCacheFilePath(key);
            if (!fs.existsSync(filePath)) return null;

            const cacheData = await fs.readJson(filePath) as CacheData<T>;
            const age = (Date.now() - cacheData.timestamp) / 1000;

            if (age > cacheData.ttl) {
                await this.del(key);
                return null;
            }
            return cacheData.data;
        } catch (error) {
            return null;
        }
    }

    async del(key: string): Promise<void> {
        try {
            const filePath = this.getCacheFilePath(key);
            await fs.unlink(filePath);
        } catch (error: any) {
            if (error.message !== 'Invalid cache key') {
                // Ignore deletion errors
            }
        }
    }

    async clear(): Promise<void> {
        try {
            await fs.emptyDir(this.cacheDir);
        } catch (error) {
            console.error('Cache clear error:', error);
        }
    }
}