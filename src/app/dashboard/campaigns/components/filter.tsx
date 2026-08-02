import { RefreshCw, SearchIcon } from "lucide-react";
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
import { SearchableSelect } from "@/components/searchable-select";
import { CampaignStatus } from "@/constants/campaign";
import type {
  FilterPartnerResource,
  FilterPointTypeResource,
  FilterVaultResource,
} from "@/types/filters";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import { subDays } from "date-fns";
import { type DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/date-range-picker";

const itemsSelectStatus = [
  { label: "All", value: "all" },
  { label: "Active", value: CampaignStatus.Active },
  { label: "Inactive", value: CampaignStatus.Inactive },
];

interface FilterCampaignProps {
  isLoading: boolean;
  isApplying?: boolean;
  partnersSelect: FilterPartnerResource[];
  vaultsSelect: FilterVaultResource[];
  pointTypesSelect: FilterPointTypeResource[];
  onApply: ({
    selectedPartner,
    selectedStatus,
    selectedVault,
    search,
    dateFrom,
    dateTo,
    selectedPointType,
  }: {
    selectedPartner: string;
    selectedStatus: string;
    selectedVault: string;
    search: string;
    dateFrom?: string | undefined;
    dateTo?: string | undefined;
    selectedPointType: string;
  }) => void;
  onReset: () => void;
}

export const FilterCampaign = ({
  isLoading,
  isApplying,
  partnersSelect,
  onApply,
  onReset,
  vaultsSelect,
  pointTypesSelect,
}: FilterCampaignProps) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [search, setSearch] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedVault, setSelectedVault] = useState<string>("all");
  const [selectedPointType, setSelectedPointType] = useState<string>("all");

  // Debounce amount để tránh spam
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 600);
    return () => clearTimeout(t);
  }, [search]);

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
      selectedPartner,
      selectedStatus,
      selectedVault,
      search: debouncedSearch,
      dateFrom: date?.from?.toISOString() || undefined,
      dateTo: date?.to?.toISOString() || undefined,
      selectedPointType,
    });
  }, [
    onApply,
    date,
    debouncedSearch,
    selectedPartner,
    selectedStatus,
    selectedVault,
    selectedPointType,
  ]);

  useEffect(() => {
    handleApply();
  }, [handleApply]);

  const handleReset = () => {
    setSearch("");
    setSelectedPartner("all");
    setSelectedStatus("all");
    setSelectedVault("all");
    setSelectedPointType("all");
    setDate(undefined);
    onReset();
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-semibold text-muted-foreground flex justify-between items-center">
          <Field className="max-w-sm">
            <InputGroup>
              <InputGroupInput
                id="inline-end-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  handleApply();
                }}
                placeholder="Search..."
                disabled={isApplying}
              />
              <InputGroupAddon align="inline-end">
                <SearchIcon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              variant="outline"
              disabled={isApplying}
              onClick={handleReset}
            >
              <RefreshCw className="size-4" />
              Reset Filter
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-3 lg:grid-cols-5">
          {/* filter status */}
          <Field className="lg:col-span-1">
            <FieldLabel className={"text-xs font-medium text-muted-foreground"}>
              Status
            </FieldLabel>
            {isLoading ? (
              <Skeleton className="h-8" />
            ) : (
              <Select
                items={itemsSelectStatus}
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value ?? "all")}
                disabled={isApplying}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    {itemsSelectStatus.map((item) => (
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

          {/* filter partner */}
          <Field className="lg:col-span-1">
            <FieldLabel className={"text-xs font-medium text-muted-foreground"}>
              Partner
            </FieldLabel>
            {isLoading ? (
              <Skeleton className="h-8" />
            ) : (
              <SearchableSelect
                items={itemsSelectPartner}
                value={selectedPartner}
                onValueChange={setSelectedPartner}
                placeholder="Partner"
                searchPlaceholder="Search partner..."
                disabled={isApplying}
              />
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
              <SearchableSelect
                items={itemsSelectVault}
                value={selectedVault}
                onValueChange={setSelectedVault}
                placeholder="Vault"
                searchPlaceholder="Search vault..."
                disabled={isApplying}
              />
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
              <SearchableSelect
                items={itemsSelectPointType}
                value={selectedPointType}
                onValueChange={setSelectedPointType}
                placeholder="Point Type"
                searchPlaceholder="Search point type..."
                disabled={isApplying}
              />
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
            <DateRangePicker
              date={date}
              onDateChange={setDate}
              disabled={isApplying}
            />
          </Field>
        </div>
      </CardContent>
    </Card>
  );
};
