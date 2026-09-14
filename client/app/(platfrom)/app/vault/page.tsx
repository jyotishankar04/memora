"use client";

import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LockPasswordIcon as Lock,
  Layers01Icon as Layers,
  FileTextIcon as FileText,
  RotateCcwIcon as RotateCcw,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { Reveal } from "@/components/ui/reveal";
import { useMemoriesQuery, useUpdateCollectionMutation, useUpdateMemoryMutation } from "@/context/MemoryContext";
import { listCollections } from "@/lib/collections";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLockVaultMutation, useSetVaultPinMutation, useUnlockVaultMutation, useVaultStatusQuery } from "@/hooks/use-vault";

export default function VaultPage() {
  const status = useVaultStatusQuery();

  if (status.isLoading) return <PageSkeleton />;

  if (status.isError) {
    return (
      <div className="mx-auto max-w-sm px-6 py-20 text-center">
        <p className="text-sm text-muted-foreground">Couldn&apos;t load the vault. Try reloading.</p>
      </div>
    );
  }

  if (!status.data?.hasPin) return <SetupGate />;
  if (!status.data.unlocked) return <UnlockGate />;
  return <VaultContents />;
}

function GateShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Reveal className="mx-auto max-w-sm py-20 text-center">
      <div className="relative mx-auto mb-6 flex h-14 w-14 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-card shadow-md">
          <HugeiconsIcon icon={Lock} strokeWidth={2.25} className="h-6 w-6 text-primary" />
        </div>
      </div>
      <h1 className="text-xl font-bold tracking-tight">{title}</h1>
      <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-6">{children}</div>
    </Reveal>
  );
}

function SetupGate() {
  const [pin, setPin] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const setPinMutation = useSetVaultPinMutation();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pin.length < 4 || setPinMutation.isPending) return;
    if (pin !== confirm) {
      toast.add({ title: "PINs don't match", type: "error" });
      return;
    }
    try {
      await setPinMutation.mutateAsync({ newPin: pin });
      toast.add({ title: "Vault PIN set", type: "success" });
    } catch (err) {
      toast.add({ title: err instanceof Error ? err.message : "Couldn't set the PIN.", type: "error" });
    }
  }

  return (
    <GateShell
      title="Set up your vault"
      description="Pick a PIN. Anything you move into the vault is hidden everywhere else — search, the graph, insights, sharing — until you enter it."
    >
      <form onSubmit={submit} className="space-y-3">
        <Input
          type="password"
          inputMode="numeric"
          required
          autoFocus
          minLength={4}
          value={pin}
          onChange={(event) => setPin(event.target.value)}
          placeholder="New PIN"
          className="h-9 text-center text-xs"
        />
        <Input
          type="password"
          inputMode="numeric"
          required
          minLength={4}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          placeholder="Confirm PIN"
          className="h-9 text-center text-xs"
        />
        <Button type="submit" size="lg" disabled={setPinMutation.isPending || pin.length < 4} className="w-full rounded-full">
          {setPinMutation.isPending ? "Saving…" : "Set PIN"}
        </Button>
      </form>
    </GateShell>
  );
}

function UnlockGate() {
  const [pin, setPin] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const unlockMutation = useUnlockVaultMutation();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!pin || unlockMutation.isPending) return;
    setError(null);
    try {
      await unlockMutation.mutateAsync(pin);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Incorrect PIN.");
    }
  }

  return (
    <GateShell title="Vault is locked" description="Enter your PIN to see what's inside.">
      <form onSubmit={submit} className="space-y-3">
        <Input
          type="password"
          inputMode="numeric"
          required
          autoFocus
          value={pin}
          onChange={(event) => setPin(event.target.value)}
          placeholder="PIN"
          className="h-9 text-center text-xs"
          aria-invalid={Boolean(error)}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button type="submit" size="lg" disabled={unlockMutation.isPending || !pin} className="w-full rounded-full">
          {unlockMutation.isPending ? "Checking…" : "Unlock"}
        </Button>
      </form>
    </GateShell>
  );
}

function VaultContents() {
  const queryClient = useQueryClient();
  const memoriesKey = ["memories", { isVaulted: true, limit: 100 }] as const;
  const collectionsKey = ["collections", { vaulted: true }] as const;
  const { data: memoriesData, isLoading: memoriesLoading } = useMemoriesQuery({ isVaulted: true, limit: 100 });
  const collectionsQuery = useQuery({ queryKey: collectionsKey, queryFn: () => listCollections(false, true) });
  const lockMutation = useLockVaultMutation();
  const unvaultMemory = useUpdateMemoryMutation();
  const unvaultCollection = useUpdateCollectionMutation();

  // The generic mutations' own onSettled already invalidates the broad
  // ["memories"]/["collections"] prefixes, which normally refetches every
  // observer including this one. Belt-and-suspenders: this page's own two
  // vault-scoped keys are invalidated explicitly too, so a removal is
  // guaranteed to disappear from this exact view without waiting on a
  // reload — cheap, since a no-op invalidate on an already-fresh key costs
  // nothing.
  const refreshVaultViews = () => {
    queryClient.invalidateQueries({ queryKey: memoriesKey });
    queryClient.invalidateQueries({ queryKey: collectionsKey });
  };

  const memories = memoriesData?.items ?? [];
  const collections = collectionsQuery.data ?? [];
  const loading = memoriesLoading || collectionsQuery.isLoading;
  const empty = !loading && memories.length === 0 && collections.length === 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-lg font-bold text-foreground">Vault</h1>
          <p className="text-xs text-muted-foreground">
            Hidden from search, the graph, insights, and sharing until you unlock it.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={lockMutation.isPending}
          onClick={() => lockMutation.mutate()}
          className="h-8 shrink-0 rounded-full px-3 text-[11px] font-semibold"
        >
          <HugeiconsIcon icon={Lock} strokeWidth={2.25} className="h-3 w-3" /> Lock now
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : empty ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-12 text-center text-xs text-muted-foreground">
          Nothing in the vault yet. Use &ldquo;Move to vault&rdquo; on a memory or collection to hide it here.
        </p>
      ) : (
        <div className="space-y-6">
          {collections.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-xs font-bold text-foreground">Collections</h2>
              <ul className="space-y-2">
                {collections.map((collection, index) => (
                  <Reveal key={collection.id} index={Math.min(index, 6)}>
                    <li className="flex items-center gap-3 rounded-xl border border-border p-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <HugeiconsIcon icon={Layers} strokeWidth={2.25} className="h-4 w-4" />
                      </span>
                      <Link href={`/app/collections/${collection.id}`} className="min-w-0 flex-1 truncate text-xs font-semibold text-foreground hover:text-primary">
                        {collection.name}
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={unvaultCollection.isPending}
                        onClick={async () => {
                          try {
                            await unvaultCollection.mutateAsync({ id: collection.id, patch: { isVaulted: false } });
                            refreshVaultViews();
                            toast.add({ title: "Removed from vault", description: collection.name, type: "success" });
                          } catch (err) {
                            toast.add({ title: err instanceof Error ? err.message : "Couldn't remove that.", type: "error" });
                          }
                        }}
                        className="h-7 shrink-0 rounded-full px-2.5 text-[10px]"
                      >
                        <HugeiconsIcon icon={RotateCcw} strokeWidth={2.25} className="h-3 w-3" /> Remove
                      </Button>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </section>
          )}

          {memories.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-xs font-bold text-foreground">Memories</h2>
              <ul className="space-y-2">
                {memories.map((memory, index) => (
                  <Reveal key={memory.id} index={Math.min(index, 8)}>
                    <li className="flex items-center gap-3 rounded-xl border border-border p-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <HugeiconsIcon icon={FileText} strokeWidth={2.25} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-xs font-semibold text-foreground">{memory.title}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={unvaultMemory.isPending}
                        onClick={async () => {
                          try {
                            await unvaultMemory.mutateAsync({ id: memory.id, patch: { isVaulted: false } });
                            refreshVaultViews();
                            toast.add({ title: "Removed from vault", description: memory.title, type: "success" });
                          } catch (err) {
                            toast.add({ title: err instanceof Error ? err.message : "Couldn't remove that.", type: "error" });
                          }
                        }}
                        className="h-7 shrink-0 rounded-full px-2.5 text-[10px]"
                      >
                        <HugeiconsIcon icon={RotateCcw} strokeWidth={2.25} className="h-3 w-3" /> Remove
                      </Button>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}
