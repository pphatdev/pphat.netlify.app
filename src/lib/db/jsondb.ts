import fs from 'fs';
import path from 'path';
import crypto from 'crypto'
import { renderPagination } from '@lib/functions/pagination-list';

interface DbOptions {
    dbPath: string;
    defaultData?: Record<string, unknown[]>;
}

interface PaginatedResult<T> {
    data: T[];
    success: boolean;
    metadata: {
        currentPage: number;
        pages: number;
        total: number;
        limit: number;
    };
    pagination: {
        items: Array<{
            label: string;
            url: string;
            active: boolean;
        }>;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
    };
}

interface InsertSuccess<T> {
    status: number;
    message: string;
    success: boolean;
    data: T;
}

interface UpdateSuccess<T> {
    status: number;
    message: string;
    success: boolean;
    data: T;
}


/**
 * JsonDB - A simple JSON file-based database for local development
 * Handles basic CRUD operations on collections within a JSON file
 */
export class JsonDB {
    private dbPath: string;
    private data: Record<string, unknown[]>;

    /**
     * Initialize the JSON database
     * @param options Configuration options for the database
     */
    constructor(options: DbOptions) {
        this.dbPath = options.dbPath;

        try {
            // Check if file exists
            if (fs.existsSync(this.dbPath)) {
                const rawData = fs.readFileSync(this.dbPath, 'utf8');
                this.data = JSON.parse(rawData);
            } else {
                // Create new DB with default data or empty collections
                this.data = options.defaultData || {};
                this.save();
            }
        } catch (error) {
            console.error('Error initializing JsonDB:', error);
            this.data = options.defaultData || {};
            this.save();
        }
    }

    /**
     * Save current data to the JSON file
     */
    private save(): void {
        try {
            // Ensure the directory exists
            const dir = path.dirname(this.dbPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving database:', error);
        }
    }

    /**
     * Read the latest data from the file to ensure we have the most recent version
     */
    private refreshData(): void {
        try {
            if (fs.existsSync(this.dbPath)) {
                const rawData = fs.readFileSync(this.dbPath, 'utf8');
                this.data = JSON.parse(rawData);
            }
        } catch (error) {
            console.error('Error reading database file:', error);
            // Continue with existing data if read fails
        }
    }

    /**
     * Generate a unique ID for new items
     * @returns string - Unique ID
     */
    private generateId(): string {
        return crypto.randomUUID();
    }

    /**
     * Get all items from a collection with pagination, search and sort
     * @param collection Name of the collection
     * @param search Search term
     * @param page Page number (default: 1)
     * @param limit Number of items per page (default: 10)
     * @param sort Sort field (e.g., 'name', '-name' for descending)
     * @returns Array of items in the collection for the given page
     */
    getAll<T extends Record<string, unknown>>(collection: string, search: string = '', page: number = 1, limit: number = 10, sort?: string): PaginatedResult<T> {
        this.refreshData();

        if (!this.data[collection]) {
            this.data[collection] = [];
        }

        let items = [...this.data[collection]] as T[];

        // Apply search
        if (search) {
            items = items.filter(item => {
                return Object.values(item).some(value => {
                    if (typeof value === 'string') {
                        return value.toLowerCase().includes(search.toLowerCase());
                    }
                    return false;
                });
            });
        }

        // Apply sort
        if (sort) {
            const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
            const sortOrder = sort.startsWith('-') ? -1 : 1;

            items.sort((a, b) => {
                const valueA = (a as { [key: string]: unknown })[sortField];
                const valueB = (b as { [key: string]: unknown })[sortField];

                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return sortOrder * valueA.localeCompare(valueB);
                }
                if (typeof valueA === 'number' && typeof valueB === 'number') {
                    return sortOrder * (valueA - valueB);
                }
                return 0;
            });
        }

        const total = items.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedItems = items.slice(startIndex, endIndex);

        return {
            data: paginatedItems,
            success: true,
            metadata: {
                currentPage: page,
                pages: limit == -1 ? page :totalPages,
                total: total,
                limit: limit
            },
            pagination: {
                items: renderPagination(
                    {
                        totalPages: totalPages,
                        currentPage: page
                    },
                    `?page=${page}&limit=${limit}&sort=${sort || 'asc'}&search=${search}`
                ),
                hasPreviousPage: page > 1,
                hasNextPage: page < totalPages
            }
        };
    }

    /**
     * Get a single item by id from a collection
     * @param collection Name of the collection
     * @param id ID of the item to find
     * @returns Found item or null if not found
     */
    getById<T>(collection: string, id: string): T | null {
        this.refreshData();

        if (!this.data[collection]) {
            return null;
        }

        return this.data[collection].find(item => (item as { id: string }).id === id) as T || null;
    }

    /**
     * Create a new item in a collection
     * @param collection Name of the collection
     * @param item Item data to insert (ID will be generated)
     * @returns The created item with generated ID
     */
    insert<T>(collection: string, item: Omit<T, 'id'>): InsertSuccess<T> {
        this.refreshData();

        if (!this.data[collection]) {
            this.data[collection] = [];
        }

        const newItem = {
            id: this.generateId(),
            ...item
        } as T;

        this.data[collection].push(newItem);
        this.save();
        return {
            status: 200,
            message: 'Item created successfully',
            success: true,
            data: newItem,
        };
    }

    /**
     * Update an existing item in a collection
     * @param collection Name of the collection
     * @param id ID of the item to update
     * @param updates Partial data to update
     * @returns Updated item or null if not found
     */
    update<T>(collection: string, id: string, updates: Partial<T>): UpdateSuccess<T> | null {
        this.refreshData();

        if (!this.data[collection]) {
            return null;
        }

        const index = this.data[collection].findIndex(item => (item as { id: string }).id === id);
        if (index === -1) {
            return null;
        }

        // Update the item
        this.data[collection][index] = {
            ...(this.data[collection][index] as object),
            ...updates
        };

        this.save();
        return {
            status: 200,
            message: 'Item updated successfully',
            success: true,
            data: this.data[collection][index] as T
        }
    }

    /**
     * Delete an item from a collection
     * @param collection Name of the collection
     * @param id ID of the item to delete
     * @returns true if deleted, false if not found
     */
    delete(collection: string, id: string): boolean {
        this.refreshData();

        if (!this.data[collection]) {
            return false;
        }

        const initialLength = this.data[collection].length;
        this.data[collection] = this.data[collection].filter(item => (item as { id: string }).id !== id);

        if (initialLength !== this.data[collection].length) {
            this.save();
            return true;
        }

        return false;
    }

    /**
     * Query items in a collection based on criteria
     * @param collection Name of the collection
     * @param query Filter function
     * @returns Filtered array of items
     */
    query<T>(collection: string, query: (item: T) => boolean): T[] {
        this.refreshData();

        if (!this.data[collection]) {
            return [];
        }

        return this.data[collection].filter(item => query(item as T)) as T[];
    }
}