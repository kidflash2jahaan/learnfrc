import React from "react";
import { AbsoluteFill } from "remotion";
import { BRAND } from "./brand";
import { Frame, Grad, Mark } from "./frame";

type Dept = { name: string; from: string; to: string; topics: string[] };

const DEPTS: Record<string, Dept> = {
  programming: {
    name: "Programming",
    from: "#2f5fff",
    to: "#22d3ee",
    topics: ["WPILib & command-based", "PID, feedforward & SysId", "Swerve, odometry & vision"],
  },
  cad: {
    name: "CAD",
    from: "#7c3aed",
    to: "#22d3ee",
    topics: ["Onshape from scratch", "Gearboxes & design-for-manufacture", "FRCDesignLib parts library"],
  },
  mechanical: {
    name: "Mechanical",
    from: "#f97316",
    to: "#f5b50a",
    topics: ["Drivetrains & gear ratios", "Mechanisms & fabrication", "Pneumatics, end to end"],
  },
  electrical: {
    name: "Electrical",
    from: "#f43f5e",
    to: "#f97316",
    topics: ["roboRIO, PDH & the CAN bus", "Wiring that passes inspection", "Troubleshooting brownouts"],
  },
  scouting: {
    name: "Scouting & Strategy",
    from: "#10b981",
    to: "#22d3ee",
    topics: ["OPR, EPA & Statbotics", "Building a picklist", "Alliance selection"],
  },
  impact: {
    name: "Impact Award",
    from: "#ec4899",
    to: "#7c3aed",
    topics: ["The 10,000-character essay", "The 12 executive summaries", "The 7-minute pitch"],
  },
};

export const DeptPost: React.FC<{ dept: string }> = ({ dept }) => {
  const d = DEPTS[dept] ?? DEPTS.programming;
  return (
    <Frame from={d.from} to={d.to}>
      <AbsoluteFill style={{ padding: 96, justifyContent: "center", gap: 38 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Mark size={64} from={d.from} to={d.to} />
          <div style={{ fontSize: 38, fontWeight: 700, color: BRAND.fg }}>
            Learn<Grad from={d.from} to={d.to}>FRC</Grad>
          </div>
        </div>

        <div style={{ fontSize: 36, fontWeight: 600, color: BRAND.muted, textTransform: "uppercase", letterSpacing: 4 }}>
          Department
        </div>
        <div style={{ fontSize: 116, fontWeight: 800, lineHeight: 0.98, letterSpacing: -4 }}>
          <Grad from={d.from} to={d.to}>{d.name}</Grad>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 8 }}>
          {d.topics.map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  background: `linear-gradient(135deg, ${d.from}, ${d.to})`,
                  flexShrink: 0,
                }}
              />
              <div style={{ fontSize: 44, fontWeight: 600, color: BRAND.fg }}>{t}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 16,
            alignSelf: "flex-start",
            padding: "22px 44px",
            borderRadius: 999,
            background: `linear-gradient(110deg, ${d.from}, ${d.to})`,
            color: "white",
            fontSize: 40,
            fontWeight: 700,
          }}
        >
          Free at learnfrc.systemerr.com
        </div>
      </AbsoluteFill>
    </Frame>
  );
};
