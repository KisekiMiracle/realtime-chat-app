"use client";

import { createContext, useContext } from "react";

export const LatestPostsContext = createContext<
  Record<string, string> | undefined
>(undefined);

export function useLatestPostsContext(): Record<string, any> {
  const context = useContext(LatestPostsContext);

  if (context === undefined)
    throw new Error(
      "You must provide a list of Latest Posts to UseLatestPostsContext.",
    );

  return context;
}
