import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const titles: Record<string, string> = {
  "campaign-templates": "Campaign Templates",
  vaults: "Vaults",
  partners: "Partners",
  "user-campaign-points": "User Campaign Points",
  "point-history": "Point History",
  distributions: "Distributions",
  "backfill-jobs": "Backfill Jobs",
  settings: "Settings",
  "audit-logs": "Audit Logs",
};

export default function DashboardSectionPage({
  params,
}: {
  params: { section: string };
}) {
  const title = titles[params?.section] ?? params?.section ?? "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mock UI page (no business logic)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Coming soon</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Trang này là placeholder để demo layout + navigation.
        </CardContent>
      </Card>
    </div>
  );
}
