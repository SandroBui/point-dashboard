import {
  getDashboardOverview,
  getTopPartners,
  getTopUsers,
  getTopVaults,
} from "@/api/dashboard";
import { ROW_PER_PAGE } from "@/constants/dashboard";
import { useState } from "react";
import useSWR from "swr";

type PaginatedListResponse<T> = {
  data: T[];
  meta?: { total_pages?: number; total?: number };
};

type OverviewFilters = {
  partner?: string;
  vaultId?: string;
  dateFrom?: string;
  dateTo?: string;
  type?: string;
};

function useTopList<T>(
  swrKey: string,
  fetcher: (
    page: number,
    limit: number,
    partner?: string,
    vaultId?: string,
    dateFrom?: string,
    dateTo?: string,
    type?: string,
  ) => Promise<PaginatedListResponse<T>>,
  filter: OverviewFilters,
) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ROW_PER_PAGE[1]);

  const { data, isLoading, mutate } = useSWR(
    [
      swrKey,
      page,
      limit,
      filter.partner,
      filter.vaultId,
      filter.dateFrom,
      filter.dateTo,
      filter.type,
    ],
    () =>
      fetcher(
        page,
        limit,
        filter.partner,
        filter.vaultId,
        filter.dateFrom,
        filter.dateTo,
        filter.type,
      ),
  );

  const totalPages = Math.max(1, data?.meta?.total_pages ?? 1);

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

  return {
    page,
    limit,
    data,
    isLoading,
    totalPages,
    handleOnchangePage,
    handleNextPage,
    handlePreviousPage,
    handleChangeLimit,
    setPage,
    mutate,
  };
}

export default function useGetDashboardOverview() {
  const [appliedFilters, setAppliedFilters] = useState<OverviewFilters>({});

  const {
    data: overview,
    isLoading: isLoadingOverview,
    mutate: mutateOverviewData,
  } = useSWR(
    [
      "get-dashboard-overview",
      appliedFilters.partner,
      appliedFilters.vaultId,
      appliedFilters.dateFrom,
      appliedFilters.dateTo,
      appliedFilters.type,
    ],
    () =>
      getDashboardOverview(
        appliedFilters.partner,
        appliedFilters.vaultId,
        appliedFilters.dateFrom,
        appliedFilters.dateTo,
        appliedFilters.type,
      ),
  );

  const topVaults = useTopList(
    "get-dashboard-top-vaults",
    getTopVaults,
    appliedFilters,
  );
  const topPartners = useTopList(
    "get-dashboard-top-partners",
    getTopPartners,
    appliedFilters,
  );
  const topUsers = useTopList(
    "get-dashboard-top-users",
    getTopUsers,
    appliedFilters,
  );

  const applyFilters = ({
    selectedPartner,
    selectedVault,
    dateFrom,
    dateTo,
    selectedPointType,
  }: {
    selectedPartner: string;
    selectedVault: string;
    dateFrom?: string;
    dateTo?: string;
    selectedPointType?: string;
  }) => {
    const normalizedPartner =
      selectedPartner && selectedPartner !== "all"
        ? selectedPartner
        : undefined;
    const normalizedVaultId =
      selectedVault && selectedVault !== "all" ? selectedVault : undefined;
    const normalizedDateFrom = dateFrom || undefined;
    const normalizedDateTo = dateTo || undefined;
    const normalizedType =
      selectedPointType && selectedPointType !== "all"
        ? selectedPointType
        : undefined;

    setAppliedFilters({
      partner: normalizedPartner,
      vaultId: normalizedVaultId,
      dateFrom: normalizedDateFrom,
      dateTo: normalizedDateTo,
      type: normalizedType,
    });
    topVaults.setPage(1);
  };

  const resetFilters = () => {
    setAppliedFilters({});
    topVaults.setPage(1);
  };

  const mutationRefreshData = async () => {
    await topVaults.mutate();
    await mutateOverviewData();
    await topPartners.mutate();
    await topUsers.mutate();
  };

  return {
    overview,
    isLoadingOverview,
    topVaults,
    topPartners,
    topUsers,
    applyFilters,
    resetFilters,
    appliedFilters,
    mutationRefreshData,
  };
}
