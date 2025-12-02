"use server"

import { posts } from "@/db/schema"
import { db } from "@/lib/db"
import { sql } from "drizzle-orm"

export async function getPostBySlug(slug: string) {
    const data = await db.select().from(posts).where(sql`${posts.slug} = ${slug}`).limit(1)
    return data[0]
}