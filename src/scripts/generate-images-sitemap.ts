import { readdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { getBaseUrl } from '../lib/utils';

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

// Extract project cover image from MDX frontmatter
function extractProjectImage(mdxContent: string): string | null {
    const match = mdxContent.match(/^image:\s*["']([^"']+)["']/m);
    return match ? match[1] : null;
}

interface PostImageGroup {
    slug: string;
    title: string;
    images: Array<{ loc: string; imgTitle: string }>;
}

function toAbsoluteImageUrl(imagePath: string, baseUrl: string): string | null {
    const value = imagePath.trim();
    if (!value || value.startsWith('data:') || value.startsWith('blob:')) {
        return null;
    }

    if (value.startsWith('http://') || value.startsWith('https://')) {
        return value;
    }

    if (value.startsWith('/')) {
        return `${baseUrl}${value}`;
    }

    return null;
}

// Get all blog post images grouped per post
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

        // Include local and external thumbnails.
        const thumbnailLoc = thumbnail ? toAbsoluteImageUrl(thumbnail, baseUrl) : null;
        if (thumbnailLoc) {
            postImages.push({
                loc: thumbnailLoc,
                imgTitle: `${title} - Cover`
            });
        }

        // Extract all inline image sources from MDX (<img src="..."> or <img src='...'>).
        const imgPattern = /src=["']([^"']+)["']/g;
        let match;
        while ((match = imgPattern.exec(mdxContent)) !== null) {
            const imgPath = match[1];
            const imageLoc = toAbsoluteImageUrl(imgPath, baseUrl);
            if (imageLoc && imageLoc !== thumbnailLoc && !postImages.some(i => i.loc === imageLoc)) {
                const fileName = imgPath.split('/').pop()?.split('?')[0] ?? 'image';
                postImages.push({
                    loc: imageLoc,
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

function toAbsoluteLocalImageUrl(imagePath: string, baseUrl: string): string | null {
    if (imagePath.startsWith('/')) {
        return `${baseUrl}${imagePath}`;
    }

    if (imagePath.startsWith(`${baseUrl}/`)) {
        return imagePath;
    }

    return null;
}

// Get all project images grouped per project, local/origin images only
function getProjectImageGroups(baseUrl: string): PostImageGroup[] {
    const projectDir = join(process.cwd(), 'content', 'projects');
    const groups: PostImageGroup[] = [];

    if (!existsSync(projectDir)) {
        console.warn('Project directory not found:', projectDir);
        return groups;
    }

    const projectDirs = readdirSync(projectDir).filter(file =>
        existsSync(join(projectDir, file, 'index.mdx'))
    );

    for (const projectSlug of projectDirs) {
        const mdxPath = join(projectDir, projectSlug, 'index.mdx');
        const mdxContent = readFileSync(mdxPath, 'utf-8');
        const projectImage = extractProjectImage(mdxContent);
        const title = extractTitle(mdxContent) ?? projectSlug;
        const projectImages: Array<{ loc: string; imgTitle: string }> = [];

        if (projectImage) {
            const coverLoc = toAbsoluteLocalImageUrl(projectImage, baseUrl);
            if (coverLoc) {
                projectImages.push({
                    loc: coverLoc,
                    imgTitle: `${title} - Cover`
                });
            }
        }

        // Extract inline project screenshots from MDX src attributes
        const imgPattern = /src="([^"]*\/assets\/projects\/[^"]+\.(?:jpg|jpeg|png|gif|webp|avif|svg))"/g;
        let match;
        while ((match = imgPattern.exec(mdxContent)) !== null) {
            const imgPath = match[1];
            const imageLoc = toAbsoluteLocalImageUrl(imgPath, baseUrl);

            if (imageLoc && !projectImages.some(i => i.loc === imageLoc)) {
                const fileName = imgPath.split('/').pop() ?? 'image';
                projectImages.push({
                    loc: imageLoc,
                    imgTitle: `${title} - ${fileName}`
                });
            }
        }

        if (projectImages.length > 0) {
            groups.push({ slug: projectSlug, title, images: projectImages });
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

        const projectsPostGroups = getProjectImageGroups(baseUrl);
        const totalProjectImages = projectsPostGroups.reduce((sum, g) => sum + g.images.length, 0);

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
            // One <url> per project with all its local images grouped together
            ...projectsPostGroups.map(project => [
                '  <url>',
                `    <loc>${baseUrl}/projects/${project.slug}</loc>`,
                project.images.map(img => [
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
        console.log('\n📷 Image sitemap generated successfully.');
        console.log(` • Gallery images: ${imageFiles.length}`);
        console.log(` • Blog posts: ${blogPostGroups.length} (${totalBlogImages} images)`);
        console.log(` • Project posts: ${projectsPostGroups.length} (${totalProjectImages} images)`);
        console.log(` • Total indexed images: ${imageFiles.length + totalBlogImages + totalProjectImages}\n`);
    } catch (error) {
        console.error('❌ Error generating sitemap:', error instanceof Error ? error.message : error);
        throw error;
    }
}

const isDirectRun = process.argv[1]?.replace(/\\/g, '/').endsWith('/generate-images-sitemap.js');

if (isDirectRun) {
    generateImageSitemap().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}