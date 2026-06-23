import { getPartnerPoints } from "@/api/partnerPoints";
import { getVaultsV2 } from "@/api/vaults";
import { ROW_PER_PAGE } from "@/constants/dashboard";
import { useCallback, useState } from "react";

import useSWR from "swr";

type PartnerPointFilters = {
  search?: string;
  status?: string;
  vaultId?: string;
};

export default function useGetPartnerPoints() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ROW_PER_PAGE[1]);

  const [appliedFilters, setAppliedFilters] = useState<PartnerPointFilters>({});

  const { data: listVaults, isLoading: isLoadingGetVaults } = useSWR(
    ["get-filter-vaults"],
    () => getVaultsV2(),
  );

  const {
    data: partnerPoints,
    isLoading: isLoadingGetPartnerPoints,
    mutate: mutatePartnerPoints,
  } = useSWR(
    [
      "get-partner-points",
      page,
      limit,
      appliedFilters.search,
      appliedFilters.status,
      appliedFilters.vaultId,
    ],
    () =>
      getPartnerPoints(
        page,
        limit,
        appliedFilters.search,
        appliedFilters.search,
        appliedFilters.status,
        appliedFilters.vaultId,
      ),
  );

  const totalPages = Math.max(1, partnerPoints?.meta?.total_pages ?? 1);

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
      selectedStatus,
      selectedVault,
      search,
    }: {
      selectedStatus: string;
      selectedVault: string;
      search: string;
    }) => {
      const normalizedStatus =
        selectedStatus && selectedStatus !== "all" ? selectedStatus : undefined;
      const normalizedVaultId =
        selectedVault && selectedVault !== "all" ? selectedVault : undefined;
      const normalizedSearch = search.trim() || undefined;

      setAppliedFilters({
        search: normalizedSearch,
        status: normalizedStatus,
        vaultId: normalizedVaultId,
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
    partnerPoints,
    isLoadingGetPartnerPoints,
    handleNextPage,
    handlePreviousPage,
    isLoadingFilter: isLoadingGetVaults,
    listVaults: listVaults?.data ?? [],
    mutatePartnerPoints,
  };
}
