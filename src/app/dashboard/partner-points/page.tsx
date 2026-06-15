"use client";
import { Database, Pencil, Plus } from "lucide-react";
import { useState } from "react";

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
import { FilterPartnerPoint } from "./components/filter";
import { PartnerPointSheet } from "./components/partner-point-sheet";

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
import useGetPartnerPoints from "@/hooks/useGetPartnerPoints";
import type { PartnerPointResource } from "@/types/partnerPoint";

import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const itemsSelectRow = ROW_PER_PAGE.map((item) => ({
  label: item,
  value: item,
}));

export default function PartnerPointsPage() {
  const {
    page,
    limit,
    handleChangeLimit,
    partnerPoints,
    handleOnchangePage,
    handleNextPage,
    handlePreviousPage,
    isLoadingGetPartnerPoints,
    isLoadingFilter,
    applyFilters,
    resetFilters,
    listVaults,
    mutatePartnerPoints,
  } = useGetPartnerPoints();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<PartnerPointResource | null>(null);

  const totalPages = Math.max(1, partnerPoints?.meta?.total_pages ?? 1);
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const paginationTokens = useGetPaginationTokens(page, totalPages);

  const handleCreate = () => {
    setEditing(null);
    setSheetOpen(true);
  };

  const handleEdit = (partnerPoint: PartnerPointResource) => {
    setEditing(partnerPoint);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Partner Points
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage partner points and their configurations
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleCreate}>
            <Plus className="size-4" />
            Create Partner Point
          </Button>
        </div>
      </div>
      <FilterPartnerPoint
        isLoading={isLoadingFilter}
        isApplying={isLoadingGetPartnerPoints}
        onApply={applyFilters}
        onReset={resetFilters}
        vaultsSelect={listVaults ?? []}
      />
      <Card>
        <CardHeader className="flex justify-between items-center gap-1">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold">
              Total {partnerPoints?.meta?.total ?? 0} partner points
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table className="min-w-237.5">
            <TableHeader>
              <TableRow>
                <TableHead className="w-64">Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Vault</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Exposure</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-18 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody
              isLoading={isLoadingGetPartnerPoints}
              skeletonRows={limit}
            >
              {partnerPoints?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="p-8">
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

              {partnerPoints?.data &&
                partnerPoints?.data?.length > 0 &&
                partnerPoints?.data?.map((partnerPoint) => {
                  const { id, attributes } = partnerPoint;
                  return (
                    <TableRow key={id}>
                      <TableCell>
                        <div className="truncate font-medium">
                          {attributes.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {attributes.slug}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {attributes.vault_name ?? "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={attributes.is_active ? "success" : "muted"}
                        >
                          {attributes.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            attributes.is_exposure ? "success" : "muted"
                          }
                        >
                          {attributes.is_exposure ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {attributes.updated_at &&
                          format(
                            parseUTCStringToLocalDate(attributes.updated_at),
                            "MMM dd, yyyy",
                          )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Edit"
                            onClick={() => handleEdit(partnerPoint)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                        </div>
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

      <PartnerPointSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        partnerPoint={editing}
        vaults={listVaults ?? []}
        onSuccess={() => mutatePartnerPoints()}
      />
    </div>
  );
}
