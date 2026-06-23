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
import type { FilterVaultResource } from "@/types/filters";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const itemsSelectStatus = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

interface FilterPartnerPointProps {
  isLoading: boolean;
  isApplying?: boolean;
  vaultsSelect: FilterVaultResource[];
  onApply: ({
    selectedStatus,
    selectedVault,
    search,
  }: {
    selectedStatus: string;
    selectedVault: string;
    search: string;
  }) => void;
  onReset: () => void;
}

export const FilterPartnerPoint = ({
  isLoading,
  isApplying,
  vaultsSelect,
  onApply,
  onReset,
}: FilterPartnerPointProps) => {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedVault, setSelectedVault] = useState<string>("all");

  // Debounce amount để tránh spam
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 600);
    return () => clearTimeout(t);
  }, [search]);

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
      selectedStatus,
      selectedVault,
      search: debouncedSearch,
    });
  }, [debouncedSearch, selectedStatus, selectedVault, onApply]);

  useEffect(() => {
    handleApply();
  }, [handleApply]);

  const handleReset = () => {
    setSearch("");
    setSelectedStatus("all");
    setSelectedVault("all");
    onReset();
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-semibold text-muted-foreground flex justify-between items-center">
          <Field className="max-w-sm">
            <InputGroup>
              <InputGroupInput
                id="partner-point-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  handleApply();
                }}
                placeholder="Search by name or slug..."
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
        </div>
      </CardContent>
    </Card>
  );
};
