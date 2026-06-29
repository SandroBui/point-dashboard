<<<<<<< HEAD:src/app/dashboard/user-point-ledger-history/components/filter.tsx
import { RefreshCw, SearchIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
=======
import { RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

>>>>>>> upstream/main:src/app/dashboard/overview/components/filter.tsx
import { Field, FieldLabel } from "@/components/ui/field";

import { Button } from "@/components/ui/button";
<<<<<<< HEAD:src/app/dashboard/user-point-ledger-history/components/filter.tsx
import { SearchableSelect } from "@/components/searchable-select";
=======
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

>>>>>>> upstream/main:src/app/dashboard/overview/components/filter.tsx
import type {
  FilterPartnerResource,
  FilterPointTypeResource,
  FilterVaultResource,
} from "@/types/filters";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
<<<<<<< HEAD:src/app/dashboard/user-point-ledger-history/components/filter.tsx
=======

>>>>>>> upstream/main:src/app/dashboard/overview/components/filter.tsx
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
<<<<<<< HEAD:src/app/dashboard/user-point-ledger-history/components/filter.tsx
}: FilterUserCampaignPointHistoryProps) => {
=======
  vaultsSelect,
  pointTypesSelect,
  onRefreshData,
}: FilterCampaignProps) => {
>>>>>>> upstream/main:src/app/dashboard/overview/components/filter.tsx
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
<<<<<<< HEAD:src/app/dashboard/user-point-ledger-history/components/filter.tsx
  const [userAddress, setUserAddress] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
=======

>>>>>>> upstream/main:src/app/dashboard/overview/components/filter.tsx
  const [selectedPartner, setSelectedPartner] = useState<string>("all");
  const [selectedVault, setSelectedVault] = useState<string>("all");
  const [selectedPointType, setSelectedPointType] = useState<string>("all");

<<<<<<< HEAD:src/app/dashboard/user-point-ledger-history/components/filter.tsx
  // Debounce amount để tránh spam
  const [debouncedSearch, setDebouncedSearch] = useState(userAddress);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(userAddress), 600);
    return () => clearTimeout(t);
  }, [userAddress]);

  const itemsSelectPartner = useMemo(() => {
=======
  const itemsSelectPointType = useMemo(() => {
>>>>>>> upstream/main:src/app/dashboard/overview/components/filter.tsx
    return (
      pointTypesSelect?.map((item) => ({
        label: item.attributes.name,
<<<<<<< HEAD:src/app/dashboard/user-point-ledger-history/components/filter.tsx
        value: item.attributes.partner_slug,
=======
        value: item.attributes.slug,
>>>>>>> upstream/main:src/app/dashboard/overview/components/filter.tsx
      })) || []
    );
  }, [pointTypesSelect]);

  const itemsSelectPartner = useMemo(() => {
    return (
      partnersSelect?.map((item) => ({
        label: item.attributes.name,
<<<<<<< HEAD:src/app/dashboard/user-point-ledger-history/components/filter.tsx
        value: item.attributes.campaign_id,
=======
        value: item.attributes.partner_slug,
>>>>>>> upstream/main:src/app/dashboard/overview/components/filter.tsx
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
<<<<<<< HEAD:src/app/dashboard/user-point-ledger-history/components/filter.tsx
      userAddress: debouncedSearch,
      selectedCampaign,
      selectedPartner,
      selectedVault,
=======
      partner: selectedPartner,
      vaultId: selectedVault,
>>>>>>> upstream/main:src/app/dashboard/overview/components/filter.tsx
      dateFrom: date?.from?.toISOString() || undefined,
      dateTo: date?.to?.toISOString() || undefined,
      type: selectedPointType,
    });
  }, [
<<<<<<< HEAD:src/app/dashboard/user-point-ledger-history/components/filter.tsx
    debouncedSearch,
    selectedCampaign,
    selectedPartner,
    selectedVault,
    date,
    onApply,
=======
    onApply,
    selectedPartner,
    selectedVault,
    date?.from,
    date?.to,
    selectedPointType,
>>>>>>> upstream/main:src/app/dashboard/overview/components/filter.tsx
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
<<<<<<< HEAD:src/app/dashboard/user-point-ledger-history/components/filter.tsx
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-semibold text-muted-foreground flex justify-between items-center">
          <Field className="max-w-sm">
            <InputGroup>
              <InputGroupInput
                id="user-address-input"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  handleApply();
                }}
                placeholder="Search by user address..."
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
        <div className="grid gap-3 lg:grid-cols-4">
=======
      <CardContent className="">
        <div className="grid gap-3 lg:grid-cols-5">
          {/* filter partner */}
>>>>>>> upstream/main:src/app/dashboard/overview/components/filter.tsx
          <Field className="lg:col-span-1">
            <FieldLabel className={"text-xs font-medium text-muted-foreground"}>
              Partner
            </FieldLabel>
            {isLoading ? (
              <Skeleton className="h-8" />
            ) : (
<<<<<<< HEAD:src/app/dashboard/user-point-ledger-history/components/filter.tsx
              <SearchableSelect
                items={itemsSelectCampaign}
                value={selectedCampaign}
                onValueChange={setSelectedCampaign}
                placeholder="Campaign"
                searchPlaceholder="Search campaign..."
                disabled={isApplying}
              />
=======
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
>>>>>>> upstream/main:src/app/dashboard/overview/components/filter.tsx
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
<<<<<<< HEAD:src/app/dashboard/user-point-ledger-history/components/filter.tsx
              <SearchableSelect
                items={itemsSelectPartner}
                value={selectedPartner}
                onValueChange={setSelectedPartner}
                placeholder="Partner"
                searchPlaceholder="Search partner..."
                disabled={isApplying}
              />
=======
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
>>>>>>> upstream/main:src/app/dashboard/overview/components/filter.tsx
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
<<<<<<< HEAD:src/app/dashboard/user-point-ledger-history/components/filter.tsx
              <SearchableSelect
                items={itemsSelectVault}
                value={selectedVault}
                onValueChange={setSelectedVault}
                placeholder="Vault"
                searchPlaceholder="Search vault..."
                disabled={isApplying}
              />
=======
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
>>>>>>> upstream/main:src/app/dashboard/overview/components/filter.tsx
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
