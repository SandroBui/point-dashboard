export type UserCampaignPointsStatus = "ACTIVE" | "DISABLED";

export type UserCampaignPointsAttributes = {
  status: UserCampaignPointsStatus;
  user: string;
  campaign: string;
  partner: string;
  vault: string;
  current_points: string;
  lifetime_points: string;
  last_distribution_time: string;
};

export type UserCampaignPointsResource = {
  id: string;
  type: "user-campaign-points";
  attributes: UserCampaignPointsAttributes;
};

export type UserCampaignPointsResponse = {
  data: UserCampaignPointsResource[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type UserCampaignPointsStatsAttributes = {
  total_users: number;
  total_points: string;
  avg_points_per_user: string;
  users_with_points: number;
  zero_point_users: number;
};

export type UserCampaignPointsStatsResource = {
  id: "stats";
  type: "user-campaign-points-stats";
  attributes: UserCampaignPointsStatsAttributes;
};

export type UserCampaignPointsStatsResponse = {
  data: UserCampaignPointsStatsResource;
};
