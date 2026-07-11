"use client";

import { RefreshCw, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { SearchableSelect } from "@/components/searchable-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApplyFiltersTokenDistributionTrackingType } from "@/hooks/useGetTokenDistributionTracking";
import type {
  FilterCampaignResource,
  FilterPartnerResource,
} from "@/types/filters";

interface FilterTokenDistributionTrackingProps {
  isLoading: boolean;
  isApplying?: boolean;
  partnersSelect: FilterPartnerResource[];
  campaignsSelect: FilterCampaignResource[];
  onApply: (filters: ApplyFiltersTokenDistributionTrackingType) => void;
  onReset: () => void;
}

export const FilterTokenDistributionTracking = ({
  isLoading,
  isApplying,
  partnersSelect,
  campaignsSelect,
  onApply,
  onReset,
}: FilterTokenDistributionTrackingProps) => {
  const [search, setSearch] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<string>("all");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 600);
    return () => clearTimeout(timeout);
  }, [search]);

  const itemsSelectPartner = useMemo(
    () =>
      partnersSelect?.map((item) => ({
        label: item.attributes.name,
        value: item.attributes.partner_slug,
      })) || [],
    [partnersSelect],
  );

  const itemsSelectCampaign = useMemo(
    () =>
      campaignsSelect?.map((item) => ({
        label: item.attributes.name,
        value: item.attributes.campaign_id,
      })) || [],
    [campaignsSelect],
  );

  const handleApply = useCallback(() => {
    onApply({
      selectedPartner,
      selectedCampaign,
      search: debouncedSearch,
    });
  }, [debouncedSearch, onApply, selectedCampaign, selectedPartner]);

  useEffect(() => {
    handleApply();
  }, [handleApply]);

  const handleReset = () => {
    setSearch("");
    setSelectedPartner("all");
    setSelectedCampaign("all");
    onReset();
  };

  return (
    <Card>
      <CardContent className="">
        <div className="grid gap-3 items-end md:grid-cols-5">
          <Field className="w-full col-span-2">
            <InputGroup>
              <InputGroupInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  handleApply();
                }}
                placeholder="Search wallet address"
                disabled={isApplying}
              />
              <InputGroupAddon align="inline-end">
                <SearchIcon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <p className="text-xs font-medium text-muted-foreground">Partner</p>
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

          <Field>
            <p className="text-xs font-medium text-muted-foreground">
              Campaign
            </p>
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
        </div>
      </CardContent>
    </Card>
  );
};
