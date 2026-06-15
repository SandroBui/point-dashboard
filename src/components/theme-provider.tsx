"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "./ui/tooltip";
import { Toaster } from "./ui/sonner";

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <SessionProvider>
      <NextThemesProvider {...props}>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </NextThemesProvider>
    </SessionProvider>
  );
}

export { ThemeProvider };
