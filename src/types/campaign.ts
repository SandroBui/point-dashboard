export type CampaignStatus = "active" | "inactive";

export type Campaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  pool_address: string;
};

export type CreateCampaignInput = {
  name: string;
  pool_address: string;
};
