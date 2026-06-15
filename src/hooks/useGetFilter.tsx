import { getFilterCampaigns, getFilterPointTypes } from "@/api/campaigns";
import { getPartners } from "@/api/partners";
import { getVaultsV2 } from "@/api/vaults";

import useSWR from "swr";

export default function useGetFilter() {
  const { data: listPartners, isLoading: isLoadingGetPartners } = useSWR(
    ["get-filter-partners"],
    () => getPartners(),
  );

  const { data: listVaults, isLoading: isLoadingGetVaults } = useSWR(
    ["get-filter-vaults"],
    () => getVaultsV2(),
  );

  const { data: listFilterCampaigns, isLoading: isLoadingGeFilterCampaigns } =
    useSWR(["get-filter-campaigns"], () => getFilterCampaigns());

  const { data: listFilterPointTypes, isLoading: isLoadingGeFilterPointTypes } =
    useSWR(["get-filter-point-types"], () => getFilterPointTypes());

  return {
    listVaults: listVaults?.data ?? [],
    isLoadingFilter:
      isLoadingGetPartners ||
      isLoadingGetVaults ||
      isLoadingGeFilterCampaigns ||
      isLoadingGeFilterPointTypes,
    listFilterCampaigns: listFilterCampaigns?.data || [],
    listFilterPointTypes: listFilterPointTypes?.data || [],
    listPartners: listPartners?.data ?? [],
  };
}
