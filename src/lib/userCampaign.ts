
import { UserCampaignPointsStatus } from "@/constants/userCampaignPoints";
import {
    UserCampaignPointsStatus as UserCampaignPointsStatusType,
} from "@/types/userCampaignPoints";

export const statusBadgeVariant = (status: UserCampaignPointsStatusType) => {
    switch (status) {
        case UserCampaignPointsStatus.Active:
            return "success";
        case UserCampaignPointsStatus.Disabled:
            return "muted";
    }
}