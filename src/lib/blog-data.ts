export interface Article {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  date: string; // YYYY-MM-DD
  readMins: number;
  content: string; // markdown
}

export const ARTICLES: Article[] = [
  {
    slug: "how-to-start-an-frc-team",
    title: "How to Start an FRC Team: A Complete Beginner's Guide",
    description:
      "Everything you need to start a FIRST Robotics Competition (FRC) team — costs, registration, mentors, space, timeline, and grants that cover your first event.",
    keywords: [
      "how to start an FRC team",
      "start a FIRST robotics team",
      "FRC team registration",
      "FRC cost",
      "new FRC team",
    ],
    date: "2026-06-22",
    readMins: 7,
    content: `Starting a FIRST Robotics Competition team feels huge — a 120-pound robot, a six-week build season, thousands of dollars. But thousands of teams started exactly where you are. Here's the honest, practical path from "we want a team" to your first match.

## What FRC actually is

FRC is the flagship high-school program of *FIRST*. Each January, every team worldwide gets the same game at **Kickoff**, then has about six weeks to design, build, and program a robot to play it. Teams compete at Regional or District events in the spring, with the season culminating at the **FIRST Championship** in Houston.

It is not just engineering: a strong team needs people doing mechanical, CAD, programming, electrical, scouting, strategy, business, fundraising, and outreach. That breadth is good news — there's a role for almost anyone.

## Step 1: Find your people

You need three things before anything else:

- **Students.** You can start with as few as 5–10 committed members. Quality of commitment matters far more than headcount in year one.
- **At least one adult mentor / lead coach.** This is required for registration. A teacher, parent, or local engineer all work — they don't need robotics experience, just reliability.
- **A host organization.** Usually a school, but homeschool groups, libraries, and community organizations can charter teams too.

## Step 2: Understand the real costs

Budget honestly up front. For the current season, the core fees are:

- **Season registration: ~$6,500** (this is your entry and includes a Kit of Parts).
- **Each additional Regional event: ~$3,200.**
- Plus robot parts, tools, and travel — FIRST's published median total for a Regional team is around **$24,000/season**, though many teams run leaner.

The number scares people, so here's the part nobody tells rookies: **you rarely pay full freight your first year.** Rookie teams are eligible for substantial grants — most notably the **NASA FRC Sponsorship Grant**, which can cover your first event's registration entirely. Check the [FIRST Team Grant Opportunities](https://www.firstinspires.org/programs/team-grant-opportunities) page early; deadlines cluster in the fall.

## Step 3: Register and get your Kit of Parts

Register your team at [firstinspires.org](https://www.firstinspires.org/robotics/frc). New teams get a **rookie Kit of Parts** with a control system, motors, and a drivetrain option to get you moving. Get your adult leads' Youth Protection screening done early — it's a common bottleneck.

## Step 4: Get a space and basic tools

You need a room you can leave a half-built robot in, plus power and a few feet of open floor to drive on. Tool-wise, start minimal: drill, hand tools, a way to cut aluminum, and a soldering/crimping kit for electrical. You can borrow CNC or machining time from a veteran team or a sponsor's shop.

## Step 5: Train before Kickoff

This is where most rookie teams stumble — they spend the first two weeks of build season *learning the basics* instead of building. Use the fall and early winter to get members comfortable with the fundamentals of each department: drivetrains, wiring that passes inspection, the programming control system, and basic strategy. (That's exactly what we built [LearnFRC](https://learnfrc.systemerr.com) for — free, structured lessons across every department. Start with the [Getting Started guide](https://learnfrc.systemerr.com/guides/getting-started).)

## Step 6: Survive your first build season

A few rules that save rookie teams:

- **Keep the robot simple.** A reliable robot that drives and scores one way beats an ambitious robot that doesn't work.
- **Wire it well.** A large share of robot failures at events are electrical. Crimp cleanly and build a tidy CAN bus.
- **Start scouting early.** You pick alliances on data, not vibes.
- **Document everything.** Your seniors graduate; written knowledge is how the team survives.

## The mindset that matters most

Your first season's goal is **not** to win — it's to finish a robot, compete, and build a team that comes back next year. Lean on the community: Chief Delphi, your regional veterans, and Open Alliance teams are remarkably generous. Ask questions early and often.

Ready to train your team? Browse the [free department guides on LearnFRC](https://learnfrc.systemerr.com/guides) — built by an FRC student, for new teams.`,
  },
  {
    slug: "swerve-drive-explained",
    title: "Swerve Drive Explained: How FRC's Most Popular Drivetrain Works",
    description:
      "A clear, beginner-friendly explanation of swerve drive in FRC — how the modules work, the math behind it, COTS options, and whether your team should run it.",
    keywords: [
      "swerve drive",
      "FRC swerve drive",
      "how does swerve drive work",
      "swerve modules",
      "FRC drivetrain",
    ],
    date: "2026-06-22",
    readMins: 6,
    content: `Swerve drive has gone from an elite-team novelty to the most common drivetrain at the top of FRC. If you've watched a recent match and seen robots slide sideways and spin while moving, that's swerve. Here's how it actually works — without the intimidating math.

## What swerve drive is

A swerve drive is a **holonomic** drivetrain: it can move in any direction *and* rotate independently, at the same time. It does this with (usually four) **swerve modules**, one near each corner of the robot. Each module has:

- A **drive motor** that spins the wheel (how fast you go), and
- A **steering (azimuth) motor** that rotates the whole wheel assembly to point in any direction (which way you go), plus
- An **absolute encoder** that always knows which way the module is pointed.

Because every wheel can point and spin independently, the robot can translate in any direction regardless of which way it's "facing." That's what makes swerve feel so agile.

## How it works (the intuition)

You don't need to derive the kinematics to understand it. The driver commands three things: forward/back speed, left/right speed, and rotation. The robot's code runs **inverse kinematics** to figure out, for each of the four modules, the exact *angle* and *speed* that combine to produce that overall motion. WPILib provides this math out of the box (\`SwerveDriveKinematics\`), so you mostly configure it rather than write it from scratch.

Add **field-oriented control** — where "push the stick forward" means "move toward the far end of the field" no matter which way the robot is turned — and swerve becomes incredibly intuitive to drive.

## The COTS options

You almost never build swerve modules from scratch anymore. The popular commercial off-the-shelf (COTS) modules include:

- **SDS MK4 / MK4i / MK4n** (Swerve Drive Specialties)
- **WCP Swerve X / X2** (West Coast Products)
- **REV MAXSwerve**
- **TTB Swerve** and others

They differ in size, gearing, motor compatibility (NEO, NEO Vortex, Kraken X60, etc.), and how you maintain them — but all give you a proven module so you can focus on the rest of the robot.

## The trade-offs (should *your* team run it?)

Swerve is powerful, but it's not free:

**Pros:** unmatched maneuverability, strong defense evasion, precise auto paths.

**Cons:**
- **Cost.** Four modules plus eight motors is a significant chunk of budget.
- **Programming complexity.** Encoder offsets, odometry, and tuning take real software effort.
- **Maintenance.** More moving parts means more that can loosen or fail mid-event.

A well-built **tank/west-coast drive** is still completely competitive and far simpler. The honest rule: a reliable tank drive beats a poorly-tuned swerve every time. Run swerve when your team has the budget *and* the software capacity to support it.

## How to learn it

If your team is ready to take it on, learn it in this order: the drivetrain mechanics, then WPILib command-based programming, then odometry and path-following. We cover each step in the free [Programming](https://learnfrc.systemerr.com/guides/programming-software) and [Mechanical](https://learnfrc.systemerr.com/guides/mechanical-build) tracks on LearnFRC, and the official [WPILib docs](https://docs.wpilib.org) are excellent for the code side.

Want the full path from drivetrain basics to a swerve-driving robot? [Start the free Programming track →](https://learnfrc.systemerr.com/guides/programming-software)`,
  },
  {
    slug: "how-to-win-the-impact-award",
    title: "How to Win the FIRST Impact Award (FRC's Most Prestigious Award)",
    description:
      "What the FIRST Impact Award is, how it's judged, and how to write the essay, executive summaries, and pitch that win it — the most prestigious award in FRC.",
    keywords: [
      "FIRST Impact Award",
      "how to win Impact Award",
      "FRC Impact Award essay",
      "Chairman's Award",
      "FRC awards",
    ],
    date: "2026-06-22",
    readMins: 7,
    content: `The FIRST Impact Award (formerly the Chairman's Award) is the most prestigious award in FRC. It doesn't go to the best robot — it goes to the team that best represents a role model for other teams and best embodies the mission of *FIRST*. Winning it at the Championship inducts your team into the **FIRST Hall of Fame**. Here's how it actually works.

## What the Impact Award really measures

This is the key mindset shift: **the Impact Award is not about your robot.** It's about your team's measurable, sustained effect on your community and on FIRST — and your plan to keep that going. Judges are looking for a team that spreads STEM, helps other teams form and grow, and can prove real, lasting outcomes (not just "we did an event once").

The single biggest mistake teams make is treating it as a writing contest you start in February. Winning teams do the *work* year-round and document it as they go.

## The three parts of a submission

A complete Impact Award submission has three pieces:

### 1. The essay (up to 10,000 characters)
A narrative of your team's story and impact. It should be specific and evidence-driven: concrete programs, real numbers, and the outcomes they produced — not vague mission statements. Show a trajectory: where you started, what you built, and where it's going.

### 2. The executive summaries (12 questions)
A set of short, punchy responses (each limited to ~500 characters) covering specific areas — your outreach, the teams you've started or mentored, your sustainability, your impact on participants, and more. These force you to be concrete. Every box should contain a real, quantified accomplishment.

### 3. The presentation / judged pitch
At the event, a small group of students presents to judges and answers questions. This is where personality and authenticity matter. Judges can tell instantly whether the students *live* the work or just memorized a script. Practice, but speak like humans.

## How it's judged and advances

The award is given at District and Regional events, and those winners advance to compete for the **Championship Impact Award**. At Championship, judges select a set of finalists and, from those, one winning team that enters the Hall of Fame. Because it advances, your event submission is the foundation for everything above it.

## How to actually win it

- **Start documenting in the offseason.** Keep a running log of every outreach event, team you helped, and measurable outcome. February-you will thank June-you.
- **Quantify everything.** "We ran workshops" is weak. "We trained 140 students across 6 rookie teams, 3 of which competed for the first time" is strong.
- **Tell one coherent story.** The essay, summaries, and pitch should reinforce the same narrative, not feel like three separate documents.
- **Prove sustainability.** Judges want to see your impact will outlast the current seniors — pipelines, funding, and systems, not heroics.
- **Pick presenters who do the work.** Authenticity beats polish.

## Where to learn the details

The exact character limits, question list, and judging criteria are published each season in the [FIRST awards materials](https://www.firstinspires.org/resource-library/frc/awards) — always confirm the current year's specifics. For a step-by-step walkthrough of the essay, the executive summaries, and building a winning pitch, see the free [Impact Award track on LearnFRC](https://learnfrc.systemerr.com/guides/impact-award).

The teams that win this award aren't the ones with the best writers — they're the ones doing real work all year and telling that story clearly. [Start the Impact Award guide →](https://learnfrc.systemerr.com/guides/impact-award)`,
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
