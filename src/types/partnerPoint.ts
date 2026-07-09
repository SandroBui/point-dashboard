export type PartnerPointAttributes = {
  name: string;
  slug: string;
  vault_id: string | null;
  vault_name: string | null;
  is_active: boolean;
  is_exposure: boolean;
  created_at: string;
  updated_at: string;
};

export type PartnerPointResource = {
  id: string;
  type: string;
  attributes: PartnerPointAttributes;
};

export type PaginationMeta = {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

export type PartnerPointsResponse = {
  data: PartnerPointResource[];
  meta: PaginationMeta;
};

export type PartnerPointSingleResponse = {
  data: PartnerPointResource;
};

export type PartnerPointSummaryAttributes = {
  partner_name: string;
  partner_slug: string;
  total_point: string;
  total_vault: number;
};

export type PartnerPointSummaryResource = {
  id: string;
  type: string;
  attributes: PartnerPointSummaryAttributes;
};

export type PartnerPointSummariesResponse = {
  data: PartnerPointSummaryResource[];
  meta: PaginationMeta;
};

export type PartnerPointInput = {
  name: string;
  slug: string;
  vault_id?: string | null;
  is_active?: boolean;
  is_exposure?: boolean;
};
