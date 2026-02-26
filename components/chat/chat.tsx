"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useChat } from "@/hooks/use-chat";
import { UserContext, UseUserContext } from "@/app/chat/context";
import { Spinner } from "../ui/spinner";

export default function ChatRoom() {
  const user = UseUserContext();
  const { slug } = useParams<{ slug: string }>();
  const [input, setInput] = useState("");
  const lastMessage = useRef<HTMLDivElement | null>(null);

  // Replace with your actual user context
  const { messages, sendMessage, connected, isLoading } = useChat({
    roomId: slug,
    user_id: user.id,
    name: user.name,
  });

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
    lastMessage.current!.scrollIntoView();
  };

  useEffect(() => {
    if (!isLoading) {
      lastMessage.current!.scrollIntoView();
    }
  }, [isLoading, messages]);

  return (
    <>
      {isLoading ? (
        <div className="flex items-center gap-1">
          <Spinner />
          <span>Loading...</span>
        </div>
      ) : (
        <div
          className="flex flex-col p-4 overflow-y-hidden"
          style={{ height: "calc(100dvh - 96px)" }}
        >
          <div className="text-sm mb-2">
            Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4">
            {messages.map((msg, i) => (
              <div key={i} className="flex flex-col wrap-break-word">
                <span className="text-xs text-gray-400">
                  {msg.name} · {new Date(msg.created_at).toLocaleTimeString()}
                </span>
                <span>{msg.content}</span>
              </div>
            ))}
            <div ref={lastMessage} />
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 border rounded px-3 py-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
