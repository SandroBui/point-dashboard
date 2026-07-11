export type TokenDistributionTrackingAttributes = {
  recipient_wallet_address: string;
  amount: string;
  tx_hash: string;
  campaign_id: string;
  campaign_name: string;
  partner_slug: string;
  created_at: string;
};

export type TokenDistributionTrackingResource = {
  id: string;
  type: "token-distribution-tracking";
  attributes: TokenDistributionTrackingAttributes;
};

export type TokenDistributionTrackingMeta = {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

export type TokenDistributionTrackingResponse = {
  data: TokenDistributionTrackingResource[];
  meta: TokenDistributionTrackingMeta;
};

export type ImportTokenDistributionTrackingResponse = {
  data?: {
    imported?: number;
    skipped_non_success?: number;
    skipped_duplicate?: number;
  };
};
