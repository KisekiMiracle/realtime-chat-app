import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import SidebarUserButton from "./button/sidebar-user";
import { ChevronDown } from "feather-icons-react";
import {
  CollapsibleTrigger,
  CollapsibleContent,
  Collapsible,
} from "./ui/collapsible";

export function AppSidebar({ user }: { user: Record<string, any> }) {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="">
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                <span>Members - </span>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/chat">Global Channel</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter className="">
        <SidebarUserButton user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
