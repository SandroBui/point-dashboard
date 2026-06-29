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

import { useCallback, useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import { Input } from "@/components/ui/input";
import { UserCampaignPointsStatus } from "@/constants/userCampaignPoints";
import { ApplyFiltersUserCampaignPointsType } from "@/hooks/useGetUserCampaignPoints";
import {
  FilterCampaignResource,
  FilterPartnerResource,
  FilterVaultResource,
} from "@/types/filters";
const itemsSelectStatus = [
  { label: "All", value: "all" },
  { label: "Active", value: UserCampaignPointsStatus.Active },
  { label: "Disabled", value: UserCampaignPointsStatus.Disabled },
];

interface FilterUserCampaignPointsProps {
  isLoading: boolean;
  isApplying?: boolean;
  partnersSelect: FilterPartnerResource[];
  vaultsSelect: FilterVaultResource[];
  campaignsSelect: FilterCampaignResource[];
  onApply: (filters: ApplyFiltersUserCampaignPointsType) => void;
  onReset: () => void;
}

export const FilterUserCampaignPoints = ({
  isLoading,
  isApplying,
  partnersSelect,
  onApply,
  onReset,
  vaultsSelect,
  campaignsSelect,
}: FilterUserCampaignPointsProps) => {
  const [search, setSearch] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [selectedVault, setSelectedVault] = useState<string>("all");
  const [rangePoints, setRangePoints] = useState<{
    min: string;
    max: string;
  }>({
    min: "",
    max: "",
  });

  // Debounce amount để tránh spam
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 600);
    return () => clearTimeout(t);
  }, [search]);

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

  const itemsSelectCampaign = useMemo(() => {
    return (
      campaignsSelect?.map((item) => ({
        label: item.attributes.name,
        value: item.attributes.campaign_id,
      })) || []
    );
  }, [campaignsSelect]);

  const handleApply = useCallback(() => {
    onApply({
      selectedPartner,
      selectedStatus,
      selectedVault,
      search: debouncedSearch,
      minPoints: rangePoints.min,
      maxPoints: rangePoints.max,
      selectedCampaign,
    });
  }, [
    debouncedSearch,
    onApply,
    selectedPartner,
    selectedStatus,
    selectedVault,
    selectedCampaign,
    rangePoints,
  ]);

  useEffect(() => {
    handleApply();
  }, [handleApply]);

  const handleReset = () => {
    setSearch("");
    setSelectedPartner("all");
    setSelectedStatus("all");
    setSelectedVault("all");
    setSelectedCampaign("all");
    setRangePoints({
      min: "",
      max: "",
    });
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
                placeholder="Search address"
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

          {/* filter campaign */}
          <Field className="lg:col-span-1">
            <FieldLabel className={"text-xs font-medium text-muted-foreground"}>
              Campaigns
            </FieldLabel>
            {isLoading ? (
              <Skeleton className="h-8" />
            ) : (
              <SearchableSelect
                items={itemsSelectCampaign}
                value={selectedCampaign}
                onValueChange={setSelectedCampaign}
                placeholder="Campaign"
                searchPlaceholder="Search campaign..."
                disabled={isApplying}
              />
            )}
          </Field>

          {/* filter range point */}
          <Field className="lg:col-span-1">
            <FieldLabel className={"text-xs font-medium text-muted-foreground"}>
              Points Balance
            </FieldLabel>
            <div className="flex items-center">
              <Input
                type="number"
                value={rangePoints?.min}
                onChange={(e) =>
                  setRangePoints((prev) => ({
                    ...prev,
                    min: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  handleApply();
                }}
                placeholder="Min"
                disabled={isApplying}
              />
              {"-"}
              <Input
                type="number"
                value={rangePoints?.max}
                onChange={(e) =>
                  setRangePoints((prev) => ({
                    ...prev,
                    max: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  handleApply();
                }}
                placeholder="Max"
                disabled={isApplying}
              />
            </div>
          </Field>
        </div>
      </CardContent>
    </Card>
  );
};
