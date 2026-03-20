#!/usr/bin/env node

import { generateSitemaps } from './generate-sitemap';
import { generateImageSitemap } from './generate-images-sitemap';
import { generateFeeds } from './generate-feeds';
import { generateManifest } from './generate-manifest';

async function runBuildPipeline(): Promise<void> {
    await generateSitemaps();
    await generateImageSitemap();
    generateFeeds();
    generateManifest();
}

runBuildPipeline().catch((error) => {
    console.error('❌ Build pipeline failed:', error);
    process.exit(1);
});