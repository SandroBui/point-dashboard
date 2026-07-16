import { NavGroup } from "@/types/sidebar";
import {
  Boxes,
  Building2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogsIcon,
  Waypoints,
} from "lucide-react";

export const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard/overview",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Campaign Management",
    items: [
      { title: "Campaigns", href: "/dashboard/campaigns", icon: Waypoints },
      {
        title: "Partners Source",
        href: "/dashboard/partners-source",
        icon: Building2,
      },
    ],
  },
  {
    title: "Point Management",
    items: [
      {
        title: "User Point Ledger",
        href: "/dashboard/user-point-ledger",
        icon: ClipboardList,
      },
      {
        title: "User Point Ledger History",
        href: "/dashboard/user-point-ledger-history",
        icon: Boxes,
      },
    ],
  },
  {
    title: "Distribution Management",
    items: [
      {
        title: "Point Distribution History",
        href: "/dashboard/point-distribution-history",
        icon: FileText,
      },
      {
        title: "Token Distribution History",
        href: "/dashboard/token-distribution-history",
        icon: FileText,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Point Distribution Logs",
        href: "/dashboard/point-distribution-logs",
        icon: LogsIcon,
      },
    ],
  },
];

export const ROW_PER_PAGE = [5, 10, 20, 50];
