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

interface PostImageGroup {
    slug: string;
    title: string;
    images: Array<{ loc: string; imgTitle: string }>;
}

// Get all blog post images grouped per post, local images only
function getBlogPostImageGroups(baseUrl: string): PostImageGroup[] {
    const blogDir = join(process.cwd(), 'content', 'posts');
    const groups: PostImageGroup[] = [];

    if (!existsSync(blogDir)) {
        console.warn('Blog directory not found:', blogDir);
        return groups;
    }

    const postDirs = readdirSync(blogDir).filter(file =>
        existsSync(join(blogDir, file, 'index.mdx'))
    );

    for (const postDir of postDirs) {
        const mdxPath = join(blogDir, postDir, 'index.mdx');
        const mdxContent = readFileSync(mdxPath, 'utf-8');
        const thumbnail = extractThumbnail(mdxContent);
        const title = extractTitle(mdxContent) ?? postDir;
        const postImages: Array<{ loc: string; imgTitle: string }> = [];

        // Add thumbnail only if it's a local path (skip external/CDN URLs)
        if (thumbnail && !thumbnail.startsWith('http')) {
            postImages.push({
                loc: `${baseUrl}${thumbnail}`,
                imgTitle: `${title} - Cover`
            });
        }

        // Extract gallery images from MDX src attributes (local paths only)
        const imgPattern = /src="([^"]*\/(?:assets\/)?blogs\/[^"]+\.webp)"/g;
        let match;
        while ((match = imgPattern.exec(mdxContent)) !== null) {
            const imgPath = match[1];
            if (
                (imgPath.startsWith('/blogs/') || imgPath.startsWith('/assets/blogs/'))
                && imgPath !== thumbnail
                && !postImages.some(i => i.loc === `${baseUrl}${imgPath}`)
            ) {
                const fileName = imgPath.split('/').pop() ?? 'image';
                postImages.push({
                    loc: `${baseUrl}${imgPath}`,
                    imgTitle: `${title} - ${fileName}`
                });
            }
        }

        if (postImages.length > 0) {
            groups.push({ slug: postDir, title, images: postImages });
        }
    }

    return groups;
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

        // Get blog post images grouped per post
        const blogPostGroups = getBlogPostImageGroups(baseUrl);
        const totalBlogImages = blogPostGroups.reduce((sum, g) => sum + g.images.length, 0);

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
            // One <url> per post with all its images grouped together
            ...blogPostGroups.map(post => [
                '  <url>',
                `    <loc>${baseUrl}/posts/${post.slug}</loc>`,
                post.images.map(img => [
                    '    <image:image>',
                    `      <image:loc>${img.loc}</image:loc>`,
                    `      <image:title>${img.imgTitle}</image:title>`,
                    '    </image:image>'
                ].join('\n')).join('\n'),
                '  </url>'
            ].join('\n')),
            '</urlset>'
        ].join('\n');

        // Write to file
        const outputPath = join(process.cwd(), 'public', 'image-sitemap.xml');
        writeFileSync(outputPath, sitemap, 'utf-8');
        console.log('✅ Image sitemap generated successfully.');
        console.log(`   - Gallery images: ${imageFiles.length}`);
        console.log(`   - Blog posts: ${blogPostGroups.length} (${totalBlogImages} images)`);
        console.log(`   - Total indexed images: ${imageFiles.length + totalBlogImages}`);
    } catch (error) {
        console.error('❌ Error generating sitemap:', error instanceof Error ? error.message : error);
        throw error;
    }
}

// Run the function
generateImageSitemap().catch(console.error);