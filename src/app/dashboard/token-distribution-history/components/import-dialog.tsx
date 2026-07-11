"use client";

import { useRef, useState } from "react";
import { AlertCircle, FileSpreadsheet, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { importTokenDistributionTracking } from "@/api/tokenDistributionTracking";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ACCEPTED_EXTENSION = ".csv";
const ACCEPTED_MIME_TYPES = [
  "text/csv",
  "application/csv",
  "application/vnd.ms-excel",
];

function isCsvFile(file: File) {
  const hasCsvExtension = file.name.toLowerCase().endsWith(ACCEPTED_EXTENSION);
  const hasCsvMime = file.type ? ACCEPTED_MIME_TYPES.includes(file.type) : true;
  return hasCsvExtension && hasCsvMime;
}

type ImportTokenDistributionTrackingDialogProps = {
  onImported?: () => void;
};

export function ImportTokenDistributionTrackingDialog({
  onImported,
}: ImportTokenDistributionTrackingDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const resetState = () => {
    setFile(null);
    setErrorMessage("");
    setIsDragging(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleOpenChange = (next: boolean) => {
    if (isImporting) return;
    setOpen(next);
    if (!next) resetState();
  };

  const handleSelectFile = (selected: File | null | undefined) => {
    if (!selected) return;

    if (!isCsvFile(selected)) {
      setFile(null);
      setErrorMessage(
        `Invalid file type. Please select a ${ACCEPTED_EXTENSION} file.`,
      );
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setFile(selected);
    setErrorMessage("");
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isImporting) return;
    handleSelectFile(e.dataTransfer.files?.[0]);
  };

  const handleImport = async () => {
    if (!file || isImporting) return;

    const toastId = toast.loading("Importing token distribution tracking...");
    setIsImporting(true);
    setErrorMessage("");

    try {
      const res = await importTokenDistributionTracking(file);
      const imported = res.data?.imported ?? 0;
      const skippedNonSuccess = res.data?.skipped_non_success ?? 0;
      const skippedDuplicate = res.data?.skipped_duplicate ?? 0;

      onImported?.();

      toast.success(
        `Import completed. Imported ${imported}, skipped non-success ${skippedNonSuccess}, skipped duplicate ${skippedDuplicate}.`,
        { id: toastId },
      );
      setOpen(false);
      resetState();
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Import failed. Please check the file and try again.";
      setErrorMessage(message);
      toast.error(message, { id: toastId });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline">
            <Upload className="size-4" />
            Import
          </Button>
        }
      />
      <DialogContent showCloseButton={!isImporting}>
        <DialogHeader>
          <DialogTitle>Import Token Distribution Tracking</DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import token distribution tracking data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <label
            htmlFor="import-token-distribution-tracking-file"
            onDragOver={(e) => {
              e.preventDefault();
              if (!isImporting) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/30 px-4 py-8 text-center transition-colors hover:bg-muted/50",
              isDragging && "border-ring bg-muted/60",
              isImporting && "pointer-events-none opacity-60",
            )}
          >
            <Upload className="size-7 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">CSV file only</p>
            </div>
            <input
              ref={inputRef}
              id="import-token-distribution-tracking-file"
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              disabled={isImporting}
              onChange={(e) => handleSelectFile(e.target.files?.[0])}
            />
          </label>

          {file && (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
              <FileSpreadsheet className="size-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate text-sm">{file.name}</span>
              {!isImporting && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Remove file"
                  onClick={resetState}
                >
                  <X className="size-3.5" />
                </Button>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" disabled={isImporting}>
                Cancel
              </Button>
            }
          />
          <Button onClick={handleImport} disabled={!file || isImporting}>
            {isImporting && <Loader2 className="size-4 animate-spin" />}
            {isImporting ? "Importing..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
