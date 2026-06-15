import { Filter, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import type {
  FilterCampaignResource,
  FilterPartnerResource,
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
import { SearchableSelect } from "@/components/searchable-select";

interface FilterPointDistributionHistoryProps {
  isLoading: boolean;
  isApplying?: boolean;
  partnersSelect: FilterPartnerResource[];
  campaignsSelect: FilterCampaignResource[];
  vaultsSelect: FilterVaultResource[];
  onApply: ({
    selectedCampaign,
    selectedPartner,
    selectedVault,
    dateFrom,
    dateTo,
  }: {
    selectedCampaign: string;
    selectedPartner: string;
    selectedVault: string;
    dateFrom?: string;
    dateTo?: string;
  }) => void;
  onReset: () => void;
}

export const FilterPointDistributionHistory = ({
  isLoading,
  isApplying,
  partnersSelect,
  campaignsSelect,
  vaultsSelect,
  onApply,
  onReset,
}: FilterPointDistributionHistoryProps) => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [selectedPartner, setSelectedPartner] = useState<string>("all");
  const [selectedVault, setSelectedVault] = useState<string>("all");

  const itemsSelectPartner = useMemo(() => {
    return (
      partnersSelect?.map((item) => ({
        label: item.attributes.name,
        value: item.attributes.partner_slug,
      })) || []
    );
  }, [partnersSelect]);

  const itemsSelectCampaign = useMemo(() => {
    return (
      campaignsSelect?.map((item) => ({
        label: item.attributes.name,
        value: item.attributes.campaign_id,
      })) || []
    );
  }, [campaignsSelect]);

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
      selectedCampaign,
      selectedPartner,
      selectedVault,
      dateFrom: date?.from?.toISOString() || undefined,
      dateTo: date?.to?.toISOString() || undefined,
    });
  };

  const handleReset = () => {
    setSelectedCampaign("all");
    setSelectedPartner("all");
    setSelectedVault("all");
    setDate(undefined);
    onReset();
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
          <span>Filters</span>
          <div className="flex flex-wrap items-center justify-end gap-2">
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
              Apply
            </Button>
            <Button variant="ghost" disabled={isApplying} onClick={handleReset}>
              <RefreshCw className="size-4" />
              Reset
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-3 lg:grid-cols-4">
          <Field className="lg:col-span-1">
            <FieldLabel className="text-xs font-medium text-muted-foreground">
              Campaign
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
              />
            )}
          </Field>

          <Field className="lg:col-span-1">
            <FieldLabel className="text-xs font-medium text-muted-foreground">
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
              />
            )}
          </Field>

          <Field className="lg:col-span-1">
            <FieldLabel className="text-xs font-medium text-muted-foreground">
              Vault
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
              />
            )}
          </Field>

          <Field className="lg:col-span-1">
            <FieldLabel
              htmlFor="date-picker-range"
              className="text-xs font-medium text-muted-foreground"
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
