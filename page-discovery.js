const { readFileSync, writeFileSync, existsSync, readdirSync, statSync } = require('fs');
const { join, relative, extname } = require('path');

const currentDomain = "https://pphat.netlify.app";

function findAllNextJSPages() {
    const pages = [];
    const appDir = join(process.cwd(), 'src/app');
    
    function scanDirectory(dir, basePath = '') {
        try {
            const items = readdirSync(dir);
            
            for (const item of items) {
                const fullPath = join(dir, item);
                const stat = statSync(fullPath);
                
                if (stat.isDirectory()) {
                    // Skip certain directories
                    if (item.startsWith('(') && item.endsWith(')')) {
                        // Route groups - scan contents but don't add to path
                        scanDirectory(fullPath, basePath);
                    } else if (item.startsWith('[') && item.endsWith(']')) {
                        // Dynamic routes - we'll handle these separately
                        if (item === '[slug]') {
                            console.log(`   Found dynamic route: ${basePath}/${item}`);
                        }
                        scanDirectory(fullPath, `${basePath}/${item}`);
                    } else {
                        scanDirectory(fullPath, basePath ? `${basePath}/${item}` : `/${item}`);
                    }
                } else if (item === 'page.tsx' || item === 'page.ts' || item === 'page.js') {
                    const routePath = basePath || '/';
                    pages.push({
                        path: routePath,
                        file: relative(process.cwd(), fullPath),
                        type: 'static'
                    });
                }
            }
        } catch (error) {
            console.error(`Error scanning ${dir}:`, error.message);
        }
    }
    
    console.log('🔍 Scanning Next.js app directory for pages...');
    scanDirectory(appDir);
    
    return pages;
}

function findPublicFiles() {
    const files = [];
    const publicDir = join(process.cwd(), 'public');
    
    function scanPublic(dir, basePath = '') {
        try {
            const items = readdirSync(dir);
            
            for (const item of items) {
                const fullPath = join(dir, item);
                const stat = statSync(fullPath);
                
                if (stat.isDirectory()) {
                    scanPublic(fullPath, `${basePath}/${item}`);
                } else {
                    const ext = extname(item);
                    const routePath = `${basePath}/${item}`;
                    
                    // Include certain file types that might be accessible
                    if (['.html', '.xml', '.txt', '.json'].includes(ext)) {
                        files.push({
                            path: routePath,
                            file: relative(process.cwd(), fullPath),
                            type: 'static-file'
                        });
                    }
                }
            }
        } catch (error) {
            console.error(`Error scanning public directory:`, error.message);
        }
    }
    
    console.log('🔍 Scanning public directory for accessible files...');
    scanPublic(publicDir);
    
    return files;
}

function findDynamicPages() {
    const dynamicPages = [];
    
    // Check for blog posts
    try {
        const postsPath = join(process.cwd(), 'public/data/post.json');
        if (existsSync(postsPath)) {
            const postsData = JSON.parse(readFileSync(postsPath, 'utf-8'));
            const posts = postsData.posts || [];
            
            posts.forEach(post => {
                if (post.published && post.slug) {
                    dynamicPages.push({
                        path: `/posts/${post.slug}`,
                        file: 'src/app/posts/[slug]/page.tsx',
                        type: 'dynamic-post',
                        data: post
                    });
                }
            });
        }
    } catch (error) {
        console.error('Error reading posts data:', error.message);
    }
    
    // Check for projects if they have dynamic routes
    try {
        const projectsPath = join(process.cwd(), 'public/data/project.json');
        if (existsSync(projectsPath)) {
            const projectsData = JSON.parse(readFileSync(projectsPath, 'utf-8'));
            const projects = projectsData.posts || []; // Note: projects are in 'posts' array
            
            // Check if there's a dynamic project route
            const projectDynamicRoute = join(process.cwd(), 'src/app/projects/[id]/page.tsx');
            if (existsSync(projectDynamicRoute)) {
                projects.forEach(project => {
                    if (project.published && project.id) {
                        dynamicPages.push({
                            path: `/projects/${project.id}`,
                            file: 'src/app/projects/[id]/page.tsx',
                            type: 'dynamic-project',
                            data: project
                        });
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error reading projects data:', error.message);
    }
    
    return dynamicPages;
}

function compareWithSitemap() {
    const allPages = [
        ...findAllNextJSPages(),
        ...findPublicFiles(),
        ...findDynamicPages()
    ];
    
    // Read current sitemap
    let sitemapPages = [];
    try {
        const sitemapPath = join(process.cwd(), 'public/sitemap.xml');
        const sitemapContent = readFileSync(sitemapPath, 'utf-8');
        const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
        
        if (urlMatches) {
            sitemapPages = urlMatches.map(match => 
                match.replace(/<\/?loc>/g, '').replace(currentDomain, '')
            );
        }
    } catch (error) {
        console.error('Error reading sitemap:', error.message);
    }
    
    console.log('📊 Page Discovery Analysis:');
    console.log('=' .repeat(50));
    console.log(`🔍 Found ${allPages.length} total discoverable pages`);
    console.log(`📄 Current sitemap has ${sitemapPages.length} pages`);
    console.log('');
    
    // Find pages in sitemap
    const inSitemap = allPages.filter(page => sitemapPages.includes(page.path));
    console.log(`✅ Pages in sitemap: ${inSitemap.length}`);
    inSitemap.forEach(page => {
        console.log(`   ${page.path} (${page.type})`);
    });
    console.log('');
    
    // Find pages NOT in sitemap
    const notInSitemap = allPages.filter(page => !sitemapPages.includes(page.path));
    console.log(`❌ Pages NOT in sitemap: ${notInSitemap.length}`);
    notInSitemap.forEach(page => {
        console.log(`   ${page.path} (${page.type})`);
    });
    console.log('');
    
    // Find URLs in sitemap but not found in codebase
    const orphanedUrls = sitemapPages.filter(url => 
        !allPages.some(page => page.path === url)
    );
    console.log(`🔗 URLs in sitemap but not found in codebase: ${orphanedUrls.length}`);
    orphanedUrls.forEach(url => {
        console.log(`   ${url}`);
    });
    console.log('');
    
    // Potential indexing issues
    console.log('🚨 Potential Indexing Issues:');
    console.log('');
    
    if (notInSitemap.length > 0) {
        console.log(`1. ${notInSitemap.length} pages found but not in sitemap`);
        console.log('   These pages might be discovered by Google but not properly submitted');
    }
    
    if (orphanedUrls.length > 0) {
        console.log(`2. ${orphanedUrls.length} URLs in sitemap but pages don't exist`);
        console.log('   These might cause 404 errors when Google tries to crawl them');
    }
    
    // Check for admin/auth pages that might be indexed
    const adminPages = allPages.filter(page => 
        page.path.includes('/admin') || 
        page.path.includes('/login') || 
        page.path.includes('(auth)')
    );
    
    if (adminPages.length > 0) {
        console.log(`3. ${adminPages.length} admin/auth pages found`);
        console.log('   These should be blocked from indexing');
        adminPages.forEach(page => {
            console.log(`   ${page.path}`);
        });
    }
    
    console.log('');
    console.log('💡 Recommendations:');
    console.log('');
    
    if (notInSitemap.length > 0) {
        console.log('1. Add missing pages to sitemap or block them if they shouldn\'t be indexed');
    }
    
    if (orphanedUrls.length > 0) {
        console.log('2. Remove orphaned URLs from sitemap or create the missing pages');
    }
    
    console.log('3. Check Google Search Console for:');
    console.log('   - Pages discovered but not submitted (should match missing pages)');
    console.log('   - Crawl errors (404s from orphaned URLs)');
    console.log('   - Pages with noindex tags');
    console.log('   - Duplicate content issues');
    
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('1. Update sitemap to include all legitimate pages');
    console.log('2. Ensure robots.txt blocks admin/auth pages');
    console.log('3. Submit updated sitemap to Google Search Console');
    console.log('4. Use URL Inspection tool to test specific pages');
    
    // Save detailed analysis
    const analysis = {
        discoveryDate: new Date().toISOString(),
        domain: currentDomain,
        totalDiscoveredPages: allPages.length,
        sitemapPages: sitemapPages.length,
        pagesInSitemap: inSitemap.length,
        pagesNotInSitemap: notInSitemap.length,
        orphanedUrls: orphanedUrls.length,
        allPages,
        notInSitemap,
        orphanedUrls,
        adminPages
    };
    
    const timestamp = new Date().toISOString().split('T')[0];
    const reportPath = join(process.cwd(), `page-discovery-${timestamp}.json`);
    writeFileSync(reportPath, JSON.stringify(analysis, null, 2), 'utf-8');
    console.log(`\n📋 Detailed analysis saved to: page-discovery-${timestamp}.json`);
}

// Run the analysis
console.log('🔍 Starting comprehensive page discovery analysis...');
console.log('This will help identify the 32 pages Google found but aren\'t indexed');
console.log('Current working directory:', process.cwd());
console.log('');

try {
    compareWithSitemap();
} catch (error) {
    console.error('Error during analysis:', error);
}
