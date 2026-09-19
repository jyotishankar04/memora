"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePlanFeature } from "@/hooks/use-plan-limit";
import { ProBadge } from "@/components/plan-limit-notice";
import { downloadMemoriesExport } from "@/lib/data-export";
import { toast } from "@/components/ui/toast";
import { clearMemories, deleteAccount, type ClearMemoriesMode, type DeleteAccountMode } from "@/lib/account";
import { logout } from "@/lib/auth";
import { useUser } from "@/context/UserContext";

export default function PrivacySettingsPage() {
  const router = useRouter();
  const { user } = useUser();
  const dataExport = usePlanFeature("dataExport");
  const [exporting, setExporting] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [clearPending, setClearPending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await downloadMemoriesExport();
    } catch {
      toast.add({ title: "Export failed. Please try again.", type: "error" });
    } finally {
      setExporting(false);
    }
  };

  const runClearMemories = async (mode: ClearMemoriesMode) => {
    setClearPending(true);
    try {
      const result = await clearMemories(mode);
      setClearOpen(false);
      toast.add({
        title: mode === "trash" ? "Moved to trash" : "Deleted permanently",
        description: mode === "trash" ? `${result.count ?? 0} memories moved to trash.` : `${result.deleted ?? 0} memories deleted.`,
        type: "success",
      });
    } catch (err) {
      toast.add({ title: err instanceof Error ? err.message : "Couldn't clear your memories.", type: "error" });
    } finally {
      setClearPending(false);
    }
  };

  const runDeleteAccount = async (mode: DeleteAccountMode) => {
    setDeletePending(true);
    try {
      await deleteAccount(mode);
      toast.add({
        title: mode === "soft" ? "Account scheduled for deletion" : "Account deleted",
        description: mode === "soft" ? "Log back in within 30 days to cancel this." : undefined,
        type: "success",
      });
      await logout().catch(() => {});
      router.push("/auth/login");
    } catch (err) {
      setDeletePending(false);
      toast.add({ title: err instanceof Error ? err.message : "Couldn't delete your account.", type: "error" });
    }
  };

  return (
    <div className="space-y-6 max-w-md text-xs font-semibold">

      <div className="space-y-1 pb-4 border-b border-border/25">
        <h3 className="text-sm font-bold text-foreground">Privacy & Data</h3>
        <p className="text-[10px] text-muted-foreground">Manage your personal databases exports.</p>
      </div>

      <div className="space-y-4 text-xs font-semibold text-foreground/80">

        {/* Export Data */}
        <div className="p-4 border border-border bg-card rounded-xl flex items-center justify-between">
          <div>
            <h4 className="text-foreground flex items-center gap-1.5">
              Export all memories
              {!dataExport.loading && !dataExport.enabled && <ProBadge />}
            </h4>
            <p className="text-[9.5px] text-muted-foreground mt-0.5 font-medium">Download JSON dump representing all parsed cards metadata.</p>
          </div>
          {dataExport.enabled ? (
            <Button
              onClick={handleExport}
              disabled={exporting}
              className="h-8 rounded-full text-[10px] font-bold"
            >
              {exporting ? "Exporting..." : "Export"}
            </Button>
          ) : (
            <Button
              disabled
              title={dataExport.loading ? undefined : "Exporting your data is a Pro feature"}
              className="h-8 rounded-full text-[10px] font-bold border border-border bg-transparent text-muted-foreground opacity-60 cursor-not-allowed"
            >
              Pro feature
            </Button>
          )}
        </div>

        {/* Download media */}
        <div className="p-4 border border-border bg-card rounded-xl flex items-center justify-between">
          <div>
            <h4 className="text-foreground">Download your files</h4>
            <p className="text-[9.5px] text-muted-foreground mt-0.5 font-medium">Download zip archive containing all screenshots and document uploads.</p>
          </div>
          <Button disabled title="Coming soon" className="h-8 rounded-full text-[10px] font-bold border border-border bg-transparent text-muted-foreground opacity-60 cursor-not-allowed">
            Coming soon
          </Button>
        </div>

        {/* Delete settings */}
        <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-xl space-y-4">
          <div>
            <h4 className="text-red-500 font-bold">Danger Zone</h4>
            <p className="text-[9.5px] text-muted-foreground mt-0.5 font-medium">Irreversible actions regarding account records.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setClearOpen(true)}
              className="h-8 px-3 rounded-full border border-red-500/20 text-red-500 text-[9.5px] font-bold hover:bg-red-500/10 transition-colors"
            >
              Clear memories
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="h-8 px-3 rounded-full bg-red-500 text-white text-[9.5px] font-bold hover:bg-red-600 transition-colors"
            >
              Delete account
            </button>
          </div>
        </div>

      </div>

      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all memories?</AlertDialogTitle>
            <AlertDialogDescription>
              Choose whether to move everything to Trash (recoverable for 15 days) or delete it all right now, permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={clearPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={clearPending}
              className="border border-border bg-transparent text-foreground hover:bg-muted"
              onClick={() => runClearMemories("trash")}
            >
              Move all to trash
            </AlertDialogAction>
            <AlertDialogAction
              disabled={clearPending}
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => runClearMemories("delete")}
            >
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {user?.email ?? "your account"} and everything in it. Choose a 30-day grace period (log back in
              anytime before then to cancel) or delete everything immediately with no way back.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletePending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deletePending}
              className="border border-border bg-transparent text-foreground hover:bg-muted"
              onClick={() => runDeleteAccount("soft")}
            >
              Deactivate (30-day grace period)
            </AlertDialogAction>
            <AlertDialogAction
              disabled={deletePending}
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => runDeleteAccount("hard")}
            >
              Delete everything now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
