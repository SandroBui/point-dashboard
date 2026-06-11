export type CampaignStatus = "active" | "inactive";

export type Campaign = CampaignAttributes & {
  id: string;
};

export type CampaignAttributes = {
  name: string;
  description: string;
  status: CampaignStatus;
  multiplier: number;
  start_date: string;
  end_date: string;
  partner_slug: string;
  partner_name: string;
  vault: string;
  pool_address: string;
  point_type_slug: string;
  tags: string[];
  totals_user: number;
  distributed: number;
  created_at: string;
  updated_at: string;
};

export type CreateCampaignInput = {
  name: string;
  pool_address: string;
};

export type PartnersItem = {
  id: number;
  name: string;
  slug: string;
  website: string;
};

export type CampaignResource = {
  id: string;
  type: string;
  attributes: CampaignAttributes;
};

export type CampaignsResponse = {
  data: CampaignResource[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type ImportCampaignsResponse = {
  data?: {
    imported?: number;
    failed?: number;
    [key: string]: unknown;
  };
  message?: string;
};
