"use client";

import { useMemo, useState } from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type SearchableSelectItem = {
  label: string;
  value: string;
};

type SearchableSelectProps = {
  items: SearchableSelectItem[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  includeAll?: boolean;
  defaultOption?: SearchableSelectItem;
  disabled?: boolean;
  className?: string;
};

export function SearchableSelect({
  items,
  value,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  includeAll = true,
  defaultOption = { label: "All", value: "all" },
  disabled = false,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const allItems = useMemo(() => {
    const base = includeAll ? [defaultOption, ...items] : items;
    const seen = new Set<string>();

    return base.filter((item) => {
      if (seen.has(item.value)) return false;
      seen.add(item.value);
      return true;
    });
  }, [items, includeAll, defaultOption]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return allItems;

    return allItems.filter((item) =>
      item.label.toLowerCase().includes(query),
    );
  }, [allItems, search]);

  const selectedLabel =
    allItems.find((item) => item.value === value)?.label ?? placeholder;

  const isDefaultSelected = includeAll && value === defaultOption.value;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        disabled={disabled}
        render={
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-8 w-full justify-between px-2.5 font-normal",
              className,
            )}
          >
            <span
              className={cn(
                "truncate",
                isDefaultSelected && "text-muted-foreground",
              )}
            >
              {selectedLabel}
            </span>
            <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
          </Button>
        }
      />
      <PopoverContent className="w-(--anchor-width) min-w-36 p-0" align="start">
        <div className="border-b p-2">
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-8"
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto p-1">
          {filteredItems.length === 0 ? (
            <p className="px-2 py-4 text-center text-sm text-muted-foreground">
              No results
            </p>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.value}
                type="button"
                className={cn(
                  "relative flex w-full cursor-default items-center rounded-md py-1.5 pr-8 pl-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  value === item.value && "bg-accent",
                )}
                onClick={() => {
                  onValueChange(item.value);
                  setOpen(false);
                }}
              >
                <span className="truncate">{item.label}</span>
                {value === item.value && (
                  <CheckIcon className="absolute right-2 size-4" />
                )}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
