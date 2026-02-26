import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Tamber",
  description: "...",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
