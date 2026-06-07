import apiFetch from "../lib/apiFetch";
import qs from "query-string";
import { UserCampaignPointsResponse, UserCampaignPointsStatsResponse } from "@/types/userCampaignPoints";

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