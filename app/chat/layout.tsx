"use client";

import "../globals.css";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { UserContext } from "./context";
import { AppSidebarRight } from "@/components/app-sidebar-right";

const queryClient = new QueryClient();

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { user }: { user: Record<string, string> } = (
          await axios.get("/api/auth/me", {
            withCredentials: true,
          })
        ).data;
        setUser(user);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isLoading ? (
          <section className="flex flex-col gap-2 items-center justify-center w-full h-screen">
            <Spinner className="size-12" />
            <span className="text-lg font-semibold italic">
              Loading Contents...
            </span>
          </section>
        ) : (
          <SidebarProvider
            style={
              {
                "--sidebar-width": "20rem",
                "--sidebar-width-mobile": "20rem",
              } as React.CSSProperties
            }
          >
            <AppSidebar user={user!} />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
              </header>
              <div className="flex flex-1 flex-col gap-4 p-4">
                <UserContext.Provider value={{ user: user }}>
                  {children}
                </UserContext.Provider>
              </div>
            </SidebarInset>
            <AppSidebarRight />
          </SidebarProvider>
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
