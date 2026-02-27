"use client";

import SigninForm from "@/components/form/signin-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function SignupPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <section
        className="w-full flex items-center justify-center"
        style={{ height: "calc(100dvh - 124px)" }}
      >
        <SigninForm />
      </section>
    </QueryClientProvider>
  );
}
