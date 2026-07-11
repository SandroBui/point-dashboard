"use client";

import { Copy, Database } from "lucide-react";
import { format } from "date-fns";

import { FilterTokenDistributionTracking } from "./components/filter";
import { ImportTokenDistributionTrackingDialog } from "./components/import-dialog";
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
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ROW_PER_PAGE } from "@/constants/dashboard";
import useGetFilter from "@/hooks/useGetFilter";
import useGetPaginationTokens from "@/hooks/useGetPaginationTokens";
import useGetTokenDistributionTracking from "@/hooks/useGetTokenDistributionTracking";
import { parseUTCStringToLocalDate } from "@/lib/date";
import { toFixedNumber, withCommas } from "@/lib/number";
import { copyTextToClipboard, truncateAddress } from "@/lib/string";
import { cn } from "@/lib/utils";
import { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const itemsSelectRow = ROW_PER_PAGE.map((item) => ({
  label: item,
  value: item,
}));

export default function TokenDistributionTrackingPage() {
  const {
    page,
    limit,
    handleChangeLimit,
    tokenDistributionTracking,
    handleOnchangePage,
    handleNextPage,
    handlePreviousPage,
    isLoadingGetTokenDistributionTracking,
    applyFilters,
    resetFilters,
    refreshTokenDistributionTracking,
  } = useGetTokenDistributionTracking();
  const { listPartners, isLoadingFilter, listFilterCampaigns } = useGetFilter();

  const totalPages = Math.max(
    1,
    tokenDistributionTracking?.meta?.total_pages ?? 1,
  );
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const paginationTokens = useGetPaginationTokens(page, totalPages);

  const [currentAddressCopy, setCurrentAddressCopy] = useState({
    address: "",
    rowIndex: 0,
  });

  const copyAddressToClipboard = (address: string, rowIndex: number) => {
    copyTextToClipboard(address, () => {
      setCurrentAddressCopy({ address, rowIndex });
      setTimeout(() => {
        setCurrentAddressCopy({ address: "", rowIndex: 0 });
      }, 2000);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Token Distribution History
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track imported token distribution records across campaigns
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ImportTokenDistributionTrackingDialog
            onImported={refreshTokenDistributionTracking}
          />
        </div>
      </div>

      <FilterTokenDistributionTracking
        isLoading={isLoadingFilter}
        isApplying={isLoadingGetTokenDistributionTracking}
        partnersSelect={listPartners}
        campaignsSelect={listFilterCampaigns}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      <Card>
        <CardHeader className="flex items-center justify-between gap-1">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold">
              Total {tokenDistributionTracking?.meta?.total ?? 0} records
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table className="min-w-220">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No.</TableHead>
                <TableHead className="w-56">User Wallet</TableHead>
                <TableHead className="text-right">Token Amount</TableHead>
                <TableHead className="w-56">Tx Hash</TableHead>
                <TableHead className="w-64">Campaign</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody
              isLoading={isLoadingGetTokenDistributionTracking}
              skeletonRows={limit}
            >
              {(!tokenDistributionTracking?.data ||
                tokenDistributionTracking?.data?.length === 0) && (
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

              {tokenDistributionTracking?.data?.map(
                ({ id, attributes }, index) => {
                  const rowIndex = (page - 1) * limit + index + 1;

                  return (
                    <TableRow key={id}>
                      <TableCell className="text-center">{rowIndex}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium text-blue-400">
                            {truncateAddress(
                              attributes.recipient_wallet_address,
                            )}
                          </p>
                          <Tooltip
                            open={
                              currentAddressCopy?.address ===
                                attributes.recipient_wallet_address &&
                              currentAddressCopy?.rowIndex === rowIndex
                            }
                          >
                            <TooltipTrigger
                              render={
                                <Copy
                                  className="size-4 cursor-pointer"
                                  onClick={() =>
                                    copyAddressToClipboard(
                                      attributes.recipient_wallet_address,
                                      rowIndex,
                                    )
                                  }
                                />
                              }
                            />
                            <TooltipContent>
                              <p>Address successfully copied!</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {withCommas(
                          toFixedNumber(Number(attributes.amount), 4),
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <p
                          className="max-w-56 truncate"
                          title={attributes.tx_hash}
                        >
                          {attributes.tx_hash || "-"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="truncate font-medium">
                          {attributes.campaign_name || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {attributes.created_at
                          ? format(
                              parseUTCStringToLocalDate(attributes.created_at),
                              "MMM dd, yyyy HH:mm",
                            )
                          : "-"}
                      </TableCell>
                    </TableRow>
                  );
                },
              )}
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
                value={limit}
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
