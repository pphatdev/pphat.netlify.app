console.log("\x1b[36m%s\x1b[0m", "🚀 Starting build process...");
console.log("\x1b[33m%s\x1b[0m", "⚡ Loading configurations...");
console.log("\n");

// Use new sitemap generator
export { createSitemap } from './generate-sitemap';
console.log("\x1b[32m%s\x1b[0m", "✨ Sitemap generated successfully!\n");
export { generateImageSitemap } from "./generate-images-sitemap";
console.log("\x1b[32m%s\x1b[0m", "✨ Image sitemap generated successfully!\n");
export { generateManifest } from "./generate-manifest";

console.log("\x1b[32m%s\x1b[0m", "✨ Build initialized successfully!\n");