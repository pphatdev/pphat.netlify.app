#!/usr/bin/env node

/**
 * SEO Structured Data Validation
 * Validates that all structured data components use environment variables correctly
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

console.log('🔍 Testing SEO Structured Data Configuration...\n');

// Test environment variables in constants file
console.log('📋 Environment Variable Constants:');
const constantsPath: string = path.join(process.cwd(), 'src/lib/constants.ts');
if (fs.existsSync(constantsPath)) {
    const constantsContent: string = fs.readFileSync(constantsPath, 'utf-8');

    const envVars: string[] = [
        'PERSON_NAME',
        'PERSON_ALTERNATE_NAME',
        'PERSON_JOB_TITLE',
        'CONTACT_EMAIL',
        'CONTACT_PHONE',
        'ADDRESS_STREET',
        'ADDRESS_LOCALITY',
        'COMPANY_NAME',
        'GITHUB_URL',
        'LINKEDIN_URL'
    ];

    envVars.forEach((envVar: string) => {
        if (constantsContent.includes(`process.env.${envVar}`)) {
            console.log(`\t${colors.green}✅ ${envVar} is environment-based${colors.reset}`);
        } else {
            console.log(`\t${colors.red}❌ ${envVar} is missing or hardcoded${colors.reset}`);
        }
    });
} else {
    console.log(`\t${colors.red}❌ constants.ts not found${colors.reset}`);
}

// Test structured data components
console.log('\n🏷️  Structured Data Components:');
const components: string[] = [
    'src/components/JsonLd.tsx',
    'src/components/home-person-structured-data.tsx',
    'src/components/website-structured-data.tsx',
    'src/components/about-structured-data.tsx'
];

components.forEach((component: string) => {
    const componentPath: string = path.join(process.cwd(), component);
    if (fs.existsSync(componentPath)) {
        const content: string = fs.readFileSync(componentPath, 'utf-8');

        // Check if it imports from constants
        if (content.includes('from "@lib/constants"') || content.includes('from \'@lib/constants\'')) {
            console.log(`\t${colors.green}✅ ${component} uses constants${colors.reset}`);
        } else {
            console.log(`\t${colors.red}❌ ${component} doesn't use constants${colors.reset}`);
        }

        // Check if it has hardcoded values
        const hardcodedPatterns: string[] = [
            '"Leat Sophat"',
            '"PPhat"',
            '"info.sophat@gmail.com"',
            '"https://github.com/pphatdev"',
            '"TURBOTECH CO., LTD"'
        ];

        const hasHardcoded: boolean = hardcodedPatterns.some((pattern: string) =>
            content.includes(pattern) && !content.includes('process.env')
        );

        if (!hasHardcoded) {
            console.log(`\t${colors.green}✅ ${component} has no hardcoded values${colors.reset}`);
        } else {
            console.log(`\t${colors.yellow}⚠️  ${component} may have hardcoded values${colors.reset}`);
        }
    } else {
        console.log(`\t${colors.red}❌ ${component} not found${colors.reset}`);
    }
});

// Test .env.example file
console.log('\n📝 Environment Configuration:');
const envExamplePath: string = path.join(process.cwd(), '.env.example');
if (fs.existsSync(envExamplePath)) {
    const envContent: string = fs.readFileSync(envExamplePath, 'utf-8');
    console.log(`\t${colors.green}✅ .env.example file exists${colors.reset}`);

    const requiredVars: string[] = [
        'PERSON_NAME',
        'PERSON_ALTERNATE_NAME',
        'CONTACT_EMAIL',
        'COMPANY_NAME',
        'GITHUB_URL'
    ];

    requiredVars.forEach((envVar: string) => {
        if (envContent.includes(envVar)) {
            console.log(`\t${colors.green}✅ ${envVar} is documented in .env.example${colors.reset}`);
        } else {
            console.log(`\t${colors.red}❌ ${envVar} is missing from .env.example${colors.reset}`);
        }
    });
} else {
    console.log(`\t${colors.red}❌ .env.example file not found${colors.reset}`);
}

// Test metadata configuration
console.log('\n🏷️  Metadata Configuration:');
const homePagePath: string = path.join(process.cwd(), 'src/app/(home)/page.tsx');
if (fs.existsSync(homePagePath)) {
    const homeContent: string = fs.readFileSync(homePagePath, 'utf-8');

    if (homeContent.includes('HomePersonStructuredData')) {
        console.log(`\t${colors.green}✅ Home page includes PersonStructuredData${colors.reset}`);
    } else {
        console.log(`\t${colors.red}❌ Home page missing PersonStructuredData${colors.reset}`);
    }

    if (homeContent.includes('WebsiteStructuredData')) {
        console.log(`\t${colors.green}✅ Home page includes WebsiteStructuredData${colors.reset}`);
    } else {
        console.log(`\t${colors.red}❌ Home page missing WebsiteStructuredData${colors.reset}`);
    }

    if (homeContent.includes('robots:')) {
        console.log(`\t${colors.green}✅ Home page has robots metadata${colors.reset}`);
    } else {
        console.log(`\t${colors.red}❌ Home page missing robots metadata${colors.reset}`);
    }
} else {
    console.log(`\t${colors.red}❌ Home page not found${colors.reset}`);
}

console.log('\n✨ SEO Structured Data Validation Complete!');
console.log('\n📝 Next Steps:');
console.log('\t1. Create a local .env file based on .env.example');
console.log('\t2. Update environment variables with your actual data');
console.log('\t3. Test the structured data with Google\'s Rich Results Test');
console.log('\t4. Verify robots.txt allows indexing');
