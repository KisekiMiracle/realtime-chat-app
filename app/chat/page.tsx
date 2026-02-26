import FriendList from "@/components/friend-list";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat | Tamber",
  description: "...",
};

export default function Page() {
  return (
    <div>
      <FriendList />
    </div>
  );
}
