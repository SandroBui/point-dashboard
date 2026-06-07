import apiFetch from "@/lib/apiFetch";
import type {
  FilterListResponse,
  FilterPartnerResource,
} from "@/types/filters";

export const getPartners = async () =>
  await apiFetch<FilterListResponse<FilterPartnerResource>>(
    `/api/v1/admin/filters/partners`,
  );
