import { exportCampaigns, getCampaigns } from "@/api/campaigns";
import { getPartners } from "@/api/partners";
import { getVaultsV2 } from "@/api/vaults";
import { ROW_PER_PAGE } from "@/constants/dashboard";
import { downloadBlob } from "@/lib/download";
import { useState } from "react";

import useSWR from "swr";

type CampaignFilters = {
  partner?: string;
  search?: string;
  status?: string;
  vaultId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export default function useGetCampaigns() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ROW_PER_PAGE[1]);

  const [appliedFilters, setAppliedFilters] = useState<CampaignFilters>({});
  const [isExporting, setIsExporting] = useState(false);

  const { data: listPartners, isLoading: isLoadingGetPartners } = useSWR(
    ["get-filter-partners"],
    () => getPartners(),
  );

  const { data: listVaults, isLoading: isLoadingGetVaults } = useSWR(
    ["get-filter-vaults"],
    () => getVaultsV2(),
  );

  const {
    data: campaigns,
    isLoading: isLoadingGetCampaigns,
    mutate: refreshCampaigns,
  } = useSWR(
    [
      "get-campaigns",
      page,
      limit,
      appliedFilters.partner,
      appliedFilters.search,
      appliedFilters.status,
      appliedFilters.vaultId,
      appliedFilters.dateFrom,
      appliedFilters.dateTo,
    ],
    () =>
      getCampaigns(
        page,
        limit,
        appliedFilters.partner,
        appliedFilters.search,
        appliedFilters.status,
        appliedFilters.vaultId,
        appliedFilters.dateFrom,
        appliedFilters.dateTo,
      ),
  );

  const totalPages = Math.max(1, campaigns?.meta?.total_pages ?? 1);

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

  const applyFilters = ({
    selectedPartner,
    selectedStatus,
    selectedVault,
    search,
    dateFrom,
    dateTo,
  }: {
    selectedPartner: string;
    selectedStatus: string;
    selectedVault: string;
    search: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const normalizedPartner =
      selectedPartner && selectedPartner !== "all"
        ? selectedPartner
        : undefined;
    const normalizedStatus =
      selectedStatus && selectedStatus !== "all" ? selectedStatus : undefined;
    const normalizedVaultId =
      selectedVault && selectedVault !== "all" ? selectedVault : undefined;
    const normalizedSearch = search.trim() || undefined;
    const normalizedDateFrom = dateFrom || undefined;
    const normalizedDateTo = dateTo || undefined;

    setAppliedFilters({
      partner: normalizedPartner,
      search: normalizedSearch,
      status: normalizedStatus,
      vaultId: normalizedVaultId,
      dateFrom: normalizedDateFrom,
      dateTo: normalizedDateTo,
    });
    setPage(1);
  };

  const resetFilters = () => {
    setAppliedFilters({});
    setPage(1);
  };

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const { blob, filename } = await exportCampaigns(appliedFilters);
      if (blob.size === 0) {
        throw new Error("The export returned an empty file.");
      }
      downloadBlob(blob, filename);
    } catch (error) {
      console.error("Failed to export campaigns", error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to export campaigns. Please try again.";
      if (typeof window !== "undefined") {
        window.alert(message);
      }
    } finally {
      setIsExporting(false);
    }
  };

  return {
    handleOnchangePage,
    handleChangeLimit,
    applyFilters,
    resetFilters,
    page,
    limit,
    appliedFilters,
    listPartners: listPartners?.data ?? [],
    campaigns,
    isLoadingGetCampaigns,
    handleNextPage,
    handlePreviousPage,
    isLoadingFilter: isLoadingGetPartners || isLoadingGetVaults,
    listVaults: listVaults?.data ?? [],
    refreshCampaigns,
    handleExport,
    isExporting,
  };
}
