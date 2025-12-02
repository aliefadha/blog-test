/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import ReactMarkdown from 'react-markdown';

import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/intellij-light.css';

interface PostDetailProps {
    post: any
}

export function PostDetail({ post }: PostDetailProps) {
    return (
        <article className="max-w-4xl mx-auto mb-12">
            {/* Header Section */}
            <div className="mb-8">
                {post.tags &&
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="bg-background">
                            {post.tags}
                        </Badge>
                    </div>
                }

                <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{post.title}</h1>

                <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>
            </div>

            {/* Content Section */}
            <Card className="border border-border bg-card p-8 prose prose-invert max-w-none">
                <div className="relative bg-background rounded-lg border border-border overflow-hidden">
                    <Image src={post.image} alt={post.title} width={400} height={192} className="w-full h-48 object-cover" />
                </div>
                <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                        {post.content}
                    </ReactMarkdown>
                </div>
            </Card>
        </article>
    )
}
