"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";

import { getCampaignDetail, updateCampaign } from "@/api/campaigns";
import { CampaignForm } from "../../components/campaign-form";
import { CreateCampaignInput } from "@/types/campaign";
import { normalizeUtcStringToIso } from "@/lib/date";

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data: campaign, isLoading } = useSWR(
    id ? ["campaign-detail", id] : null,
    ([, campaignId]) => getCampaignDetail(campaignId),
  );

  const defaultValues = useMemo(() => {
    const attrs = campaign?.data?.attributes;
    if (!attrs) return undefined;
    return {
      name: attrs.name ?? "",
      partner_slug: attrs.partner_slug ?? "",
      point_type_slug: attrs.point_type_slug ?? "",
      pool_address: attrs.pool_address ?? "",
      vault_id: attrs.vault_id ?? "",
      multiplier: attrs.multiplier ?? 1,
      start_date: normalizeUtcStringToIso(attrs.start_date),
      end_date: normalizeUtcStringToIso(attrs.end_date),
      description: attrs.description ?? "",
      tags: attrs.tags ?? [],
      status: attrs.status ?? "active",
    };
  }, [campaign?.data?.attributes]);

  const onSubmit = async (payload: CreateCampaignInput) => {
    if (!id) return;
    const toastId = toast.loading("Saving campaign...");
    try {
      await updateCampaign(id, payload);
      toast.success("Campaign updated", { id: toastId });
      router.push(`/dashboard/campaigns/${id}`);
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Update campaign failed";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <CampaignForm
      title="Edit Campaign"
      subtitle="Update campaign configuration"
      submitLabel="Save"
      isLoading={isLoading || !defaultValues}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
    />
  );
}
