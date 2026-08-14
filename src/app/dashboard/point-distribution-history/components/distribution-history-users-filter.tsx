"use client";

import { SearchIcon } from "lucide-react";

import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface DistributionHistoryUsersFilterProps {
  search: string;
  isApplying?: boolean;
  onSearchChange: (value: string) => void;
  onSearchApply: () => void;
}

export const DistributionHistoryUsersFilter = ({
  search,
  isApplying,
  onSearchChange,
  onSearchApply,
}: DistributionHistoryUsersFilterProps) => {
  return (
    <Field className="w-full max-w-sm">
      <InputGroup>
        <InputGroupInput
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            onSearchApply();
          }}
          placeholder="Search wallet address"
          disabled={isApplying}
        />
        <InputGroupAddon align="inline-end">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
};
