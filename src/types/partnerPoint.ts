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

export type PartnerPointsResponse = {
  data: PartnerPointResource[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type PartnerPointSingleResponse = {
  data: PartnerPointResource;
};

export type PartnerPointInput = {
  name: string;
  slug: string;
  vault_id?: string | null;
  is_active?: boolean;
  is_exposure?: boolean;
};
