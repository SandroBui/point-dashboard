"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createCampaign } from "@/api/campaigns";
import { CampaignForm } from "../components/campaign-form";
import { CreateCampaignInput } from "@/types/campaign";

export default function CreateCampaignPage() {
  const router = useRouter();

  const onSubmit = async (payload: CreateCampaignInput) => {
    const toastId = toast.loading("Creating campaign...");
    try {
      await createCampaign(payload);
      toast.success("Campaign created", { id: toastId });
      router.push("/dashboard/campaigns");
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Create campaign failed";
      toast.error(message, { id: toastId });
    }
  };
  return (
    <CampaignForm
      title="Create Campaign"
      subtitle="Fill in details to create a new campaign"
      submitLabel="Create"
      onSubmit={onSubmit}
    />
  );
}
