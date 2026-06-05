import { getCampaigns } from "@/api/campaigns";
import { getPartners } from "@/api/partners";
import { getVaultsV2 } from "@/api/vaults";
import { ROW_PER_PAGE } from "@/constants/dashboard";
import { useState } from "react";

import useSWR from "swr";

type CampaignFilters = {
  partner?: string;
  search?: string;
  status?: string;
  vaultId?: string;
};

export default function useGetCampaigns() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ROW_PER_PAGE[1]);

  const [search, setSearch] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedVault, setSelectedVault] = useState<string>("all");
  const [appliedFilters, setAppliedFilters] = useState<CampaignFilters>({});

  const { data: listPartners, isLoading: isLoadingGetPartners } = useSWR(
    ["get-partners"],
    () => getPartners(),
  );

  const { data: listVaults, isLoading: isLoadingGetVaults } = useSWR(
    ["get-all-vaults"],
    () => getVaultsV2(),
  );

  const { data: campaigns, isLoading: isLoadingGetCampaigns } = useSWR(
    [
      "get-campaigns",
      page,
      limit,
      appliedFilters.partner,
      appliedFilters.search,
      appliedFilters.status,
      appliedFilters.vaultId,
    ],
    () =>
      getCampaigns(
        page,
        limit,
        appliedFilters.partner,
        appliedFilters.search,
        appliedFilters.status,
        appliedFilters.vaultId,
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

  const applyFilters = () => {
    const normalizedPartner =
      selectedPartner && selectedPartner !== "all"
        ? selectedPartner
        : undefined;
    const normalizedStatus =
      selectedStatus && selectedStatus !== "all" ? selectedStatus : undefined;
    const normalizedVaultId =
      selectedVault && selectedVault !== "all" ? selectedVault : undefined;
    const normalizedSearch = search.trim() || undefined;

    setAppliedFilters({
      partner: normalizedPartner,
      search: normalizedSearch,
      status: normalizedStatus,
      vaultId: normalizedVaultId,
    });
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedPartner("all");
    setSelectedStatus("all");
    setSelectedVault("all");
    setAppliedFilters({});
    setPage(1);
  };

  return {
    handleOnchangePage,
    handleChangeLimit,
    applyFilters,
    resetFilters,
    page,
    limit,
    search,
    setSearch,
    selectedPartner,
    setSelectedPartner,
    selectedStatus,
    setSelectedStatus,
    appliedFilters,
    listPartners,
    campaigns,
    isLoadingGetCampaigns,
    handleNextPage,
    handlePreviousPage,
    isLoadingFilter: isLoadingGetPartners || isLoadingGetVaults,
    listVaults: listVaults?.data || [],
    selectedVault,
    setSelectedVault,
  };
}
