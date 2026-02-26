"use client";

import { useEffect, useRef } from "react";

interface Props {
  baseUrl: string;
}

export function useWebSocket({ baseUrl }: Props) {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(baseUrl);

    ws.current.onopen = () => console.log("Connected");
    ws.current.onclose = () => console.log("Disconnected");
    ws.current.onerror = (error) => console.error("WS Error:", error);

    return () => {
      ws.current?.close();
    };
  }, [baseUrl]);

  const send = (message: unknown) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { ws, send };
}
