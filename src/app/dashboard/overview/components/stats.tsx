import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toFixedNumber, withCommas } from "@/lib/number";
import { DashboardOverviewAttributes } from "@/types/dashboard";
import {
  Coins,
  PlayCircle,
  Vault,
  Waypoints,
  XCircle,
  type LucideIcon,
} from "lucide-react";

interface StatsOverviewProps {
  statsData: DashboardOverviewAttributes;
  isLoading: boolean;
}

const Stat = ({
  title,
  value,
  Icon,
  iconClassName,
  isLoading,
}: {
  title: string;
  value: string;
  Icon: LucideIcon;
  iconClassName: string;
  isLoading: boolean;
}) => {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-3">
        <div
          className={`flex size-9 items-center justify-center rounded-lg ring-1 ${iconClassName}`}
        >
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground">{title}</div>
          <div className="mt-0.5 text-base font-semibold tracking-tight text-foreground sm:text-lg">
            {isLoading ? <Skeleton className="w-full h-7" /> : value}
          </div>
        </div>
      </div>
    </div>
  );
};

export const StatsOverview = ({ statsData, isLoading }: StatsOverviewProps) => {
  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-stretch">
          <Stat
            Icon={Waypoints}
            iconClassName={"bg-blue-500/15 text-blue-500 ring-blue-500/20"}
            title="Total Campaigns"
            isLoading={isLoading}
            value={withCommas(statsData.total_campaigns ?? 0)}
          />
          <Separator className="my-3 sm:hidden" />
          <Separator orientation="vertical" className="mx-4 hidden sm:block" />
          <Stat
            Icon={PlayCircle}
            iconClassName={
              "bg-emerald-500/15 text-emerald-500 ring-emerald-500/20"
            }
            title="Active Campaigns"
            isLoading={isLoading}
            value={withCommas(statsData.active_campaigns ?? 0)}
          />
          <Separator className="my-3 sm:hidden" />
          <Separator orientation="vertical" className="mx-4 hidden sm:block" />
          <Stat
            Icon={XCircle}
            iconClassName={"bg-rose-500/15 text-rose-500 ring-rose-500/20"}
            title="Inactive Campaigns"
            isLoading={isLoading}
            value={withCommas(statsData.inactive_campaigns ?? 0)}
          />
          <Separator className="my-3 sm:hidden" />
          <Separator orientation="vertical" className="mx-4 hidden sm:block" />
          <Stat
            Icon={Vault}
            iconClassName={"bg-amber-500/15 text-amber-500 ring-amber-500/20"}
            title="Active Vaults"
            isLoading={isLoading}
            value={withCommas(statsData.active_vaults ?? 0)}
          />
          <Separator className="my-3 sm:hidden" />
          <Separator orientation="vertical" className="mx-4 hidden sm:block" />
          <Stat
            Icon={Coins}
            iconClassName={
              "bg-violet-500/15 text-violet-500 ring-violet-500/20"
            }
            title="Total Points Distributed"
            isLoading={isLoading}
            value={withCommas(
              toFixedNumber(Number(statsData.total_points_distributed) || 0, 2),
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
