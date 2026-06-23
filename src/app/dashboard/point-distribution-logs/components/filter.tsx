import { RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
import { SearchableSelect } from "@/components/searchable-select";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import {
  FilterCampaignResource,
  FilterPartnerResource,
  FilterVaultResource,
} from "@/types/filters";
import {
  PointDistributionLogsEvent,
  PointDistributionLogsLevel,
} from "@/constants/pointDistributionLogs";
import { ApplyFiltersPointDistributionLogsType } from "@/hooks/useGetPointDistributionLogs";

const itemsSelectEvent = [
  { label: "All", value: "all" },
  { label: "Warning", value: PointDistributionLogsEvent.Warning },
  { label: "Error", value: PointDistributionLogsEvent.Error },
];

const itemsSelectLevel = [
  { label: "All", value: "all" },
  {
    label: "Vault not found",
    value: PointDistributionLogsLevel.VAULT_NOT_FOUND,
  },
  {
    label: "No active campaign",
    value: PointDistributionLogsLevel.NO_ACTIVE_CAMPAIGN,
  },
  {
    label: "Total deposit zero",
    value: PointDistributionLogsLevel.TOTAL_DEPOSIT_ZERO,
  },
  {
    label: "Distribute user failed",
    value: PointDistributionLogsLevel.DISTRIBUTE_USER_FAILED,
  },
  {
    label: "Indirect pool no balances",
    value: PointDistributionLogsLevel.INDIRECT_POOL_NO_BALANCES,
  },
  {
    label: "Indirect pool total balance zero",
    value: PointDistributionLogsLevel.INDIRECT_POOL_TOTAL_BALANCE_ZERO,
  },
  {
    label: "Process point distribution failed",
    value: PointDistributionLogsLevel.PROCESS_FAILED,
  },
  { label: "No new points", value: PointDistributionLogsLevel.NO_NEW_POINTS },
];

interface FilterPointDistributionLogsProps {
  isLoading: boolean;
  isApplying?: boolean;
  partnersSelect: FilterPartnerResource[];
  vaultsSelect: FilterVaultResource[];
  campaignsSelect: FilterCampaignResource[];
  onApply: (filters: ApplyFiltersPointDistributionLogsType) => void;
  onReset: () => void;
}

export const FilterPointDistributionLogs = ({
  isLoading,
  isApplying,
  partnersSelect,
  onApply,
  onReset,
  vaultsSelect,
  campaignsSelect,
}: FilterPointDistributionLogsProps) => {
  const [selectedPartner, setSelectedPartner] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [selectedVault, setSelectedVault] = useState<string>("all");

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
      selectedEvent,
      selectedLevel,
      selectedVault,
      selectedCampaign,
    });
  }, [
    selectedPartner,
    selectedEvent,
    selectedLevel,
    selectedVault,
    selectedCampaign,
    onApply,
  ]);

  useEffect(() => {
    handleApply();
  }, [handleApply]);

  const handleReset = () => {
    setSelectedPartner("all");
    setSelectedEvent("all");
    setSelectedLevel("all");
    setSelectedCampaign("all");
    setSelectedVault("all");
    onReset();
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-semibold text-muted-foreground flex justify-between items-center">
          <p>Filters</p>
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
          {/* filter event */}
          <Field className="lg:col-span-1">
            <FieldLabel className={"text-xs font-medium text-muted-foreground"}>
              Event
            </FieldLabel>
            {isLoading ? (
              <Skeleton className="h-8" />
            ) : (
              <Select
                items={itemsSelectEvent}
                value={selectedEvent}
                onValueChange={(value) => setSelectedEvent(value ?? "all")}
                disabled={isApplying}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Event</SelectLabel>
                    {itemsSelectEvent.map((item) => (
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

          {/* filter level */}
          <Field className="lg:col-span-1">
            <FieldLabel className={"text-xs font-medium text-muted-foreground"}>
              Level
            </FieldLabel>
            {isLoading ? (
              <Skeleton className="h-8" />
            ) : (
              <Select
                items={itemsSelectLevel}
                value={selectedLevel}
                onValueChange={(value) => setSelectedLevel(value ?? "all")}
                disabled={isApplying}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Level</SelectLabel>
                    {itemsSelectLevel.map((item) => (
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
        </div>
      </CardContent>
    </Card>
  );
};
