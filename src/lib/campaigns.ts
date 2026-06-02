import type { Campaign, CreateCampaignInput } from "@/types/campaign";
import apiFetch from "./apiFetch";


export async function listCampaigns(): Promise<Campaign[]> {
  return apiFetch<Campaign[]>("/campaigns");
}

export async function createCampaign(
  input: CreateCampaignInput,
): Promise<Campaign> {
  return apiFetch<Campaign>("/campaigns", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function inactiveCampaign(id: string): Promise<Campaign> {
  return apiFetch<Campaign>(`/campaigns/${id}/inactive`, {
    method: "PATCH",
  });
}
