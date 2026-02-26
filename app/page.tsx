import SignupForm from "@/components/form/signup-form";
import Navbar from "@/components/navbar/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Tamber",
  description: "...",
};

export default function Home() {
  return (
    <section className="w-full flex flex-col">
      <Navbar />
      <h1>Home</h1>
    </section>
  );
}
