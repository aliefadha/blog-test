import z from "zod";

export const createPostSchema = z.object({
    title: z
        .string()
        .min(3, "Post title must atleast 3 characters."),
    image: z.union([
        z.instanceof(File, { message: "Image is required" })
            .refine(file => !file || file.size !== 0 || file.size <= 5000000, { message: "Max size exceeded" }),
        z.string().optional()
    ])
        .refine(value => value instanceof File || typeof value === "string", {
            message: "Image is required"
        }),
    excerpt: z
        .string()
        .max(160, "Post excerpt must be 160 characters max"),
    content: z
        .string()
        .min(1, "Post content is required"),
    category: z
        .string(),
    tags: z
        .string()
})

export type CreatePostSchema = z.infer<typeof createPostSchema>