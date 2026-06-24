"use client";

import * as React from "react";

/**
 * Pings the presence endpoint every 60s so the admin panel can show who is
 * online. Only fires when a Supabase auth cookie (sb-*) is present, so
 * anonymous visitors never trigger it.
 */
export function PresenceBeacon() {
  React.useEffect(() => {
    const signedIn = () => document.cookie.includes("sb-");
    if (!signedIn()) return;

    const ping = () => {
      if (!signedIn()) return;
      fetch("/api/presence", { method: "POST", keepalive: true }).catch(() => {});
    };

    ping();
    const id = setInterval(ping, 60_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") ping();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return null;
}
