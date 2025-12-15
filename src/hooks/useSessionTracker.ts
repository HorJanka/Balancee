"use client";

import { useEffect, useRef } from "react";

const INTERVAL_SECONDS = 10;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // Start a new session after 30 mins of inactivity

export function useSessionTracker() {
  const sessionIdRef = useRef<string | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    const sendHeartbeat = async () => {

      // Don't do anything if the user is not active
      if (document.hidden) return;

      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;

      if (timeSinceLastActivity > SESSION_TIMEOUT_MS) {
        console.log("Session timeout - starting new session");
        sessionIdRef.current = null; // Delete old id, server will generate a new one
      }

      try {
        const res = await fetch("/api/analytics/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            sessionId: sessionIdRef.current,
            incrementBy: INTERVAL_SECONDS 
          }),
        });
        
        const data = await res.json();
        if (data.sessionId) {
          sessionIdRef.current = data.sessionId;
        }
        
        // After successful heartbeat update the activity time
        lastActivityRef.current = now;

      } catch (e) {
        console.error(e);
      }
    };

    // If the user wakes up the tab, update the time
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
         // If user has come back check if we need a new session
         const now = Date.now();
         if (now - lastActivityRef.current > SESSION_TIMEOUT_MS) {
            sessionIdRef.current = null; // Reset
         }
         lastActivityRef.current = now; // Reset the time
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    const intervalId = setInterval(sendHeartbeat, INTERVAL_SECONDS * 1000);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
}