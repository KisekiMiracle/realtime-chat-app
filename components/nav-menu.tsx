"use client";

import Link from "next/link";
import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useRef,
  type ComponentProps,
} from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { hover, animate } from "motion/react";
import FeatherIcon from "feather-icons-react";
import {
  Bug,
  HeartPlus,
  Info,
  MessageCircle,
  Newspaper,
  ReceiptText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => (
  <div className={cn("flex items-center gap-4 mt-2", props.className)}>
    {/* Regular links outside NavigationMenu */}
    <NavLink
      label="Home"
      href="/"
      icon={<FeatherIcon icon="home" size={16} />}
    />
    <NavLink label="About" href="/about" icon={<Info size={16} />} />
    <NavLink
      label="News and Announcements"
      href="/news-and-announcements"
      icon={<Newspaper size={16} />}
    />
    <NavLink
      label="Chatrooms"
      href="/chat"
      target="_blank"
      icon={<MessageCircle size={16} />}
    />

    {/* Only the dropdown gets NavigationMenu */}
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="p-0 hover:bg-transparent! flex [&>svg]:-mt-1.5">
            <NavLink label="Support Center" icon={<HeartPlus size={16} />} />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-96">
              <ListItem
                href="/report"
                title="Report a bug"
                leadingIcon={<Bug size={16} />}
              >
                Submit a Bug / Error you have found to the developer team. We
                have our users covered.
              </ListItem>
              <ListItem
                href="/contact"
                title="Contact Us"
                leadingIcon={<ReceiptText size={16} />}
              >
                The moderation team is available to listen to your inquiry.
                Remember to not send us spam.
              </ListItem>
              <ListItem
                href="/terms-of-service-and-privacy-policy"
                title="Terms of Service"
                leadingIcon={<ReceiptText size={16} />}
              >
                You must agree with our Terms of Service and Privacy Policy to
                use this platform.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>
);

interface NavLinkProps {
  label: string;
  href?: string;
  target?: "_self" | "_blank";
  icon: React.ReactElement;
}

function NavLink({ label, href, target = "_self", icon }: NavLinkProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    return hover(ref.current!, (element) => {
      animate(element.querySelector("div:last-child"), {
        width: "100%",
      });

      return () => {
        animate(element.querySelector("div:last-child"), {
          width: 0,
        });
      };
    });
  }, []);

  return (
    <div className="flex flex-col gap-1 hover:cursor-pointer" ref={ref}>
      {href ? (
        <>
          <Link
            href={href}
            target={target}
            className="text-sm flex items-center gap-1"
          >
            {icon}
            {label}
          </Link>
          <div className="border-t-2 border-t-neutral-900 w-0" />
        </>
      ) : (
        <>
          <div className="text-sm flex items-center gap-1">
            {icon}
            {label}
          </div>
          <div className="border-t-2 border-t-neutral-900 w-0" />
        </>
      )}
    </div>
  );
}

interface ListItemProps extends ComponentPropsWithoutRef<"li"> {
  leadingIcon: React.ReactElement;
  href: string;
}

function ListItem({
  title,
  leadingIcon,
  children,
  href,
  ...props
}: ListItemProps) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium flex items-center gap-1">
              {leadingIcon}
              <span>{title}</span>
            </div>
            <div className="text-muted-foreground line-clamp-2">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
