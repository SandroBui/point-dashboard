import apiFetch from "@/lib/apiFetch";
import { parseFilename } from "@/lib/download";
import type {
  HistorySortField,
  HistorySortOrder,
  UserCampaignPointHistoryFilters,
  UserCampaignPointHistoryResponse,
} from "@/types/userCampaignPointHistory";
import qs from "query-string";

export const getUserCampaignPointHistory = async (
  page: number,
  limit: number,
  filters: UserCampaignPointHistoryFilters,
  sortField?: HistorySortField,
  sortOrder?: HistorySortOrder,
) => {
  const sort =
    sortField && sortOrder
      ? sortOrder === "desc"
        ? `-${sortField}`
        : sortField
      : undefined;

  return await apiFetch<UserCampaignPointHistoryResponse>(
    `/api/v1/admin/user-campaign-point-history?${qs.stringify({
      "page[number]": page,
      "page[size]": limit,
      "filter[user_address]": filters.userAddress,
      "filter[campaign_id]": filters.campaignId,
      "filter[partner_id]": filters.partnerId,
      "filter[vault_id]": filters.vaultId,
      "filter[from_time]": filters.dateFrom,
      "filter[to_time]": filters.dateTo,
      sort,
    })}`,
  );
};

export const exportUserCampaignPointHistory = async (
  filters: UserCampaignPointHistoryFilters,
  sortField?: HistorySortField,
  sortOrder?: HistorySortOrder,
) => {
  const sort =
    sortField && sortOrder
      ? sortOrder === "desc"
        ? `-${sortField}`
        : sortField
      : undefined;

  const query = qs.stringify({
    "filter[user_address]": filters.userAddress,
    "filter[campaign_id]": filters.campaignId,
    "filter[partner_id]": filters.partnerId,
    "filter[vault_id]": filters.vaultId,
    "filter[from_time]": filters.dateFrom,
    "filter[to_time]": filters.dateTo,
    sort,
  });

  const res = await fetch(
    `/api/v1/admin/user-campaign-point-history/export?${query}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    const message = await res.text().catch(() => "");
    throw new Error(message || `Export failed: ${res.status}`);
  }

  const blob = await res.blob();
  const filename =
    parseFilename(res.headers.get("content-disposition")) ??
    "user-campaign-point-history.csv";

  return { blob, filename };
};
