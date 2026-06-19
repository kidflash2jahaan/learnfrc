/**
 * Static catalog of the LearnFRC departments — display name + tagline.
 * Used as a graceful fallback for marketing surfaces before/if the database
 * read fails, and to guarantee ordering. Live DB data takes precedence.
 */
export type CatalogEntry = {
  slug: string;
  name: string;
  tagline: string;
};

export const DEPT_CATALOG: CatalogEntry[] = [
  {
    slug: "getting-started",
    name: "Getting Started with FRC",
    tagline: "New to FIRST Robotics? Start your journey here.",
  },
  {
    slug: "mechanical-build",
    name: "Mechanical, Build & Pneumatics",
    tagline: "Drivetrains, mechanisms, fabrication, and pneumatics.",
  },
  {
    slug: "cad-design",
    name: "CAD & Design",
    tagline: "Design robots in Onshape, SolidWorks & Fusion.",
  },
  {
    slug: "programming-software",
    name: "Programming, Controls & Sensors",
    tagline: "Code the robot with WPILib — plus sensors, vision & control.",
  },
  {
    slug: "electrical-wiring",
    name: "Electrical & Wiring",
    tagline: "Power, the control system, and legal wiring.",
  },
  {
    slug: "business-operations",
    name: "Business, Operations & Fundraising",
    tagline: "Run your team — and fund it — like a real organization.",
  },
  {
    slug: "media-outreach",
    name: "Media, Branding & Outreach",
    tagline: "Branding, media, and community impact.",
  },
  {
    slug: "impact-award",
    name: "The Impact Award",
    tagline: "Pursue FRC's most prestigious award.",
  },
  {
    slug: "scouting-strategy",
    name: "Scouting & Strategy",
    tagline: "Turn match data into winning strategy.",
  },
  {
    slug: "drive-team",
    name: "Drive Team",
    tagline: "Driver, operator, and coach on the field.",
  },
  {
    slug: "safety",
    name: "Safety",
    tagline: "Build a safety-first robotics culture.",
  },
];
