#!/usr/bin/env node

/**
 * SEO Structured Data Validation
 * Validates that all structured data components use environment variables correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing SEO Structured Data Configuration...\n');

// Test environment variables in constants file
console.log('📋 Environment Variable Constants:');
const constantsPath = path.join(process.cwd(), 'src/lib/constants.ts');
if (fs.existsSync(constantsPath)) {
    const constantsContent = fs.readFileSync(constantsPath, 'utf-8');

    const envVars = [
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

    envVars.forEach(envVar => {
        if (constantsContent.includes(`process.env.${envVar}`)) {
            console.log(`  ✅ ${envVar} is environment-based`);
        } else {
            console.log(`  ❌ ${envVar} is missing or hardcoded`);
        }
    });
} else {
    console.log('  ❌ constants.ts not found');
}

// Test structured data components
console.log('\n🏷️  Structured Data Components:');
const components = [
    'src/components/JsonLd.tsx',
    'src/components/home-person-structured-data.tsx',
    'src/components/website-structured-data.tsx',
    'src/components/about-structured-data.tsx'
];

components.forEach(component => {
    const componentPath = path.join(process.cwd(), component);
    if (fs.existsSync(componentPath)) {
        const content = fs.readFileSync(componentPath, 'utf-8');

        // Check if it imports from constants
        if (content.includes('from "@lib/constants"') || content.includes('from \'@lib/constants\'')) {
            console.log(`  ✅ ${component} uses constants`);
        } else {
            console.log(`  ❌ ${component} doesn't use constants`);
        }

        // Check if it has hardcoded values
        const hardcodedPatterns = [
            '"Leat Sophat"',
            '"PPhat"',
            '"info.sophat@gmail.com"',
            '"https://github.com/pphatdev"',
            '"TURBOTECH CO., LTD"'
        ];

        const hasHardcoded = hardcodedPatterns.some(pattern =>
            content.includes(pattern) && !content.includes('process.env')
        );

        if (!hasHardcoded) {
            console.log(`  ✅ ${component} has no hardcoded values`);
        } else {
            console.log(`  ⚠️  ${component} may have hardcoded values`);
        }
    } else {
        console.log(`  ❌ ${component} not found`);
    }
});

// Test .env.example file
console.log('\n📝 Environment Configuration:');
const envExamplePath = path.join(process.cwd(), '.env.example');
if (fs.existsSync(envExamplePath)) {
    const envContent = fs.readFileSync(envExamplePath, 'utf-8');
    console.log('  ✅ .env.example file exists');

    const requiredVars = [
        'PERSON_NAME',
        'PERSON_ALTERNATE_NAME',
        'CONTACT_EMAIL',
        'COMPANY_NAME',
        'GITHUB_URL'
    ];

    requiredVars.forEach(envVar => {
        if (envContent.includes(envVar)) {
            console.log(`  ✅ ${envVar} is documented in .env.example`);
        } else {
            console.log(`  ❌ ${envVar} is missing from .env.example`);
        }
    });
} else {
    console.log('  ❌ .env.example file not found');
}

// Test metadata configuration
console.log('\n🏷️  Metadata Configuration:');
const homePagePath = path.join(process.cwd(), 'src/app/(home)/page.tsx');
if (fs.existsSync(homePagePath)) {
    const homeContent = fs.readFileSync(homePagePath, 'utf-8');

    if (homeContent.includes('HomePersonStructuredData')) {
        console.log('  ✅ Home page includes PersonStructuredData');
    } else {
        console.log('  ❌ Home page missing PersonStructuredData');
    }

    if (homeContent.includes('WebsiteStructuredData')) {
        console.log('  ✅ Home page includes WebsiteStructuredData');
    } else {
        console.log('  ❌ Home page missing WebsiteStructuredData');
    }

    if (homeContent.includes('robots:')) {
        console.log('  ✅ Home page has robots metadata');
    } else {
        console.log('  ❌ Home page missing robots metadata');
    }
} else {
    console.log('  ❌ Home page not found');
}

console.log('\n✨ SEO Structured Data Validation Complete!');
console.log('\n📝 Next Steps:');
console.log('1. Create a local .env file based on .env.example');
console.log('2. Update environment variables with your actual data');
console.log('3. Test the structured data with Google\'s Rich Results Test');
console.log('4. Verify robots.txt allows indexing');
