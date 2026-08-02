"use client";

import { ArrowLeft, Copy, Database } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { parseUTCStringToLocalDate } from "@/lib/date";
import useGetPaginationTokens from "@/hooks/useGetPaginationTokens";
import { useState } from "react";
import { copyTextToClipboard, truncateAddress } from "@/lib/string";

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
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toFixedNumber, withCommas } from "@/lib/number";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROW_PER_PAGE } from "@/constants/dashboard";
import { getPointDistributionHistoryDetail } from "@/api/pointDistributionHistory";
import { getUserCampaignPointHistory } from "@/api/userCampaignPointHistory";

const itemsSelectRow = ROW_PER_PAGE.map((item) => ({
  label: item,
  value: item,
}));

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const {
    data: pointDistributionHistoryDetail,
    isLoading: isLoadingPointDistributionHistoryDetail,
    error: errorPointDistributionHistoryDetail,
  } = useSWR(id ? ["point-distribution-history-detail", id] : null, () =>
    getPointDistributionHistoryDetail(id),
  );

  const attrs = pointDistributionHistoryDetail?.data?.attributes;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ROW_PER_PAGE[1]);

  const handleOnchangePage = (newPage: number) => {
    setPage(Math.min(Math.max(newPage, 1), totalPages));
  };

  const {
    data: userDistributionHistory,
    isLoading: isLoadingUserDistributionHistory,
  } = useSWR(
    id ? ["user-campaign-point-history-detail", id, page, limit] : null,
    () =>
      getUserCampaignPointHistory(page, limit, {
        distributionId: id,
      }),
  );

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

  const totalPages = Math.max(
    1,
    userDistributionHistory?.meta?.total_pages ?? 1,
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
            {isLoadingPointDistributionHistoryDetail ? (
              <Skeleton className="h-8" />
            ) : (
              <>
                Distribution At{" "}
                {attrs?.created_at
                  ? format(
                      parseUTCStringToLocalDate(attrs.created_at),
                      "dd/MM/yyyy hh:mm a",
                    )
                  : "-"}
              </>
            )}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/point-distribution-history")}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Point Distribution History Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {errorPointDistributionHistoryDetail ? (
            <div className="text-sm text-destructive">
              {errorPointDistributionHistoryDetail.message}
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <Field className="lg:col-span-1">
                <FieldLabel className="font-medium">Campaign</FieldLabel>
                {isLoadingPointDistributionHistoryDetail ? (
                  <Skeleton className="h-8" />
                ) : (
                  <div className="text-sm text-muted-foreground break-all">
                    {attrs?.campaign ?? "-"}
                  </div>
                )}
              </Field>

              <Field className="lg:col-span-1">
                <FieldLabel className="font-medium">Partner</FieldLabel>
                {isLoadingPointDistributionHistoryDetail ? (
                  <Skeleton className="h-8" />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {attrs?.partner ?? "-"}
                  </div>
                )}
              </Field>

              <Field className="lg:col-span-1">
                <FieldLabel className="font-medium">Point</FieldLabel>
                {isLoadingPointDistributionHistoryDetail ? (
                  <Skeleton className="h-8" />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {attrs?.point
                      ? withCommas(toFixedNumber(attrs.point, 6))
                      : "-"}
                  </div>
                )}
              </Field>

              <Field className="lg:col-span-1">
                <FieldLabel className="font-medium">Vault</FieldLabel>
                {isLoadingPointDistributionHistoryDetail ? (
                  <Skeleton className="h-8" />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {attrs?.vault ?? "-"}
                  </div>
                )}
              </Field>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center gap-1">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold">
              Total {userDistributionHistory?.meta?.total ?? 0} users
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table className="min-w-262.5">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No.</TableHead>
                <TableHead className="w-45">User</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead className="text-right">Points Delta</TableHead>
                <TableHead>Note</TableHead>
                <TableHead className="text-right">Balance Amount</TableHead>
                <TableHead>Balance Note</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody
              isLoading={isLoadingUserDistributionHistory}
              skeletonRows={limit}
            >
              {(!userDistributionHistory?.data ||
                userDistributionHistory?.data?.length === 0) && (
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

              {userDistributionHistory?.data &&
                userDistributionHistory?.data?.length > 0 &&
                userDistributionHistory?.data?.map(
                  ({ id, attributes }, index) => {
                    const delta = Number(attributes.points_delta);
                    const isPositive = delta >= 0;
                    const rowIndex = (page - 1) * limit + index + 1;
                    const balanceAmount =
                      attributes.balance_amount != null &&
                      attributes.balance_amount !== ""
                        ? Number(attributes.balance_amount)
                        : null;

                    return (
                      <TableRow key={id}>
                        <TableCell className="text-center">
                          {rowIndex}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <p className="truncate font-medium text-blue-400">
                              {truncateAddress(attributes.user)}
                            </p>
                            <Tooltip
                              open={
                                currentAddressCopy?.address ===
                                  attributes.user &&
                                currentAddressCopy?.rowIndex === rowIndex
                              }
                            >
                              <TooltipTrigger
                                render={
                                  <Copy
                                    className="size-4 cursor-pointer"
                                    onClick={() =>
                                      copyAddressToClipboard(
                                        attributes.user,
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
                        <TableCell className="text-right text-sm font-medium tabular-nums">
                          {balanceAmount != null && !Number.isNaN(balanceAmount)
                            ? withCommas(toFixedNumber(balanceAmount, 6))
                            : "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {attributes.balance_note ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(
                            parseUTCStringToLocalDate(attributes.created_at),
                            "MMM dd, yyyy HH:mm",
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  },
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
