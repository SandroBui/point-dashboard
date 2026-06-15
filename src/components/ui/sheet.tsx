"use client";

import * as React from "react";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;

function SheetContent({
  className,
  children,
  side = "right",
  showClose = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: "right" | "left";
  showClose?: boolean;
}) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ease-out data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed inset-y-0 z-50 flex h-full w-full max-w-md flex-col gap-4 bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out",
          side === "right" &&
            "right-0 border-l data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full",
          side === "left" &&
            "left-0 border-r data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full",
          className,
        )}
        {...props}
      >
        {children}
        {showClose && (
          <SheetPrimitive.Close
            className="absolute top-4 right-4 rounded-md opacity-70 outline-none transition-opacity hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none [&_svg]:size-4"
            aria-label="Close"
          >
            <XIcon />
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPrimitive.Portal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
