import { NavGroup } from "@/types/sidebar";
import {
    Boxes,
    Building2,
    ClipboardList,
    FileText,
    LayoutDashboard,
    Settings,
    Shield,
    Users,
    Vault,
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
                title: "User Campaign Points",
                href: "/dashboard/user-campaign-points",
                icon: ClipboardList,
            },
            { title: "User Campaign Point History", href: "/dashboard/user-campaign-points-history", icon: Boxes },
        ],
    },
    // {
    //     title: "Distribution Management",
    //     items: [
    //         { title: "Distributions", href: "/dashboard/distributions", icon: Users },
    //         {
    //             title: "Backfill Jobs",
    //             href: "/dashboard/backfill-jobs",
    //             icon: Shield,
    //         },
    //     ],
    // },
    // {
    //     title: "System",
    //     items: [
    //         { title: "Settings", href: "/dashboard/settings", icon: Settings },
    //         { title: "Audit Logs", href: "/dashboard/audit-logs", icon: Shield },
    //     ],
    // },
];

export const ROW_PER_PAGE = [5, 10, 20, 50];
