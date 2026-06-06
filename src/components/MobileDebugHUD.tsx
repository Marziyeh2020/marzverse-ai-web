"use client";

import { useEffect, useState } from "react";

export default function MobileDebugHUD() {
  const [debugInfo, setDebugInfo] = useState({
    isMobile: false,
    particleCount: 6000,
    dpr: 1,
    touchActive: false,
    webgl: false
  });

  useEffect(() => {
    // Basic WebGL support check
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    const webglSupported = !!gl;

    const updateInfo = () => {
      const isMobile = window.innerWidth < 768;
      setDebugInfo(prev => ({
        ...prev,
        isMobile,
        particleCount: isMobile ? 500 : 6000,
        dpr: window.devicePixelRatio,
        webgl: webglSupported
      }));
    };

    updateInfo();
    window.addEventListener("resize", updateInfo);

    // Track touch events globally
    const handleTouchStart = () => setDebugInfo(prev => ({ ...prev, touchActive: true }));
    const handleTouchEnd = () => setDebugInfo(prev => ({ ...prev, touchActive: false }));

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("resize", updateInfo);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  if (!debugInfo.isMobile) return null;

  return (
    <div className="fixed top-4 left-4 z-[99999] bg-black/80 text-[#00FF88] text-[10px] font-mono p-4 rounded border border-[#00FF88]/30 pointer-events-none backdrop-blur-md">
      <h3 className="font-bold mb-2 text-white border-b border-white/20 pb-1">MOBILE DEBUG</h3>
      <div className="flex flex-col gap-1">
        <div>Particle Count: <span className="text-white">{debugInfo.particleCount}</span></div>
        <div>DPR: <span className="text-white">{debugInfo.dpr.toFixed(2)}</span></div>
        <div>Touch Active: <span className="text-white">{debugInfo.touchActive ? "true" : "false"}</span></div>
        <div>WebGL Support: <span className="text-white">{debugInfo.webgl ? "true" : "false"}</span></div>
      </div>
    </div>
  );
}
