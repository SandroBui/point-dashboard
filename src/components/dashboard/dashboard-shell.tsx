"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Boxes,
  Building2,
  ChevronDown,
  ChevronsLeft,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Menu,
  Settings,
  Shield,
  Users,
  Vault,
  Waypoints,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useSession } from "next-auth/react";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard/campaigns",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Campaign Management",
    items: [
      { title: "Campaigns", href: "/dashboard/campaigns", icon: Waypoints },
      {
        title: "Campaign Templates",
        href: "/dashboard/campaign-templates",
        icon: FileText,
      },
      { title: "Vaults", href: "/dashboard/vaults", icon: Vault },
      { title: "Partners", href: "/dashboard/partners", icon: Building2 },
    ],
  },
  {
    title: "Point Management",
    items: [
      {
        title: "User Campaign Points",
        href: "/dashboard/user-campaign-points",
        icon: ClipboardList,
      },
      { title: "Point History", href: "/dashboard/point-history", icon: Boxes },
    ],
  },
  {
    title: "Distribution Management",
    items: [
      { title: "Distributions", href: "/dashboard/distributions", icon: Users },
      {
        title: "Backfill Jobs",
        href: "/dashboard/backfill-jobs",
        icon: Shield,
      },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Settings", href: "/dashboard/settings", icon: Settings },
      { title: "Audit Logs", href: "/dashboard/audit-logs", icon: Shield },
    ],
  },
];

function getActiveTitle(pathname: string) {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (pathname === item.href) return item.title;
    }
  }
  return "Dashboard";
}

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Waypoints className="size-4" />
          </span>
          <span className="text-sm">Point System</span>
        </div>
        <div className="ml-auto hidden lg:flex">
          <Button variant="ghost" size="icon" aria-label="Collapse sidebar">
            <ChevronsLeft className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-2 py-4">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-5">
            <div className="px-3 pb-2 text-xs font-medium text-sidebar-foreground/60">
              {group.title.toUpperCase()}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    <span className="truncate">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex justify-between items-center gap-2 rounded-lg bg-sidebar-accent/40 px-3 py-2">
          <span className="text-sm text-sidebar-foreground/80">Theme</span>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const title = getActiveTitle(pathname);
  const { data: session, status: sessionStatus } = useSession();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside className="hidden w-[270px] shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:block">
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
                  <DropdownMenuItem>
                    <span className="text-red-500">Logout</span>
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
          <div className="absolute inset-y-0 left-0 w-[270px] border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl">
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
