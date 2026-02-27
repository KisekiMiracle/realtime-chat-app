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
import { useContext, useEffect, useState } from "react";
import { UserContext, UseUserContext } from "@/app/chat/context";
import axios from "axios";
import { Spinner } from "../ui/spinner";

export default function UserButton() {
  const router = useRouter();
  const [user, setUser] = useState<Record<string, any> | undefined>(undefined);
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
        setUser(undefined);
        setIsLoading(false);
      }
    };
    getUser();
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center gap-1">
        <Spinner /> <span>Loading...</span>{" "}
      </div>
    );

  return (
    <>
      {typeof user === "undefined" ? (
        <div className="flex flex-row items-center gap-2">
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
            size="sm"
            className="flex items-center gap-1 hover:cursor-pointer"
            onClick={() => router.push("/signin")}
          >
            <FeatherIcon icon="log-in" />
            <span>Sign In</span>
          </Button>
        </div>
      ) : (
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
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
