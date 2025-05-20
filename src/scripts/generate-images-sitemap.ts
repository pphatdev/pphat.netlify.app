import { currentDomain } from "../lib/constants";
import { readdirSync, writeFileSync } from "fs";
import { join } from "path";

// Function to generate image sitemap
export async function generateImageSitemap() {
    try {
        // Path to your gallery images
        const imageDir = join(process.cwd(), 'public', 'assets', 'gallery', 'WEBP');

        // Get all image files with type safety
        const imageFiles = readdirSync(imageDir)
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

        if (imageFiles.length === 0) {
            console.warn('No image files found in directory:', imageDir);
        }

        // Generate sitemap with proper indentation
        const sitemap = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
            '  <url>',
            `    <loc>${currentDomain}/gallery</loc>`,
            imageFiles.map(file => {
                const imageName = file.split('.')[0];
                return [
                    '    <image:image>',
                    `      <image:loc>${currentDomain}/assets/gallery/WEBP/${file}</image:loc>`,
                    `      <image:title>Leat Sophat - ${imageName}</image:title>`,
                    '    </image:image>'
                ].join('\n');
            }).join('\n'),
            '  </url>',
            '  <url>',
            `    <loc>${currentDomain}</loc>`,
            '    <image:image>',
            `      <image:loc>${currentDomain}/assets/avatars/hero.webp</image:loc>`,
            '      <image:title>Leat Sophat - Senior Front-end Developer and UI/UX Designer</image:title>',
            '      <image:caption>Profile photo of Leat Sophat</image:caption>',
            '    </image:image>',
            '  </url>',
            '</urlset>'
        ].join('\n');        // Write to file with error handling
        const outputPath = join(process.cwd(), 'public', 'image-sitemap.xml');
        writeFileSync(outputPath, sitemap.replace(/\s+/g, " "), 'utf-8');
        console.log('✅ Image sitemap generated successfully.');
    } catch (error) {
        console.error('❌ Error generating sitemap:', error instanceof Error ? error.message : error);
        throw error;
    }
}

// Run the function
generateImageSitemap().catch(console.error);