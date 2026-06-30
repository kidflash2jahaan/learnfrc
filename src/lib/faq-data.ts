// Shared FAQ data — server-safe (no "use client") so BOTH the homepage
// FAQPage structured data (server) and the <Faq> client component can import it.
export const FAQS = [
  {
    q: "Is LearnFRC free?",
    a: "Yes — completely free. Create an account to track your progress, earn XP and achievements, and pick up where you left off. You can browse every guide without signing in.",
  },
  {
    q: "Do I need any experience to start?",
    a: "No. The Getting Started track assumes zero robotics, coding, or engineering background. Each department goes from fundamentals to advanced, so you can start anywhere that fits your role.",
  },
  {
    q: "Where does the content come from?",
    a: "Every guide is researched and fact-checked against authoritative FRC sources — the official WPILib docs, FIRST Inspires, vendor documentation (REV, CTRE, Limelight), Chief Delphi, and The Blue Alliance. Lessons cite their sources so you can dig deeper.",
  },
  {
    q: "Which departments are covered?",
    a: "All 11 — Getting Started, Mechanical & Build, CAD & Design, Programming & Controls, Electrical & Wiring, Business & Fundraising, Media & Outreach, the Impact Award, Scouting & Strategy, Drive Team, and Safety. Every role on a team has a path.",
  },
  {
    q: "Is this affiliated with FIRST?",
    a: "No. LearnFRC is an independent, student-built learning resource. It is not affiliated with or endorsed by FIRST®. All trademarks belong to their respective owners.",
  },
];
