import { readFileSync } from 'fs';
import { join } from 'path';

interface ValidationResult {
    url: string;
    status: number;
    isValid: boolean;
    error?: string;
}

// Validate a single URL
async function validateUrl(url: string): Promise<ValidationResult> {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            headers: {
                'User-Agent': 'SEO-Validator/1.0'
            }
        });

        return {
            url,
            status: response.status,
            isValid: response.status === 200,
        };
    } catch (error) {
        return {
            url,
            status: 0,
            isValid: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

// Parse sitemap.xml and extract URLs
function extractUrlsFromSitemap(): string[] {
    try {
        const sitemapPath = join(process.cwd(), 'public/sitemap.xml');
        const sitemapContent = readFileSync(sitemapPath, 'utf-8');

        // Extract URLs using regex
        const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
        return urlMatches.map(match => match.replace(/<\/?loc>/g, ''));
    } catch (error) {
        console.error('Error reading sitemap.xml:', error);
        return [];
    }
}

// Validate all URLs in the sitemap
export async function validateSitemap(): Promise<void> {
    console.log('🔍 Starting sitemap URL validation...\n');

    const urls = extractUrlsFromSitemap();

    if (urls.length === 0) {
        console.error('❌ No URLs found in sitemap.xml');
        return;
    }

    console.log(`📊 Found ${urls.length} URLs to validate\n`);

    const results: ValidationResult[] = [];
    const batchSize = 5; // Validate 5 URLs at a time to avoid overwhelming the server

    for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        const batchPromises = batch.map(url => validateUrl(url));
        const batchResults = await Promise.all(batchPromises);

        results.push(...batchResults);

        // Show progress
        console.log(`✅ Validated ${Math.min(i + batchSize, urls.length)}/${urls.length} URLs`);
    }

    // Analyze results
    const validUrls = results.filter(r => r.isValid);
    const invalidUrls = results.filter(r => !r.isValid);

    console.log('\n📋 Validation Results:');
    console.log(`✅ Valid URLs (200 status): ${validUrls.length}`);
    console.log(`❌ Invalid URLs: ${invalidUrls.length}\n`);

    // Show invalid URLs
    if (invalidUrls.length > 0) {
        console.log('🚨 Invalid URLs found:');
        invalidUrls.forEach(result => {
            console.log(`❌ ${result.url} - Status: ${result.status}${result.error ? ` (${result.error})` : ''}`);
        });
        console.log('\n📝 Recommendations:');
        console.log('1. Remove or fix URLs that return non-200 status codes');
        console.log('2. Ensure all URLs are canonical (no redirects)');
        console.log('3. Verify that all pages exist and are accessible');
        console.log('4. Check for any authentication requirements on public pages');
    } else {
        console.log('🎉 All URLs are valid and return 200 status codes!');
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log(`Total URLs checked: ${results.length}`);
    console.log(`Success rate: ${((validUrls.length / results.length) * 100).toFixed(1)}%`);

    if (invalidUrls.length > 0) {
        process.exit(1); // Exit with error code if there are invalid URLs
    }
}

// Run validation if this script is executed directly
if (require.main === module) {
    validateSitemap().catch(error => {
        console.error('❌ Validation failed:', error);
        process.exit(1);
    });
}
