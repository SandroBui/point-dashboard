"use client";
import {
  Copy,
  Database,
  Download,
  Loader2,
  MoreHorizontal,
  Pencil,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { FilterUserCampaignPoints } from "./components/filter";

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
import { toFixedNumber, withCommas } from "@/lib/number";
import { cn } from "@/lib/utils";
import useGetPaginationTokens from "@/hooks/useGetPaginationTokens";

import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import useGetUserCampaignPoints from "@/hooks/useGetUserCampaignPoints";
import {
  UserCampaignPointsStatsAttributes,
  UserCampaignPointsStatus as UserCampaignPointsStatusType,
} from "@/types/userCampaignPoints";
import { UserCampaignPointsStatus } from "@/constants/userCampaignPoints";
import { copyTextToClipboard, truncateAddress } from "@/lib/string";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { StatsUserCampaignPoints } from "./components/stats";
import { ImportUserCampaignPointsDialog } from "./components/import-dialog";

function statusBadgeVariant(status: UserCampaignPointsStatusType) {
  switch (status) {
    case UserCampaignPointsStatus.Active:
      return "success";
    case UserCampaignPointsStatus.Disabled:
      return "muted";
  }
}

const itemsSelectRow = ROW_PER_PAGE.map((item) => ({
  label: item,
  value: item,
}));

export default function UserCampaignPointsPage() {
  const {
    page,
    limit,
    handleChangeLimit,
    userCampaignPoints,
    handleOnchangePage,
    handleNextPage,
    handlePreviousPage,
    isLoadingGetUserCampaignPoints,
    listFilterCampaigns,
    listPartners,
    isLoadingFilter,
    applyFilters,
    resetFilters,
    listVaults,
    statsUserCampaignPoints,
    isLoadingGetStatsUserCampaignPointsStats,
    handleExport,
    isExporting,
    refreshUserCampaignPoints,
  } = useGetUserCampaignPoints();

  const totalPages = Math.max(1, userCampaignPoints?.meta?.total_pages ?? 1);
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const paginationTokens = useGetPaginationTokens(page, totalPages);

  const [currentAddressCopy, setCurrentAddressCopy] = useState("");

  const copyAddressToClipboard = (address: string) => {
    copyTextToClipboard(address, () => {
      setCurrentAddressCopy(address);
      setTimeout(() => {
        setCurrentAddressCopy("");
      }, 2000);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            User Campaign Points
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View management user points cross all campaigns
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ImportUserCampaignPointsDialog
            onImported={() => refreshUserCampaignPoints()}
          />
        </div>
      </div>
      <FilterUserCampaignPoints
        isLoading={isLoadingFilter}
        isApplying={isLoadingGetUserCampaignPoints}
        campaignsSelect={listFilterCampaigns}
        partnersSelect={listPartners}
        onApply={applyFilters}
        onReset={resetFilters}
        vaultsSelect={listVaults ?? []}
      />
      <StatsUserCampaignPoints
        statsData={
          statsUserCampaignPoints?.data?.attributes ??
          ({} as UserCampaignPointsStatsAttributes)
        }
        isLoading={isLoadingGetStatsUserCampaignPointsStats}
      />

      <Card>
        <CardHeader className="flex justify-between items-center gap-1">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold">
              Total {userCampaignPoints?.meta?.total ?? 0} users
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
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
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table className="min-w-262.5">
            <TableHeader>
              <TableRow>
                <TableHead className="w-85">User</TableHead>
                <TableHead className="w-85">Campaign</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Vault</TableHead>
                <TableHead className="w-55">Current Points</TableHead>
                <TableHead className="w-55">Life Time Earned</TableHead>
                <TableHead>Last Distribution</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-18 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody
              isLoading={isLoadingGetUserCampaignPoints}
              skeletonRows={limit}
            >
              {userCampaignPoints?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="p-8">
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

              {userCampaignPoints?.data &&
                userCampaignPoints?.data?.length > 0 &&
                userCampaignPoints?.data?.map(({ id, attributes }) => (
                  <TableRow key={id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-blue-400">
                          {truncateAddress(attributes.user)}
                        </p>
                        <Tooltip open={currentAddressCopy === attributes.user}>
                          <TooltipTrigger
                            render={
                              <Copy
                                className="size-4 cursor-pointer"
                                onClick={() =>
                                  copyAddressToClipboard(attributes.user)
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
                    <TableCell className="truncate text-sm text-muted-foreground">
                      {attributes.campaign}
                    </TableCell>
                    <TableCell className="truncate text-sm text-muted-foreground">
                      {attributes.partner}
                    </TableCell>
                    <TableCell className="truncate text-sm text-muted-foreground">
                      {attributes.vault}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {withCommas(
                        toFixedNumber(
                          Number(attributes.current_points) || 0,
                          2,
                        ),
                      )}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {withCommas(
                        toFixedNumber(
                          Number(attributes.lifetime_points) || 0,
                          2,
                        ),
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {attributes.last_distribution_time &&
                        format(
                          parseUTCStringToLocalDate(
                            attributes.last_distribution_time,
                          ),
                          "MMM dd, yyyy",
                        )}{" "}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusBadgeVariant(attributes.status)}
                        className="capitalize"
                      >
                        {attributes.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Edit"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="More actions"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
