import { NEXT_PUBLIC_APP_URL } from "../lib/constants";
import { readdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

function getBaseUrl(): string {
    const raw = NEXT_PUBLIC_APP_URL.trim();
    const parsed = new URL(raw);
    if (parsed.hostname.startsWith('www.')) {
        parsed.hostname = parsed.hostname.slice(4);
    }
    return parsed.toString().replace(/\/$/, '');
}

// Extract thumbnail from MDX frontmatter
function extractThumbnail(mdxContent: string): string | null {
    const match = mdxContent.match(/^thumbnail:\s*["']([^"']+)["']/m);
    return match ? match[1] : null;
}

// Extract title from MDX frontmatter
function extractTitle(mdxContent: string): string | null {
    const match = mdxContent.match(/^title:\s*["']([^"']+)["']/m);
    return match ? match[1] : null;
}

// Get all blog post images (thumbnail + gallery images)
function getBlogPostImages(baseUrl: string): Array<{ loc: string; title: string }> {
    const blogDir = join(process.cwd(), 'content', 'posts');
    const images: Array<{ loc: string; title: string }> = [];

    if (!existsSync(blogDir)) {
        console.warn('Blog directory not found:', blogDir);
        return images;
    }

    const postDirs = readdirSync(blogDir).filter(file => {
        const fullPath = join(blogDir, file);
        return existsSync(join(fullPath, 'index.mdx'));
    });

    for (const postDir of postDirs) {
        const mdxPath = join(blogDir, postDir, 'index.mdx');
        const mdxContent = readFileSync(mdxPath, 'utf-8');
        const thumbnail = extractThumbnail(mdxContent);
        const title = extractTitle(mdxContent);

        // Add thumbnail as primary image
        if (thumbnail) {
            let thumbnailUrl = thumbnail;
            if (!thumbnail.startsWith('http')) {
                thumbnailUrl = `${baseUrl}${thumbnail}`;
            }

            images.push({
                loc: thumbnailUrl,
                title: title ? `${title} - Cover` : `Blog Post - ${postDir}`
            });
        }

        // Extract ALL gallery images from MDX
        const imgPattern = /src="([^"]*\/blogs\/[^"]+\.webp)"/g;
        let match;
        const galleryImages = new Set<string>();

        while ((match = imgPattern.exec(mdxContent)) !== null) {
            const imgPath = match[1];
            // Only include local blog images, not the thumbnail we already added
            if (imgPath !== thumbnail && imgPath.startsWith('/blogs/')) {
                galleryImages.add(imgPath);
            }
        }

        // Add all gallery images to sitemap
        for (const imgPath of galleryImages) {
            const imageUrl = imgPath.startsWith('http') ? imgPath : `${baseUrl}${imgPath}`;
            const fileName = imgPath.split('/').pop() || 'image';

            images.push({
                loc: imageUrl,
                title: title ? `${title} - ${fileName}` : `Gallery - ${fileName}`
            });
        }
    }

    return images;
}

// Function to generate image sitemap
export async function generateImageSitemap() {
    try {
        const baseUrl = getBaseUrl();
        // Path to your gallery images
        const imageDir = join(process.cwd(), 'public', 'assets', 'gallery', 'WEBP');

        // Get all image files with type safety
        const imageFiles = readdirSync(imageDir)
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

        if (imageFiles.length === 0) {
            console.warn('No image files found in directory:', imageDir);
        }

        // Get blog post thumbnails
        const blogImages = getBlogPostImages(baseUrl);

        // Generate sitemap with proper indentation
        const sitemap = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
            '  <url>',
            `    <loc>${baseUrl}/gallery</loc>`,
            imageFiles.map(file => {
                const imageName = file.split('.')[0];
                return [
                    '    <image:image>',
                    `      <image:loc>${baseUrl}/assets/gallery/WEBP/${file}</image:loc>`,
                    `      <image:title>Leat Sophat - ${imageName}</image:title>`,
                    '    </image:image>'
                ].join('\n');
            }).join('\n'),
            '  </url>',
            '  <url>',
            `    <loc>${baseUrl}</loc>`,
            '    <image:image>',
            `      <image:loc>${baseUrl}/assets/avatars/hero.webp</image:loc>`,
            '      <image:title>Leat Sophat - Senior Front-end Developer and UI/UX Designer</image:title>',
            '      <image:caption>Profile photo of Leat Sophat</image:caption>',
            '    </image:image>',
            '  </url>',
            // Add blog post thumbnails
            ...blogImages.map(img => [
                '  <url>',
                `    <loc>${baseUrl}/posts</loc>`,
                '    <image:image>',
                `      <image:loc>${img.loc}</image:loc>`,
                `      <image:title>${img.title}</image:title>`,
                '    </image:image>',
                '  </url>'
            ].join('\n')),
            '</urlset>'
        ].join('\n');        // Write to file with error handling
        const outputPath = join(process.cwd(), 'public', 'image-sitemap.xml');
        writeFileSync(outputPath, sitemap.replace(/\s+/g, " "), 'utf-8');
        console.log('✅ Image sitemap generated successfully.');
        console.log(`   - Gallery images: ${imageFiles.length}`);
        console.log(`   - Blog images: ${blogImages.length} (thumbnails + gallery images)`);
        console.log(`   - Total indexed images: ${imageFiles.length + blogImages.length}`);
    } catch (error) {
        console.error('❌ Error generating sitemap:', error instanceof Error ? error.message : error);
        throw error;
    }
}

// Run the function
generateImageSitemap().catch(console.error);