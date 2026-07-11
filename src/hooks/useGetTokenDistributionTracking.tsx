import { getTokenDistributionTracking } from "@/api/tokenDistributionTracking";
import { ROW_PER_PAGE } from "@/constants/dashboard";
import { useCallback, useState } from "react";
import useSWR from "swr";

export type ApplyFiltersTokenDistributionTrackingType = {
  selectedPartner: string;
  selectedCampaign: string;
  search: string;
};

type TokenDistributionTrackingFilters = {
  partnerSlug?: string;
  campaignId?: string;
  walletAddress?: string;
};

export default function useGetTokenDistributionTracking() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ROW_PER_PAGE[1]);
  const [appliedFilters, setAppliedFilters] =
    useState<TokenDistributionTrackingFilters>({});

  const {
    data: tokenDistributionTracking,
    isLoading: isLoadingGetTokenDistributionTracking,
    mutate: refreshTokenDistributionTracking,
  } = useSWR(
    [
      "get-token-distribution-tracking",
      page,
      limit,
      appliedFilters.campaignId,
      appliedFilters.partnerSlug,
      appliedFilters.walletAddress,
    ],
    () =>
      getTokenDistributionTracking(
        page,
        limit,
        appliedFilters.campaignId,
        appliedFilters.partnerSlug,
        appliedFilters.walletAddress,
      ),
  );

  const totalPages = Math.max(
    1,
    tokenDistributionTracking?.meta?.total_pages ?? 1,
  );

  const handleOnchangePage = (newPage: number) => {
    setPage(Math.min(Math.max(newPage, 1), totalPages));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleChangeLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const applyFilters = useCallback(
    ({
      selectedPartner,
      selectedCampaign,
      search,
    }: ApplyFiltersTokenDistributionTrackingType) => {
      const normalizedPartnerSlug =
        selectedPartner && selectedPartner !== "all"
          ? selectedPartner
          : undefined;
      const normalizedCampaignId =
        selectedCampaign && selectedCampaign !== "all"
          ? selectedCampaign
          : undefined;
      const normalizedWalletAddress = search.trim() || undefined;

      setAppliedFilters({
        partnerSlug: normalizedPartnerSlug,
        campaignId: normalizedCampaignId,
        walletAddress: normalizedWalletAddress,
      });
      setPage(1);
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setAppliedFilters({});
    setPage(1);
  }, []);

  return {
    page,
    limit,
    appliedFilters,
    tokenDistributionTracking,
    isLoadingGetTokenDistributionTracking,
    handleChangeLimit,
    handleOnchangePage,
    handleNextPage,
    handlePreviousPage,
    applyFilters,
    resetFilters,
    refreshTokenDistributionTracking,
  };
}
