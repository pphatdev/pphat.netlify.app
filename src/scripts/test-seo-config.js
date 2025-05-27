#!/usr/bin/env node

/**
 * SEO Configuration Test
 * Verifies that all metadata configurations have proper robots indexing settings
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing SEO Configuration...\n');

// Test environment variables
console.log('📋 Environment Variables:');
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    console.log('  ✅ .env file exists');

    if (envContent.includes('IS_PRODUCTION="true"')) {
        console.log('  ✅ IS_PRODUCTION is set to "true"');
    } else {
        console.log('  ❌ IS_PRODUCTION should be set to "true"');
    }

    if (envContent.includes('NEXTJS_ENV=production')) {
        console.log('  ✅ NEXTJS_ENV is set to "production"');
    } else {
        console.log('  ❌ NEXTJS_ENV should be set to "production"');
    }
} else {
    console.log('  ❌ .env file not found');
}

// Test metadata files
console.log('\n🏷️  Metadata Configuration:');
const metadataFiles = [
    'src/lib/meta/home.ts',
    'src/lib/meta/posts.ts',
    'src/lib/meta/projects.ts',
    'src/app/gallery/[id]/layout.tsx'
];

metadataFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        if (content.includes('index: true') && content.includes('follow: true')) {
            console.log(`  ✅ ${file} has proper robots configuration`);
        } else {
            console.log(`  ❌ ${file} missing proper robots configuration`);
        }
    } else {
        console.log(`  ❌ ${file} not found`);
    }
});

// Test robots.txt
console.log('\n🤖 Robots.txt:');
const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
if (fs.existsSync(robotsPath)) {
    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    if (robotsContent.includes('user-agent: *') && !robotsContent.includes('disallow: /')) {
        console.log('  ✅ robots.txt allows crawling');
    } else if (robotsContent.includes('disallow: /')) {
        console.log('  ❌ robots.txt disallows crawling of root');
    } else {
        console.log('  ⚠️  robots.txt content needs review');
    }
} else {
    console.log('  ❌ robots.txt not found');
}

// Test sitemap
console.log('\n🗺️  Sitemap:');
const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
    console.log('  ✅ sitemap.xml exists');
} else {
    console.log('  ❌ sitemap.xml not found - run: npm run generate:sitemap');
}

// Test deployment configuration
console.log('\n🚀 Deployment Configuration:');
const netlifyTomlPath = path.join(process.cwd(), 'netlify.toml');
if (fs.existsSync(netlifyTomlPath)) {
    const netlifyContent = fs.readFileSync(netlifyTomlPath, 'utf-8');
    if (netlifyContent.includes('X-Robots-Tag = "index, follow"')) {
        console.log('  ✅ netlify.toml has proper X-Robots-Tag header');
    } else {
        console.log('  ❌ netlify.toml missing proper X-Robots-Tag header');
    }
} else {
    console.log('  ❌ netlify.toml not found');
}

const headersPath = path.join(process.cwd(), '_headers');
if (fs.existsSync(headersPath)) {
    console.log('  ✅ _headers file exists');
} else {
    console.log('  ❌ _headers file not found');
}

console.log('\n✨ SEO test completed!\n');
console.log('📝 Next steps:');
console.log('1. Deploy these changes to Netlify');
console.log('2. Check the live site headers with: curl -I https://pphat.top');
console.log('3. Verify robots meta tag is not "noindex"');
console.log('4. Test with Google Search Console');
