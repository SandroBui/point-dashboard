import apiFetch from "@/lib/apiFetch";
import { parseFilename } from "@/lib/download";
import type {
  PointDistributionHistoryFilters,
  PointDistributionHistoryResource,
  PointDistributionHistoryResponse,
} from "@/types/pointDistributionHistory";
import qs from "query-string";

export const getPointDistributionHistory = async (
  page: number,
  limit: number,
  filters: PointDistributionHistoryFilters,
) => {
  return await apiFetch<PointDistributionHistoryResponse>(
    `/api/v1/admin/point-distribution-history?${qs.stringify({
      "page[number]": page,
      "page[size]": limit,
      "filter[vault_id]": filters.vaultId,
      "filter[campaign_id]": filters.campaignId,
      "filter[partner_id]": filters.partnerId,
      "filter[from_time]": filters.dateFrom,
      "filter[to_time]": filters.dateTo,
    })}`,
  );
};

export const exportPointDistributionHistory = async (
  filters: PointDistributionHistoryFilters,
) => {
  const query = qs.stringify({
    "filter[vault_id]": filters.vaultId,
    "filter[campaign_id]": filters.campaignId,
    "filter[partner_id]": filters.partnerId,
    "filter[from_time]": filters.dateFrom,
    "filter[to_time]": filters.dateTo,
  });

  const res = await fetch(
    `/api/v1/admin/point-distribution-history/export?${query}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    const message = await res.text().catch(() => "");
    throw new Error(message || `Export failed: ${res.status}`);
  }

  const blob = await res.blob();
  const filename =
    parseFilename(res.headers.get("content-disposition")) ??
    "point-distribution-history.csv";

  return { blob, filename };
};

export const getPointDistributionHistoryDetail = async (id: string) => {
  const res = await apiFetch<{
    data: PointDistributionHistoryResource;
  }>(`/api/v1/admin/point-distribution-history/${id}`);
  return res;
};
