"use client";
import { Database } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useGetDashboardOverview from "@/hooks/useGetDashboardOverview";
import { DashboardOverviewAttributes } from "@/types/dashboard";

import { StatsOverview } from "./components/stats";
import { TableFooter } from "./components/table-footer";
import { FilterOverview } from "./components/filter";
import useGetFilter from "@/hooks/useGetFilter";
import { toFixedNumber, withCommas } from "@/lib/number";

export default function OverviewPage() {
  const {
    overview,
    isLoadingOverview,
    topVaults,
    topPartners,
    applyFilters,
    resetFilters,
    mutationRefreshData,
  } = useGetDashboardOverview();

  const { listPartners, isLoadingFilter, listVaults, listFilterPointTypes } =
    useGetFilter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Overview Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time overview of point ecosystem performance
          </p>
        </div>
      </div>

      <FilterOverview
        isLoading={isLoadingFilter}
        isApplying={
          topVaults.isLoading || topPartners.isLoading || isLoadingOverview
        }
        partnersSelect={listPartners ?? []}
        onApply={applyFilters}
        onReset={resetFilters}
        vaultsSelect={listVaults ?? []}
        pointTypesSelect={listFilterPointTypes ?? []}
        onRefreshData={mutationRefreshData}
      />

      <StatsOverview
        statsData={
          overview?.data?.attributes ?? ({} as DashboardOverviewAttributes)
        }
        isLoading={isLoadingOverview}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Top Vaults */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Top Points by Vault
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">No.</TableHead>
                  <TableHead>Vault</TableHead>
                  <TableHead className="text-right">Total Points</TableHead>
                  <TableHead className="text-right">Campaigns</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody
                isLoading={topVaults.isLoading}
                skeletonRows={topVaults.limit}
              >
                {topVaults.data?.data?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="p-8">
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

                {topVaults.data?.data &&
                  topVaults.data.data.length > 0 &&
                  topVaults.data.data.map(({ id, attributes }, index) => (
                    <TableRow key={id}>
                      <TableCell className="text-sm text-muted-foreground text-center">
                        {(topVaults.page - 1) * topVaults.limit + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {attributes.vault}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {withCommas(
                          toFixedNumber(
                            Number(attributes.total_points || 0),
                            2,
                          ),
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">
                          {attributes.campaigns?.length ?? 0}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            <TableFooter
              page={topVaults.page}
              limit={topVaults.limit}
              totalPages={topVaults.totalPages}
              onChangePage={topVaults.handleOnchangePage}
              onNextPage={topVaults.handleNextPage}
              onPreviousPage={topVaults.handlePreviousPage}
              onChangeLimit={topVaults.handleChangeLimit}
            />
          </CardContent>
        </Card>

        {/* Top Partners */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Top Points by Partner
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">No.</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead className="text-right">Total Points</TableHead>
                  <TableHead className="text-right">Vaults</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody
                isLoading={topPartners.isLoading}
                skeletonRows={topPartners.limit}
              >
                {topPartners.data?.data?.length === 0 && (
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

                {topPartners.data?.data &&
                  topPartners.data.data.length > 0 &&
                  topPartners.data.data.map(({ id, attributes }, index) => (
                    <TableRow key={id}>
                      <TableCell className="text-sm text-muted-foreground text-center">
                        {(topPartners.page - 1) * topPartners.limit + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {attributes.partner}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {withCommas(
                          toFixedNumber(
                            Number(attributes.total_points || 0),
                            2,
                          ),
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">
                          {attributes.vaults?.length ?? 0}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            <TableFooter
              page={topPartners.page}
              limit={topPartners.limit}
              totalPages={topPartners.totalPages}
              onChangePage={topPartners.handleOnchangePage}
              onNextPage={topPartners.handleNextPage}
              onPreviousPage={topPartners.handlePreviousPage}
              onChangeLimit={topPartners.handleChangeLimit}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
