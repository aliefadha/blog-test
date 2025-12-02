"use server"
import { posts } from "@/db/schema";
import { createPostSchema } from "@/definitions/create-post";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import xss from "xss";

export type CreatePostResult =
    | { ok: true; message: string }
    | { ok: false; message: string; fieldErrors?: Record<string, string> };

export async function createPost(formData: FormData): Promise<CreatePostResult> {
    const parsed = createPostSchema.safeParse({
        title: formData.get("title"),
        image: formData.get("image"),
        excerpt: formData.get("excerpt"),
        content: formData.get("content"),
        category: formData.get("category"),
        tags: formData.get("tags")
    })

    if (!parsed.success) {
        const issues = parsed.error.flatten();
        return {
            ok: false,
            message: "Validation failed",
            fieldErrors: {
                title: issues.fieldErrors.title?.[0] ?? "",
                image: issues.fieldErrors.image?.[0] ?? "",
                excerpt: issues.fieldErrors.excerpt?.[0] ?? "",
                content: issues.fieldErrors.content?.[0] ?? "",
                category: issues.fieldErrors.category?.[0] ?? "",
                tags: issues.fieldErrors.tags?.[0] ?? "",
            },
        };
    }

    const slug = slugify(parsed.data.title, { lower: true })

    let imagePath: string | null = null;
    if (parsed.data.image instanceof File) {
        const file = parsed.data.image;
        if (file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}_${file.name.replaceAll(" ", "_")}`;
            const uploadDir = path.join(process.cwd(), "public", "uploads");

            await mkdir(uploadDir, { recursive: true });
            await writeFile(path.join(uploadDir, filename), buffer);

            imagePath = `/uploads/${filename}`;
        }
    } else if (typeof parsed.data.image === 'string') {
        imagePath = parsed.data.image;
    }

    await db.insert(posts).values({
        title: parsed.data.title,
        slug: slug,
        excerpt: parsed.data.excerpt,
        category: parsed.data.category,
        tags: parsed.data.tags,
        status: "draft",
        content: xss(parsed.data.content),
        image: imagePath,
        createdAt: new Date()
    })

    revalidatePath('/')
    return { ok: true, message: "Posts added!" };
}
