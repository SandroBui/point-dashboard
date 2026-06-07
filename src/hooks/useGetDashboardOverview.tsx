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

function useTopList<T>(
  swrKey: string,
  fetcher: (page: number, limit: number) => Promise<PaginatedListResponse<T>>,
) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ROW_PER_PAGE[1]);

  const { data, isLoading } = useSWR([swrKey, page, limit], () =>
    fetcher(page, limit),
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
  };
}

export default function useGetDashboardOverview() {
  const { data: overview, isLoading: isLoadingOverview } = useSWR(
    ["get-dashboard-overview"],
    () => getDashboardOverview(),
  );

  const topVaults = useTopList("get-dashboard-top-vaults", getTopVaults);
  const topPartners = useTopList("get-dashboard-top-partners", getTopPartners);
  const topUsers = useTopList("get-dashboard-top-users", getTopUsers);

  return {
    overview,
    isLoadingOverview,
    topVaults,
    topPartners,
    topUsers,
  };
}
