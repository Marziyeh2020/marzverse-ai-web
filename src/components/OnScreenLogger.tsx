"use client";
import React, { useEffect, useState } from "react";

export function logToScreen(msg: string) {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("onscreen-log", { detail: msg });
    window.dispatchEvent(event);
  }
}

export default function OnScreenLogger() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const handleLog = (e: any) => {
      setLogs((prev) => [...prev, e.detail]);
    };
    window.addEventListener("onscreen-log", handleLog);
    return () => window.removeEventListener("onscreen-log", handleLog);
  }, []);

  if (logs.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 z-[9999] bg-black/80 text-green-400 font-mono text-xs p-4 pointer-events-none w-full max-h-[50vh] overflow-auto">
      <h3 className="text-white mb-2">DEBUG LOGS:</h3>
      {logs.map((log, i) => (
        <div key={i}>{log}</div>
      ))}
    </div>
  );
}
