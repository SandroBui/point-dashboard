import { RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { Field, FieldLabel } from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  FilterPartnerResource,
  FilterPointTypeResource,
  FilterVaultResource,
} from "@/types/filters";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import { format, subDays } from "date-fns";
import { type DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { OverviewFilters } from "@/hooks/useGetDashboardOverview";

interface FilterCampaignProps {
  isLoading: boolean;
  isApplying?: boolean;
  partnersSelect: FilterPartnerResource[];
  vaultsSelect: FilterVaultResource[];
  pointTypesSelect: FilterPointTypeResource[];
  onApply: ({
    partner,
    vaultId,
    dateFrom,
    dateTo,
    type,
  }: OverviewFilters) => void;
  onReset: () => void;
  onRefreshData: () => void;
}

export const FilterOverview = ({
  isLoading,
  isApplying,
  partnersSelect,
  onApply,
  onReset,
  vaultsSelect,
  pointTypesSelect,
  onRefreshData,
}: FilterCampaignProps) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const [selectedPartner, setSelectedPartner] = useState<string>("all");
  const [selectedVault, setSelectedVault] = useState<string>("all");
  const [selectedPointType, setSelectedPointType] = useState<string>("all");

  const itemsSelectPointType = useMemo(() => {
    return (
      pointTypesSelect?.map((item) => ({
        label: item.attributes.name,
        value: item.attributes.slug,
      })) || []
    );
  }, [pointTypesSelect]);

  const itemsSelectPartner = useMemo(() => {
    return (
      partnersSelect?.map((item) => ({
        label: item.attributes.name,
        value: item.attributes.partner_slug,
      })) || []
    );
  }, [partnersSelect]);

  const itemsSelectVault = useMemo(() => {
    return (
      vaultsSelect?.map((item) => ({
        label: item.attributes.name,
        value: item.attributes.vault_id,
      })) || []
    );
  }, [vaultsSelect]);

  const handleApply = useCallback(() => {
    onApply({
      partner: selectedPartner,
      vaultId: selectedVault,
      dateFrom: date?.from?.toISOString() || undefined,
      dateTo: date?.to?.toISOString() || undefined,
      type: selectedPointType,
    });
  }, [
    onApply,
    selectedPartner,
    selectedVault,
    date?.from,
    date?.to,
    selectedPointType,
  ]);

  useEffect(() => {
    handleApply();
  }, [handleApply]);

  const handleReset = () => {
    setSelectedPartner("all");
    setSelectedVault("all");
    setSelectedPointType("all");
    setDate(undefined);
    onReset();
  };

  return (
    <Card>
      <CardContent className="">
        <div className="grid gap-3 lg:grid-cols-5">
          {/* filter partner */}
          <Field className="lg:col-span-1">
            <FieldLabel className={"text-xs font-medium text-muted-foreground"}>
              Partner
            </FieldLabel>
            {isLoading ? (
              <Skeleton className="h-8" />
            ) : (
              <Select
                items={itemsSelectPartner.concat({
                  label: "All",
                  value: "all",
                })}
                value={selectedPartner}
                onValueChange={(value) => setSelectedPartner(value ?? "all")}
                disabled={isApplying}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Partner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Partner</SelectLabel>
                    <SelectItem key={"all"} value={"all"} className={"text-sm"}>
                      All
                    </SelectItem>
                    {itemsSelectPartner.map((item) => (
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
            )}
          </Field>

          {/* filter vault */}
          <Field className="lg:col-span-1">
            <FieldLabel className={"text-xs font-medium text-muted-foreground"}>
              Vaults
            </FieldLabel>
            {isLoading ? (
              <Skeleton className="h-8" />
            ) : (
              <Select
                items={itemsSelectVault.concat({
                  label: "All",
                  value: "all",
                })}
                value={selectedVault}
                onValueChange={(value) => setSelectedVault(value ?? "all")}
                disabled={isApplying}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Vault" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Vaults</SelectLabel>
                    <SelectItem key={"all"} value={"all"} className={"text-sm"}>
                      All
                    </SelectItem>
                    {itemsSelectVault.map((item) => (
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
            )}
          </Field>

          {/* filter point type */}
          <Field className="lg:col-span-1">
            <FieldLabel className={"text-xs font-medium text-muted-foreground"}>
              Point Types
            </FieldLabel>
            {isLoading ? (
              <Skeleton className="h-8" />
            ) : (
              <Select
                items={itemsSelectPointType.concat({
                  label: "All",
                  value: "all",
                })}
                value={selectedPointType}
                onValueChange={(value) => setSelectedPointType(value ?? "all")}
                disabled={isApplying}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Point Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Point Types</SelectLabel>
                    <SelectItem key={"all"} value={"all"} className={"text-sm"}>
                      All
                    </SelectItem>
                    {itemsSelectPointType.map((item) => (
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
            )}
          </Field>

          {/* filter date range */}
          <Field className="lg:col-span-1">
            <FieldLabel
              htmlFor="date-picker-range"
              className={"text-xs font-medium text-muted-foreground"}
            >
              Date Range
            </FieldLabel>
            <Popover>
              <PopoverTrigger
                disabled={isApplying}
                render={
                  <Button
                    variant="outline"
                    id="date-picker-range"
                    className="justify-start px-2.5 font-normal"
                  >
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                }
              />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </Field>

          <div className="flex gap-1 justify-end items-end">
            <Button
              variant="outline"
              disabled={isApplying}
              onClick={handleReset}
            >
              <RefreshCw className="size-4" />
              Reset Filter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
