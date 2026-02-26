"use client";

import SigninForm from "@/components/form/signin-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function SignupPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <section className="w-full h-screen flex items-center justify-center">
        <SigninForm />
      </section>
    </QueryClientProvider>
  );
}
