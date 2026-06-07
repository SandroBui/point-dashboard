import { ChevronsLeft, Waypoints } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { navGroups } from "@/constants/dashboard";

export function SidebarContent({
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
    </div>
  );
}
