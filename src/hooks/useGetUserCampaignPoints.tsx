import { getFilterCampaigns } from "@/api/campaigns";
import { getPartners } from "@/api/partners";
import {
  exportUserCampaignPoints,
  getStatsUserCampaignPoints,
  getUserCampaignPoints,
} from "@/api/userCampaignsPoints";
import { getVaultsV2 } from "@/api/vaults";
import { ROW_PER_PAGE } from "@/constants/dashboard";
import { downloadBlob } from "@/lib/download";
import { useState } from "react";

import useSWR from "swr";

export type ApplyFiltersUserCampaignPointsType = {
  selectedPartner: string;
  selectedStatus: string;
  selectedVault: string;
  search: string;
  minPoints: string;
  maxPoints: string;
  selectedCampaign: string;
};

type UserCampaignPointsFilters = {
  partner?: string;
  search?: string;
  status?: string;
  vaultId?: string;
  min?: string;
  max?: string;
  campaignId?: string;
};

export default function useGetUserCampaignPoints() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ROW_PER_PAGE[1]);

  const [appliedFilters, setAppliedFilters] =
    useState<UserCampaignPointsFilters>({});
  const [isExporting, setIsExporting] = useState(false);

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

  const {
    data: userCampaignPoints,
    isLoading: isLoadingGetUserCampaignPoints,
    mutate: refreshUserCampaignPoints,
  } = useSWR(
    [
      "get-user-campaign-points",
      page,
      limit,
      appliedFilters.partner,
      appliedFilters.search,
      appliedFilters.status,
      appliedFilters.vaultId,
      appliedFilters.min,
      appliedFilters.max,
      appliedFilters.campaignId,
    ],
    () =>
      getUserCampaignPoints(
        page,
        limit,
        appliedFilters.partner,
        appliedFilters.search,
        appliedFilters.status,
        appliedFilters.vaultId,
        appliedFilters.min,
        appliedFilters.max,
        appliedFilters.campaignId,
      ),
  );

  const {
    data: statsUserCampaignPoints,
    isLoading: isLoadingGetStatsUserCampaignPointsStats,
  } = useSWR(
    [
      "get-stats-user-campaign-points-stats",
      page,
      limit,
      appliedFilters.partner,
      appliedFilters.search,
      appliedFilters.status,
      appliedFilters.vaultId,
      appliedFilters.min,
      appliedFilters.max,
      appliedFilters.campaignId,
    ],
    () =>
      getStatsUserCampaignPoints(
        appliedFilters.partner,
        appliedFilters.search,
        appliedFilters.status,
        appliedFilters.vaultId,
        appliedFilters.min,
        appliedFilters.max,
        appliedFilters.campaignId,
      ),
  );

  const totalPages = Math.max(1, userCampaignPoints?.meta?.total_pages ?? 1);

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
    minPoints,
    maxPoints,
    selectedCampaign,
  }: ApplyFiltersUserCampaignPointsType) => {
    const normalizedPartner =
      selectedPartner && selectedPartner !== "all"
        ? selectedPartner
        : undefined;
    const normalizedStatus =
      selectedStatus && selectedStatus !== "all" ? selectedStatus : undefined;
    const normalizedVaultId =
      selectedVault && selectedVault !== "all" ? selectedVault : undefined;
    const normalizedSearch = search.trim() || undefined;
    const normalizedMin = minPoints.trim() || undefined;
    const normalizedMax = maxPoints.trim() || undefined;
    const normalizedCampaignId =
      selectedCampaign && selectedCampaign !== "all"
        ? selectedCampaign
        : undefined;

    setAppliedFilters({
      partner: normalizedPartner,
      search: normalizedSearch,
      status: normalizedStatus,
      vaultId: normalizedVaultId,
      min: normalizedMin,
      max: normalizedMax,
      campaignId: normalizedCampaignId,
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
      const { blob, filename } = await exportUserCampaignPoints(
        appliedFilters.partner,
        appliedFilters.search,
        appliedFilters.status,
        appliedFilters.vaultId,
        appliedFilters.min,
        appliedFilters.max,
        appliedFilters.campaignId,
      );
      if (blob.size === 0) {
        throw new Error("The export returned an empty file.");
      }
      downloadBlob(blob, filename);
    } catch (error) {
      console.error("Failed to export user campaign points", error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to export user campaign points. Please try again.";
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
    userCampaignPoints,
    isLoadingGetUserCampaignPoints,
    handleNextPage,
    handlePreviousPage,
    isLoadingFilter:
      isLoadingGetPartners || isLoadingGetVaults || isLoadingGeFilterCampaigns,
    listVaults: listVaults?.data || [],
    listFilterCampaigns: listFilterCampaigns?.data || [],
    statsUserCampaignPoints,
    isLoadingGetStatsUserCampaignPointsStats,
    handleExport,
    isExporting,
    refreshUserCampaignPoints,
  };
}
