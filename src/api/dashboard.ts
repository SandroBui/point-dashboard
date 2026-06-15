import apiFetch from "../lib/apiFetch";
import qs from "query-string";
import type {
  DashboardOverviewResponse,
  TopPartnersResponse,
  TopUsersResponse,
  TopVaultsResponse,
} from "@/types/dashboard";

export const getDashboardOverview = async (
  partner?: string,
  vaultId?: string,
  dateFrom?: string,
  dateTo?: string,
  type?: string,
) =>
  await apiFetch<DashboardOverviewResponse>(
    `/api/v1/admin/dashboard/overview?${qs.stringify({
      "filter[partner_slug]": partner,
      "filter[vault_id]": vaultId,
      "filter[from_time]": dateFrom,
      "filter[to_time]": dateTo,
      "filter[point_type_slug]": type,
    })}`,
  );

export const getTopVaults = async (
  page: number,
  limit: number,
  partner?: string,
  vaultId?: string,
  dateFrom?: string,
  dateTo?: string,
  type?: string,
) =>
  await apiFetch<TopVaultsResponse>(
    `/api/v1/admin/dashboard/top-vaults?${qs.stringify({
      "page[number]": page,
      "page[size]": limit,
      "filter[partner_slug]": partner,
      "filter[vault_id]": vaultId,
      "filter[from_time]": dateFrom,
      "filter[to_time]": dateTo,
      "filter[point_type_slug]": type,
    })}`,
  );

export const getTopPartners = async (
  page: number,
  limit: number,
  partner?: string,
  vaultId?: string,
  dateFrom?: string,
  dateTo?: string,
  type?: string,
) =>
  await apiFetch<TopPartnersResponse>(
    `/api/v1/admin/dashboard/top-partners?${qs.stringify({
      "page[number]": page,
      "page[size]": limit,
      "filter[partner_slug]": partner,
      "filter[vault_id]": vaultId,
      "filter[from_time]": dateFrom,
      "filter[to_time]": dateTo,
      "filter[point_type_slug]": type,
    })}`,
  );

export const getTopUsers = async (
  page: number,
  limit: number,
  partner?: string,
  vaultId?: string,
  dateFrom?: string,
  dateTo?: string,
  type?: string,
) =>
  await apiFetch<TopUsersResponse>(
    `/api/v1/admin/dashboard/top-users?${qs.stringify({
      "page[number]": page,
      "page[size]": limit,
      "filter[partner_slug]": partner,
      "filter[vault_id]": vaultId,
      "filter[from_time]": dateFrom,
      "filter[to_time]": dateTo,
      "filter[point_type_slug]": type,
    })}`,
  );
