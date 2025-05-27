#!/usr/bin/env node

/**
 * SEO Configuration Test
 * Verifies that all metadata configurations have proper robots indexing settings
 */

import * as fs from 'fs';
import * as path from 'path';

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m'
};

console.log('🔍 Testing SEO Configuration...\n');

// Test environment variables
console.log('📋 Environment Variables:');
const envPath: string = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envContent: string = fs.readFileSync(envPath, 'utf-8');
    console.log(`\t${colors.green}✅ .env file exists${colors.reset}`);

    if (envContent.includes('IS_PRODUCTION="true"')) {
        console.log(`\t${colors.green}✅ IS_PRODUCTION is set to "true"${colors.reset}`);
    } else {
        console.log(`\t${colors.red}❌ IS_PRODUCTION should be set to "true"${colors.reset}`);
    }

    if (envContent.includes('NEXTJS_ENV=production')) {
        console.log(`\t${colors.green}✅ NEXTJS_ENV is set to "production"${colors.reset}`);
    } else {
        console.log(`\t${colors.red}❌ NEXTJS_ENV should be set to "production"${colors.reset}`);
    }
} else {
    console.log(`\t${colors.red}❌ .env file not found${colors.reset}`);
}

// Test metadata files
console.log('\n🏷️  Metadata Configuration:');
const metadataFiles: string[] = [
    'src/lib/meta/home.ts',
    'src/lib/meta/posts.ts',
    'src/lib/meta/projects.ts',
    'src/app/gallery/[id]/layout.tsx'
];

metadataFiles.forEach((file: string) => {
    const filePath: string = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        const content: string = fs.readFileSync(filePath, 'utf-8');
        if (content.includes('index: true') && content.includes('follow: true')) {
            console.log(`\t${colors.green}✅ ${file} has proper robots configuration${colors.reset}`);
        } else {
            console.log(`\t${colors.red}❌ ${file} missing proper robots configuration${colors.reset}`);
        }
    } else {
        console.log(`\t${colors.red}❌ ${file} not found${colors.reset}`);
    }
});

// Test robots.txt
console.log('\n🤖 Robots.txt:');
const robotsPath: string = path.join(process.cwd(), 'public', 'robots.txt');
if (fs.existsSync(robotsPath)) {
    const robotsContent: string = fs.readFileSync(robotsPath, 'utf-8');
    if (robotsContent.includes('user-agent: *') && !robotsContent.includes('disallow: /')) {
        console.log(`\t${colors.green}✅ robots.txt allows crawling${colors.reset}`);
    } else if (robotsContent.includes('disallow: /')) {
        console.log(`\t${colors.red}❌ robots.txt disallows crawling of root${colors.reset}`);
    } else {
        console.log(`\t${colors.yellow}⚠️  robots.txt content needs review${colors.reset}`);
    }
} else {
    console.log(`\t${colors.red}❌ robots.txt not found${colors.reset}`);
}

// Test sitemap
console.log('\n🗺️  Sitemap:');
const sitemapPath: string = path.join(process.cwd(), 'public', 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
    console.log(`\t${colors.green}✅ sitemap.xml exists${colors.reset}`);
} else {
    console.log(`\t${colors.red}❌ sitemap.xml not found - run: npm run generate:sitemap${colors.reset}`);
}

// Test deployment configuration
console.log('\n🚀 Deployment Configuration:');
const netlifyTomlPath: string = path.join(process.cwd(), 'netlify.toml');
if (fs.existsSync(netlifyTomlPath)) {
    const netlifyContent: string = fs.readFileSync(netlifyTomlPath, 'utf-8');
    if (netlifyContent.includes('X-Robots-Tag = "index, follow"')) {
        console.log(`\t${colors.green}✅ netlify.toml has proper X-Robots-Tag header${colors.reset}`);
    } else {
        console.log(`\t${colors.red}❌ netlify.toml missing proper X-Robots-Tag header${colors.reset}`);
    }
} else {
    console.log(`\t${colors.red}❌ netlify.toml not found${colors.reset}`);
}

const headersPath: string = path.join(process.cwd(), '_headers');
if (fs.existsSync(headersPath)) {
    console.log(`\t${colors.green}✅ _headers file exists${colors.reset}`);
} else {
    console.log(`\t${colors.red}❌ _headers file not found${colors.reset}`);
}

console.log('\n✨ SEO test completed!\n');
console.log('📝 Next steps:');
console.log('\t1. Deploy these changes to Netlify');
console.log('\t2. Check the live site headers with: curl -I https://pphat.top');
console.log('\t3. Verify robots meta tag is not "noindex"');
console.log('\t4. Test with Google Search Console');
