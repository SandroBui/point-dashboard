"use client";
import {
  Database,
  Download,
  MoreHorizontal,
  Pencil,
  Plus,
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
import { FilterCampaign } from "./components/filter";

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
import { CampaignAttributes } from "@/types/campaign";
import { CampaignStatus } from "@/constants/campaign";
import useGetCampaigns from "@/hooks/useGetCampaign";
import { format } from "date-fns";
import { parseUTCStringToLocalDate } from "@/lib/date";
import { toFixedNumber, withCommas } from "@/lib/number";
import { cn } from "@/lib/utils";
import useGetPaginationTokens from "@/hooks/useGetPaginationTokens";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

function statusBadgeVariant(status: CampaignAttributes["status"]) {
  switch (status) {
    case CampaignStatus.Active:
      return "success";
    case CampaignStatus.Inactive:
      return "muted";
  }
}

const itemsSelectRow = ROW_PER_PAGE.map((item) => ({
  label: `${item.toString()}`,
  value: item.toString(),
}));

export default function CampaignsPage() {
  const {
    page,
    limit,
    handleChangeLimit,
    campaigns,
    handleOnchangePage,
    handleNextPage,
    handlePreviousPage,
    isLoadingGetCampaigns,
    listPartners,
    isLoadingFilter,
    applyFilters,
    resetFilters,
    listVaults,
  } = useGetCampaigns();

  const totalPages = Math.max(1, campaigns?.meta?.total_pages ?? 1);
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const paginationTokens = useGetPaginationTokens(page, totalPages);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all campaigns and their configurations
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* <Button variant="outline">
            <SlidersHorizontal className="size-4" />
            Columns
          </Button> */}
          <Button>
            <Plus className="size-4" />
            Create Campaign
          </Button>
        </div>
      </div>
      <FilterCampaign
        isLoading={isLoadingFilter}
        isApplying={isLoadingGetCampaigns}
        partnersSelect={listPartners ?? []}
        onApply={applyFilters}
        onReset={resetFilters}
        vaultsSelect={listVaults ?? []}
      />
      <Card>
        <CardHeader className="flex justify-between items-center gap-1">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold">
              Total {campaigns?.meta?.total ?? 0} campaigns
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="size-4" />
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
                <TableHead className="w-85">Campaign</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Vault</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Period</TableHead>
                {/* <TableHead className="text-right">Total Points</TableHead> */}
                <TableHead className="text-right">Users</TableHead>
                <TableHead className="w-55">Distributed</TableHead>
                <TableHead className="w-18 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody isLoading={isLoadingGetCampaigns} skeletonRows={limit}>
              {campaigns?.data?.length === 0 && (
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

              {campaigns?.data &&
                campaigns?.data?.length > 0 &&
                campaigns?.data?.map(({ id, attributes }) => (
                  <TableRow key={id}>
                    <TableCell>
                      <div className="truncate font-medium">
                        {attributes.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {attributes.partner_name ?? attributes.partner_slug}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {attributes.vault}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusBadgeVariant(attributes.status)}
                        className="capitalize"
                      >
                        {attributes.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {attributes.start_date &&
                        format(
                          parseUTCStringToLocalDate(attributes.start_date),
                          "MMM dd, yyyy",
                        )}{" "}
                      -{" "}
                      {attributes.end_date
                        ? format(
                            parseUTCStringToLocalDate(attributes.end_date),
                            "MMM dd, yyyy",
                          )
                        : "Present"}
                    </TableCell>
                    {/* <TableCell className="text-right text-sm">
                    {row.totalPoints}
                  </TableCell> */}
                    <TableCell className="text-right text-sm">
                      {withCommas(
                        toFixedNumber(attributes.totals_user || 0, 2),
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {withCommas(
                          toFixedNumber(attributes.distributed || 0, 2),
                        )}
                      </div>
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
                defaultValue={limit}
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
