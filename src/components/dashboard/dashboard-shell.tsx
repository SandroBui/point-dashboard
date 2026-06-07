"use client";

import * as React from "react";

import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Menu } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { SidebarContent } from "./sidebar-content";
import { navGroups } from "@/constants/dashboard";
import { ModeToggle } from "../mode-toggle";

function getActiveTitle(pathname: string) {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (pathname === item.href) return item.title;
    }
  }
  return "Dashboard";
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const title = getActiveTitle(pathname);
  const { data: session, status: sessionStatus } = useSession();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside className="hidden w-67.5 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:block">
          <SidebarContent pathname={pathname} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur lg:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-4" />
            </Button>

            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-semibold">{title}</span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <ModeToggle />
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="size-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={
                    "flex items-center gap-3 hover:bg-muted px-3 py-2 rounded-lg transition-colors"
                  }
                >
                  {sessionStatus === "loading" ? (
                    <>
                      <span className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                      <div className="text-left hidden sm:block">
                        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                      </div>
                      <span className="w-4 h-4 rounded bg-muted animate-pulse" />
                    </>
                  ) : (
                    <>
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={session?.user?.image ?? ""}
                          alt="Admin User"
                        />
                        <AvatarFallback>{session?.user?.name}</AvatarFallback>
                      </Avatar>
                      <div className="text-left hidden sm:block">
                        <p className="text-sm font-medium text-foreground">
                          {session?.user?.name}
                        </p>
                        {/* <p className="text-xs text-muted-foreground">Super Admin</p> */}
                      </div>
                      <ChevronDown
                        size={16}
                        className="text-muted-foreground"
                      />
                    </>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {/* <DropdownMenuItem>
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator /> */}
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => signOut({ callbackUrl: "/sign-in" })}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-67.5 border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl">
            <SidebarContent
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { DashboardShell };
