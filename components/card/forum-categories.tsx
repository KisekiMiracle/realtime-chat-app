import { client } from "@/app/api/[[...slugs]]/route";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  MessageCircle,
  MessageSquareReply,
  MoveRight,
  StickyNote,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";

export default async function ForumCategories() {
  const categories = (
    await client.query(/* sql */ `
      SELECT 
        c.*,
        p.name AS parent_name,
        p.slug AS parent_slug,
        COUNT(DISTINCT fp.id) AS post_count,
        COALESCE(SUM(fp.reply_count), 0) AS reply_count
      FROM forum_categories c
      LEFT JOIN forum_categories p ON c.parent_id = p.id
      LEFT JOIN forum_posts fp ON fp.category_id = c.id
      GROUP BY c.id, p.name, p.slug, p.display_order
      ORDER BY p.display_order, c.display_order;
    `)
  ).rows;
  const parents = categories.filter((c) => c.parent_id === null);
  const children = categories.filter((c) => c.parent_id !== null);

  const grouped = parents.map((parent) => ({
    ...parent,
    subcategories: children.filter((c) => c.parent_id === parent.id),
  }));

  return (
    <div className="flex flex-col gap-12">
      {grouped.map((parent) => (
        <div key={parent.id} className="flex flex-col gap-4">
          <h2 className="text-2xl lg:text-4xl font-bold border-b-4 w-fit pb-2 border-b-neutral-900">
            {parent.name}
          </h2>
          {parent.subcategories.map((sub: Record<string, string>) => (
            <Card key={sub.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-1">
                  <MessageCircle size={16} />
                  {sub.name}
                </CardTitle>
                <CardDescription>{sub.description}</CardDescription>
                <CardAction>
                  <Link
                    href={`/category/${sub.parent_slug}`}
                    className="flex items-center gap-1 text-xs"
                  >
                    <span>Explore</span>
                    <MoveRight size={16} />
                  </Link>
                </CardAction>
              </CardHeader>
              <CardContent className="flex items-center gap-4 self-end">
                <div className="flex flex-col gap-2 w-36">
                  <span className="flex items-center gap-1 pb-1 text-sm font-semibold border-b border-b-neutral-900">
                    <StickyNote size={16} />
                    Posts
                  </span>
                  <span className="text-xl font-semibold text-neutral-900">
                    {sub.post_count}
                  </span>
                </div>
                <div className="flex flex-col gap-2 w-36">
                  <span className="flex items-center gap-1 pb-1 text-sm font-semibold border-b border-b-neutral-900">
                    <MessageSquareReply size={16} />
                    Replies
                  </span>
                  <span className="font-semibold text-xl text-neutral-900">
                    {sub.reply_count}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}
