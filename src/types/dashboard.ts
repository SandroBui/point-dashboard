export type DashboardPaginationMeta = {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

export type DashboardOverviewAttributes = {
  total_campaigns: number;
  active_campaigns: number;
  inactive_campaigns: number;
  active_vaults: number;
  total_points_distributed: string;
};

export type DashboardOverviewResource = {
  id: string;
  type: "dashboard-overview";
  attributes: DashboardOverviewAttributes;
};

export type DashboardOverviewResponse = {
  data: DashboardOverviewResource;
};

export type TopVaultAttributes = {
  vault: string;
  vault_id: string;
  total_points: string;
  campaigns: string[];
};

export type TopVaultResource = {
  id: string;
  type: "top-vaults";
  attributes: TopVaultAttributes;
};

export type TopVaultsResponse = {
  data: TopVaultResource[];
  meta: DashboardPaginationMeta;
};

export type TopPartnerAttributes = {
  partner: string;
  partner_slug: string;
  total_points: string;
  vaults: string[];
};

export type TopPartnerResource = {
  id: string;
  type: "top-partners";
  attributes: TopPartnerAttributes;
};

export type TopPartnersResponse = {
  data: TopPartnerResource[];
  meta: DashboardPaginationMeta;
};

export type TopUserAttributes = {
  user: string;
  total_points: string;
};

export type TopUserResource = {
  id: string;
  type: "top-users";
  attributes: TopUserAttributes;
};

export type TopUsersResponse = {
  data: TopUserResource[];
  meta: DashboardPaginationMeta;
};
