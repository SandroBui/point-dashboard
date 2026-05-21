import { SignInButton } from "@/components/auth-buttons";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Points Dashboard
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Sign in to manage campaigns
          </p>
        </div>
        <SignInButton />
      </div>
    </main>
  );
}
