import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toFixedNumber, withCommas } from "@/lib/number";
import { UserCampaignPointsStatsAttributes } from "@/types/userCampaignPoints";
import {
  Coins,
  User,
  UserCheck,
  UserX,
  Users,
  type LucideIcon,
} from "lucide-react";

interface StatsUserCampaignPointsProps {
  statsData: UserCampaignPointsStatsAttributes;
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
  value: number;
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
            {isLoading ? (
              <Skeleton className="w-full h-7" />
            ) : (
              withCommas(toFixedNumber(value, 2))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const StatsUserCampaignPoints = ({
  statsData,
  isLoading,
}: StatsUserCampaignPointsProps) => {
  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-stretch">
          <Stat
            Icon={Users}
            iconClassName={"bg-blue-500/15 text-blue-500 ring-blue-500/20"}
            title="Total Users"
            isLoading={isLoading}
            value={statsData.total_users ?? 0}
          />
          <Separator className="my-3 sm:hidden" />
          <Separator orientation="vertical" className="mx-4 hidden sm:block" />
          <Stat
            Icon={Coins}
            iconClassName={
              "bg-violet-500/15 text-violet-500 ring-violet-500/20"
            }
            title="Total Points"
            isLoading={isLoading}
            value={Number(statsData.total_points) ?? 0}
          />
          <Separator className="my-3 sm:hidden" />
          <Separator orientation="vertical" className="mx-4 hidden sm:block" />
          <Stat
            Icon={Users}
            iconClassName={"bg-amber-500/15 text-amber-500 ring-amber-500/20"}
            title="Avg. Points per User"
            isLoading={isLoading}
            value={Number(statsData.avg_points_per_user) ?? 0}
          />
          <Separator className="my-3 sm:hidden" />
          <Separator orientation="vertical" className="mx-4 hidden sm:block" />
          <Stat
            Icon={UserCheck}
            iconClassName={
              "bg-emerald-500/15 text-emerald-500 ring-emerald-500/20"
            }
            isLoading={isLoading}
            title="Users With Points"
            value={Number(statsData.users_with_points) ?? 0}
          />
          <Separator className="my-3 sm:hidden" />
          <Separator orientation="vertical" className="mx-4 hidden sm:block" />
          <Stat
            Icon={UserCheck}
            iconClassName={"bg-rose-500/15 text-rose-500 ring-rose-500/20"}
            title="Zero Point Users"
            isLoading={isLoading}
            value={Number(statsData.zero_point_users) ?? 0}
          />
        </div>
      </CardContent>
    </Card>
  );
};
