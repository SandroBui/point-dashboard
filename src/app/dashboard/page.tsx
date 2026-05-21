import { auth } from "@/auth";
import { AddCampaignForm } from "@/components/add-campaign-form";
import { CampaignList } from "@/components/campaign-list";
import { SignOutButton } from "@/components/auth-buttons";
import { listCampaigns } from "@/lib/campaigns";

export default async function DashboardPage() {
  const session = await auth();
  let campaigns: Awaited<ReturnType<typeof listCampaigns>> = [];
  let fetchError: string | null = null;

  try {
    campaigns = await listCampaigns();
  } catch (err) {
    fetchError =
      err instanceof Error ? err.message : "Failed to load campaigns.";
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Points Dashboard
            </h1>
            {session?.user?.email && (
              <p className="mt-0.5 text-sm text-[var(--muted)]">
                {session.user.email}
              </p>
            )}
          </div>
          <SignOutButton />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 p-6">
        <section>
          <h2 className="text-lg font-semibold">Campaigns</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage point campaigns and pool addresses
          </p>
        </section>

        {fetchError ? (
          <div
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
            role="alert"
          >
            <p className="font-medium">Could not load campaigns</p>
            <p className="mt-1">{fetchError}</p>
            <p className="mt-2 text-xs opacity-80">
              Check that API_BASE_URL is set and the backend is running.
            </p>
          </div>
        ) : (
          <CampaignList campaigns={campaigns} />
        )}

        <AddCampaignForm />
      </main>
    </div>
  );
}
