import { getPointDistributionLogs } from "@/api/pointDistributionLogs";
import { ROW_PER_PAGE } from "@/constants/dashboard";
import { useCallback, useState } from "react";
import useSWR from "swr";

export type ApplyFiltersPointDistributionLogsType = {
  selectedPartner?: string;
  selectedEvent?: string;
  selectedLevel?: string;
  selectedVault?: string;
  selectedCampaign?: string;
};

export default function useGetPointDistributionLogs() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ROW_PER_PAGE[1]);

  const [appliedFilters, setAppliedFilters] =
    useState<ApplyFiltersPointDistributionLogsType>({});

  const {
    data: pointDistributionLogs,
    isLoading: isLoadingGetPointDistributionLogs,
  } = useSWR(
    [
      "get-point-distribution-logs",
      page,
      limit,
      appliedFilters.selectedPartner,
      appliedFilters.selectedEvent,
      appliedFilters.selectedLevel,
      appliedFilters.selectedVault,
      appliedFilters.selectedCampaign,
    ],
    () =>
      getPointDistributionLogs(
        page,
        limit,
        appliedFilters.selectedPartner,
        appliedFilters.selectedEvent,
        appliedFilters.selectedLevel,
        appliedFilters.selectedVault,
        appliedFilters.selectedCampaign,
      ),
  );

  const totalPages = Math.max(1, pointDistributionLogs?.meta?.total_pages ?? 1);

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
      selectedEvent,
      selectedLevel,
      selectedVault,
      selectedCampaign,
    }: ApplyFiltersPointDistributionLogsType) => {
      const normalizedPartner =
        selectedPartner && selectedPartner !== "all"
          ? selectedPartner
          : undefined;
      const normalizedEvent =
        selectedEvent && selectedEvent !== "all" ? selectedEvent : undefined;
      const normalizedLevel =
        selectedLevel && selectedLevel !== "all" ? selectedLevel : undefined;
      const normalizedVaultId =
        selectedVault && selectedVault !== "all" ? selectedVault : undefined;
      const normalizedCampaignId =
        selectedCampaign && selectedCampaign !== "all"
          ? selectedCampaign
          : undefined;

      setAppliedFilters({
        selectedPartner: normalizedPartner,
        selectedEvent: normalizedEvent,
        selectedLevel: normalizedLevel,
        selectedVault: normalizedVaultId,
        selectedCampaign: normalizedCampaignId,
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
    handleOnchangePage,
    handleChangeLimit,
    applyFilters,
    resetFilters,
    page,
    limit,
    appliedFilters,
    pointDistributionLogs,
    isLoadingGetPointDistributionLogs,
    handleNextPage,
    handlePreviousPage,
  };
}
