export type FilterPartnerResource = {
  id: string;
  type: "filter-partners";
  attributes: { partner_slug: string; name: string };
};

export type FilterVaultResource = {
  id: string;
  type: "filter-vaults";
  attributes: { vault_id: string; name: string };
};

export type FilterCampaignResource = {
  id: string;
  type: "filter-campaigns";
  attributes: { campaign_id: string; name: string };
};

export type FilterListResponse<T> = { data: T[] };
