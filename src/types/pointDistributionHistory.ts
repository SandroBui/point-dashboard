export type PointDistributionHistoryAttributes = {
  vault: string;
  campaign: string | null;
  partner: string;
  point: number;
  created_at: string;
};

export type PointDistributionHistoryResource = {
  id: string;
  type: "point-distribution-history";
  attributes: PointDistributionHistoryAttributes;
};

export type PointDistributionHistoryResponse = {
  data: PointDistributionHistoryResource[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type PointDistributionHistoryFilters = {
  vaultId?: string;
  campaignId?: string;
  partnerId?: string;
  dateFrom?: string;
  dateTo?: string;
};
