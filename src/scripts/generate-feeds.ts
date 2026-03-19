import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { NEXT_PUBLIC_APP_URL, appDescriptions, appTitle } from '../lib/constants';

interface PostData {
    slug: string;
    title: string;
    description?: string;
    thumbnail?: string;
    published: boolean;
    createdAt: string;
    updatedAt?: string;
}

function xmlEscape(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function toCdata(value: string): string {
    // Split embedded CDATA terminators to keep valid XML.
    return `<![CDATA[${value.replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
}

function toRfc2822(value: string): string {
    return new Date(value).toUTCString();
}

function toIso(value: string): string {
    return new Date(value).toISOString();
}

function getImageMimeType(imageUrl: string): string {
    const cleanUrl = imageUrl.split('?')[0].toLowerCase();
    if (cleanUrl.endsWith('.png')) return 'image/png';
    if (cleanUrl.endsWith('.gif')) return 'image/gif';
    if (cleanUrl.endsWith('.webp')) return 'image/webp';
    if (cleanUrl.endsWith('.svg')) return 'image/svg+xml';
    return 'image/jpeg';
}

function getBaseUrl(): string {
    const raw = NEXT_PUBLIC_APP_URL.trim();
    const parsed = new URL(raw);
    if (parsed.hostname.startsWith('www.')) {
        parsed.hostname = parsed.hostname.slice(4);
    }
    return parsed.toString().replace(/\/$/, '');
}

function toOriginUrl(value: string, baseUrl: string): string {
    if (!value) return baseUrl;
    try {
        return new URL(value, `${baseUrl}/`).toString();
    } catch {
        return baseUrl;
    }
}

function parseFrontmatter(content: string): Record<string, unknown> {
    const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!match) return {};
    const yaml = match[1];
    const data: Record<string, unknown> = {};
    for (const line of yaml.split('\n')) {
        const m = line.match(/^(\w+):\s*(.+)/);
        if (m) {
            let val: unknown = m[2].trim();
            if (val === 'true') val = true;
            else if (val === 'false') val = false;
            else if (typeof val === 'string' && val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            data[m[1]] = val;
        }
    }
    return data;
}

function findMarkdownFilesInDir(dir: string): string[] {
    if (!existsSync(dir)) return [];
    const results: string[] = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) results.push(...findMarkdownFilesInDir(fullPath));
        else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) results.push(fullPath);
    }
    return results;
}

function readPublishedPosts(): PostData[] {
    const postsDir = join(process.cwd(), 'content', 'posts');
    const files = findMarkdownFilesInDir(postsDir);
    const posts: PostData[] = [];

    for (const file of files) {
        const raw = readFileSync(file, 'utf-8');
        const data = parseFrontmatter(raw);
        if (data.published !== true) continue;

        posts.push({
            slug: data.slug as string || '',
            title: data.title as string || '',
            description: data.description as string || '',
            thumbnail: data.thumbnail as string || '',
            published: true,
            createdAt: data.createdAt as string || '',
            updatedAt: data.updatedAt as string || undefined,
        });
    }

    return posts.sort((a, b) => {
        const aTime = new Date(a.updatedAt || a.createdAt).getTime();
        const bTime = new Date(b.updatedAt || b.createdAt).getTime();
        return bTime - aTime;
    });
}

function readPublishedProjects(): PostData[] {
    const projectsDir = join(process.cwd(), 'content', 'projects');
    const files = findMarkdownFilesInDir(projectsDir);
    const projects: PostData[] = [];

    for (const file of files) {
        const raw = readFileSync(file, 'utf-8');
        const data = parseFrontmatter(raw);
        if (data.published !== true) continue;

        projects.push({
            slug: data.slug as string || '',
            title: data.title as string || '',
            description: data.description as string || '',
            // projects use "image" field, posts use "thumbnail"
            thumbnail: (data.image as string) || (data.thumbnail as string) || '',
            published: true,
            createdAt: data.createdAt as string || '',
            updatedAt: data.updatedAt as string || undefined,
        });
    }

    return projects.sort((a, b) => {
        const aTime = new Date(a.updatedAt || a.createdAt).getTime();
        const bTime = new Date(b.updatedAt || b.createdAt).getTime();
        return bTime - aTime;
    });
}

interface FeedOptions {
    feedFile?: string;
    sectionPath?: string;
    channelTitle?: string;
    channelDesc?: string;
}

function buildRss(posts: PostData[], baseUrl: string, opts: FeedOptions = {}): string {
    const feedFile = opts.feedFile ?? 'rss.xml';
    const sectionPath = opts.sectionPath ?? 'posts';
    const feedUrl = `${baseUrl}/${feedFile}`;
    const siteUrl = `${baseUrl}/${sectionPath}`;
    const channelImageUrl = `${baseUrl}/assets/icons/android-chrome-512x512.png`;
    const channelTitle = opts.channelTitle ?? appTitle;
    const channelDesc = opts.channelDesc ?? appDescriptions;
    const updated = posts[0]?.updatedAt || posts[0]?.createdAt || new Date().toISOString();

    const items = posts
        .map((post) => {
            const postUrl = `${baseUrl}/${sectionPath}/${post.slug}`;
            const published = post.createdAt;
            const updatedAt = post.updatedAt || post.createdAt;
            const description = post.description || '';
            const thumbnail = toOriginUrl(post.thumbnail || channelImageUrl, baseUrl);
            const imageType = getImageMimeType(thumbnail);

            return [
                '  <item>',
                `    <title>${toCdata(post.title)}</title>`,
                `    <link>${xmlEscape(postUrl)}</link>`,
                `    <guid isPermaLink=\"true\">${xmlEscape(postUrl)}</guid>`,
                `    <pubDate>${toRfc2822(published)}</pubDate>`,
                `    <description>${toCdata(description)}</description>`,
                `    <enclosure url=\"${xmlEscape(thumbnail)}\" length=\"0\" type=\"${imageType}\" />`,
                `    <media:content url=\"${xmlEscape(thumbnail)}\" medium=\"image\" type=\"${imageType}\" />`,
                `    <media:thumbnail url=\"${xmlEscape(thumbnail)}\" />`,
                `    <dc:date>${toIso(updatedAt)}</dc:date>`,
                '  </item>',
            ].join('\n');
        })
        .join('\n');

    return [
        '<?xml version=\"1.0\" encoding=\"UTF-8\"?>',
        '<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:media=\"http://search.yahoo.com/mrss/\">',
        '<channel>',
        `  <title>${toCdata(channelTitle)}</title>`,
        `  <link>${xmlEscape(siteUrl)}</link>`,
        `  <description>${toCdata(channelDesc)}</description>`,
        `  <language>en-US</language>`,
        '  <image>',
        `    <url>${xmlEscape(channelImageUrl)}</url>`,
        `    <title>${toCdata(channelTitle)}</title>`,
        `    <link>${xmlEscape(baseUrl)}</link>`,
        '  </image>',
        `  <lastBuildDate>${toRfc2822(updated)}</lastBuildDate>`,
        `  <atom:link href=\"${xmlEscape(feedUrl)}\" rel=\"self\" type=\"application/rss+xml\" />`,
        items,
        '</channel>',
        '</rss>',
        '',
    ].join('\n');
}

function buildAtom(posts: PostData[], baseUrl: string, opts: FeedOptions = {}): string {
    const feedFile = opts.feedFile ?? 'atom.xml';
    const sectionPath = opts.sectionPath ?? 'posts';
    const feedUrl = `${baseUrl}/${feedFile}`;
    const siteUrl = `${baseUrl}/${sectionPath}`;
    const title = opts.channelTitle ?? appTitle;
    const updated = posts[0]?.updatedAt || posts[0]?.createdAt || new Date().toISOString();

    const entries = posts
        .map((post) => {
            const postUrl = `${baseUrl}/${sectionPath}/${post.slug}`;
            const summary = post.description || '';
            const published = post.createdAt;
            const updatedAt = post.updatedAt || post.createdAt;

            return [
                '  <entry>',
                `    <title>${xmlEscape(post.title)}</title>`,
                `    <id>${xmlEscape(postUrl)}</id>`,
                `    <link href=\"${xmlEscape(postUrl)}\" />`,
                `    <published>${toIso(published)}</published>`,
                `    <updated>${toIso(updatedAt)}</updated>`,
                `    <summary>${xmlEscape(summary)}</summary>`,
                '  </entry>',
            ].join('\n');
        })
        .join('\n');

    return [
        '<?xml version=\"1.0\" encoding=\"UTF-8\"?>',
        '<feed xmlns=\"http://www.w3.org/2005/Atom\">',
        `  <title>${xmlEscape(title)}</title>`,
        `  <id>${xmlEscape(feedUrl)}</id>`,
        `  <link href=\"${xmlEscape(siteUrl)}\" rel=\"alternate\" />`,
        `  <link href=\"${xmlEscape(feedUrl)}\" rel=\"self\" />`,
        `  <updated>${toIso(updated)}</updated>`,
        `  <subtitle>${xmlEscape(appDescriptions)}</subtitle>`,
        entries,
        '</feed>',
        '',
    ].join('\n');
}

function buildJsonFeed(posts: PostData[], baseUrl: string, opts: FeedOptions = {}): string {
    const feedFile = opts.feedFile ?? 'feed.json';
    const sectionPath = opts.sectionPath ?? 'posts';
    const feedUrl = `${baseUrl}/${feedFile}`;
    const siteUrl = `${baseUrl}/${sectionPath}`;
    const title = opts.channelTitle ?? appTitle;

    return JSON.stringify(
        {
            version: 'https://jsonfeed.org/version/1.1',
            title: title,
            home_page_url: siteUrl,
            feed_url: feedUrl,
            description: appDescriptions,
            language: 'en-US',
            items: posts.map((post) => {
                const postUrl = `${baseUrl}/${sectionPath}/${post.slug}`;
                return {
                    id: postUrl,
                    url: postUrl,
                    title: post.title,
                    summary: post.description || '',
                    date_published: toIso(post.createdAt),
                    date_modified: toIso(post.updatedAt || post.createdAt),
                };
            }),
        },
        null,
        2,
    );
}

export function generateFeeds(): void {
    const baseUrl = getBaseUrl();
    const posts = readPublishedPosts();
    const projects = readPublishedProjects();

    // --- Post feeds ---
    const blogDir = join(process.cwd(), 'public/blogs');
    mkdirSync(blogDir, { recursive: true });

    const rss = buildRss(posts, baseUrl, { feedFile: 'blogs/rss.xml', sectionPath: 'posts' });
    const atom = buildAtom(posts, baseUrl, { feedFile: 'blogs/atom.xml', sectionPath: 'posts' });
    const jsonFeed = buildJsonFeed(posts, baseUrl, { feedFile: 'blogs/feed.json', sectionPath: 'posts' });

    writeFileSync(join(blogDir, 'rss.xml'), rss, 'utf-8');
    writeFileSync(join(blogDir, 'atom.xml'), atom, 'utf-8');
    writeFileSync(join(blogDir, 'feed.json'), jsonFeed, 'utf-8');

    console.log(`✅ Generated feeds for ${posts.length} published posts.`);
    console.log(`🔗 RSS: ${baseUrl}/blogs/rss.xml`);
    console.log(`🔗 Atom: ${baseUrl}/blogs/atom.xml`);
    console.log(`🔗 JSON Feed: ${baseUrl}/blogs/feed.json`);

    // --- Project feeds ---
    const projectsDir = join(process.cwd(), 'public/projects');
    mkdirSync(projectsDir, { recursive: true });

    const projectsRss = buildRss(
        projects.map(p => ({ ...p })),
        baseUrl,
        { feedFile: 'projects/rss.xml', sectionPath: 'projects', channelTitle: `${appTitle} - Projects`, channelDesc: 'Latest projects by ' + appTitle }
    );
    const projectsAtom = buildAtom(
        projects.map(p => ({ ...p })),
        baseUrl,
        { feedFile: 'projects/atom.xml', sectionPath: 'projects' }
    );
    const projectsJsonFeed = buildJsonFeed(
        projects.map(p => ({ ...p })),
        baseUrl,
        { feedFile: 'projects/feed.json', sectionPath: 'projects' }
    );

    writeFileSync(join(projectsDir, 'rss.xml'), projectsRss, 'utf-8');
    writeFileSync(join(projectsDir, 'atom.xml'), projectsAtom, 'utf-8');
    writeFileSync(join(projectsDir, 'feed.json'), projectsJsonFeed, 'utf-8');

    console.log(`✅ Generated feeds for ${projects.length} published projects.`);
    console.log(`🔗 RSS: ${baseUrl}/projects/rss.xml`);
    console.log(`🔗 Atom: ${baseUrl}/projects/atom.xml`);
    console.log(`🔗 JSON Feed: ${baseUrl}/projects/feed.json`);
}

generateFeeds();
