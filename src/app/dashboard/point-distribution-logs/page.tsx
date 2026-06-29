"use client";
import { Database, Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
import { ROW_PER_PAGE } from "@/constants/dashboard";
import { format } from "date-fns";
import { parseUTCStringToLocalDate } from "@/lib/date";

import { cn } from "@/lib/utils";
import useGetPaginationTokens from "@/hooks/useGetPaginationTokens";

import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import useGetFilter from "@/hooks/useGetFilter";
import { FilterPointDistributionLogs } from "./components/filter";
import useGetPointDistributionLogs from "@/hooks/useGetPointDistributionLogs";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { levelBadgeVariant } from "@/lib/pointDistributionLog";

const itemsSelectRow = ROW_PER_PAGE.map((item) => ({
  label: item,
  value: item,
}));

export default function PointDistributionLogsPage() {
  const {
    page,
    limit,
    handleChangeLimit,
    pointDistributionLogs,
    handleOnchangePage,
    handleNextPage,
    handlePreviousPage,
    isLoadingGetPointDistributionLogs,
    applyFilters,
    resetFilters,
  } = useGetPointDistributionLogs();
  const { listPartners, isLoadingFilter, listVaults, listFilterCampaigns } =
    useGetFilter();

  const totalPages = Math.max(1, pointDistributionLogs?.meta?.total_pages ?? 1);
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const paginationTokens = useGetPaginationTokens(page, totalPages);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Point Distribution Logs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View point distribution logs cross all campaigns
          </p>
        </div>
      </div>
      <FilterPointDistributionLogs
        isLoading={isLoadingFilter}
        isApplying={isLoadingGetPointDistributionLogs}
        campaignsSelect={listFilterCampaigns}
        partnersSelect={listPartners}
        onApply={applyFilters}
        onReset={resetFilters}
        vaultsSelect={listVaults ?? []}
      />

      <Card>
        <CardHeader className="flex justify-between items-center gap-1">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold">
              Total {pointDistributionLogs?.meta?.total ?? 0} logs
            </CardTitle>
          </div>
          {/* <div className="flex items-center gap-2">
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
            <Button variant="outline">
              <SlidersHorizontal className="size-4" />
              Columns
            </Button>
          </div> */}
        </CardHeader>
        <CardContent className="pt-0">
          <Table className="min-w-262.5">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No.</TableHead>
                <TableHead className="w-85">Vault</TableHead>
                <TableHead className="w-85">Campaign</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Event</TableHead>
                <TableHead className="w-55">Message</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-18 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody
              isLoading={isLoadingGetPointDistributionLogs}
              skeletonRows={limit}
            >
              {pointDistributionLogs?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="p-8">
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

              {pointDistributionLogs?.data &&
                pointDistributionLogs?.data?.length > 0 &&
                pointDistributionLogs?.data?.map(
                  ({ id, attributes }, index) => (
                    <TableRow key={id}>
                      <TableCell className="text-center">
                        {(page - 1) * limit + index + 1}
                      </TableCell>
                      <TableCell className="truncate text-sm text-muted-foreground">
                        {attributes.vault_name ?? "-"}
                      </TableCell>
                      <TableCell className="truncate text-sm text-muted-foreground">
                        {attributes.point_campaign_name ?? "-"}
                      </TableCell>
                      <TableCell className="truncate text-sm text-muted-foreground">
                        {attributes.partner_name ?? "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={levelBadgeVariant(attributes.level)}
                          className="capitalize"
                        >
                          {attributes.level.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="truncate text-sm text-muted-foreground">
                        {attributes.event ?? "-"}
                      </TableCell>
                      <TableCell className="truncate text-sm text-muted-foreground">
                        {attributes.message ?? "-"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {attributes.created_at &&
                          format(
                            parseUTCStringToLocalDate(attributes.created_at),
                            "MMM dd, yyyy",
                          )}{" "}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/dashboard/point-distribution-logs/${id}`}
                            className={cn(
                              buttonVariants({
                                variant: "ghost",
                                size: "icon-sm",
                              }),
                            )}
                            aria-label="View"
                          >
                            <Eye className="size-4" />
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ),
                )}
            </TableBody>
          </Table>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 items-center shrink-0">
              <p className="">Rows per page</p>
              <Select
                items={itemsSelectRow}
                onValueChange={(newLimit) =>
                  handleChangeLimit(Number(newLimit))
                }
                value={limit}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Rows per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {itemsSelectRow.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                        className={"text-sm"}
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
