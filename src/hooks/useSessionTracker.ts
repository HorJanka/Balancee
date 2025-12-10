"use client";

import { useEffect, useRef } from "react";

export function useSessionTracker() {
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    // 1. At start send a signal
    const sendHeartbeat = async () => {
      // Only send if the page is visible (don't measure inactive time)
      if (document.hidden) return;

      try {
        const res = await fetch("/api/analytics/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionIdRef.current }),
        });
        
        const data = await res.json();
        // Save the session Id, so that we can update it
        if (data.sessionId) {
            sessionIdRef.current = data.sessionId;
        }
      } catch (e) {
        console.error("Analytics error", e);
      }
    };

    // First call imidietly
    sendHeartbeat();


    // 2. Update "lastHeartbeat" every 10 seconds
    // More frequently -> more stress on servers
    const intervalId = setInterval(sendHeartbeat, 10000);

    return () => clearInterval(intervalId);
  }, []);
}