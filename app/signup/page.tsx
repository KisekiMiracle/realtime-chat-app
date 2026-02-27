"use client";

import SignupForm from "@/components/form/signup-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function SignupPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <section
        className="w-full h-screen flex items-center justify-center"
        style={{ height: "calc(100dvh - 124px)" }}
      >
        <SignupForm />
      </section>
    </QueryClientProvider>
  );
}
