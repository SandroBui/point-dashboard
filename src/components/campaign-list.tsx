import { inactiveCampaignAction } from "@/app/dashboard/actions";
import type { Campaign } from "@/types/campaign";

type CampaignListProps = {
  campaigns: Campaign[];
};

export function CampaignList({ campaigns }: CampaignListProps) {
  if (campaigns.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-12 text-center">
        <p className="text-sm font-medium">No campaigns yet</p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Create your first campaign using the form.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background)]">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Pool address</th>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr
                key={campaign.id}
                className="border-b border-[var(--border)] last:border-0"
              >
                <td className="px-4 py-3 font-medium">{campaign.name}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={campaign.status} />
                </td>
                <td className="max-w-[200px] truncate px-4 py-3 font-mono text-xs text-[var(--muted)]">
                  {campaign.pool_address}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--muted)]">
                  {campaign.id}
                </td>
                <td className="px-4 py-3 text-right">
                  {campaign.status === "active" ? (
                    <form
                      action={async () => {
                        "use server";
                        await inactiveCampaignAction(campaign.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="rounded-lg border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted)] transition-colors hover:border-red-300 hover:text-red-600"
                      >
                        Deactivate
                      </button>
                    </form>
                  ) : (
                    <span className="text-xs text-[var(--muted)]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Campaign["status"] }) {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
      }`}
    >
      {status}
    </span>
  );
}
