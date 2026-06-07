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

import { Campaign } from "@/types/campaign";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import { Input } from "@/components/ui/input";
import { UserCampaignPointsStatus } from "@/constants/userCampaignPoints";
import { ApplyFiltersUserCampaignPointsType } from "@/hooks/useGetUserCampaignPoints";
const itemsSelectStatus = [
  { label: "All", value: "all" },
  { label: "Active", value: UserCampaignPointsStatus.Active },
  { label: "Disabled", value: UserCampaignPointsStatus.Disabled },
];

interface FilterUserCampaignPointsProps {
  isLoading: boolean;
  isApplying?: boolean;
  partnersSelect: { name: string; slug: string }[];
  vaultsSelect: { id: string; attributes: { name: string } }[];
  campaignsSelect: Campaign[];
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

  const itemsSelectPartner = useMemo(() => {
    return (
      partnersSelect?.map((item) => ({
        label: item.name,
        value: item.slug,
      })) || []
    );
  }, [partnersSelect]);

  const itemsSelectVault = useMemo(() => {
    return (
      vaultsSelect?.map((item) => ({
        label: item.attributes.name,
        value: item.id,
      })) || []
    );
  }, [vaultsSelect]);

  const itemsSelectCampaign = useMemo(() => {
    return (
      campaignsSelect?.map((item) => ({
        label: item.name,
        value: item.id,
      })) || []
    );
  }, [campaignsSelect]);

  const handleApply = () => {
    onApply({
      selectedPartner,
      selectedStatus,
      selectedVault,
      search,
      minPoints: rangePoints.min,
      maxPoints: rangePoints.max,
      selectedCampaign,
    });
  };

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

          {/* filter campaign */}
          <Field className="lg:col-span-1">
            <FieldLabel className={"text-xs font-medium text-muted-foreground"}>
              Campaigns
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
                <SelectTrigger className="">
                  <SelectValue placeholder="Campaign" />
                </SelectTrigger>
                <SelectContent className={"w-auto overflow-x-auto"}>
                  <SelectGroup>
                    <SelectLabel>Campaigns</SelectLabel>
                    <SelectItem key={"all"} value={"all"} className={"text-sm"}>
                      All
                    </SelectItem>
                    {itemsSelectCampaign.map((item) => (
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
              />
            </div>
          </Field>
        </div>
      </CardContent>
    </Card>
  );
};
