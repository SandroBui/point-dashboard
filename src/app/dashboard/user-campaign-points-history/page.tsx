"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Database,
  Download,
  Loader2,
} from "lucide-react";
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
import useGetUserCampaignPointHistory from "@/hooks/useGetUserCampaignPointHistory";
import useGetPaginationTokens from "@/hooks/useGetPaginationTokens";
import { FilterUserCampaignPointHistory } from "./components/filter";
import type { HistorySortField } from "@/types/userCampaignPointHistory";
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

const itemsSelectRow = ROW_PER_PAGE.map((item) => ({
  label: `${item.toString()}`,
  value: item.toString(),
}));

function SortableHeader({
  label,
  field,
  sortField,
  sortOrder,
  onSort,
  className,
}: {
  label: string;
  field: HistorySortField;
  sortField: HistorySortField;
  sortOrder: "asc" | "desc";
  onSort: (field: HistorySortField) => void;
  className?: string;
}) {
  const isActive = sortField === field;
  const Icon = isActive
    ? sortOrder === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  return (
    <TableHead className={className}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 gap-1 font-medium"
        onClick={() => onSort(field)}
      >
        {label}
        <Icon className="size-3.5" />
      </Button>
    </TableHead>
  );
}

export default function UserCampaignPointsHistoryPage() {
  const {
    page,
    limit,
    history,
    sortField,
    sortOrder,
    handleChangeLimit,
    handleOnchangePage,
    handleNextPage,
    handlePreviousPage,
    isLoadingHistory,
    listPartners,
    listCampaigns,
    isLoadingFilter,
    applyFilters,
    resetFilters,
    toggleSort,
    listVaults,
    handleExport,
    isExporting,
  } = useGetUserCampaignPointHistory();

  const totalPages = Math.max(1, history?.meta?.total_pages ?? 1);
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const paginationTokens = useGetPaginationTokens(page, totalPages);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          User Campaign Points History
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View point changes per user and campaign over time
        </p>
      </div>

      <FilterUserCampaignPointHistory
        isLoading={isLoadingFilter}
        isApplying={isLoadingHistory}
        partnersSelect={listPartners ?? []}
        campaignsSelect={listCampaigns ?? []}
        vaultsSelect={listVaults ?? []}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      <Card>
        <CardHeader className="flex items-center justify-between gap-1">
          <CardTitle className="text-sm font-semibold">
            Total {withCommas(history?.meta?.total ?? 0)} records
          </CardTitle>
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
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
                <TableHead className="w-45">User</TableHead>
                <TableHead>Campaign</TableHead>
                <SortableHeader
                  label="Points Delta"
                  field="points_delta"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={toggleSort}
                  className="text-right"
                />
                <TableHead>Note</TableHead>
                <SortableHeader
                  label="Created At"
                  field="created_at"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={toggleSort}
                />
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
                history.data.map(({ id, attributes }) => {
                  const delta = Number(attributes.points_delta);
                  const isPositive = delta >= 0;

                  return (
                    <TableRow key={id}>
                      <TableCell>
                        <div
                          className="max-w-45 truncate font-mono text-sm"
                          title={attributes.user}
                        >
                          {attributes.user}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="truncate font-medium">
                          {attributes.campaign}
                        </div>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right text-sm font-medium tabular-nums",
                          isPositive ? "text-emerald-600" : "text-red-600",
                        )}
                      >
                        {isPositive ? "+" : ""}
                        {withCommas(toFixedNumber(delta, 6))}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {attributes.note ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(
                          parseUTCStringToLocalDate(attributes.created_at),
                          "MMM dd, yyyy HH:mm",
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
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
