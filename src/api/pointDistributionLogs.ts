import apiFetch from "../lib/apiFetch";
import qs from "query-string";
import { PointDistributionLogsDetailResponse, PointDistributionLogsResponse } from "@/types/pointDistributionLogs";

export const getPointDistributionLogs = async (
  page: number,
  limit: number,
  partner?: string,
  event?: string,
  level?: string,
  vaultId?: string,
  campaignId?: string,
) =>
  await apiFetch<PointDistributionLogsResponse>(
    `/api/v1/admin/point-distribution-log?${qs.stringify({
      "page[number]": page,
      "page[size]": limit,
      "filter[partner_slug]": partner,
      "filter[vault_id]": vaultId,
      "filter[point_campaign_id]": campaignId,
      "filter[level]": level,
      "filter[event]": event,
    })}`,
  );


export const getPointDistributionLogDetail = async (logId: string) => {
  const res = await apiFetch<PointDistributionLogsDetailResponse>(
    `/api/v1/admin/point-distribution-log/${logId}`,
  );
  return res;
};