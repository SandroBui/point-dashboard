"use client";

import { Database, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ROW_PER_PAGE } from "@/constants/dashboard";
import useGetPointDistributionHistory from "@/hooks/useGetPointDistributionHistory";
import useGetPaginationTokens from "@/hooks/useGetPaginationTokens";
import { FilterPointDistributionHistory } from "./components/filter";
import { format } from "date-fns";
import { parseUTCStringToLocalDate } from "@/lib/date";
import { toFixedNumber, withCommas } from "@/lib/number";
import { cn } from "@/lib/utils";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import useGetFilter from "@/hooks/useGetFilter";

const itemsSelectRow = ROW_PER_PAGE.map((item) => ({
  label: `${item.toString()}`,
  value: item.toString(),
}));

export default function PointDistributionHistoryPage() {
  const {
    page,
    limit,
    history,
    handleChangeLimit,
    handleOnchangePage,
    handleNextPage,
    handlePreviousPage,
    isLoadingHistory,
    applyFilters,
    resetFilters,
    handleExport,
    isExporting,
  } = useGetPointDistributionHistory();
  const { listPartners, isLoadingFilter, listVaults, listFilterCampaigns } =
    useGetFilter();

  const totalPages = Math.max(1, history?.meta?.total_pages ?? 1);
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const paginationTokens = useGetPaginationTokens(page, totalPages);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Point Distribution History
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View point distribution records by vault, partner, and campaign
        </p>
      </div>

      <FilterPointDistributionHistory
        isLoading={isLoadingFilter}
        isApplying={isLoadingHistory}
        partnersSelect={listPartners ?? []}
        campaignsSelect={listFilterCampaigns ?? []}
        vaultsSelect={listVaults ?? []}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      <Card>
        <CardHeader className="flex items-center justify-between gap-1">
          <CardTitle className="text-sm font-semibold">
            Total {withCommas(history?.meta?.total ?? 0)} records
          </CardTitle>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Export
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <Table className="min-w-200">
            <TableHeader>
              <TableRow>
                <TableHead>Vault</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody isLoading={isLoadingHistory} skeletonRows={limit}>
              {history?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="p-8">
                    <Empty className="mx-auto max-w-xl">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Database />
                        </EmptyMedia>
                        <EmptyTitle>No data</EmptyTitle>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}

              {history?.data &&
                history.data.length > 0 &&
                history.data.map(({ id, attributes }) => (
                  <TableRow key={id}>
                    <TableCell>
                      <div className="truncate font-medium">
                        {attributes.vault}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="truncate text-sm text-muted-foreground">
                        {attributes.campaign ?? "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="truncate font-medium">
                        {attributes.partner}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium tabular-nums">
                      {withCommas(toFixedNumber(attributes.point, 6))}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(
                        parseUTCStringToLocalDate(attributes.created_at),
                        "MMM dd, yyyy HH:mm",
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex shrink-0 items-center gap-2">
              <p>Rows per page</p>
              <Select
                items={itemsSelectRow}
                onValueChange={(newLimit) =>
                  handleChangeLimit(Number(newLimit))
                }
                value={String(limit)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rows per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {itemsSelectRow.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                        className="text-sm"
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Pagination className="justify-end">
              <PaginationContent key={`${page}-${totalPages}`}>
                <PaginationItem>
                  <PaginationPrevious
                    aria-disabled={!canGoPrev}
                    tabIndex={!canGoPrev ? -1 : undefined}
                    className={cn(
                      !canGoPrev && "pointer-events-none opacity-50",
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!canGoPrev) return;
                      handlePreviousPage();
                    }}
                  />
                </PaginationItem>

                {paginationTokens.map((token, idx) => {
                  if (token === "ellipsis") {
                    return (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={token}>
                      <PaginationLink
                        isActive={token === page}
                        onClick={(e) => {
                          e.preventDefault();
                          handleOnchangePage(token);
                        }}
                      >
                        {token}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    aria-disabled={!canGoNext}
                    tabIndex={!canGoNext ? -1 : undefined}
                    className={cn(
                      !canGoNext && "pointer-events-none opacity-50",
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!canGoNext) return;
                      handleNextPage();
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
