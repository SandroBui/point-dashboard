import apiFetch from "@/lib/apiFetch";
import type {
  FilterListResponse,
  FilterVaultResource,
} from "@/types/filters";

export const getVaultsV2 = async () =>
  await apiFetch<FilterListResponse<FilterVaultResource>>(
    `/api/v1/admin/filters/vaults`,
  );
