import ChatRoom from "@/components/chat/chat";
import type { Metadata } from "next";
import { UserContext } from "../../context";

export const metadata: Metadata = {
  title: "Chat | Tamber",
  description: "...",
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <section className="xl:max-w-8/12 w-full self-center">
      <ChatRoom />
    </section>
  );
}
