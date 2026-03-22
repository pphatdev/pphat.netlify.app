import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
    name: text('name').notNull(),
    passwordHash: text('password_hash'),
    image: text('image').notNull().default(''),
    role: text('role').notNull().default('editor'),
    provider: text('provider').notNull().default('credentials'),
    githubId: text('github_id'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
}, (table) => [
    uniqueIndex('users_email_unique').on(table.email),
    uniqueIndex('users_github_id_unique').on(table.githubId),
    index('users_role_idx').on(table.role),
]);

export const posts = sqliteTable('posts', {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    thumbnail: text('thumbnail').notNull().default(''),
    content: text('content').notNull().default(''),
    filePath: text('file_path').notNull().default(''),
    published: integer('published', { mode: 'boolean' }).notNull().default(false),
    moderatorId: text('moderator_id').references(() => users.id),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at'),
    syncedAt: text('synced_at').notNull(),
}, (table) => [
    uniqueIndex('posts_slug_unique').on(table.slug),
    index('posts_published_idx').on(table.published),
    index('posts_created_at_idx').on(table.createdAt),
    index('posts_moderator_id_idx').on(table.moderatorId),
]);

export const postTags = sqliteTable('post_tags', {
    postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    tag: text('tag').notNull(),
}, (table) => [
    primaryKey({ columns: [table.postId, table.tag] }),
    index('post_tags_tag_idx').on(table.tag),
]);

export const postAuthors = sqliteTable('post_authors', {
    postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    name: text('name').notNull(),
    profile: text('profile').notNull().default(''),
    url: text('url').notNull().default(''),
}, (table) => [
    primaryKey({ columns: [table.postId, table.position] }),
]);

export const projects = sqliteTable('projects', {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    image: text('image').notNull().default(''),
    content: text('content').notNull().default(''),
    filePath: text('file_path').notNull().default(''),
    published: integer('published', { mode: 'boolean' }).notNull().default(false),
    createdAt: text('created_at').notNull(),
    syncedAt: text('synced_at').notNull(),
}, (table) => [
    uniqueIndex('projects_slug_unique').on(table.slug),
    index('projects_published_idx').on(table.published),
    index('projects_created_at_idx').on(table.createdAt),
]);

export const projectTags = sqliteTable('project_tags', {
    projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    tag: text('tag').notNull(),
}, (table) => [
    primaryKey({ columns: [table.projectId, table.tag] }),
    index('project_tags_tag_idx').on(table.tag),
]);

export const projectLanguages = sqliteTable('project_languages', {
    projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    language: text('language').notNull(),
}, (table) => [
    primaryKey({ columns: [table.projectId, table.language] }),
    index('project_languages_language_idx').on(table.language),
]);

export const projectAuthors = sqliteTable('project_authors', {
    projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    name: text('name').notNull(),
    profile: text('profile').notNull().default(''),
    url: text('url').notNull().default(''),
}, (table) => [
    primaryKey({ columns: [table.projectId, table.position] }),
]);

export const projectSources = sqliteTable('project_sources', {
    projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    name: text('name').notNull(),
    type: text('type').notNull().default(''),
    url: text('url').notNull(),
}, (table) => [
    primaryKey({ columns: [table.projectId, table.position] }),
]);

export const contactSubmissions = sqliteTable('contact_submissions', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    subject: text('subject').notNull(),
    message: text('message').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    deliveryStatus: text('delivery_status').notNull().default('pending'),
    isSpam: integer('is_spam', { mode: 'boolean' }).notNull().default(false),
    deliveredAt: text('delivered_at'),
    createdAt: text('created_at').notNull(),
}, (table) => [
    index('contact_submissions_created_at_idx').on(table.createdAt),
    index('contact_submissions_email_idx').on(table.email),
    index('contact_submissions_status_idx').on(table.deliveryStatus),
]);

export const contentVisitors = sqliteTable('content_visitors', {
    contentType: text('content_type').notNull(),
    contentSlug: text('content_slug').notNull(),
    visitorCount: integer('visitor_count').notNull().default(0),
    updatedAt: text('updated_at').notNull(),
}, (table) => [
    primaryKey({ columns: [table.contentType, table.contentSlug] }),
    index('content_visitors_type_idx').on(table.contentType),
    index('content_visitors_slug_idx').on(table.contentSlug),
]);