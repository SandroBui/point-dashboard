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
            // {
            //     title: "Campaign Templates",
            //     href: "/dashboard/campaign-templates",
            //     icon: FileText,
            // },
            // { title: "Vaults", href: "/dashboard/vaults", icon: Vault },
            // { title: "Partners", href: "/dashboard/partners", icon: Building2 },
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
            { title: "User Point Ledger History", href: "/dashboard/user-point-ledger-history", icon: Boxes },
            {
                title: "Point Distribution History",
                href: "/dashboard/point-distribution-history",
                icon: FileText,
            },
        ],
    },
    {
        title: "Distribution Management",
        items: [
            // { title: "Distributions", href: "/dashboard/distributions", icon: Users },
            // {
            //     title: "Backfill Jobs",
            //     href: "/dashboard/backfill-jobs",
            //     icon: Shield,
            // },
            {
                title: "Point Distribution Logs",
                href: "/dashboard/point-distribution-logs",
                icon: LogsIcon,
            },

        ],
    },
    // {
    //     title: "System",
    //     items: [
    //         { title: "Settings", href: "/dashboard/settings", icon: Settings },
    //         { title: "Audit Logs", href: "/dashboard/audit-logs", icon: Shield },
    //     ],
    // },
];

export const ROW_PER_PAGE = [5, 10, 20, 50];
