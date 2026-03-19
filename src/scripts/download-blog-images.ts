import { readdirSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

/**
 * Creates placeholder webp images for blog galleries
 * This ensures all image paths are valid for Google indexing
 */
async function createPlaceholderImages() {
    try {
        const blogDir = join(process.cwd(), 'content', 'posts', '07-03-2026-kampot');
        const publicBlogDir = join(process.cwd(), 'public', 'assets', 'blogs', '07-03-2026-kampot');

        // Ensure output directory exists
        if (!existsSync(publicBlogDir)) {
            mkdirSync(publicBlogDir, { recursive: true });
        }

        const mdxPath = join(blogDir, 'index.mdx');
        const mdxContent = readFileSync(mdxPath, 'utf-8');

        // Find all section-X-Y.webp references in MDX
        const imgPattern = /src="\/(?:assets\/)?blogs\/07-03-2026-kampot\/(section-\d+-\d+\.webp)"/g;
        const matches: string[] = [];
        let match;

        while ((match = imgPattern.exec(mdxContent)) !== null) {
            if (!matches.includes(match[1])) {
                matches.push(match[1]);
            }
        }

        console.log(`📸 Found ${matches.length} image references in blog post`);

        // Create placeholder images with a gradient
        let createdCount = 0;
        let skippedCount = 0;
        for (const fileName of matches) {
            const filePath = join(publicBlogDir, fileName);

            if (existsSync(filePath)) {
                skippedCount += 1;
                continue;
            }

            // Create a colorful placeholder image (1200x630 optimal for blog thumbs)
            const gradient = Buffer.from(`
                <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <rect width="1200" height="630" fill="url(#grad)"/>
                    <text x="600" y="315" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial">
                        ${fileName}
                    </text>
                </svg>
            `);

            await sharp(gradient)
                .webp({ quality: 75 })
                .toFile(filePath);

            console.log(`✅ Created: ${fileName}`);
            createdCount += 1;
        }

        // Create cover image if it doesn't exist
        const coverPath = join(publicBlogDir, 'cover.webp');
        if (!existsSync(coverPath)) {
            const coverGradient = Buffer.from(`
                <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#f093fb;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#f5576c;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <rect width="1200" height="630" fill="url(#grad)"/>
                    <text x="600" y="315" font-size="64" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-weight="bold">
                        ហ្នឹងមែនៗ កំពត!!
                    </text>
                </svg>
            `);

            await sharp(coverGradient)
                .webp({ quality: 80 })
                .toFile(coverPath);

            console.log(`✅ Created: cover.webp (thumbnail)`);
        }

        console.log(`\n📊 Result: created ${createdCount}, skipped ${skippedCount}`);
        console.log(`✨ Blog images ready for search indexing`);
    } catch (error) {
        console.error('❌ Error creating images:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

createPlaceholderImages();
