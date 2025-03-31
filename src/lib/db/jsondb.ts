import fs from 'fs';
import path from 'path';

interface DbOptions {
    dbPath: string;
    defaultData?: Record<string, any[]>;
}

/**
 * JsonDB - A simple JSON file-based database for local development
 * Handles basic CRUD operations on collections within a JSON file
 */
export class JsonDB {
    private dbPath: string;
    private data: Record<string, any[]>;

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
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    /**
     * Get all items from a collection
     * @param collection Name of the collection
     * @returns Array of items in the collection
     */
    getAll<T>(collection: string): T[] {
        this.refreshData();

        if (!this.data[collection]) {
            this.data[collection] = [];
        }
        return [...this.data[collection]] as T[];
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

        return this.data[collection].find(item => item.id === id) as T || null;
    }

    /**
     * Create a new item in a collection
     * @param collection Name of the collection
     * @param item Item data to insert (ID will be generated)
     * @returns The created item with generated ID
     */
    create<T>(collection: string, item: Omit<T, 'id'>): T {
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
        return newItem;
    }

    /**
     * Update an existing item in a collection
     * @param collection Name of the collection
     * @param id ID of the item to update
     * @param updates Partial data to update
     * @returns Updated item or null if not found
     */
    update<T>(collection: string, id: string, updates: Partial<T>): T | null {
        this.refreshData();

        if (!this.data[collection]) {
            return null;
        }

        const index = this.data[collection].findIndex(item => item.id === id);
        if (index === -1) {
            return null;
        }

        // Update the item
        this.data[collection][index] = {
            ...this.data[collection][index],
            ...updates
        };

        this.save();
        return this.data[collection][index] as T;
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
        this.data[collection] = this.data[collection].filter(item => item.id !== id);

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