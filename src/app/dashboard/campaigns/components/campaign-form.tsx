"use client";

import { ArrowLeft, Loader2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/searchable-select";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import useGetFilter from "@/hooks/useGetFilter";
import type { CreateCampaignInput } from "@/types/campaign";
import { format } from "date-fns";
import type { CampaignStatus } from "@/types/campaign";

export type CampaignFormValues = {
  name: string;
  partner_slug: string;
  point_type_slug: string;
  pool_address: string;
  vault_id: string;
  multiplier: number;
  start_date: string;
  end_date?: string;
  description?: string;
  tags: string[];
  status: CampaignStatus;
};

const campaignStatusValues = ["active", "inactive"] as const;

const campaignSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    partner_slug: z.string().trim().min(1, "Partner is required"),
    point_type_slug: z.string().trim().min(1, "Point type is required"),
    pool_address: z.string().trim().min(1, "Pool address is required"),
    vault_id: z.string().trim().min(1, "Vault is required"),
    multiplier: z.preprocess(
      (v) => (typeof v === "string" ? Number(v) : v),
      z.number().min(0, "Multiplier must be >= 0"),
    ),
    start_date: z.iso.datetime("Start date is required"),
    end_date: z.preprocess(
      (v) => (typeof v === "string" && v.trim().length === 0 ? undefined : v),
      z.iso.datetime().optional(),
    ),
    description: z.preprocess(
      (v) => (typeof v === "string" && v.trim().length === 0 ? undefined : v),
      z.string().optional(),
    ),
    tags: z.array(z.string()).default([]),
    status: z.enum(campaignStatusValues),
  })
  .superRefine((values, ctx) => {
    if (!values.end_date) return;

    const startDate = new Date(values.start_date);
    const endDate = new Date(values.end_date);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return;
    }

    if (endDate < startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["end_date"],
        message: "End date must be greater than or equal to start date",
      });
    }
  });

const itemsSelectStatus = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

type CampaignFormProps = {
  title: string;
  subtitle: string;
  submitLabel: string;
  defaultValues?: Partial<CampaignFormValues>;
  isLoading?: boolean;
  onSubmit: (payload: CreateCampaignInput) => Promise<void>;
};

export function CampaignForm({
  title,
  subtitle,
  submitLabel,
  defaultValues,
  isLoading,
  onSubmit,
}: CampaignFormProps) {
  const router = useRouter();
  const [tagText, setTagText] = useState("");
  const { listPartners, isLoadingFilter, listVaults, listFilterPointTypes } =
    useGetFilter();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormValues>({
    defaultValues: {
      name: "",
      partner_slug: "",
      point_type_slug: "",
      pool_address: "",
      vault_id: "",
      multiplier: 1,
      start_date: "",
      end_date: "",
      description: "",
      tags: [],
      status: "active",
      ...defaultValues,
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!defaultValues) return;
    reset({
      name: defaultValues.name ?? "",
      partner_slug: defaultValues.partner_slug ?? "",
      point_type_slug: defaultValues.point_type_slug ?? "",
      pool_address: defaultValues.pool_address ?? "",
      vault_id: defaultValues.vault_id ?? "",
      multiplier: defaultValues.multiplier ?? 1,
      start_date: defaultValues.start_date ?? "",
      end_date: defaultValues.end_date ?? "",
      description: defaultValues.description ?? "",
      tags: defaultValues.tags ?? [],
      status: defaultValues.status ?? "active",
    });
  }, [defaultValues, reset]);

  const itemsSelectPartner = useMemo(() => {
    return (
      listPartners?.map((item) => ({
        label: item.attributes.name,
        value: item.attributes.partner_slug,
      })) || []
    );
  }, [listPartners]);

  const itemsSelectVault = useMemo(() => {
    return (
      listVaults?.map((item) => ({
        label: item.attributes.name,
        value: item.attributes.vault_id,
      })) || []
    );
  }, [listVaults]);

  const itemsSelectPointType = useMemo(() => {
    return (
      listFilterPointTypes?.map((item) => ({
        label: item.attributes.name,
        value: item.attributes.slug,
      })) || []
    );
  }, [listFilterPointTypes]);

  const submit = handleSubmit(async (values) => {
    const parsed = campaignSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof CampaignFormValues | undefined;
        if (!key) return;
        setError(key, { type: "validate", message: issue.message });
      });
      return;
    }

    const payload: CreateCampaignInput = {
      name: parsed.data.name,
      partner_slug: parsed.data.partner_slug,
      point_type_slug: parsed.data.point_type_slug,
      pool_address: parsed.data.pool_address,
      vault_id: parsed.data.vault_id,
      multiplier: parsed.data.multiplier,
      start_date: parsed.data.start_date,
      end_date: parsed.data.end_date,
      description: parsed.data.description,
      tags: parsed.data.tags,
      status: parsed.data.status,
    };

    await onSubmit(payload);
  });

  const isLoadingSelects = isLoading || isLoadingFilter;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button onClick={submit} disabled={isSubmitting || isLoading}>
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
            {submitLabel}
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
          <div className="grid gap-4 lg:grid-cols-2">
            <Field className="lg:col-span-1">
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Name<span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                placeholder="Campaign name"
                aria-invalid={!!errors.name}
                disabled={isLoading}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field className="lg:col-span-1">
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Pool Address<span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                placeholder="0x..."
                aria-invalid={!!errors.pool_address}
                disabled={isLoading}
                {...register("pool_address")}
              />
              <FieldError errors={[errors.pool_address]} />
            </Field>

            <Field className="lg:col-span-1">
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Status
              </FieldLabel>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    items={itemsSelectStatus}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value ?? "active")}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        {itemsSelectStatus.map((item) => (
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
                )}
              />
              <FieldError errors={[errors.status]} />
            </Field>

            <Field className="lg:col-span-1">
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Partner<span className="text-destructive">*</span>
              </FieldLabel>
              {isLoadingSelects ? (
                <Skeleton className="h-8" />
              ) : (
                <Controller
                  control={control}
                  name="partner_slug"
                  render={({ field }) => (
                    <SearchableSelect
                      items={itemsSelectPartner}
                      value={field.value}
                      onValueChange={field.onChange}
                      includeAll={false}
                      placeholder="Partner"
                      searchPlaceholder="Search partner..."
                      disabled={isLoading}
                    />
                  )}
                />
              )}
              <FieldError errors={[errors.partner_slug]} />
            </Field>

            <Field className="lg:col-span-1">
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Vault<span className="text-destructive">*</span>
              </FieldLabel>
              {isLoadingSelects ? (
                <Skeleton className="h-8" />
              ) : (
                <Controller
                  control={control}
                  name="vault_id"
                  render={({ field }) => (
                    <SearchableSelect
                      items={itemsSelectVault}
                      value={field.value}
                      onValueChange={field.onChange}
                      includeAll={false}
                      placeholder="Vault"
                      searchPlaceholder="Search vault..."
                      disabled={isLoading}
                    />
                  )}
                />
              )}
              <FieldError errors={[errors.vault_id]} />
            </Field>

            <Field className="lg:col-span-1">
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Point Type<span className="text-destructive">*</span>
              </FieldLabel>
              {isLoadingSelects ? (
                <Skeleton className="h-8" />
              ) : (
                <Controller
                  control={control}
                  name="point_type_slug"
                  render={({ field }) => (
                    <SearchableSelect
                      items={itemsSelectPointType}
                      value={field.value}
                      onValueChange={field.onChange}
                      includeAll={false}
                      placeholder="Point type"
                      searchPlaceholder="Search point type..."
                      disabled={isLoading}
                    />
                  )}
                />
              )}
              <FieldError errors={[errors.point_type_slug]} />
            </Field>

            <Field className="lg:col-span-2">
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Multiplier
              </FieldLabel>
              <Input
                type="number"
                step="0.01"
                min={0}
                aria-invalid={!!errors.multiplier}
                disabled={isLoading}
                {...register("multiplier", { valueAsNumber: true })}
              />
              <FieldError errors={[errors.multiplier]} />
            </Field>

            <Field className="lg:col-span-1">
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Start Date<span className="text-destructive">*</span>
              </FieldLabel>
              <Controller
                control={control}
                name="start_date"
                render={({ field }) => {
                  const selected = field.value
                    ? new Date(field.value)
                    : undefined;
                  return (
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            variant="outline"
                            className="justify-start px-2.5 font-normal"
                            disabled={isLoading}
                          >
                            {selected ? (
                              format(selected, "LLL dd, y")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        }
                      />
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selected}
                          onSelect={(date) =>
                            field.onChange(date ? date.toISOString() : "")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  );
                }}
              />
              <FieldError errors={[errors.start_date]} />
            </Field>

            <Field className="lg:col-span-1">
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                End Date
              </FieldLabel>
              <Controller
                control={control}
                name="end_date"
                render={({ field }) => {
                  const selected = field.value
                    ? new Date(field.value)
                    : undefined;
                  return (
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger
                          render={
                            <Button
                              variant="outline"
                              className="flex-1 justify-start px-2.5 font-normal"
                              disabled={isLoading}
                            >
                              {selected ? (
                                format(selected, "LLL dd, y")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          }
                        />
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selected}
                            onSelect={(date) =>
                              field.onChange(date ? date.toISOString() : "")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => field.onChange("")}
                        disabled={!field.value || isLoading}
                      >
                        Clear
                      </Button>
                    </div>
                  );
                }}
              />
              <FieldError errors={[errors.end_date]} />
            </Field>

            <Field className="lg:col-span-2">
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Description
              </FieldLabel>
              <Textarea
                placeholder="Description"
                aria-invalid={!!errors.description}
                disabled={isLoading}
                {...register("description")}
              />
              <FieldError errors={[errors.description]} />
            </Field>

            <Field className="lg:col-span-2">
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Tags
              </FieldLabel>
              <Controller
                control={control}
                name="tags"
                render={({ field }) => {
                  const tags = field.value ?? [];
                  return (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                            <button
                              type="button"
                              className="ml-0.5 inline-flex size-4 items-center justify-center rounded-full hover:bg-muted"
                              onClick={() =>
                                field.onChange(tags.filter((t) => t !== tag))
                              }
                              disabled={isLoading}
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Type tag and press Enter"
                        value={tagText}
                        disabled={isLoading}
                        onChange={(e) => setTagText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const next = tagText.trim();
                            if (!next) return;
                            if (tags.includes(next)) {
                              setTagText("");
                              return;
                            }
                            field.onChange([...tags, next]);
                            setTagText("");
                            return;
                          }

                          if (e.key === "Backspace" && tagText.length === 0) {
                            field.onChange(tags.slice(0, -1));
                          }
                        }}
                      />
                    </div>
                  );
                }}
              />
              <FieldError errors={[errors.tags]} />
            </Field>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
