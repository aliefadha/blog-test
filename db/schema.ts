import { pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const postsStatus = pgEnum("status", ["draft", "scheduled", "published", "archived"]);

export const posts = pgTable("posts", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    image: varchar("image"),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    category: varchar("category").notNull(),
    tags: varchar("tags"),
    status: postsStatus().default("draft"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    postedAt: timestamp("posted_at")
});