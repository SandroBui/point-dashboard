import type {
  Campaign,
  CampaignsResponse,
  CreateCampaignInput,
  ImportCampaignsResponse,
} from "@/types/campaign";
import type {
  FilterCampaignResource,
  FilterListResponse,
} from "@/types/filters";
import apiFetch from "../lib/apiFetch";
import { parseFilename } from "../lib/download";
import qs from "query-string";

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
      "page[number]": page,
      "page[size]": limit,
      "filter[partner_slug]": partner,
      "filter[name]": search,
      "filter[status]": status,
      "filter[vault_id]": vaultId,
      "filter[from_time]": dateFrom,
      "filter[to_time]": dateTo,
    })}`,
  );

export const getFilterCampaigns = async () =>
  await apiFetch<FilterListResponse<FilterCampaignResource>>(
    `/api/v1/admin/filters/campaigns`,
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

export const exportCampaigns = async (filters: {
  partner?: string;
  search?: string;
  status?: string;
  vaultId?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  const query = qs.stringify({
    "filter[partner_slug]": filters.partner,
    "filter[name]": filters.search,
    "filter[status]": filters.status,
    "filter[vault_id]": filters.vaultId,
    "filter[from_time]": filters.dateFrom,
    "filter[to_time]": filters.dateTo,
  });

  const res = await fetch(`/api/v1/admin/point-campaigns/export?${query}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const message = await res.text().catch(() => "");
    throw new Error(message || `Export failed: ${res.status}`);
  }

  const blob = await res.blob();
  const filename =
    parseFilename(res.headers.get("content-disposition")) ??
    "point-campaigns.csv";

  return { blob, filename };
};

export const importCampaigns = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return await apiFetch<ImportCampaignsResponse>(
    `/api/v1/admin/point-campaigns/import`,
    {
      method: "POST",
      body: formData,
    },
  );
};