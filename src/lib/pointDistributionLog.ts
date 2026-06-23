import { PointDistributionLogsEvent } from "@/constants/pointDistributionLogs";

export const levelBadgeVariant = (level: string) => {
    switch (level) {
        case PointDistributionLogsEvent.Error:
            return "destructive";
        case PointDistributionLogsEvent.Warning:
            return "warning";
        default:
            return "default";
    }
};