"use client";

import { createCampaignAction, type ActionState } from "@/app/dashboard/actions";
import { useActionState } from "react";
import { useEffect, useRef } from "react";

const initialState: ActionState = {};

export function AddCampaignForm() {
  const [state, formAction, isPending] = useActionState(
    createCampaignAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold">Add campaign</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Create a new points campaign
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Summer rewards"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none ring-[var(--accent)] focus:ring-2"
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="pool_address"
            className="mb-1.5 block text-sm font-medium"
          >
            Pool address
          </label>
          <input
            id="pool_address"
            name="pool_address"
            type="text"
            required
            placeholder="0x..."
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none ring-[var(--accent)] focus:ring-2"
          />
        </div>
      </div>

      {state.error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="mt-4 text-sm text-[var(--success)]" role="status">
          Campaign created successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50"
      >
        {isPending ? "Creating…" : "Create campaign"}
      </button>
    </form>
  );
}
