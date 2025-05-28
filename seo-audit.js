const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

console.log('Starting SEO Audit...');
const currentDomain = process.env.NEXT_PUBLIC_APP_URL || "https://pphat.netlify.app";

function auditSitemap() {
    const pages = [];
    
    try {
        const sitemapPath = join(process.cwd(), 'public/sitemap.xml');
        const sitemapContent = readFileSync(sitemapPath, 'utf-8');
        
        // Parse sitemap URLs
        const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
        const lastmodMatches = sitemapContent.match(/<lastmod>(.*?)<\/lastmod>/g);
        const priorityMatches = sitemapContent.match(/<priority>(.*?)<\/priority>/g);
        
        if (urlMatches) {
            urlMatches.forEach((match, index) => {
                const url = match.replace(/<\/?loc>/g, '');
                const path = url.replace(currentDomain, '');
                const lastmod = lastmodMatches?.[index]?.replace(/<\/?lastmod>/g, '');
                const priority = parseFloat(priorityMatches?.[index]?.replace(/<\/?priority>/g, '') || '0.5');
                
                const issues = [];
                const recommendations = [];
                
                // Check for common SEO issues
                if (!lastmod) {
                    issues.push('Missing lastmod date');
                    recommendations.push('Add lastmod date to improve crawl efficiency');
                }
                
                if (priority < 0.5 && path !== '/login') {
                    issues.push('Low priority value');
                    recommendations.push('Consider increasing priority for important pages');
                }
                
                // Check for blocked paths
                const isBlocked = ['/admin/', '/login', '/(auth)/'].some(blocked => 
                    path.includes(blocked.replace('/', ''))
                );
                
                if (isBlocked) {
                    issues.push('Page is blocked in robots.txt');
                    recommendations.push('This is intentional for admin/auth pages');
                }
                
                pages.push({
                    url,
                    path,
                    lastModified: lastmod,
                    priority,
                    issues,
                    recommendations
                });
            });
        }
    } catch (error) {
        console.error('Error reading sitemap:', error);
    }
    
    return pages;
}

function auditRobotsTxt() {
    const blocked = [];
    const allowed = [];
    const issues = [];
    
    try {
        const robotsPath = join(process.cwd(), 'public/robots.txt');
        const robotsContent = readFileSync(robotsPath, 'utf-8');
        
        const lines = robotsContent.split('\n');
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('Disallow:')) {
                const path = trimmed.replace('Disallow:', '').trim();
                if (path && path !== '/') {
                    blocked.push(path);
                }
            } else if (trimmed.startsWith('Allow:')) {
                const path = trimmed.replace('Allow:', '').trim();
                if (path) {
                    allowed.push(path);
                }
            } else if (trimmed.startsWith('Sitemap:')) {
                const sitemapUrl = trimmed.replace('Sitemap:', '').trim();
                if (!sitemapUrl.includes('pphat.netlify.app')) {
                    issues.push(`Incorrect sitemap URL: ${sitemapUrl}`);
                }
            }
        });
        
    } catch (error) {
        issues.push('Could not read robots.txt file');
    }
    
    return { blocked, allowed, issues };
}

function generateSEOReport() {
    console.log('🔍 Starting SEO audit for', currentDomain);
    console.log('================================================\n');
    
    const pages = auditSitemap();
    const robotsAudit = auditRobotsTxt();
    
    const indexablePages = pages.filter(p => 
        !robotsAudit.blocked.some(blocked => p.path.includes(blocked.replace('/', '')))
    );
    
    const blockedPages = pages.filter(p => 
        robotsAudit.blocked.some(blocked => p.path.includes(blocked.replace('/', '')))
    );
    
    console.log('📊 SEO Audit Summary:');
    console.log(`📄 Total pages in sitemap: ${pages.length}`);
    console.log(`✅ Indexable pages: ${indexablePages.length}`);
    console.log(`🚫 Blocked pages: ${blockedPages.length}`);
    console.log('');
    
    console.log('🔧 Robots.txt Configuration:');
    console.log(`   Blocked paths: ${robotsAudit.blocked.join(', ')}`);
    console.log(`   Allowed paths: ${robotsAudit.allowed.join(', ')}`);
    
    if (robotsAudit.issues.length > 0) {
        console.log('   ⚠️  Issues:', robotsAudit.issues.join(', '));
    }
    console.log('');
    
    console.log('📋 Indexable Pages:');
    indexablePages.forEach((page, index) => {
        console.log(`${index + 1}. ${page.path} (Priority: ${page.priority})`);
        if (page.issues.length > 0) {
            console.log(`   ⚠️  Issues: ${page.issues.join(', ')}`);
        }
    });
    console.log('');
    
    console.log('🚫 Blocked Pages (Not indexed):');
    blockedPages.forEach((page, index) => {
        console.log(`${index + 1}. ${page.path}`);
    });
    console.log('');
    
    console.log('🎯 Action Plan to Fix Google Indexing Issues:');
    console.log('');
    console.log('1. 📝 Submit Updated Sitemap:');
    console.log('   - Go to Google Search Console');
    console.log('   - Navigate to Sitemaps section');
    console.log(`   - Submit: ${currentDomain}/sitemap.xml`);
    console.log(`   - Submit: ${currentDomain}/image-sitemap.xml`);
    console.log('');
    console.log('2. 🔍 Check Page Indexing Status:');
    console.log('   - Use "URL Inspection" tool in GSC');
    console.log('   - Test each unindexed page individually');
    console.log('   - Request indexing for important pages');
    console.log('');
    console.log('3. 🚨 Common Issues to Check:');
    console.log('   - Pages returning 404 or 500 errors');
    console.log('   - Pages with noindex meta tags');
    console.log('   - Pages blocked by robots.txt');
    console.log('   - Duplicate content issues');
    console.log('   - Pages with poor content quality');
    console.log('   - Pages with slow loading times');
    console.log('');
    console.log('4. 🔧 Technical Fixes:');
    console.log('   - Ensure all pages have proper meta tags');
    console.log('   - Add structured data where appropriate');
    console.log('   - Improve internal linking');
    console.log('   - Fix any crawl errors');
    console.log('   - Optimize page loading speed');
    console.log('');
    console.log('5. 📊 Monitor Progress:');
    console.log('   - Check GSC weekly for indexing status');
    console.log('   - Monitor crawl errors and fix promptly');
    console.log('   - Track improvements in search rankings');
    
    // Save report
    const timestamp = new Date().toISOString().split('T')[0];
    const report = {
        domain: currentDomain,
        auditDate: new Date().toISOString(),
        totalPages: pages.length,
        indexablePages: indexablePages.length,
        blockedPages: blockedPages.length,
        pages,
        robotsConfig: robotsAudit
    };
    
    const reportPath = join(process.cwd(), `seo-audit-${timestamp}.json`);
    writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`\n📋 Detailed report saved to: seo-audit-${timestamp}.json`);
}

// Run the audit
generateSEOReport();
