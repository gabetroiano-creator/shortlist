"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/useAuth";
import { snapshotLocal, applyLocal, loadRemote, saveRemote } from "@/lib/sync";

// Renders nothing. While signed in: pulls the cloud copy once on login (then
// reloads so all pages pick it up), and pushes local changes every few seconds.
export default function SyncProvider() {
  const { user } = useAuth();
  const lastPushed = useRef("");

  useEffect(() => {
    if (!user) return;
    const guard = `shortlist:pulled:${user.id}`;
    if (sessionStorage.getItem(guard)) return;
    let cancelled = false;
    (async () => {
      const remote = await loadRemote(user.id);
      if (cancelled) return;
      sessionStorage.setItem(guard, "1");
      if (remote && Object.keys(remote).length) {
        applyLocal(remote);
        lastPushed.current = JSON.stringify(snapshotLocal());
        location.reload();
      } else {
        const snap = snapshotLocal();
        lastPushed.current = JSON.stringify(snap);
        await saveRemote(user.id, snap);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => {
      const snap = snapshotLocal();
      const s = JSON.stringify(snap);
      if (s !== lastPushed.current) {
        lastPushed.current = s;
        saveRemote(user.id, snap);
      }
    }, 4000);
    return () => clearInterval(id);
  }, [user]);

  return null;
}
