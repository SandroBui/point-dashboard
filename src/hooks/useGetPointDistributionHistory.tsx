import {
  exportPointDistributionHistory,
  getPointDistributionHistory,
} from "@/api/pointDistributionHistory";
import { ROW_PER_PAGE } from "@/constants/dashboard";
import { downloadBlob } from "@/lib/download";
import type { PointDistributionHistoryFilters } from "@/types/pointDistributionHistory";
import { subDays } from "date-fns";
import { useCallback, useState } from "react";
import useSWR from "swr";

export default function useGetPointDistributionHistory() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ROW_PER_PAGE[1]);
  const [appliedFilters, setAppliedFilters] =
    useState<PointDistributionHistoryFilters>({
      dateFrom: new Date().toISOString(),
      dateTo: subDays(new Date(), 7).toISOString(),
    });
  const [isExporting, setIsExporting] = useState(false);

  const { data: history, isLoading: isLoadingHistory } = useSWR(
    [
      "get-point-distribution-history",
      page,
      limit,
      appliedFilters.vaultId,
      appliedFilters.campaignId,
      appliedFilters.partnerId,
      appliedFilters.dateFrom,
      appliedFilters.dateTo,
    ],
    () => getPointDistributionHistory(page, limit, appliedFilters),
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
      selectedCampaign,
      selectedPartner,
      selectedVault,
      dateFrom,
      dateTo,
    }: {
      selectedCampaign: string;
      selectedPartner: string;
      selectedVault: string;
      dateFrom?: string;
      dateTo?: string;
    }) => {
      setAppliedFilters({
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

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const { blob, filename } =
        await exportPointDistributionHistory(appliedFilters);
      if (blob.size === 0) {
        throw new Error("The export returned an empty file.");
      }
      downloadBlob(blob, filename);
    } catch (error) {
      console.error("Failed to export point distribution history", error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to export point distribution history. Please try again.";
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
    handleOnchangePage,
    handleChangeLimit,
    handleNextPage,
    handlePreviousPage,
    applyFilters,
    resetFilters,
    handleExport,
    isExporting,
    isLoadingHistory,
  };
}
