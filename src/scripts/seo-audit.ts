import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { currentDomain } from '../lib/constants';

interface PageAudit {
    url: string;
    title: string;
    description?: string;
    canonical?: string;
    robots?: string;
    lastModified?: string;
    priority: number;
    issues: string[];
    recommendations: string[];
}

interface SEOAuditReport {
    domain: string;
    totalPages: number;
    indexablePages: number;
    blockedPages: number;
    issues: {
        critical: number;
        warning: number;
        info: number;
    };
    pages: PageAudit[];
    summary: string[];
}

function auditSitemap(): PageAudit[] {
    const pages: PageAudit[] = [];

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

                const issues: string[] = [];
                const recommendations: string[] = [];

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
                    title: getPageTitle(path),
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

function getPageTitle(path: string): string {
    const pathMap: Record<string, string> = {
        '/': 'Home - PPhat Dev',
        '/about': 'About - PPhat Dev',
        '/contact': 'Contact - PPhat Dev',
        '/gallery': 'Gallery - PPhat Dev',
        '/posts': 'Blog Posts - PPhat Dev',
        '/projects': 'Projects - PPhat Dev',
        '/login': 'Login - PPhat Dev'
    };

    if (pathMap[path]) {
        return pathMap[path];
    }

    if (path.startsWith('/posts/')) {
        const slug = path.replace('/posts/', '');
        return `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - PPhat Dev`;
    }

    return `${path} - PPhat Dev`;
}

function auditRobotsTxt(): { blocked: string[], allowed: string[], issues: string[] } {
    const blocked: string[] = [];
    const allowed: string[] = [];
    const issues: string[] = [];

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
                if (!sitemapUrl.includes('pphat.top')) {
                    issues.push(`Incorrect sitemap URL: ${sitemapUrl}`);
                }
            }
        });

    } catch (error) {
        issues.push('Could not read robots.txt file');
    }

    return { blocked, allowed, issues };
}

function checkMissingPages(): string[] {
    const potentialPages = [
        '/sitemap.xml',
        '/robots.txt',
        '/favicon.ico',
        '/.well-known/security.txt',
        '/privacy-policy',
        '/terms-of-service',
        '/404'
    ];

    const missing: string[] = [];
    const currentPages = auditSitemap().map(p => p.url.replace(currentDomain, ''));

    potentialPages.forEach(page => {
        if (!currentPages.includes(page)) {
            missing.push(page);
        }
    });

    return missing;
}

function generateSEOReport(): SEOAuditReport {
    console.log('🔍 Starting SEO audit...\n');

    const pages = auditSitemap();
    const robotsAudit = auditRobotsTxt();
    const missingPages = checkMissingPages();

    const indexablePages = pages.filter(p =>
        !robotsAudit.blocked.some(blocked => p.url.includes(blocked.replace('/', '')))
    );

    const blockedPages = pages.filter(p =>
        robotsAudit.blocked.some(blocked => p.url.includes(blocked.replace('/', '')))
    );

    let criticalIssues = 0;
    let warningIssues = 0;
    let infoIssues = 0;

    pages.forEach(page => {
        if (page.issues.some(issue => issue.includes('blocked'))) {
            if (page.url.includes('/admin') || page.url.includes('/login')) {
                infoIssues++;
            } else {
                criticalIssues++;
            }
        } else if (page.issues.some(issue => issue.includes('priority'))) {
            warningIssues++;
        } else if (page.issues.length > 0) {
            infoIssues++;
        }
    });

    const summary = [
        `📊 SEO Audit Summary for ${currentDomain}`,
        `📄 Total pages in sitemap: ${pages.length}`,
        `✅ Indexable pages: ${indexablePages.length}`,
        `🚫 Blocked pages: ${blockedPages.length}`,
        `⚠️  Critical issues: ${criticalIssues}`,
        `⚡ Warning issues: ${warningIssues}`,
        `ℹ️  Info issues: ${infoIssues}`,
        '',
        '🔧 Robots.txt Configuration:',
        `   Blocked paths: ${robotsAudit.blocked.join(', ')}`,
        `   Allowed paths: ${robotsAudit.allowed.join(', ')}`,
        '',
        '❌ Missing recommended pages:',
        ...missingPages.map(page => `   - ${page}`),
        '',
        '💡 Key Recommendations:',
        '   1. Ensure all important pages are in sitemap',
        '   2. Check Google Search Console for specific indexing issues',
        '   3. Submit updated sitemap to Google',
        '   4. Monitor crawl errors and fix them',
        '   5. Ensure proper internal linking structure'
    ];

    return {
        domain: currentDomain,
        totalPages: pages.length,
        indexablePages: indexablePages.length,
        blockedPages: blockedPages.length,
        issues: {
            critical: criticalIssues,
            warning: warningIssues,
            info: infoIssues
        },
        pages,
        summary
    };
}

function generateActionPlan(): string[] {
    return [
        '🎯 Action Plan to Fix Google Indexing Issues:',
        '',
        '1. 📝 Submit Updated Sitemap:',
        '   - Go to Google Search Console',
        '   - Navigate to Sitemaps section',
        '   - Submit: https://pphat.top/sitemap.xml',
        '   - Submit: https://pphat.top/image-sitemap.xml',
        '',
        '2. 🔍 Check Page Indexing Status:',
        '   - Use "URL Inspection" tool in GSC',
        '   - Test each unindexed page individually',
        '   - Request indexing for important pages',
        '',
        '3. 🚨 Common Issues to Check:',
        '   - Pages returning 404 or 500 errors',
        '   - Pages with noindex meta tags',
        '   - Pages blocked by robots.txt',
        '   - Duplicate content issues',
        '   - Pages with poor content quality',
        '   - Pages with slow loading times',
        '',
        '4. 🔧 Technical Fixes:',
        '   - Ensure all pages have proper meta tags',
        '   - Add structured data where appropriate',
        '   - Improve internal linking',
        '   - Fix any crawl errors',
        '   - Optimize page loading speed',
        '',
        '5. 📊 Monitor Progress:',
        '   - Check GSC weekly for indexing status',
        '   - Monitor crawl errors and fix promptly',
        '   - Track improvements in search rankings'
    ];
}

// Main execution
export function runSEOAudit(): void {
    const report = generateSEOReport();
    const actionPlan = generateActionPlan();

    // Print summary to console
    report.summary.forEach(line => console.log(line));
    console.log('\n');
    actionPlan.forEach(line => console.log(line));

    // Save detailed report to file
    const timestamp = new Date().toISOString().split('T')[0];
    const reportPath = join(process.cwd(), `seo-audit-${timestamp}.json`);

    writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`\n📋 Detailed report saved to: ${reportPath}`);

    // Save action plan to file
    const actionPlanPath = join(process.cwd(), `seo-action-plan-${timestamp}.md`);
    const actionPlanContent = [
        '# SEO Action Plan',
        `Generated on: ${new Date().toISOString()}`,
        `Domain: ${currentDomain}`,
        '',
        ...actionPlan,
        '',
        '## Page Details',
        '',
        ...report.pages.map(page => [
            `### ${page.title}`,
            `URL: ${page.url}`,
            `Priority: ${page.priority}`,
            `Last Modified: ${page.lastModified || 'Not specified'}`,
            page.issues.length > 0 ? `Issues: ${page.issues.join(', ')}` : 'No issues found',
            page.recommendations.length > 0 ? `Recommendations: ${page.recommendations.join(', ')}` : '',
            ''
        ]).flat()
    ].join('\n');

    writeFileSync(actionPlanPath, actionPlanContent, 'utf-8');
    console.log(`📝 Action plan saved to: ${actionPlanPath}`);
}

// Run the audit
runSEOAudit();
