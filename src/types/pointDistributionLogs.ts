

export type PointDistributionLogsAttributes = {
  run_id: string;
  vault_id: string | null;
  vault_name: string | null;
  partner_slug: string | null;
  partner_name: string | null;
  point_campaign_id: string | null;
  point_campaign_name: string | null;
  level: string;
  event: string;
  message: string;
  metadata: Record<string, number | string>;
  created_at: string;
};

export type PointDistributionLogsResource = {
  id: string;
  type: "point-distribution-log";
  attributes: PointDistributionLogsAttributes;
};

export type PointDistributionLogsResponse = {
  data: PointDistributionLogsResource[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type PointDistributionLogsDetailResponse = {
  data: PointDistributionLogsResource;
};