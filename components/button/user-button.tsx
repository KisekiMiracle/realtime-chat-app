"use client";

import FeatherIcon from "feather-icons-react";
import { Button } from "../ui/button";
import {
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  Popover,
} from "../ui/popover";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";

export default function UserButton() {
  const router = useRouter();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full hover:cursor-pointer"
        >
          <FeatherIcon icon="user" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <PopoverHeader>
          <PopoverTitle>User</PopoverTitle>
          <Separator />
          <div className="flex flex-col gap-1">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 hover:cursor-pointer"
              onClick={() => router.push("/signup")}
            >
              <FeatherIcon icon="book-open" />
              <span>Sign Up</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 hover:cursor-pointer"
              onClick={() => router.push("/signin")}
            >
              <FeatherIcon icon="log-in" />
              <span>Sign In</span>
            </Button>
          </div>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}
