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

interface FilterUserCampaignPointHistoryProps {
  isLoading: boolean;
  isApplying?: boolean;
  partnersSelect: FilterPartnerResource[];
  campaignsSelect: FilterCampaignResource[];
  vaultsSelect: FilterVaultResource[];
  onApply: ({
    userAddress,
    selectedCampaign,
    selectedPartner,
    selectedVault,
    dateFrom,
    dateTo,
  }: {
    userAddress: string;
    selectedCampaign: string;
    selectedPartner: string;
    selectedVault: string;
    dateFrom?: string;
    dateTo?: string;
  }) => void;
  onReset: () => void;
}

export const FilterUserCampaignPointHistory = ({
  isLoading,
  isApplying,
  partnersSelect,
  campaignsSelect,
  vaultsSelect,
  onApply,
  onReset,
}: FilterUserCampaignPointHistoryProps) => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [userAddress, setUserAddress] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [selectedPartner, setSelectedPartner] = useState<string>("all");
  const [selectedVault, setSelectedVault] = useState<string>("all");

  const itemsSelectPartner = useMemo(() => {
    return (
      partnersSelect?.map((item) => ({
        label: item.attributes.name,
        value: item.id,
      })) || []
    );
  }, [partnersSelect]);

  const itemsSelectCampaign = useMemo(() => {
    return (
      campaignsSelect?.map((item) => ({
        label: item.attributes.name,
        value: item.id,
      })) || []
    );
  }, [campaignsSelect]);

  const itemsSelectVault = useMemo(() => {
    return (
      vaultsSelect?.map((item) => ({
        label: item.attributes.name,
        value: item.id,
      })) || []
    );
  }, [vaultsSelect]);

  const handleApply = () => {
    onApply({
      userAddress,
      selectedCampaign,
      selectedPartner,
      selectedVault,
      dateFrom: date?.from?.toISOString() || undefined,
      dateTo: date?.to?.toISOString() || undefined,
    });
  };

  const handleReset = () => {
    setUserAddress("");
    setSelectedCampaign("all");
    setSelectedPartner("all");
    setSelectedVault("all");
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
                id="user-address-input"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  handleApply();
                }}
                placeholder="Search by user address..."
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
        <div className="grid gap-3 lg:grid-cols-4">
          <Field className="lg:col-span-1">
            <FieldLabel className="text-xs font-medium text-muted-foreground">
              Campaign
            </FieldLabel>
            {isLoading ? (
              <Skeleton className="h-8" />
            ) : (
              <Select
                items={itemsSelectCampaign.concat({
                  label: "All",
                  value: "all",
                })}
                value={selectedCampaign}
                onValueChange={(value) => setSelectedCampaign(value ?? "all")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Campaign</SelectLabel>
                    <SelectItem key="all" value="all" className="text-sm">
                      All
                    </SelectItem>
                    {itemsSelectCampaign.map((item) => (
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
          </Field>

          <Field className="lg:col-span-1">
            <FieldLabel className="text-xs font-medium text-muted-foreground">
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
                <SelectTrigger>
                  <SelectValue placeholder="Partner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Partner</SelectLabel>
                    <SelectItem key="all" value="all" className="text-sm">
                      All
                    </SelectItem>
                    {itemsSelectPartner.map((item) => (
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
          </Field>

          <Field className="lg:col-span-1">
            <FieldLabel className="text-xs font-medium text-muted-foreground">
              Vault
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
                <SelectTrigger>
                  <SelectValue placeholder="Vault" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Vault</SelectLabel>
                    <SelectItem key="all" value="all" className="text-sm">
                      All
                    </SelectItem>
                    {itemsSelectVault.map((item) => (
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
