CREATE TABLE `contact_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`delivery_status` text DEFAULT 'pending' NOT NULL,
	`is_spam` integer DEFAULT false NOT NULL,
	`delivered_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `contact_submissions_created_at_idx` ON `contact_submissions` (`created_at`);--> statement-breakpoint
CREATE INDEX `contact_submissions_email_idx` ON `contact_submissions` (`email`);--> statement-breakpoint
CREATE INDEX `contact_submissions_status_idx` ON `contact_submissions` (`delivery_status`);--> statement-breakpoint
CREATE TABLE `content_visitors` (
	`content_type` text NOT NULL,
	`content_slug` text NOT NULL,
	`visitor_count` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`content_type`, `content_slug`)
);
--> statement-breakpoint
CREATE INDEX `content_visitors_type_idx` ON `content_visitors` (`content_type`);--> statement-breakpoint
CREATE INDEX `content_visitors_slug_idx` ON `content_visitors` (`content_slug`);--> statement-breakpoint
CREATE TABLE `post_authors` (
	`post_id` text NOT NULL,
	`position` integer NOT NULL,
	`name` text NOT NULL,
	`profile` text DEFAULT '' NOT NULL,
	`url` text DEFAULT '' NOT NULL,
	PRIMARY KEY(`post_id`, `position`),
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `post_tags` (
	`post_id` text NOT NULL,
	`tag` text NOT NULL,
	PRIMARY KEY(`post_id`, `tag`),
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `post_tags_tag_idx` ON `post_tags` (`tag`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`thumbnail` text DEFAULT '' NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`file_path` text DEFAULT '' NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`moderator_id` text,
	`created_at` text NOT NULL,
	`updated_at` text,
	`synced_at` text NOT NULL,
	FOREIGN KEY (`moderator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `posts_published_idx` ON `posts` (`published`);--> statement-breakpoint
CREATE INDEX `posts_created_at_idx` ON `posts` (`created_at`);--> statement-breakpoint
CREATE INDEX `posts_moderator_id_idx` ON `posts` (`moderator_id`);--> statement-breakpoint
CREATE TABLE `project_authors` (
	`project_id` text NOT NULL,
	`position` integer NOT NULL,
	`name` text NOT NULL,
	`profile` text DEFAULT '' NOT NULL,
	`url` text DEFAULT '' NOT NULL,
	PRIMARY KEY(`project_id`, `position`),
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `project_languages` (
	`project_id` text NOT NULL,
	`language` text NOT NULL,
	PRIMARY KEY(`project_id`, `language`),
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_languages_language_idx` ON `project_languages` (`language`);--> statement-breakpoint
CREATE TABLE `project_sources` (
	`project_id` text NOT NULL,
	`position` integer NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT '' NOT NULL,
	`url` text NOT NULL,
	PRIMARY KEY(`project_id`, `position`),
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `project_tags` (
	`project_id` text NOT NULL,
	`tag` text NOT NULL,
	PRIMARY KEY(`project_id`, `tag`),
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_tags_tag_idx` ON `project_tags` (`tag`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`image` text DEFAULT '' NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`file_path` text DEFAULT '' NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`synced_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE INDEX `projects_published_idx` ON `projects` (`published`);--> statement-breakpoint
CREATE INDEX `projects_created_at_idx` ON `projects` (`created_at`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password_hash` text,
	`image` text DEFAULT '' NOT NULL,
	`role` text DEFAULT 'editor' NOT NULL,
	`provider` text DEFAULT 'credentials' NOT NULL,
	`github_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_github_id_unique` ON `users` (`github_id`);--> statement-breakpoint
CREATE INDEX `users_role_idx` ON `users` (`role`);