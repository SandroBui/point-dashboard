"use client";

import { ArrowLeft, Pencil } from "lucide-react";
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
            <div className="grid gap-4 lg:grid-cols-2">
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
