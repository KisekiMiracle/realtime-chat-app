"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  user_id: string;
  name: string;
  content: string;
  created_at: number;
}

interface UseChatOptions {
  roomId: string;
  user_id: string;
  name: string;
}

export function useChat({ roomId, user_id, name }: UseChatOptions) {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    ws.current = new WebSocket(
      `ws://${
        process.env.NEXT_PUBLIC_WEBSOCKET_URL!.split("http://")[1] ??
        process.env.NEXT_PUBLIC_WEBSOCKET_URL!.split("https://")[1]
      }/chat/${roomId}`,
    );

    ws.current.onopen = (event) => {
      setConnected(true);
    };
    ws.current.onclose = () => setConnected(false);
    // ws.current.onerror = (e) => console.error("WS error:", e);

    ws.current.onmessage = (event) => {
      const { data, type } = JSON.parse(event.data);

      switch (type) {
        case "history":
          setMessages(data);
          setIsLoading(false);
          break;
        case "message":
          setMessages((prev) => [...prev, data]);
          break;
        case "typing":
          setTypingUsers((prev) => [...prev, data.userId]);
          break;
        case "reaction":
          // handle reaction
          break;
      }
    };

    return () => ws.current?.close();
  }, [roomId]);

  const sendMessage = (content: string) => {
    if (ws.current?.readyState !== WebSocket.OPEN) return;
    ws.current.send(
      JSON.stringify({
        type: "message", // ← this is new
        user_id: user_id,
        name: name,
        content: content,
      }),
    );
  };

  return { messages, sendMessage, connected, isLoading };
}
