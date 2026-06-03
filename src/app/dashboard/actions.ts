"use server";

import { createCampaign, inactiveCampaign } from "@/api/campaigns";
import { revalidatePath } from "next/cache";

export type ActionState = {
  error?: string;
  success?: boolean;
};

export async function createCampaignAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = formData.get("name")?.toString().trim();
  const pool_address = formData.get("pool_address")?.toString().trim();

  if (!name || !pool_address) {
    return { error: "Name and pool address are required." };
  }

  try {
    await createCampaign({ name, pool_address });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to create campaign.",
    };
  }
}

export async function inactiveCampaignAction(id: string): Promise<void> {
  try {
    await inactiveCampaign(id);
    revalidatePath("/dashboard");
  } catch (err) {
    throw err;
  }
}
