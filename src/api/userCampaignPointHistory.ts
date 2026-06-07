import apiFetch from "@/lib/apiFetch";
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
