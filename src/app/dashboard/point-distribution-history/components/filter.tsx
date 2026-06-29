import { RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import type {
  FilterCampaignResource,
  FilterPartnerResource,
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
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
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

  const handleApply = useCallback(() => {
    onApply({
      selectedCampaign,
      selectedPartner,
      selectedVault,
      dateFrom: date?.from?.toISOString() || undefined,
      dateTo: date?.to?.toISOString() || undefined,
    });
  }, [selectedCampaign, selectedPartner, selectedVault, date, onApply]);

  useEffect(() => {
    handleApply();
  }, [handleApply]);

  const handleReset = () => {
    setSelectedCampaign("all");
    setSelectedPartner("all");
    setSelectedVault("all");
    setDate(undefined);
    onReset();
  };

  return (
    <Card>
      <CardContent className="">
        <div className="grid gap-3 lg:grid-cols-5">
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
                disabled={isApplying}
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
                disabled={isApplying}
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
                disabled={isApplying}
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
