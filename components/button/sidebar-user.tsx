import FeatherIcon from "feather-icons-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { ChevronsUpDown } from "lucide-react";
import { AvatarImage, AvatarFallback, Avatar } from "../ui/avatar";
import { SidebarMenuButton } from "../ui/sidebar";

interface Props {
  user: Record<string, any>;
}

export default function SidebarUserButton({ user }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg bg-neutral-900 text-white font-bold">
              {user.name.substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="overflow-hidden w-64">
            <div className="flex items-center gap-2 text-ellipsis whitespace-nowrap">
              <FeatherIcon icon="power" className="text-emerald-700 size-4" />
              <span className="font-bold">{user.name}</span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FeatherIcon icon="bar-chart" className="size-4" />
              <span>Online Status</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <FeatherIcon
                        icon="power"
                        className="text-emerald-700 size-4"
                      />
                      <span>Online</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <FeatherIcon
                        icon="power"
                        className="text-amber-700 size-4"
                      />
                      <span>Busy</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <FeatherIcon
                        icon="power"
                        className="text-rose-700 size-4"
                      />
                      <span>Away</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <div className="flex items-center gap-2 w-full">
              <FeatherIcon icon="bell" className="size-4" />
              <div className="flex justify-between w-full">
                <span>Notifications</span>
                <Badge>1</Badge>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FeatherIcon icon="bar-chart" className="size-4" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <FeatherIcon icon="sun" className="size-4" />
                      <span>Light Theme</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <FeatherIcon icon="moon" className="size-4" />
                      <span>Dark Theme</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuItem>
                  <div className="flex items-center gap-2">
                    <FeatherIcon icon="monitor" className="size-4" />
                    <span>System Preference</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link
                href="/user/settings"
                className="flex items-center gap-2 w-full"
              >
                <FeatherIcon icon="settings" className="size-4" />
                <span>User Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(user.id);
                toast.info("User Id copied to clipboard.", {
                  position: "top-right",
                });
              }}
            >
              <FeatherIcon icon="clipboard" className="size-4" />
              <span>Copy User Id</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <FeatherIcon icon="briefcase" className="size-4" />
              <span>Attribution</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <FeatherIcon icon="log-out" className="size-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
