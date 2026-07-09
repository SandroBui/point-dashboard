"use client";
import { Database } from "lucide-react";

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
import { ROW_PER_PAGE } from "@/constants/dashboard";
import { cn } from "@/lib/utils";
import useGetPaginationTokens from "@/hooks/useGetPaginationTokens";

const itemsSelectRow = ROW_PER_PAGE.map((item) => ({
  label: item,
  value: item,
}));

import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import useGetSummaryPartnerPoints from "@/hooks/useGetSummaryPartnerPoints";
import { toFixedNumber, withCommas } from "@/lib/number";

interface PartnerSummaryProps {
  partnerName?: string;
}

export const PartnerSummary = ({ partnerName }: PartnerSummaryProps) => {
  const {
    page,
    limit,
    handleChangeLimit,
    summaryPartnerPoints,
    handleOnchangePage,
    handleNextPage,
    handlePreviousPage,
    isLoadingGetSummaryPartnerPoints,
  } = useGetSummaryPartnerPoints(partnerName);

  const totalPages = Math.max(1, summaryPartnerPoints?.meta?.total_pages ?? 1);
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const paginationTokens = useGetPaginationTokens(page, totalPages);

  return (
    <Card>
      <CardHeader className="flex justify-between items-center gap-1">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold">
            Total {summaryPartnerPoints?.meta?.total ?? 0} partner points
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Table className="min-w-237.5">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">No.</TableHead>
              <TableHead className="w-64">Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Total Vaults</TableHead>
              <TableHead>Total Points</TableHead>
              <TableHead>Total Tokens</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody
            isLoading={isLoadingGetSummaryPartnerPoints}
            skeletonRows={limit}
          >
            {summaryPartnerPoints?.data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="p-8">
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

            {summaryPartnerPoints?.data &&
              summaryPartnerPoints?.data?.length > 0 &&
              summaryPartnerPoints?.data?.map((partnerPoint, index) => {
                const { id, attributes } = partnerPoint;
                return (
                  <TableRow key={id}>
                    <TableCell className="text-center">
                      {(page - 1) * limit + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="truncate font-medium">
                        {attributes.partner_name ?? "-"}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {attributes.partner_slug ?? "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {attributes.total_vault
                        ? withCommas(toFixedNumber(attributes.total_vault, 2))
                        : "0"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {attributes.total_point
                        ? withCommas(
                            toFixedNumber(Number(attributes.total_point), 2),
                          )
                        : "0"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      N/A
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 items-center shrink-0">
            <p className="">Rows per page</p>
            <Select
              items={itemsSelectRow}
              onValueChange={(newLimit) => handleChangeLimit(Number(newLimit))}
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
                  className={cn(!canGoPrev && "pointer-events-none opacity-50")}
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
                  className={cn(!canGoNext && "pointer-events-none opacity-50")}
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
  );
};
