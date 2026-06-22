import React from "react";
import { AbsoluteFill } from "remotion";
import { BRAND } from "./brand";
import { Frame, Grad, Mark } from "./frame";

type Slide =
  | { kind: "cover" }
  | { kind: "tip"; n: string; title: string; body: string }
  | { kind: "cta" };

const SLIDES: Slide[] = [
  { kind: "cover" },
  {
    kind: "tip",
    n: "1",
    title: "It's not just programming",
    body: "Mechanical, CAD, electrical, scouting, business — every department wins (or loses) matches.",
  },
  {
    kind: "tip",
    n: "2",
    title: "Brownouts lose matches",
    body: "A sagging battery drops voltage and the robot resets mid-match. Charge and rotate your batteries.",
  },
  {
    kind: "tip",
    n: "3",
    title: "Scouting wins eliminations",
    body: "Alliance picks should come from data — OPR/EPA and picklists — not vibes.",
  },
  {
    kind: "tip",
    n: "4",
    title: "Wire it clean",
    body: "A huge share of robot failures are electrical. Crimp well and build a reliable CAN bus.",
  },
  {
    kind: "tip",
    n: "5",
    title: "The Impact Award isn't about your robot",
    body: "It's judged on your team's effect on others and on FIRST — start documenting early.",
  },
  { kind: "cta" },
];

export const Carousel: React.FC<{ slide: number }> = ({ slide }) => {
  const s = SLIDES[slide] ?? SLIDES[0];

  if (s.kind === "cover") {
    return (
      <Frame>
        <AbsoluteFill style={{ padding: 96, justifyContent: "center", gap: 40 }}>
          <Mark size={120} />
          <div style={{ fontSize: 118, fontWeight: 800, lineHeight: 1.0, letterSpacing: -4, color: BRAND.fg }}>
            5 things <Grad>FRC rookies</Grad> get wrong
          </div>
          <div style={{ fontSize: 40, color: BRAND.muted, fontWeight: 500 }}>
            Save this before your first build season.
          </div>
          <div style={{ marginTop: 10, fontSize: 38, fontWeight: 700, color: BRAND.cyan }}>
            swipe →
          </div>
        </AbsoluteFill>
      </Frame>
    );
  }

  if (s.kind === "cta") {
    return (
      <Frame>
        <AbsoluteFill style={{ padding: 96, justifyContent: "center", alignItems: "center", gap: 40, textAlign: "center" }}>
          <Mark size={150} />
          <div style={{ fontSize: 104, fontWeight: 800, lineHeight: 1.02, letterSpacing: -4, color: BRAND.fg }}>
            Learn all of it — <Grad>free</Grad>
          </div>
          <div style={{ fontSize: 38, color: BRAND.muted, fontWeight: 500 }}>
            393+ web-verified lessons across all 11 departments.
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "26px 52px",
              borderRadius: 999,
              background: BRAND.grad,
              color: "white",
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            learnfrc.systemerr.com
          </div>
        </AbsoluteFill>
      </Frame>
    );
  }

  return (
    <Frame>
      <AbsoluteFill style={{ padding: 96, justifyContent: "center", gap: 44 }}>
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 40,
            background: BRAND.grad,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 90,
            fontWeight: 800,
            color: "white",
          }}
        >
          {s.n}
        </div>
        <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.03, letterSpacing: -3, color: BRAND.fg }}>
          {s.title}
        </div>
        <div style={{ fontSize: 44, color: BRAND.muted, fontWeight: 500, lineHeight: 1.35 }}>
          {s.body}
        </div>
        <div style={{ position: "absolute", bottom: 70, left: 96, fontSize: 30, fontWeight: 700, color: BRAND.muted }}>
          Learn<Grad>FRC</Grad>
        </div>
      </AbsoluteFill>
    </Frame>
  );
};
