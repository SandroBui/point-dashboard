import apiFetch from "@/lib/apiFetch";
import { VaultV2Response } from "@/types/vaults";

export const getVaultsV2 = async () =>
    await apiFetch<VaultV2Response>(`/api/v2/vaults/`);
