import { getSummaryPartnerPoints } from "@/api/partnerPoints";

import { ROW_PER_PAGE } from "@/constants/dashboard";
import { useState } from "react";

import useSWR from "swr";

export default function useGetSummaryPartnerPoints(partnerName?: string) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ROW_PER_PAGE[1]);

  const {
    data: summaryPartnerPoints,
    isLoading: isLoadingGetSummaryPartnerPoints,
  } = useSWR(["get-summary-partner-points", page, limit, partnerName], () =>
    getSummaryPartnerPoints(page, limit, partnerName),
  );

  const totalPages = Math.max(1, summaryPartnerPoints?.meta?.total_pages ?? 1);

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
    handleOnchangePage,
    handleChangeLimit,
    page,
    limit,
    summaryPartnerPoints,
    isLoadingGetSummaryPartnerPoints,
    handleNextPage,
    handlePreviousPage,
  };
}
