"use client";

import { createContext, useContext } from "react";

export const UserContext = createContext<Record<string, any> | undefined>(
  undefined,
);

export function UseUserContext(): Record<string, any> {
  const context = useContext(UserContext);

  if (context === undefined)
    throw new Error("You must provide a User to UserContext.");

  return context.user;
}

export const WebsocketContext = createContext(undefined);

export function UseWebsocketContext() {
  const context = useContext(WebsocketContext);

  if (context === undefined)
    throw new Error(
      "You must provide a Websocket connection to WebsocketContext",
    );

  return context;
}
