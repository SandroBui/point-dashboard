import Link from "next/link";
import {
  Calendar,
  ChevronDown,
  Download,
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  SearchIcon,
  SlidersHorizontal,
  Waypoints,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

type CampaignRow = {
  id: string;
  name: string;
  description: string;
  partner: string;
  vault: string;
  status: "Active" | "Paused" | "Draft" | "Completed";
  period: string;
  totalPoints: string;
  users: string;
  distributedLabel: string;
  distributedPct: number;
  iconBg: string;
};

const rows: CampaignRow[] = [
  {
    id: "1",
    name: "Spring Campaign 2024",
    description: "Spring season rewards campaign",
    partner: "Partner A",
    vault: "Vault A",
    status: "Active",
    period: "May 1, 2024 – May 31, 2024",
    totalPoints: "100,000,000 PTS",
    users: "12,456",
    distributedLabel: "75,450,000 (75.45%)",
    distributedPct: 75.45,
    iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  },
  {
    id: "2",
    name: "DeFi Summer Rewards",
    description: "Summer DeFi ecosystem rewards",
    partner: "Partner B",
    vault: "Vault B",
    status: "Active",
    period: "Apr 15, 2024 – Jun 15, 2024",
    totalPoints: "250,000,000 PTS",
    users: "18,789",
    distributedLabel: "125,750,000 (50.30%)",
    distributedPct: 50.3,
    iconBg: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  },
  {
    id: "3",
    name: "NFT Community Rewards",
    description: "Rewards for NFT community",
    partner: "Partner C",
    vault: "Vault C",
    status: "Paused",
    period: "May 1, 2024 – May 30, 2024",
    totalPoints: "50,000,000 PTS",
    users: "8,234",
    distributedLabel: "25,000,000 (50.00%)",
    distributedPct: 50,
    iconBg: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  },
  {
    id: "4",
    name: "Trading Competition",
    description: "Trading volume competition",
    partner: "Partner A",
    vault: "Vault A",
    status: "Completed",
    period: "Mar 1, 2024 – Apr 30, 2024",
    totalPoints: "75,000,000 PTS",
    users: "15,678",
    distributedLabel: "75,000,000 (100.00%)",
    distributedPct: 100,
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "5",
    name: "Liquidity Mining Phase 2",
    description: "Second phase liquidity incentives",
    partner: "Partner D",
    vault: "Vault D",
    status: "Draft",
    period: "Jun 1, 2024 – Jun 30, 2024",
    totalPoints: "120,000,000 PTS",
    users: "—",
    distributedLabel: "0 (0.00%)",
    distributedPct: 0,
    iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  },
];

function statusBadgeVariant(status: CampaignRow["status"]) {
  switch (status) {
    case "Active":
      return "success";
    case "Paused":
      return "warning";
    case "Completed":
      return "secondary";
    case "Draft":
      return "muted";
  }
}

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all campaigns and their configurations
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* <Button variant="outline">
            <SlidersHorizontal className="size-4" />
            Columns
          </Button> */}
          <Button>
            <Plus className="size-4" />
            Create Campaign
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-semibold text-muted-foreground flex justify-between items-center">
            <Field className="max-w-sm">
              <InputGroup>
                <InputGroupInput
                  id="inline-end-input"
                  placeholder="Search..."
                />
                <InputGroupAddon align="inline-end">
                  <SearchIcon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button variant="outline">
                <Filter className="size-4" />
                Filters
              </Button>
              <Button variant="ghost">
                <RefreshCw className="size-4" />
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-3 lg:grid-cols-5">
            {[
              { label: "Status", value: "All Status" },
              { label: "Partner", value: "All Partners" },
              { label: "Vault", value: "All Vaults" },
              { label: "Tags", value: "All Tags" },
            ].map((item) => (
              <div key={item.label} className="lg:col-span-1">
                <div className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </div>
                <div className="relative mt-1">
                  <select
                    className={cn(
                      "flex h-9 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm shadow-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                    )}
                    defaultValue={item.value}
                  >
                    <option>{item.value}</option>
                    <option>Option A</option>
                    <option>Option B</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-2.5 size-4 text-muted-foreground" />
                </div>
              </div>
            ))}

            <div className="lg:col-span-1">
              <div className="text-xs font-medium text-muted-foreground">
                Date Range
              </div>
              <Button variant="outline" className="mt-1 w-full justify-between">
                <span className="truncate text-sm">
                  May 1, 2024 – May 31, 2024
                </span>
                <Calendar className="size-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center gap-1">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold">
              Total {rows.length} campaigns
            </CardTitle>
            <div className="text-xs text-muted-foreground">
              Showing 1 to {rows.length} of {rows.length} results
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="size-4" />
              Export
            </Button>
            <Button variant="outline">
              <SlidersHorizontal className="size-4" />
              Columns
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table className="min-w-262.5">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[340px]">Campaign</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Vault</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Total Points</TableHead>
                <TableHead className="text-right">Users</TableHead>
                <TableHead className="w-[220px]">Distributed</TableHead>
                <TableHead className="w-[72px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-border",
                          row.iconBg,
                        )}
                      >
                        <Waypoints className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium">{row.name}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {row.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.partner}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.vault}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(row.status)}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.period}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {row.totalPoints}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {row.users}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        {row.distributedLabel}
                      </div>
                      <Progress value={row.distributedPct} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" aria-label="Edit">
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="More actions"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-muted-foreground">
              Showing 1 to {rows.length} of {rows.length} results
            </div>
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm">
                  1
                </Button>
                <Button variant="ghost" size="sm">
                  2
                </Button>
                <Button variant="ghost" size="sm">
                  3
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">10 / page</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground">
        <Link href="/dashboard">Back to dashboard</Link>
      </div>
    </div>
  );
}
