import apiFetch from "../lib/apiFetch";
import qs from "query-string";
import type {
  ImportTokenDistributionTrackingResponse,
  TokenDistributionTrackingResponse,
} from "@/types/tokenDistributionTracking";

export const getTokenDistributionTracking = async (
  page: number,
  limit: number,
  campaignId?: string,
  partnerSlug?: string,
  walletAddress?: string,
) =>
  await apiFetch<TokenDistributionTrackingResponse>(
    `/api/v1/admin/token-distribution-tracking?${qs.stringify({
      "page[number]": page,
      "page[size]": limit,
      "filter[campaign_id]": campaignId,
      "filter[partner_slug]": partnerSlug,
      "filter[wallet_address]": walletAddress,
    })}`,
  );

export const importTokenDistributionTracking = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return await apiFetch<ImportTokenDistributionTrackingResponse>(
    `/api/v1/admin/token-distribution-tracking/import`,
    {
      method: "POST",
      body: formData,
    },
  );
};
