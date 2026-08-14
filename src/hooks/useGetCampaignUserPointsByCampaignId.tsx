import { getUserCampaignPointsByCampaignId } from "@/api/userCampaignsPoints";
import { ROW_PER_PAGE } from "@/constants/dashboard";
import useGetPaginationTokens from "@/hooks/useGetPaginationTokens";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export default function useGetCampaignUserPointsByCampaignId(
  campaignId?: string,
) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ROW_PER_PAGE[1]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [appliedSearch, setAppliedSearch] = useState<string | undefined>();

  const normalizedDebouncedSearch = useMemo(
    () => debouncedSearch.trim() || undefined,
    [debouncedSearch],
  );

  const {
    data: campaignUserPoints,
    isLoading: isLoadingCampaignUserPoints,
  } = useSWR(
    campaignId
      ? ["campaign-user-points", campaignId, page, limit, appliedSearch]
      : null,
    () =>
      getUserCampaignPointsByCampaignId(
        page,
        limit,
        campaignId as string,
        "-percentage",
        appliedSearch,
      ),
  );

  const totalPages = Math.max(1, campaignUserPoints?.meta?.total_pages ?? 1);
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const paginationTokens = useGetPaginationTokens(page, totalPages);

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

  const applySearch = useCallback(() => {
    setDebouncedSearch(search);
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 600);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (appliedSearch === normalizedDebouncedSearch) return;

    setAppliedSearch(normalizedDebouncedSearch);
    setPage(1);
  }, [appliedSearch, normalizedDebouncedSearch]);

  return {
    page,
    limit,
    search,
    setSearch,
    applySearch,
    campaignUserPoints,
    isLoadingCampaignUserPoints,
    totalPages,
    canGoPrev,
    canGoNext,
    paginationTokens,
    handleOnchangePage,
    handleChangeLimit,
    handleNextPage,
    handlePreviousPage,
  };
}
