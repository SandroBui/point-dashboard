import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Points Dashboard",
  description: "Manage point campaigns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
