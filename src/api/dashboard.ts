import apiFetch from "../lib/apiFetch";
import qs from "query-string";
import type {
  DashboardOverviewResponse,
  TopPartnersResponse,
  TopUsersResponse,
  TopVaultsResponse,
} from "@/types/dashboard";

export const getDashboardOverview = async () =>
  await apiFetch<DashboardOverviewResponse>(`/api/v1/admin/dashboard/overview`);

export const getTopVaults = async (page: number, limit: number) =>
  await apiFetch<TopVaultsResponse>(
    `/api/v1/admin/dashboard/top-vaults?${qs.stringify({
      "page[number]": page,
      "page[size]": limit,
    })}`,
  );

export const getTopPartners = async (page: number, limit: number) =>
  await apiFetch<TopPartnersResponse>(
    `/api/v1/admin/dashboard/top-partners?${qs.stringify({
      "page[number]": page,
      "page[size]": limit,
    })}`,
  );

export const getTopUsers = async (page: number, limit: number) =>
  await apiFetch<TopUsersResponse>(
    `/api/v1/admin/dashboard/top-users?${qs.stringify({
      "page[number]": page,
      "page[size]": limit,
    })}`,
  );
