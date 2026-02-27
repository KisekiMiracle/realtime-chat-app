import axios from "axios";

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

export default async function LatestPostsCard() {
  const latestPosts = (
    await axios.get(`${process.env.BACKEND_URL}/api/posts/latest`)
  ).data;

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
