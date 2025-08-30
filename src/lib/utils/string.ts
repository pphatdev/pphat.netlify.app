export class StringUtils {
    /**
     * Capitalizes the first letter of a string.
     * @param {string} string - The input string.
     * @example
     * StringUtils.capitalizeFirstLetter("hello"); // "Hello"
     */
    static capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * Converts a string to a URL-friendly slug.
     * @param {string} string - The input string.
     * @example
     * StringUtils.toSlug("Hello World!"); // "hello-world"
     */
    static toSlug(string: string): string {
        return string
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    /**
     * Converts a string to title case.
     * @param {string} string - The input string.
     * @example
     * StringUtils.toTitleCase("hello world"); // "Hello World"
     */
    static toTitleCase(string: string): string {
        return string
            .split(' ')
            .map(word => this.capitalizeFirstLetter(word))
            .join(' ');
    }

    /**
     * Generates a random slug.
     * @param {number} length - The length of the slug.
     * @example
     * StringUtils.slugRandom({ length: 8, originSlug: 'prefix-' }); // "prefix-a1b2c3d4"
     */
    static slugRandom({
        length = 8,
        originSlug = ''
    }: {
        length?: number,
        originSlug?: string
    }): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return originSlug + result;
    }
}
