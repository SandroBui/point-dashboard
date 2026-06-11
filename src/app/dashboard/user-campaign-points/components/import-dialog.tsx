"use client";

import { useRef, useState } from "react";
import {
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";

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
import { importUserCampaignPoints } from "@/api/userCampaignsPoints";
import { cn } from "@/lib/utils";

type ImportStatus = "idle" | "loading" | "success" | "error";

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

type ImportUserCampaignPointsDialogProps = {
  onImported?: () => void;
};

export function ImportUserCampaignPointsDialog({
  onImported,
}: ImportUserCampaignPointsDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const isLoading = status === "loading";

  const resetState = () => {
    setFile(null);
    setStatus("idle");
    setMessage("");
    setIsDragging(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleOpenChange = (next: boolean) => {
    if (isLoading) return;
    setOpen(next);
    if (!next) resetState();
  };

  const handleSelectFile = (selected: File | null | undefined) => {
    if (!selected) return;

    if (!isCsvFile(selected)) {
      setFile(null);
      setStatus("error");
      setMessage(
        `Invalid file type. Please select a ${ACCEPTED_EXTENSION} file.`,
      );
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setFile(selected);
    setStatus("idle");
    setMessage("");
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLoading) return;
    handleSelectFile(e.dataTransfer.files?.[0]);
  };

  const handleImport = async () => {
    if (!file || isLoading) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await importUserCampaignPoints(file);
      setStatus("success");
      setMessage(res?.message ?? "User campaign points imported successfully.");
      onImported?.();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error && error.message
          ? error.message
          : "Import failed. Please check the file and try again.",
      );
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
      <DialogContent showCloseButton={!isLoading}>
        <DialogHeader>
          <DialogTitle>Import User Campaign Points</DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import user campaign points.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-8 text-center">
            <CheckCircle2 className="size-10 text-emerald-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Import successful
              </p>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <label
              htmlFor="import-user-campaign-points-file"
              onDragOver={(e) => {
                e.preventDefault();
                if (!isLoading) setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/30 px-4 py-8 text-center transition-colors hover:bg-muted/50",
                isDragging && "border-ring bg-muted/60",
                isLoading && "pointer-events-none opacity-60",
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
                id="import-user-campaign-points-file"
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                disabled={isLoading}
                onChange={(e) => handleSelectFile(e.target.files?.[0])}
              />
            </label>

            {file && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                <FileSpreadsheet className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate text-sm">{file.name}</span>
                {!isLoading && (
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

            {status === "error" && message && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {status === "success" ? (
            <DialogClose render={<Button>Done</Button>} />
          ) : (
            <>
              <DialogClose
                render={
                  <Button variant="outline" disabled={isLoading}>
                    Cancel
                  </Button>
                }
              />
              <Button onClick={handleImport} disabled={!file || isLoading}>
                {isLoading && <Loader2 className="size-4 animate-spin" />}
                {isLoading ? "Importing..." : "Import"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
