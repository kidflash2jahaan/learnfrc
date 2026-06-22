import React from "react";
import { AbsoluteFill } from "remotion";
import { BRAND, DEPARTMENTS } from "./brand";
import { Frame, Grad, Mark, Chip } from "./frame";

export const Variant: React.FC<{ variant: number }> = ({ variant }) => {
  if (variant === 1) {
    // "Every department"
    return (
      <Frame>
        <AbsoluteFill style={{ padding: 96, justifyContent: "center", gap: 36 }}>
          <Mark size={96} />
          <div style={{ fontSize: 60, fontWeight: 600, color: BRAND.muted }}>Not just code.</div>
          <div style={{ fontSize: 110, fontWeight: 800, lineHeight: 1.0, letterSpacing: -4, color: BRAND.fg }}>
            <Grad>Every department</Grad> of FRC, in one place.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            {DEPARTMENTS.map((d) => (
              <Chip key={d}>{d}</Chip>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 40, fontWeight: 700, color: BRAND.cyan }}>
            learnfrc.systemerr.com
          </div>
        </AbsoluteFill>
      </Frame>
    );
  }

  if (variant === 2) {
    // "Built by a student"
    return (
      <Frame from="#ec4899" to="#7c3aed">
        <AbsoluteFill style={{ padding: 96, justifyContent: "center", alignItems: "center", gap: 40, textAlign: "center" }}>
          <Mark size={150} from="#ec4899" to="#7c3aed" />
          <div style={{ fontSize: 104, fontWeight: 800, lineHeight: 1.04, letterSpacing: -4, color: BRAND.fg }}>
            Built by an <Grad from="#ec4899" to="#7c3aed">FRC student</Grad>, for FRC students.
          </div>
          <div style={{ fontSize: 42, color: BRAND.muted, fontWeight: 500 }}>
            393+ free, web-verified lessons across every department.
          </div>
          <div style={{ fontSize: 34, color: BRAND.fg, fontWeight: 600 }}>
            Jahaan Pardhanani · Software Lead, Sage Hill Robotics 5835
          </div>
          <div
            style={{
              marginTop: 8,
              padding: "24px 50px",
              borderRadius: 999,
              background: "linear-gradient(110deg, #ec4899, #7c3aed)",
              color: "white",
              fontSize: 42,
              fontWeight: 700,
            }}
          >
            learnfrc.systemerr.com
          </div>
        </AbsoluteFill>
      </Frame>
    );
  }

  // variant 0 — "Free"
  return (
    <Frame>
      <AbsoluteFill style={{ padding: 96, justifyContent: "center", gap: 30 }}>
        <Mark size={110} />
        <div style={{ fontSize: 120, fontWeight: 800, lineHeight: 0.98, letterSpacing: -5, color: BRAND.fg }}>
          Master FRC.
        </div>
        <div style={{ fontSize: 240, fontWeight: 800, lineHeight: 0.9, letterSpacing: -10 }}>
          <Grad>$0.</Grad>
        </div>
        <div style={{ fontSize: 44, color: BRAND.muted, fontWeight: 500, lineHeight: 1.3 }}>
          393+ lessons · every department · quizzes &amp; certificates · zero paywall.
        </div>
        <div style={{ marginTop: 8, fontSize: 42, fontWeight: 700, color: BRAND.cyan }}>
          learnfrc.systemerr.com
        </div>
      </AbsoluteFill>
    </Frame>
  );
};
