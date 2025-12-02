"use server"

import { posts } from "@/db/schema"
import { db } from "@/lib/db"

export async function getAllPosts() {
    const data = await db.select().from(posts).orderBy(posts.createdAt)
    return data
}