export type UserCampaignPointHistoryAttributes = {
  user: string;
  campaign: string;
  points_delta: string;
  note: string | null;
  created_at: string;
};

export type UserCampaignPointHistoryResource = {
  id: string;
  type: "user-campaign-point-history";
  attributes: UserCampaignPointHistoryAttributes;
};

export type UserCampaignPointHistoryResponse = {
  data: UserCampaignPointHistoryResource[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type HistorySortField = "created_at" | "points_delta";
export type HistorySortOrder = "asc" | "desc";

export type UserCampaignPointHistoryFilters = {
  userAddress?: string;
  campaignId?: string;
  partnerId?: string;
  vaultId?: string;
  dateFrom?: string;
  dateTo?: string;
};
