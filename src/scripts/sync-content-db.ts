import { getDatabaseUrl } from '../lib/db/client';
import { syncContentToDatabase } from '../lib/db/content-sync';

export async function runContentDatabaseSync(): Promise<void> {
    const result = await syncContentToDatabase();

    console.log(`SQLite database synced at ${getDatabaseUrl()}`);
    console.log(`Posts: ${result.posts}`);
    console.log(`Post tags: ${result.postTags}`);
    console.log(`Post authors: ${result.postAuthors}`);
    console.log(`Projects: ${result.projects}`);
    console.log(`Project tags: ${result.projectTags}`);
    console.log(`Project languages: ${result.projectLanguages}`);
    console.log(`Project authors: ${result.projectAuthors}`);
    console.log(`Project sources: ${result.projectSources}`);
}

runContentDatabaseSync().catch((error) => {
    console.error('Failed to sync content to SQLite:', error);
    process.exit(1);
});