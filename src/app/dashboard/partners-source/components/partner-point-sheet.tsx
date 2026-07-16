"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SearchableSelect } from "@/components/searchable-select";
import { createPartnerPoint, updatePartnerPoint } from "@/api/partnerPoints";
import type { PartnerPointResource } from "@/types/partnerPoint";
import type { FilterVaultResource } from "@/types/filters";
import { Textarea } from "@/components/ui/textarea";

const NO_VAULT = "none";

interface PartnerPointSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerPoint?: PartnerPointResource | null;
  vaults: FilterVaultResource[];
  onSuccess: () => void;
}

export const PartnerPointSheet = ({
  open,
  onOpenChange,
  partnerPoint,
  vaults,
  onSuccess,
}: PartnerPointSheetProps) => {
  const isEdit = Boolean(partnerPoint);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [vaultId, setVaultId] = useState<string>(NO_VAULT);
  const [isActive, setIsActive] = useState(true);
  const [isExposure, setIsExposure] = useState(false);
  const [note, setNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (partnerPoint) {
      const a = partnerPoint.attributes;
      setName(a.name ?? "");
      setSlug(a.slug ?? "");
      setVaultId(a.vault_id ?? NO_VAULT);
      setIsActive(a.is_active);
      setIsExposure(a.is_exposure);
      setNote(a.note ?? "");
    } else {
      setName("");
      setSlug("");
      setVaultId(NO_VAULT);
      setIsActive(true);
      setIsExposure(false);
      setNote("");
    }
  }, [open, partnerPoint]);

  const trimmedName = name.trim();
  const trimmedSlug = slug.trim();
  const canSubmit = trimmedName.length > 0 && trimmedSlug.length > 0;

  const vaultItems = vaults.map((vault) => ({
    label: vault.attributes.name,
    value: vault.attributes.vault_id,
  }));

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    const payload = {
      name: trimmedName,
      slug: trimmedSlug,
      vault_id: vaultId === NO_VAULT ? null : vaultId,
      is_active: isActive,
      is_exposure: isExposure,
      note,
    };

    try {
      if (isEdit && partnerPoint) {
        await updatePartnerPoint(partnerPoint.id, payload);
      } else {
        await createPartnerPoint(payload);
      }
      // Close first so the exit animation isn't competing with the list
      // re-render, then revalidate the table data.
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? "Edit Partner Point" : "Create Partner Point"}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the partner point details below."
              : "Add a new partner point and configure its settings."}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-1 flex-col gap-5 overflow-y-auto pr-1">
          <Field>
            <FieldLabel htmlFor="pp-name">Name</FieldLabel>
            <Input
              id="pp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ventuals"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="pp-slug">Slug</FieldLabel>
            <Input
              id="pp-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. ventuals"
            />
          </Field>

          <Field>
            <FieldLabel>Vault</FieldLabel>
            <SearchableSelect
              items={vaultItems}
              value={vaultId}
              onValueChange={setVaultId}
              defaultOption={{ label: "None", value: NO_VAULT }}
              placeholder="Select a vault"
              searchPlaceholder="Search vault..."
            />
          </Field>

          <Field className="lg:col-span-2">
            <FieldLabel className="text-xs font-medium text-muted-foreground">
              Note
            </FieldLabel>
            <Textarea
              placeholder="Note something..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isSubmitting}
            />
          </Field>

          <Field orientation="horizontal" className="justify-between">
            <FieldLabel
              htmlFor="pp-active"
              className="flex-col items-start gap-0.5"
            >
              Active
              <span className="text-xs font-normal text-muted-foreground">
                Whether this partner point is active.
              </span>
            </FieldLabel>
            <Switch
              id="pp-active"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked)}
            />
          </Field>

          <Field orientation="horizontal" className="justify-between">
            <FieldLabel
              htmlFor="pp-exposure"
              className="flex-col items-start gap-0.5"
            >
              Exposure
              <span className="text-xs font-normal text-muted-foreground">
                Whether this partner point is exposed.
              </span>
            </FieldLabel>
            <Switch
              id="pp-exposure"
              checked={isExposure}
              onCheckedChange={(checked) => setIsExposure(checked)}
            />
          </Field>

          {error && <FieldError>{error}</FieldError>}
        </div>

        <SheetFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isEdit ? "Save changes" : "Create"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
