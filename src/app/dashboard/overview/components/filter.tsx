import { Filter, Loader2, RefreshCw, SearchIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import { CampaignStatus } from "@/constants/campaign";
import type {
  FilterPartnerResource,
  FilterPointTypeResource,
  FilterVaultResource,
} from "@/types/filters";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import { format } from "date-fns";
import { type DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface FilterCampaignProps {
  isLoading: boolean;
  isApplying?: boolean;
  partnersSelect: FilterPartnerResource[];
  vaultsSelect: FilterVaultResource[];
  pointTypesSelect: FilterPointTypeResource[];
  onApply: ({
    selectedPartner,
    selectedVault,
    dateFrom,
    dateTo,
    selectedPointType,
  }: {
    selectedPartner: string;
    selectedVault: string;
    dateFrom?: string | undefined;
    dateTo?: string | undefined;
    selectedPointType: string;
  }) => void;
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
  const [date, setDate] = useState<DateRange | undefined>(undefined);
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

  const handleApply = () => {
    onApply({
      selectedPartner,
      selectedVault,
      dateFrom: date?.from?.toISOString() || undefined,
      dateTo: date?.to?.toISOString() || undefined,
      selectedPointType,
    });
  };

  const handleReset = () => {
    setSelectedPartner("all");
    setSelectedVault("all");
    setSelectedPointType("all");
    setDate(undefined);
    onReset();
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-semibold text-muted-foreground flex justify-between items-center">
          <Button variant="ghost" disabled={isApplying} onClick={onRefreshData}>
            <RefreshCw className="size-4" />
            Refresh
          </Button>
          <div className="flex gap-2 justify-end items-center">
            <Button
              variant="outline"
              disabled={isApplying}
              onClick={handleApply}
            >
              {isApplying ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Filter className="size-4" />
              )}
              Filters
            </Button>
            <Button variant="ghost" disabled={isApplying} onClick={handleReset}>
              <RefreshCw className="size-4" />
              Reset
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
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
        </div>
      </CardContent>
    </Card>
  );
};
