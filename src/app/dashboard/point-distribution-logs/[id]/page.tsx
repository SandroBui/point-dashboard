"use client";

import { ArrowLeft, Info } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { parseUTCStringToLocalDate } from "@/lib/date";
import { getPointDistributionLogDetail } from "@/api/pointDistributionLogs";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { levelBadgeVariant } from "@/lib/pointDistributionLog";

export default function PointDistributionLogDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const {
    data: campaign,
    isLoading,
    error,
  } = useSWR(id ? ["point-distribution-log-detail", id] : null, ([, logId]) =>
    getPointDistributionLogDetail(logId),
  );

  const attrs = campaign?.data?.attributes;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Log ID: {id}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">View log details</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/point-distribution-logs")}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Logs Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {error ? (
            <div className="text-sm text-destructive">{error.message}</div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              <Field className="lg:col-span-1">
                <FieldLabel className="font-medium flex items-center gap-1">
                  <p>Run ID</p>
                  <Tooltip>
                    <TooltipTrigger
                      render={<Info className="size-3 cursor-pointer" />}
                    />
                    <TooltipContent>
                      <p>
                        During a point distribution event, all users who receive
                        points in that distribution will be assigned the same ID
                        for management purposes.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </FieldLabel>
                {isLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <div className="text-sm text-muted-foreground break-all">
                    {attrs?.run_id ?? "-"}
                  </div>
                )}
              </Field>

              <Field className="lg:col-span-1">
                <FieldLabel className="font-medium">Level</FieldLabel>
                {isLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <div>
                    <Badge
                      className="w-fit capitalize"
                      variant={levelBadgeVariant(attrs?.level ?? "-")}
                    >
                      {attrs?.level ?? "-"}
                    </Badge>
                  </div>
                )}
              </Field>

              <Field className="lg:col-span-1">
                <FieldLabel className="font-medium">Event</FieldLabel>
                {isLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <div className="text-sm text-muted-foreground break-all">
                    {attrs?.event ?? "-"}
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
                    {attrs?.vault_name ?? "-"}
                  </div>
                )}
              </Field>

              <Field className="lg:col-span-1">
                <FieldLabel className="font-medium">Campaign</FieldLabel>
                {isLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {attrs?.point_campaign_name ?? "-"}
                  </div>
                )}
              </Field>

              <Field className="lg:col-span-1">
                <FieldLabel className="font-medium">Message</FieldLabel>
                {isLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {attrs?.message ?? "-"}
                  </div>
                )}
              </Field>

              <Field className="lg:col-span-1">
                <FieldLabel className="font-medium">Created Date</FieldLabel>
                {isLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {attrs?.created_at
                      ? format(
                          parseUTCStringToLocalDate(attrs.created_at),
                          "MMM dd, yyyy HH:mm:ss",
                        )
                      : "-"}
                  </div>
                )}
              </Field>

              <Field className="lg:col-span-2">
                <FieldLabel className="font-medium">Metadata</FieldLabel>
                {isLoading ? (
                  <Skeleton className="h-16" />
                ) : (
                  <ul className="text-sm text-muted-foreground whitespace-pre-wrap p-3 bg-muted-foreground/10 rounded-md">
                    {Object.entries(attrs?.metadata ?? {}).map(
                      ([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {value}
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </Field>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
