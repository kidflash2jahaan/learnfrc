import React from "react";
import { AbsoluteFill } from "remotion";
import { BRAND } from "./brand";

export const Grad: React.FC<{
  children: React.ReactNode;
  from?: string;
  to?: string;
}> = ({ children, from = BRAND.blue, to = BRAND.cyan }) => (
  <span
    style={{
      backgroundImage: `linear-gradient(110deg, ${from}, ${to})`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    }}
  >
    {children}
  </span>
);

export const Mark: React.FC<{ size: number; from?: string; to?: string }> = ({
  size,
  from = BRAND.blue,
  to = BRAND.cyan,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: `linear-gradient(135deg, ${from}, ${to})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="8" width="16" height="11" rx="3" stroke="white" strokeWidth="1.7" />
      <circle cx="9" cy="13.2" r="1.4" fill="white" />
      <circle cx="15" cy="13.2" r="1.4" fill="white" />
      <path d="M12 3.9V7.6M9.4 16.4h5.2" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="3" r="1.4" fill="white" />
    </svg>
  </div>
);

export const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      padding: "14px 26px",
      borderRadius: 999,
      border: `1px solid ${BRAND.border}`,
      background: "rgba(255,255,255,0.04)",
      fontSize: 32,
      fontWeight: 600,
      color: BRAND.fg,
    }}
  >
    {children}
  </div>
);

export const Frame: React.FC<{
  children: React.ReactNode;
  from?: string;
  to?: string;
}> = ({ children, from = BRAND.blue, to = BRAND.cyan }) => (
  <AbsoluteFill style={{ backgroundColor: BRAND.bg, fontFamily: BRAND.font }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(55% 40% at 50% 0%, ${from}55, transparent 60%), radial-gradient(50% 38% at 100% 100%, ${to}40, transparent 60%)`,
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(80% 75% at 50% 45%, black, transparent 92%)",
      }}
    />
    <AbsoluteFill style={{ boxShadow: "inset 0 0 300px 70px rgba(0,0,0,0.5)" }} />
    {children}
  </AbsoluteFill>
);
