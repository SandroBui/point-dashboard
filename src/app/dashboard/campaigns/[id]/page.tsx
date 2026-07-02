"use client";

import { ArrowLeft, Pencil, Copy, Database } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { format } from "date-fns";

import { getCampaignDetail } from "@/api/campaigns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { parseUTCStringToLocalDate } from "@/lib/date";
import { CampaignStatus } from "@/constants/campaign";
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
import { getUserCampaignPointsByCampaignId } from "@/api/userCampaignsPoints";

const itemsSelectRow = ROW_PER_PAGE.map((item) => ({
  label: item,
  value: item,
}));

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const {
    data: campaign,
    isLoading,
    error,
  } = useSWR(id ? ["campaign-detail", id] : null, ([, campaignId]) =>
    getCampaignDetail(campaignId),
  );

  const attrs = campaign?.data?.attributes;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ROW_PER_PAGE[1]);

  const { data: campaignUserPoints, isLoading: campaignUserPointsLoading } =
    useSWR(
      id ? ["campaign-user-points", id, page, limit] : null,
      ([, campaignId]) =>
        getUserCampaignPointsByCampaignId(
          page,
          limit,
          campaignId,
          "-percentage",
        ),
    );

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

  const totalPages = Math.max(1, campaignUserPoints?.meta?.total_pages ?? 1);
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
            {isLoading ? "Campaign" : (attrs?.name ?? "Campaign")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View campaign details
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button
            onClick={() => router.push(`/dashboard/campaigns/${id}/edit`)}
            disabled={!id}
          >
            <Pencil className="size-4" />
            Edit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Campaign Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {error ? (
            <div className="text-sm text-destructive">{error.message}</div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <Field className="lg:col-span-1">
                <FieldLabel className="font-medium">Status</FieldLabel>
                {isLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <div>
                    <Badge
                      className="w-fit capitalize"
                      variant={
                        CampaignStatus.Active === attrs?.status
                          ? "success"
                          : "muted"
                      }
                    >
                      {attrs?.status ?? "-"}
                    </Badge>
                  </div>
                )}
              </Field>

              <Field className="lg:col-span-1">
                <FieldLabel className="font-medium">Pool Address</FieldLabel>
                {isLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <div className="text-sm text-muted-foreground break-all">
                    {attrs?.pool_address ?? "-"}
                  </div>
                )}
              </Field>

              <Field className="lg:col-span-1">
                <FieldLabel className="font-medium">Partner</FieldLabel>
                {isLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {attrs?.partner_name ?? attrs?.partner_slug ?? "-"}
                  </div>
                )}
              </Field>

              <Field className="lg:col-span-1">
                <FieldLabel className="font-medium">Vault</FieldLabel>
                {isLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {attrs?.vault ?? "-"}
                  </div>
                )}
              </Field>

              <Field className="lg:col-span-1">
                <FieldLabel className="font-medium">Point Type</FieldLabel>
                {isLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {attrs?.point_type_name ?? attrs?.point_type_slug ?? "-"}
                  </div>
                )}
              </Field>

              <Field className="lg:col-span-1">
                <FieldLabel className="font-medium">Multiplier</FieldLabel>
                {isLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {attrs?.multiplier ?? "-"}
                  </div>
                )}
              </Field>

              <Field className="lg:col-span-1">
                <FieldLabel className="font-medium">Start Date</FieldLabel>
                {isLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {attrs?.start_date
                      ? format(
                          parseUTCStringToLocalDate(attrs.start_date),
                          "MMM dd, yyyy",
                        )
                      : "-"}
                  </div>
                )}
              </Field>

              <Field className="lg:col-span-1">
                <FieldLabel className="font-medium">End Date</FieldLabel>
                {isLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {attrs?.end_date
                      ? format(
                          parseUTCStringToLocalDate(attrs.end_date),
                          "MMM dd, yyyy",
                        )
                      : "Present"}
                  </div>
                )}
              </Field>

              <Field className="lg:col-span-2">
                <FieldLabel className="font-medium">Description</FieldLabel>
                {isLoading ? (
                  <Skeleton className="h-16" />
                ) : (
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {attrs?.description ?? "-"}
                  </div>
                )}
              </Field>

              <Field className="lg:col-span-2">
                <FieldLabel className="font-medium">Tags</FieldLabel>
                {isLoading ? (
                  <Skeleton className="h-8" />
                ) : attrs?.tags?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {attrs.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">-</div>
                )}
              </Field>

              <Field className="lg:col-span-2">
                <FieldLabel className="font-medium">Vault Reward</FieldLabel>
                {isLoading ? (
                  <Skeleton className="h-8" />
                ) : attrs?.vault_reward?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {attrs.vault_reward.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">-</div>
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
              Total {campaignUserPoints?.meta?.total ?? 0} users
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table className="min-w-262.5">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No.</TableHead>
                <TableHead className="w-85">Wallet</TableHead>
                <TableHead className="w-85">Total Point</TableHead>
                <TableHead>Percentage Point</TableHead>
                <TableHead className="w-85">Amount Shares Holding</TableHead>
                <TableHead>Percentage Shares Holding</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody
              isLoading={campaignUserPointsLoading}
              skeletonRows={limit}
            >
              {campaignUserPoints?.data?.length === 0 && (
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

              {campaignUserPoints?.data &&
                campaignUserPoints?.data?.length > 0 &&
                campaignUserPoints?.data?.map(({ id, attributes }, index) => (
                  <TableRow key={id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-blue-400">
                          {truncateAddress(attributes.user_address)}
                        </p>
                        <Tooltip
                          open={currentAddressCopy === attributes.user_address}
                        >
                          <TooltipTrigger
                            render={
                              <Copy
                                className="size-4 cursor-pointer"
                                onClick={() =>
                                  copyAddressToClipboard(
                                    attributes.user_address,
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

                    <TableCell className="text-sm">
                      {withCommas(
                        toFixedNumber(Number(attributes.total_points) || 0, 2),
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {withCommas(
                        toFixedNumber(
                          Number(attributes.percentage_point) || 0,
                          2,
                        ),
                      )}
                      %
                    </TableCell>

                    <TableCell className="text-sm">
                      {withCommas(
                        toFixedNumber(
                          Number(attributes.amount_shares_holding) || 0,
                          2,
                        ),
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {withCommas(
                        toFixedNumber(
                          Number(attributes.percentage_shares_holding) || 0,
                          2,
                        ),
                      )}
                      %
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
