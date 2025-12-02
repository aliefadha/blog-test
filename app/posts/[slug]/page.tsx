import { getPostBySlug } from "@/actions/posts/get-post-by-slug";
import { PostDetail } from "@/components/post-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await getPostBySlug(slug)
    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
                <Link href="/">
                    <Button variant="ghost" className="mb-8 gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </Link>
                <PostDetail post={post} />
            </main>
        </div>
    )
}