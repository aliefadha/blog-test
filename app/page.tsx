import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getAllPosts } from "@/actions/posts/get-all-posts";

export default async function Home() {
  const posts = await getAllPosts()
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Blog</h1>
          <p className="mt-2 text-muted-foreground">Manage and create your blog posts</p>
        </div>
        <Link href="/posts/create">
          <Button
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground transition-colors"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">New Post</span>
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Posts</h2>
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="border border-border bg-card hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Link href={`/posts/${post.slug}`} className="hover:underline">
                        <h3 className="text-lg font-semibold text-foreground truncate transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <Badge
                        variant={
                          post.status === "published" ? "default" : post.status === "scheduled" ? "outline" : "secondary"
                        }
                        className="whitespace-nowrap"
                      >
                        {post.status === "published" ? "Published" : post.status === "scheduled" ? "Scheduled" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                    {/* <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      {post.status === "scheduled" ? (
                        <span className="flex items-center gap-1 text-accent">
                          <Clock className="h-3 w-3" />
                          Publishing {formatDistanceToNow(new Date(post.postedAt), { addSuffix: true })}
                        </span>
                      ) : (
                        <>
                          <span>Created {format(post.createdAt, "MMM d, yyyy")}</span>
                          {post.status === "published" && (
                            <>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {post.views} views
                              </span>
                              <span>{post.reads} reads</span>
                            </>
                          )}
                        </>
                      )}
                    </div> */}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <Edit2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}