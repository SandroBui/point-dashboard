import {
  exportUserCampaignPointHistory,
  getUserCampaignPointHistory,
} from "@/api/userCampaignPointHistory";
import { ROW_PER_PAGE } from "@/constants/dashboard";
import { downloadBlob } from "@/lib/download";
import type {
  HistorySortField,
  HistorySortOrder,
  UserCampaignPointHistoryFilters,
} from "@/types/userCampaignPointHistory";
import { subDays } from "date-fns";
import { useCallback, useState } from "react";
import useSWR from "swr";

export default function useGetUserCampaignPointHistory() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ROW_PER_PAGE[1]);
  const [appliedFilters, setAppliedFilters] =
    useState<UserCampaignPointHistoryFilters>({
      dateFrom: subDays(new Date(), 7).toISOString(),
      dateTo: new Date().toISOString(),
    });
  const [sortField, setSortField] = useState<HistorySortField>("created_at");
  const [sortOrder, setSortOrder] = useState<HistorySortOrder>("desc");
  const [isExporting, setIsExporting] = useState(false);

  const { data: history, isLoading: isLoadingHistory } = useSWR(
    [
      "get-user-campaign-point-history",
      page,
      limit,
      appliedFilters.userAddress,
      appliedFilters.campaignId,
      appliedFilters.partnerId,
      appliedFilters.vaultId,
      appliedFilters.dateFrom,
      appliedFilters.dateTo,
      sortField,
      sortOrder,
    ],
    () =>
      getUserCampaignPointHistory(
        page,
        limit,
        appliedFilters,
        sortField,
        sortOrder,
      ),
  );

  const totalPages = Math.max(1, history?.meta?.total_pages ?? 1);

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
      userAddress,
      selectedCampaign,
      selectedPartner,
      selectedVault,
      dateFrom,
      dateTo,
    }: {
      userAddress: string;
      selectedCampaign: string;
      selectedPartner: string;
      selectedVault: string;
      dateFrom?: string;
      dateTo?: string;
    }) => {
      setAppliedFilters({
        userAddress: userAddress.trim() || undefined,
        campaignId:
          selectedCampaign && selectedCampaign !== "all"
            ? selectedCampaign
            : undefined,
        partnerId:
          selectedPartner && selectedPartner !== "all"
            ? selectedPartner
            : undefined,
        vaultId:
          selectedVault && selectedVault !== "all" ? selectedVault : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      setPage(1);
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setAppliedFilters({});
    setPage(1);
  }, []);

  const toggleSort = (field: HistorySortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const { blob, filename } = await exportUserCampaignPointHistory(
        appliedFilters,
        sortField,
        sortOrder,
      );
      if (blob.size === 0) {
        throw new Error("The export returned an empty file.");
      }
      downloadBlob(blob, filename);
    } catch (error) {
      console.error("Failed to export user campaign point history", error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to export user campaign point history. Please try again.";
      if (typeof window !== "undefined") {
        window.alert(message);
      }
    } finally {
      setIsExporting(false);
    }
  };

  return {
    page,
    limit,
    history,
    sortField,
    sortOrder,
    handleOnchangePage,
    handleChangeLimit,
    handleNextPage,
    handlePreviousPage,
    applyFilters,
    resetFilters,
    toggleSort,
    handleExport,
    isExporting,
    isLoadingHistory,
  };
}
