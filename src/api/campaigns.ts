import type {
  Campaign,
  CampaignsResponse,
  CreateCampaignInput,
} from "@/types/campaign";
import apiFetch from "../lib/apiFetch";
import qs from 'query-string';


export const getCampaigns = async (
  page: number,
  limit: number,
  partner?: string,
  search?: string,
  status?: string,
  vaultId?: string,
  dateFrom?: string,
  dateTo?: string,
) =>
  await apiFetch<CampaignsResponse>(
    `/api/v1/admin/point-campaigns?${qs.stringify({
      'page[number]': page,
      'page[size]': limit,
      'filter[partner_slug]': partner,
      'filter[name]': search,
      'filter[status]': status,
      'filter[vault_id]': vaultId,
      'filter[from_time]': dateFrom,
      'filter[to_time]': dateTo,
    })}`,
  );

export const createCampaign = async (input: CreateCampaignInput) =>
  await apiFetch<Campaign>(`/api/v1/admin/point-campaigns`, {
    method: "POST",
    body: JSON.stringify(input),
  });

export const inactiveCampaign = async (id: string) =>
  await apiFetch<Campaign>(`/api/v1/admin/point-campaigns/${id}/inactive`, {
    method: "PATCH",
  });
