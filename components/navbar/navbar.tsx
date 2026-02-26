import Link from "next/link";
import UserButton from "../button/user-button";

interface Props {
  user: Record<string, string>;
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 self-center w-8/12 py-4 flex gap-16 items-center justify-between">
      <span className="font-extrabold text-2xl">Tamber</span>
      <ul className="w-full flex items-center gap-4 text-sm mt-1">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/changelog">Changelog</Link>
      </ul>
      <UserButton />
    </nav>
  );
}
