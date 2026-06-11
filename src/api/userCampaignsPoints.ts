import apiFetch from "../lib/apiFetch";
import qs from "query-string";
import {
  ImportUserCampaignPointsResponse,
  UserCampaignPointsResponse,
  UserCampaignPointsStatsResponse,
} from "@/types/userCampaignPoints";
import { parseFilename } from "@/lib/download";

export const getUserCampaignPoints = async (
  page: number,
  limit: number,
  partner?: string,
  search?: string,
  status?: string,
  vaultId?: string,
  minPoints?: string,
  maxPoints?: string,
  campaignId?: string,
) =>
  await apiFetch<UserCampaignPointsResponse>(
    `/api/v1/admin/user-campaign-points?${qs.stringify({
      "page[number]": page,
      "page[size]": limit,
      "filter[partner_slug]": partner,
      "filter[user_address]": search,
      "filter[status]": status,
      "filter[vault_id]": vaultId,
      "filter[campaign_id]": campaignId,
      "filter[min_points]": minPoints,
      "filter[max_points]": maxPoints,
    })}`,
  );

export const getStatsUserCampaignPoints = async (
  partner?: string,
  search?: string,
  status?: string,
  vaultId?: string,
  minPoints?: string,
  maxPoints?: string,
  campaignId?: string,
) =>
  await apiFetch<UserCampaignPointsStatsResponse>(
    `/api/v1/admin/user-campaign-points/stats?${qs.stringify({
      "filter[partner_slug]": partner,
      "filter[user_address]": search,
      "filter[status]": status,
      "filter[vault_id]": vaultId,
      "filter[campaign_id]": campaignId,
      "filter[min_points]": minPoints,
      "filter[max_points]": maxPoints,
    })}`,
  );

export const exportUserCampaignPoints = async (
  partner?: string,
  search?: string,
  status?: string,
  vaultId?: string,
  minPoints?: string,
  maxPoints?: string,
  campaignId?: string,
) => {
  const query = qs.stringify({
    "filter[partner_slug]": partner,
    "filter[user_address]": search,
    "filter[status]": status,
    "filter[vault_id]": vaultId,
    "filter[campaign_id]": campaignId,
    "filter[min_points]": minPoints,
    "filter[max_points]": maxPoints,
  });

  const res = await fetch(
    `/api/v1/admin/user-campaign-points/export?${query}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    const message = await res.text().catch(() => "");
    throw new Error(message || `Export failed: ${res.status}`);
  }

  const blob = await res.blob();
  const filename =
    parseFilename(res.headers.get("content-disposition")) ??
    "user-campaign-points.csv";

  return { blob, filename };
};

export const importUserCampaignPoints = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return await apiFetch<ImportUserCampaignPointsResponse>(
    `/api/v1/admin/user-campaign-points/import`,
    {
      method: "POST",
      body: formData,
    },
  );
};