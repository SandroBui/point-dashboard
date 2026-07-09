import type {
  PartnerPointInput,
  PartnerPointSingleResponse,
  PartnerPointsResponse,
  PartnerPointSummariesResponse,
} from "@/types/partnerPoint";
import apiFetch from "../lib/apiFetch";
import qs from "query-string";

export const getPartnerPoints = async (
  page: number,
  limit: number,
  partnerSlug?: string,
  partnerName?: string,
  status?: string,
  vaultId?: string,
) =>
  await apiFetch<PartnerPointsResponse>(
    `/api/v1/admin/partner-points?${qs.stringify({
      "page[number]": page,
      "page[size]": limit,
      "filter[partner_slug]": partnerSlug,
      "filter[partner_name]": partnerName,
      "filter[status]": status,
      "filter[vault_id]": vaultId,
    })}`,
  );

export const createPartnerPoint = async (input: PartnerPointInput) =>
  await apiFetch<PartnerPointSingleResponse>(`/api/v1/admin/partner-points`, {
    method: "POST",
    body: JSON.stringify(input),
  });

export const updatePartnerPoint = async (
  id: string,
  input: Partial<PartnerPointInput>,
) =>
  await apiFetch<PartnerPointSingleResponse>(
    `/api/v1/admin/partner-points/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );

export const getSummaryPartnerPoints = async (
  page: number,
  limit: number,
  partnerName?: string,
) =>
  await apiFetch<PartnerPointSummariesResponse>(
    `/api/v1/admin/partner-points/summary?${qs.stringify({
      "page[number]": page,
      "page[size]": limit,
      "filter[partner_name]": partnerName,
    })}`,
  );
