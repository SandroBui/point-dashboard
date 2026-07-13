import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Defense in depth: never render dashboard without a real signed-in user.
  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
