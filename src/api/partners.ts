import apiFetch from "@/lib/apiFetch";
import { PartnersItem } from "@/types/campaign";

export const getPartners = async () =>
    await apiFetch<PartnersItem[]>(`/api/v1/opportunities/partners`);
