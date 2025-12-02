/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @next/next/no-img-element */
"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, ImageIcon, Tag, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import React, { startTransition, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema, CreatePostSchema } from "@/definitions/create-post";
import { createPost, CreatePostResult } from "@/actions/posts/create-post";
import { redirect } from "next/navigation";


export default function CreatePostPage() {
    const form = useForm<CreatePostSchema>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            title: "",
            excerpt: "",
            content: "",
            tags: "",
            category: "",
        }
    })

    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const imageWatch = form.watch("image");

    useEffect(() => {
        if (imageWatch instanceof File) {
            const url = URL.createObjectURL(imageWatch);
            setImagePreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else if (typeof imageWatch === "string" && imageWatch) {
            setImagePreviewUrl(imageWatch);
        } else {
            setImagePreviewUrl(null);
        }
    }, [imageWatch]);

    const handleRemoveImage = () => {
        form.setValue("image", "");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setImagePreviewUrl(null);
    };

    function onSubmit(data: CreatePostSchema) {
        toast("You submitted the following values:", {
            description: (
                <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
                    <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
            position: "bottom-right",
            classNames: {
                content: "flex flex-col gap-2",
            },
            style: {
                "--border-radius": "calc(var(--radius)  + 4px)",
            } as React.CSSProperties,
        })

        const fd = new FormData();
        fd.set("title", data.title)
        fd.set("excerpt", data.excerpt)
        fd.set("category", data.category)
        fd.set("tags", data.tags)
        fd.set("image", data.image || "")
        fd.set("content", data.content)

        startTransition(async () => {
            const result: CreatePostResult = await createPost(fd);
            if (!result.ok) {
                toast.error(result.message);
                return;
            }
            toast.success(result.message);
            form.reset();
            redirect('/')
        })
    }

    return (
        <div className="min-h-screen bg-background py-2 px-4 sm:px-6 lg:px-8">
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 max-w-7xl mx-auto"
            >
                <Card className="bg-card p-8 border border-border">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Post Content</h2>
                    <div className="space-y-6">
                        {/* Title */}
                        <FieldGroup>
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                                        <Input
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Post title"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        {/* Featured Image */}
                        <div className="space-y-3">
                            {imagePreviewUrl && (
                                <div className="relative mt-4 bg-background rounded-lg border border-border overflow-hidden">
                                    <img
                                        src={imagePreviewUrl}
                                        alt="Featured image preview"
                                        className="w-full h-48 object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 bg-background/90 hover:bg-background p-1 rounded border border-border"
                                    >
                                        <X className="h-4 w-4 text-foreground" />
                                    </button>
                                </div>
                            )}
                            <Controller
                                name="image"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Featured Image</FieldLabel>
                                        <label className="px-4 py-2 bg-background border border-border rounded-md hover:bg-accent/10 cursor-pointer transition-colors flex items-center gap-2 disabled:opacity-50">
                                            <ImageIcon className="h-4 w-4" />
                                            <span className="text-sm font-medium hidden sm:inline">Upload</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        field.onChange(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                        <FieldDescription className="text-xs text-muted-foreground">
                                            Upload an image or paste a URL. Max size: 5MB. Supported formats: JPG, PNG, WebP, GIF
                                        </FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>

                        {/* Excerpt */}
                        <div>
                            <Controller
                                name="excerpt"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Excerpt</FieldLabel>
                                        <Textarea
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Write a brief summary of your post (appears in listings)"
                                            autoComplete="off"
                                            className="w-full min-h-24"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        <p className="text-xs text-muted-foreground mt-1">{field.value?.length}/160 characters</p>
                                    </Field>
                                )}
                            />

                        </div>

                        {/* Content */}
                        <div>
                            <Controller
                                name="content"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Post Content*</FieldLabel>
                                        <Textarea
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Write your full post content here..."
                                            autoComplete="off"
                                            className="w-full min-h-96 font-mono text-sm"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        <p className="text-xs text-muted-foreground mt-1">{field.value?.length} characters</p>
                                    </Field>
                                )}
                            />
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category */}
                    <Card className="bg-card p-6 border border-border">
                        <Controller
                            name="category"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}><h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                                        <Tag className="h-4 w-4" />
                                        Category
                                    </h3>
                                    </FieldLabel>
                                    <select
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                    >
                                        <option value="">All</option>
                                        <option>Technology</option>
                                        <option>Business</option>
                                        <option>Lifestyle</option>
                                        <option>Travel</option>
                                        <option>Food</option>
                                        <option>Health</option>
                                        <option>Other</option>
                                    </select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </Card>

                    {/* Tags */}
                    <Card className="bg-card p-6 border border-border">
                        <Controller
                            name="tags"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <Tag className="h-4 w-4" />
                                            Tags
                                        </h3>
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        placeholder="Add tags (comma separated)"
                                        className="w-full text-sm"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {(field.value ?? "").split(",").filter((t) => t.trim()).length} tags added
                                    </p>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                    </Card>
                </div>

                {/* Publishing Options */}
                <Card className="bg-card p-6 border border-border">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Publishing
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <Input
                                    type="radio"
                                    name="publishType"
                                    value="now"
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-foreground">Publish immediately</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <Input
                                    type="radio"
                                    name="publishType"
                                    value="scheduled"
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-foreground">Schedule for later</span>
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-border">
                            <Button type="button" variant="outline">
                                Save as Draft
                            </Button>
                            <Button
                                type="submit"
                                className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1"
                            >
                                Create & Publish
                            </Button>
                        </div>
                    </div>
                </Card>
            </form>
        </div>
    )
}