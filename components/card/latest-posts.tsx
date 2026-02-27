import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { client } from "@/app/api/[[...slugs]]/route";

export default async function LatestPostsCard() {
  const latestPosts = (
    await client.query(/* sql */ `
        SELECT 
          forum_posts.id,
          forum_posts.title,
          forum_posts.content,
          forum_posts.views,
          forum_posts.reply_count,
          forum_posts.is_pinned,
          forum_posts.is_locked,
          forum_posts.created_at,
          forum_posts.last_reply_at,
          u1.name AS author_name,
          u2.name AS last_reply_by_name,
          fc.name AS category_name,
          fc.slug AS category_slug
        FROM forum_posts
        LEFT JOIN "user" u1 ON forum_posts.author_id = u1.id
        LEFT JOIN "user" u2 ON forum_posts.last_reply_by = u2.id
        LEFT JOIN forum_categories fc ON forum_posts.category_id = fc.id
        ORDER BY COALESCE(forum_posts.last_reply_at, forum_posts.created_at) DESC
        LIMIT 5;
    `)
  ).rows;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Posts</CardTitle>
        <CardDescription>
          What could users be discussing recently?
        </CardDescription>
        <CardAction>
          <Link href="/posts/latest">
            <span className="text-xs flex items-center gap-1">
              See more
              <MoveRight size={16} />
            </span>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {latestPosts.map((post: Record<string, string>) => (
            <Link href={`/posts/${post.id}`}>
              <Card>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{post.content}</CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center gap-1 text-xs">
                  <span>
                    Last reply at:
                    <time>{new Date(post.last_reply_at).toDateString()}</time>
                  </span>
                  <span>by {post.last_reply_by_name}</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
