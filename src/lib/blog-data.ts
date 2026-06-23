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
  {
    slug: "what-is-frc",
    title: "What Is FRC? FIRST Robotics Competition Explained",
    description: "FRC (FIRST Robotics Competition) is a high school robotics league where student teams build large robots in six weeks to play a new game each year.",
    keywords: ["what is FRC","FIRST Robotics Competition","FRC explained for beginners","how FRC works","FRC build season","join an FRC team"],
    date: "2026-06-23",
    readMins: 4,
    content: `If you have heard people throw around the term "FRC" and walked away more confused than before, here is the short version: FRC stands for the FIRST Robotics Competition, a high school robotics league where student teams design, build, and drive a roughly 100-plus-pound robot to play a brand-new game every year.

## The one-sentence definition

FRC is a varsity-style robotics competition for students in grades 9 through 12 (ages 14 to 18), run by the nonprofit FIRST. It was founded in 1989 by inventor Dean Kamen, with early help from MIT professor Woodie Flowers, on a simple idea: make building robots feel as exciting and team-driven as a sport.

The robots are not desktop kits. They are industrial-sized machines built from metal, motors, pneumatics, and custom code, and they play a fast, physical game on a field about the size of a basketball court.

## How a season actually works

Every season follows the same rhythm:

- **Kickoff (January):** FIRST reveals a brand-new game. Nobody knows what it is beforehand, so every team starts from zero on the same day.
- **Build season (about six weeks):** Teams design, prototype, build, wire, and program a robot to play that specific game. This is the crunch, and it is where most of the learning happens.
- **Competition season (roughly February to April):** Teams take their robot to events to compete, repair, and improve it between matches.

Because the game changes annually, last year's robot and strategy are mostly useless this year. That fresh-start design challenge is the whole point.

## What a match looks like

Matches are short, around two and a half minutes, and they are played two alliances at a time: a red alliance and a blue alliance, each made up of three robots from three different teams.

Each match has two phases:

- **Autonomous:** A brief opening period where the robot runs entirely on its own pre-written code, with no driver input.
- **Teleop (driver-controlled):** The longer remainder of the match, where student drivers control the robot with joysticks and controllers to score points.

Because you compete in three-robot alliances, FRC is genuinely cooperative. FIRST calls this "Coopertition" - you are competing hard while also helping the community around you. Teams routinely lend parts and advice to the very opponents they will face later.

## The events and how you advance

FRC events come in two main flavors. Some regions run larger **Regional** events; others run a series of smaller **District** events that feed into a **District Championship**. The top teams from both paths earn a spot at the **FIRST Championship**, the season's huge international finale, held in Houston each spring.

At every event, qualification matches determine a ranking. Then the top-ranked teams become alliance captains and draft other teams to form playoff alliances. So doing well is not just about your own robot - it is about being a team that others want to pick.

## What students actually build and learn

Teams start each year with a Kit of Parts and then buy or fabricate the rest. A typical robot combines:

- A drivetrain and motors (commonly sourced from vendors like REV Robotics, CTRE, AndyMark, and VEX)
- Mechanisms - arms, intakes, shooters, climbers - designed to score in that year's game
- A control system built around the roboRIO, the official robot controller
- Custom software, written in Java, C++, or Python using WPILib, the official FRC programming library

Just as importantly, FRC teams run like small organizations. Students handle CAD and machining, electrical, programming, scouting, fundraising, outreach, and even graphic design and business operations. Adult mentors guide the work, but students do it.

## How to get started

You do not need to be a robotics genius to join. Most teams want curious people who will show up and learn - whether your thing is wiring, code, design, or spreadsheets. The best first step is to find a local FRC team (often at a high school or community organization) and ask to visit.

If you want a structured walkthrough of joining a team, learning the tools, and surviving your first build season, start with our [Getting Started guide](https://learnfrc.systemerr.com/guides/getting-started). It is written for total beginners and points you to everything else as you grow.

FRC can sound intimidating from the outside, but it is really just a bunch of students building cool machines together under a tight deadline. Ready to take the first step? Head to the [Getting Started guides](https://learnfrc.systemerr.com/guides) and start learning.`,
  },
  {
    slug: "frc-programming-tutorial",
    title: "FRC Programming Tutorial: Getting Started with WPILib",
    description: "A beginner-friendly guide to programming an FRC robot with WPILib: pick a language, install the tools, write your first robot program, and deploy it.",
    keywords: ["how to program an FRC robot","WPILib for beginners","FRC programming tutorial","WPILib VS Code setup","command-based programming FRC","deploy code to roboRIO"],
    date: "2026-06-23",
    readMins: 5,
    content: `If you just got handed the laptop and told "you're on programming this year," WPILib is where you start. It is the official software library FIRST provides for writing code that runs on your robot, and once you know the basic loop it is far less scary than it looks.

## Pick a language first

WPILib officially supports three text-based languages, and they are kept at near feature-parity so you are not locked out of anything by choosing one:

- Java (WPILibJ) - the usual recommendation for new programmers. Good balance of convenience and performance, and the largest pile of beginner tutorials and example code.
- C++ (WPILibC) - more raw performance, but you manage memory yourself, so it asks more of you.
- Python (RobotPy) - convenient and readable, though as an interpreted language a typo can crash your robot mid-match instead of failing at compile time.

Most rookie programmers should start with Java. The concepts you learn transfer directly to the other two if your team switches later. Our [Programming guide](https://learnfrc.systemerr.com/guides/programming-software) goes deeper on choosing for your specific team.

## Install the WPILib toolchain

Do not piece this together from scattered downloads. WPILib ships one offline installer, released each season on the WPILib GitHub releases page (the 2026 release is 2026.x). Download the file for your operating system and run it.

The installer sets up everything you need in one shot:

- A dedicated copy of VS Code labeled for the year (for example "WPILib VS Code 2026"), kept separate from any VS Code you already have so updates do not break it.
- A Java JDK, the C++ toolchains, and the Gradle build system.
- Dashboards and utilities like Shuffleboard, Glass, Elastic, AdvantageScope, SysId, and the roboRIO Team Number Setter.

Install the full offline package rather than the online one when you can - the build server room at competition rarely has reliable Wi-Fi.

## Create your first project

Open the WPILib VS Code, then open the command palette with Ctrl+Shift+P and run "WPILib: Create a new project." You will pick a project template, your language, a folder, and your team number. The simplest starting template is built on the TimedRobot base class, which is the structure FIRST recommends for most teams.

A TimedRobot program is just a set of methods that the framework calls for you. The key ones are 'robotPeriodic', 'autonomousPeriodic', and 'teleopPeriodic'. WPILib calls each periodic method every 20 milliseconds - that is 50 times per second - so your job is to describe what should happen in one slice of time, and the framework handles repeating it.

Here is the mental model: 'teleopPeriodic' runs 50 times a second while a driver is in control, so reading a joystick and setting a motor speed inside it makes the robot respond in real time.

## Understand command-based programming

Once you can drive, the next step most teams take is command-based programming, a design pattern WPILib supports out of the box. It splits your robot into two ideas:

- Subsystems - a chunk of hardware that works as a unit, like a drivetrain or an arm with its motors and sensors.
- Commands - an action, like "drive forward two meters" or "raise the arm," that runs until it finishes or gets interrupted.

The CommandScheduler ties them together and runs at the same 50 Hz. The big win is that a subsystem can only be claimed by one command at a time, which stops two pieces of code from fighting over the same motor - a very common rookie bug. It also keeps your codebase reusable from season to season.

## Build and deploy to the roboRIO

Your code does not run until it is compiled (built) and pushed onto the roboRIO, the robot's brain. To deploy from VS Code, hit Shift+F5 or run "WPILib: Deploy Robot Code" from the command palette.

A few things that trip up new teams:

- Connect first. Your laptop must reach the robot over USB, Ethernet, or the robot's own wireless network before deploying.
- Match your team number. The number in 'wpilib_preferences.json' must match the number your roboRIO was imaged with, or the deploy will not find the robot.
- Never cut power mid-deploy. Powering off during a deploy can corrupt the roboRIO filesystem and force a re-image. Wait for it to finish.

After a successful deploy, open the FRC Driver Station, enable in Teleop, and drive.

## Practice without the full robot

You do not need a $5,000 competition robot to learn. The XRP and Romi are small, inexpensive desktop robots built specifically for practicing WPILib. Their projects run on your computer through the WPILib simulation framework instead of deploying to a roboRIO, so you can write real WPILib code and watch it move at your kitchen table. FIRST also offers a free XRP-based training course covering everything from variables up through command groups.

The fastest way to actually learn is to deploy something tiny, break it, and fix it. Start with the example tank-drive template, get the robot rolling, then add one feature at a time.

Ready to go deeper? Work through the full walkthroughs in the [LearnFRC Programming department](https://learnfrc.systemerr.com/guides/programming-software).`,
  },
  {
    slug: "how-to-wire-an-frc-robot",
    title: "How to Wire an FRC Robot: A Beginner Electrical Guide",
    description: "A beginner-friendly, accurate guide to wiring an FRC robot: battery, 120A breaker, PDH, roboRIO, radio, CAN bus, and the wire-gauge rules that pass inspection.",
    keywords: ["how to wire an FRC robot","FRC electrical system","FRC control system wiring","FRC PDH wiring","roboRIO power wiring","FRC wire gauge breaker sizing"],
    date: "2026-06-23",
    readMins: 5,
    content: `Wiring your first FRC robot feels intimidating, but the electrical system is really just one chain: battery, breaker, power distribution, and then everything else branching off it. Get that chain right and the rest is repetition.

This guide walks through the standard FRC control system in the order you actually build it, with the real numbers you need to pass inspection. If you want the full lesson set with diagrams and worked examples, the [Electrical & Wiring](https://learnfrc.systemerr.com/guides/electrical-wiring) department on LearnFRC goes deeper on each step.

## The power chain, top to bottom

Every legal FRC robot runs off exactly one battery: a 12V nominal sealed lead acid (SLA) battery, minimum 17Ah and maximum 18.2Ah, which is why people just call it "the 12V 18Ah battery." It connects through an Anderson SB connector (the pink/red SB50 you see in the Kit of Parts) on 6 AWG leads. Only one battery is allowed on the robot at a time.

From the battery, power flows in this order:

- Battery, on 6 AWG wire, to the 120A main breaker
- 120A main breaker, on 6 AWG wire, to your power distribution device
- Power distribution device out to every motor controller, the roboRIO, and the radio

The 120A main breaker does two jobs at once: it is your master power switch (the button you push to turn the robot on and off) and the main protection for everything downstream. Mount it where a person can reach it easily.

## Power distribution: PDH or PDP

The power distribution device is the hub of the whole system. Two are common:

- The REV Power Distribution Hub (PDH), the current Kit of Parts standard
- The CTRE Power Distribution Panel (PDP), still legal and on many veteran robots

Both take battery power in and split it across numbered channels, each protected by its own breaker or fuse. On a PDH, motor controllers land on the high-current WAGO terminals and are protected by 40-amp snap-in breakers. The same connector accepts a range of wire sizes, so always match the wire to the breaker, not the other way around.

## Wire gauge and breaker rules that actually get inspected

This is where new teams lose points at inspection. The rule is simple: the breaker or fuse protects the wire, so the wire has to be thick enough for the breaker behind it. The minimums are:

- 6 AWG for everything from the battery through the main breaker to the distribution device
- 12 AWG minimum on a 40A breaker (typical for big drive and mechanism motors)
- 14 AWG minimum on a 30A breaker
- 18 AWG minimum on a 20A breaker

Thicker is always allowed; thinner is never allowed. When in doubt, size up. These requirements live in the robot construction rules of the FRC Game Manual (the R6xx electrical rules), so check the current season's manual before your competition.

## Powering the roboRIO and the radio

The roboRIO is the brain of the robot, the computer that runs your code. It does not get its own 40A channel. Instead, you power it from a non-switchable, fused channel on the PDH (channels 20-22) protected by a 10A fuse, using 18 AWG wire into the roboRIO's power connector (red to V, black to C).

The radio is the current Vivid-Hosting VH-109, a Wi-Fi 6E radio built for FRC. There are two supported ways to power it: directly off battery voltage, or through the Radio Power Module (RPM), which sends clean 18V passive Power-over-Ethernet down the same Ethernet cable that carries data. One hard rule: never feed the radio from the RPM and a separate 12V source at the same time, and don't run the RPM alongside a PoE camera on the same radio. Doing so can damage the radio.

## CAN bus: the nervous system

Beyond power, modern FRC devices talk to each other over a CAN bus, a single twisted pair (yellow and green) that daisy-chains from the roboRIO through the PDH and every CAN motor controller in a loop. It lets you read motor current, set IDs, and get rich telemetry that simple PWM wiring can't. Keep the chain continuous and terminate it correctly, or devices will drop off the bus.

## Build habits that save you

- Color code: red for positive, black for negative, every time
- Strip the right length, crimp firmly, and tug-test every connection; if you can twist a main breaker lug by hand, it's not tight
- Insulate exposed terminals with heat shrink or electrical tape
- Leave a little slack and label both ends of long runs

Wiring is one of the most learnable parts of FRC because the rules are concrete and the same patterns repeat across every robot. Take it one connection at a time and verify as you go.

Ready to go deeper with full diagrams, crimping technique, and rule-by-rule checklists? Start the [Electrical & Wiring guide on LearnFRC](https://learnfrc.systemerr.com/guides/electrical-wiring).`,
  },
  {
    slug: "best-cad-software-for-frc",
    title: "The Best CAD Software for FRC (and How to Choose)",
    description: "Onshape vs SolidWorks vs Fusion 360 for FRC: all three are free for teams. Here is how to pick the right CAD software for your robot.",
    keywords: ["best CAD software for FRC","Onshape vs SolidWorks FRC","Fusion 360 for FRC","free CAD for FIRST Robotics","FRC CAD software comparison"],
    date: "2026-06-23",
    readMins: 4,
    content: `If you are picking a CAD tool for your FRC team, here is the short version: the three serious options are Onshape, SolidWorks, and Autodesk Fusion, and all three are free for FIRST Robotics teams. The better question is not which is "best" in the abstract, but which fits how your team actually works.

## Why CAD matters in FRC

CAD is how you design a robot before you cut metal. A good model catches interference, lets you check that the arm reaches the right height, and produces drawings the build team can manufacture from. Once you commit to designing in CAD rather than improvising at the bandsaw, the tool you choose shapes how your whole team collaborates for the season. If you are just getting started, the LearnFRC [CAD and Design guide](https://learnfrc.systemerr.com/guides/cad-design) walks through the fundamentals before you worry about software.

## Onshape: the community default

Onshape is the most widely used CAD platform in FRC, and for good reason. It is cloud-native and runs entirely in a browser, so it works on Chromebooks, Macs, Windows PCs, and even tablets with no install. That matters when half your team is on school laptops you do not control.

Its standout feature is real-time collaboration. Multiple students can open the same document at once and see edits happen live, with tools like Follow Mode and branching and merging for managing changes. Onshape is free for FIRST teams through the Educator Plan, which adds release management and class features.

The ecosystem is the other reason it dominates. Community resources like FRCDesign.org and Onshape4FRC offer full curricula built specifically for FRC, plus parts libraries and the official field models. If you want the smoothest path to getting a rookie productive, Onshape is hard to beat.

## SolidWorks: the industry standard

SolidWorks is professional desktop CAD used widely in mechanical engineering, and it is free for FIRST teams through a sponsorship with Dassault Systemes. It is the same software used to design the FRC field and game pieces, so the official CAD lines up natively.

Strengths:

- Extremely powerful, mature feature set used across real engineering jobs.
- Learning it builds a skill that transfers directly to college and industry.
- The sponsorship now includes browser-based cloud apps (like xDesign) plus cloud storage, so you are not strictly tied to one Windows machine.

Trade-offs:

- The full desktop version is Windows-only and needs a reasonably capable computer.
- Setup and license management are more involved than Onshape's sign-up-and-go flow.

If you have mentors who already know SolidWorks, or students aiming at mechanical engineering, the industry transferability is a real advantage.

## Autodesk Fusion: strong CAD plus CAM

Autodesk Fusion (formerly Fusion 360) is free for students and educators through Autodesk's education license, and it is also available to FRC teams. It is cloud-connected but installs as a desktop app on Windows and Mac.

Fusion's calling card is integrated CAM, the tooling that turns a model into machine instructions for a CNC router or mill. If your team manufactures parts on a CNC, having design and CAM in one program is genuinely convenient. It is also a comfortable middle ground: more approachable than full SolidWorks, more capable than entry-level tools.

The main caution is that Fusion leans on a single-user file model, so live multi-person editing is weaker than Onshape's. For a large team where many people design at once, that can become a bottleneck.

## How to choose

Match the tool to your team, not to a forum opinion:

- Mixed or school-managed computers, lots of new students, heavy collaboration: choose Onshape.
- Mentors who know SolidWorks, students targeting mechanical engineering, Windows machines available: choose SolidWorks.
- You run a CNC and want CAD plus CAM in one place: choose Fusion.

A few honest realities. First, the best CAD software is the one your mentors can actually teach, so existing expertise should weigh heavily. Second, switching mid-season is painful, so pick once and commit. Third, whatever you choose, download the official field and game-piece CAD that FIRST releases each season and design against it, because guessing at dimensions is how robots fail inspection.

There is no universally correct answer here. Onshape is the safe default for most teams because it is free, runs everywhere, and has the deepest FRC-specific learning resources, but SolidWorks and Fusion are excellent in the right hands.

Ready to start modeling? Dig into the LearnFRC [CAD and Design guides](https://learnfrc.systemerr.com/guides/cad-design) for step-by-step tutorials on whichever tool you pick.`,
  },
  {
    slug: "frc-scouting-guide",
    title: "FRC Scouting Guide: How to Scout and Build a Picklist",
    description: "Learn how FRC scouting works, what OPR and EPA actually measure, and how to turn match data into a ranked picklist for alliance selection.",
    keywords: ["how to scout in FRC","FRC picklist","OPR vs EPA","FRC alliance selection","FRC scouting data","Statbotics EPA"],
    date: "2026-06-23",
    readMins: 4,
    content: `Winning in FRC is rarely about having the single best robot in the room. It is about understanding every robot in the room well enough to predict matches, pick the right partners, and play to your alliance's strengths. That is what scouting does, and good scouting is one of the highest-leverage things a rookie or mid-tier team can invest in.

## What scouting actually is

Scouting is the process of systematically recording what robots do during qualification matches so your team can make better strategic decisions later. There are two kinds, and you want both:

- **Quantitative scouting** records numbers, match by match: how many game pieces a robot scored, where it scored them, whether it climbed or completed an endgame task, and how many seconds its scoring cycle took.
- **Qualitative scouting** records judgment that numbers miss: Is the robot reliable or does it brown out? Can it play defense? Does the drive team make smart decisions? Did it sit dead on the field?

Most teams assign one scout per robot per match (six scouts for the six robots on the field) and log data on paper sheets or a shared app, then aggregate it into a spreadsheet. The goal is a clean, per-team summary you can sort and compare.

If you are setting up a scouting system from scratch, start with our [Scouting and Strategy guides](https://learnfrc.systemerr.com/guides/scouting-strategy) before you build a spreadsheet, because the structure of your data sheet decides what questions you can answer later.

## OPR and EPA: what the metrics mean

You do not have to compute everything by hand. Two community metrics give you a fast first read on any team.

**OPR (Offensive Power Rating)** estimates a team's average point contribution to its alliance using linear algebra: it takes every alliance's final score across the event and solves a least-squares system to assign each team a number. OPR is free on The Blue Alliance and requires zero manual scouting, which is its biggest strength. Its weakness is that it assumes scoring is linear and shared cleanly across three robots, so it gets fuzzy in games with non-linear scoring, heavy defense, or penalties. As The Blue Alliance puts it, OPR "can always supplement, but never replace, proper scouting."

**EPA (Expected Points Added)**, from Statbotics, is a newer model. It builds on the Elo rating concept but reports results directly in points, so you can read it much like an OPR. EPA is a running average of a team's contribution that updates after every match, and Statbotics reports it as more predictive and better calibrated than both Elo and OPR.

Treat both as starting points, not verdicts. They tell you who is generally strong; they do not tell you whether a robot can play the specific role your alliance needs.

## Turning data into a picklist

A picklist is a ranked list of the teams you want to play with in the elimination rounds. Because a standard FRC event fields eight alliances of three robots each, your list should comfortably cover the top 24 or so teams. Most teams keep three lists:

- A **first-pick list**: complete robots that would be strong alliance captains' partners.
- A **second-pick list**: specialists who fill a specific gap, such as a fast defender or a reliable endgame robot.
- A **do-not-pick list**: teams to avoid because of unreliability or safety, regardless of raw output.

Build the lists by combining your scouting data with strategy. Ask what your robot does well, what it cannot do, and which partner abilities would complete the alliance. A team with a mediocre OPR but a flawless climb or strong defense can be worth more to you than a higher-rated robot that does the same thing your robot already does.

## How alliance selection works

Knowing the selection mechanics keeps your list realistic. At official FRC events, the eight highest-ranked alliance captains pick in order from Alliance 1 to Alliance 8 for their first choice. For the second choice the order reverses, running from Alliance 8 back up to Alliance 1, a serpentine pattern that gives lower seeds an earlier second pick. Each invited team accepts or declines on the spot, and a team that declines cannot be invited again.

Because picks vanish in real time, never bring a single ranked column. Keep your list dynamic and cross teams off as they get chosen, so you are always looking at the best robot still available.

Scouting well is a team-wide habit, not a one-person job. Get your data structure, your metrics, and your picklist process right, and you will out-strategize teams with flashier robots. For step-by-step templates and strategy breakdowns, head to our [Scouting and Strategy department](https://learnfrc.systemerr.com/guides/scouting-strategy).`,
  },
  {
    slug: "frc-gear-ratios-explained",
    title: "FRC Gear Ratios Explained",
    description: "A beginner-friendly guide to FRC gear ratios and drivetrain gearing: how reduction trades speed for torque, the free-speed formula, and how to pick a ratio.",
    keywords: ["FRC gear ratios","drivetrain gearing","gear reduction","drivetrain free speed","swerve gear ratio","FRC drivetrain calculator"],
    date: "2026-06-23",
    readMins: 5,
    content: `Picking a drivetrain gear ratio is one of the first real engineering decisions a rookie FRC team makes, and it is also one of the most misunderstood. This guide explains what a gear ratio actually does, how to estimate your robot's speed, and how to choose a ratio that fits your game.

## What a gear ratio actually is

A gear ratio describes how a gearbox trades motor speed for torque. When a small gear drives a larger gear, the output spins slower but with more turning force. The ratio is the relationship between input and output teeth. A 12-tooth gear driving an 84-tooth gear gives a 7:1 reduction: the output turns 7 times slower than the input, and produces roughly 7 times the torque (minus friction losses).

That word "reduction" is the key. Drivetrain gearboxes are almost always reductions, because motors spin far too fast to drive wheels directly. A modern FRC motor free-spins at several thousand RPM, and your wheels need to turn at a few hundred RPM. The gearbox bridges that gap.

One naming note that trips people up: WPILib and most simulation tools express the drivetrain gear ratio as output torque over input torque, so a reduction is written as a number greater than 1 (for example, 6.75:1). When you set up a drivetrain model in code, that is the convention to use.

## The speed-versus-torque tradeoff

You cannot get both high speed and high torque from the same gearing. Every ratio sits somewhere on that tradeoff:

- A lower reduction (numerically smaller) gives a faster top speed but less pushing force and slower acceleration.
- A higher reduction (numerically larger) gives more torque, better acceleration, and more pushing power, but a lower top speed.

This is why gearbox vendors like West Coast Products, REV, AndyMark, and Swerve Drive Specialties ship their drive gearboxes with several selectable ratios. REV's 3 inch MAXSwerve module, for example, includes gears for low, medium, and high speed configurations, and an upgrade kit adds even faster ratios. SDS sells the MK4i swerve module in L1 through L4 ratios, where L1 and L2 are the popular choices for a standard full-weight competition robot.

## How to estimate your robot's speed

You can predict a drivetrain's free speed (its theoretical top speed with no load) with one formula. In plain terms:

Free speed in feet per second equals motor free RPM, times an efficiency factor, divided by the total gear reduction, times wheel circumference in feet, divided by 60.

A few notes on the inputs:

- Motor free RPM: use the published no-load speed. Common FRC motors are the NEO at about 5820 RPM, the NEO Vortex at about 6784 RPM, the Falcon 500 V2 at about 6489 RPM, and the Kraken X60 at about 6048 RPM at 12 volts (about 5640 RPM with FOC enabled).
- Efficiency factor: real gearboxes lose energy to friction, and a robot never runs at its theoretical max. Most teams multiply by roughly 0.80 to 0.85 to get a realistic number.
- Wheel circumference: that is wheel diameter times pi, converted to feet. A 4 inch wheel is about 1.05 feet around.

For a worked example, take a Kraken X60 at 6048 RPM, a 6.75:1 reduction, and a 4 inch wheel. Theoretical free speed is about 17.5 ft/s; after an 85 percent efficiency factor, you land near 14.9 ft/s, which is a sensible real-world target.

## Choosing a ratio for your game

There is no single correct ratio, only the right one for your robot and the year's game. Use these guidelines:

- Heavier robots and games with lots of pushing or defense favor more reduction (more torque).
- Open fields where you sprint between scoring locations favor less reduction (more speed).
- Most competitive swerve drivetrains land somewhere around 15 to 18 ft/s of free speed. REV's default MAXSwerve template, for reference, is set to 4.8 meters per second, which is roughly 15.7 ft/s.
- Do not chase the highest number. A drivetrain you cannot control, or one that browns out the battery under load, will lose matches that a slightly slower, well-tuned robot wins.

The fastest way to sanity-check a choice is a drivetrain calculator. Tools like ReCalc let you plug in your motor, ratio, wheel size, and robot weight to see free speed and current draw before you cut any metal.

For step-by-step help wiring all of this into an actual gearbox and chassis, our [Mechanical & Build guide](https://learnfrc.systemerr.com/guides/mechanical-build) walks through gearbox assembly, wheel selection, and drivetrain layout. If you are still mapping out your whole build season, the full [LearnFRC guides library](https://learnfrc.systemerr.com/guides) covers the surrounding topics too.

Ready to turn these numbers into a real drivetrain? Start with the [Mechanical & Build guide](https://learnfrc.systemerr.com/guides/mechanical-build).`,
  },
  {
    slug: "how-to-get-frc-sponsors",
    title: "How to Get FRC Sponsors: A Fundraising Guide",
    description: "A practical guide to funding your FIRST Robotics Competition team: where to find sponsors, grants like NASA and BAE, and how to ask the right way.",
    keywords: ["how to get FRC sponsors","robotics team fundraising","FRC sponsorship","FIRST Robotics grants","NASA FRC grant","FRC team budget"],
    date: "2026-06-23",
    readMins: 4,
    content: `Running a FIRST Robotics Competition team is expensive, and funding it is one of the least-glamorous but most important jobs on the team. The good news: thousands of teams do this every year, and there is a well-worn path for finding sponsors and grants once you know where to look.

## Know your number first

Before you ask anyone for money, figure out what you actually need. FIRST registration fees alone run roughly 5,000 to 6,000 US dollars for the season, and that is just to get into your first event. Once you add a second event, travel, materials, tools, and spare parts, total team budgets commonly land anywhere from 8,000 to 50,000 dollars or more depending on how far you travel and how much you build.

Having a real budget does two things: it tells you how hard you need to fundraise, and it makes your sponsorship pitch far more credible. Sponsors trust a team that can say exactly where the money goes. For help structuring a budget and the operations behind it, our [Business and Operations guide](https://learnfrc.systemerr.com/guides/business-operations) walks through the basics.

## Set up a way to receive donations

Most companies will only donate to a tax-exempt organization, and for good reason. In the US, mentors and parents should not personally accept donations on the team's behalf, because that can create real tax problems for them.

You have two clean options:

- Run the team under your school, so donations flow through the district or a school booster organization.
- Operate as, or partner with, a registered 501(c)(3) nonprofit so donations are tax-deductible.

Team 6328 maintains a widely-cited guide on establishing a 501(c)(3) specifically for FRC teams. Sort this out early, because a sponsor asking for a tax receipt is a good problem to have.

## Grants: the lowest-effort money

Grants are applications to foundations or programs, and several are aimed directly at FRC teams. A few worth knowing:

- NASA Robotics Alliance Project grants open applications in September with awards announced around November. They primarily target rookie, new, or year-two teams, the money is sent directly to FIRST to cover registration, and awards depend on congressional funding each year.
- BAE Systems offers a grant open to all US-based FRC teams.
- Boeing and Dow grants are often tied to having an employee mentor or being in their communities.
- John Deere and others fund teams associated with a school or 501(c)(3).

The full, current list lives on the FIRST Team Grant Opportunities page. Apply to everything you qualify for, and mark the September deadlines on a calendar now.

## Sponsors: where the real funding comes from

A grant is something you apply for; a sponsorship is a donation you directly ask a company for. The single most reliable source of sponsors is personal connections. Start with the employers of your mentors and parents, then local businesses, then larger companies in your region.

Be realistic about the numbers. Cold outreach to a company that has never heard of you converts at only about 2 to 5 percent. That same ask sent to a parent's employer or a past sponsor converts much higher. So spend your energy where the warm leads are.

When you reach out, lead with your team's story and be specific about the ask. Helpful tactics:

- Build sponsorship tiers (for example bronze, silver, gold) so companies can self-select a level, and spell out what each tier gets, such as a logo on the robot, the banner, or team shirts.
- Ask for in-kind donations too. Machine time, raw aluminum, electronics, lunch for a build night, or printing all reduce your budget without anyone writing a check.
- Keep a short business plan, around three to four pages, that explains your team, your impact, and your budget.

## Keep the sponsors you win

Retention beats recruitment every time. It is far easier to keep a sponsor than to find a new one, so treat existing sponsors well: send a thank-you, share season results, invite them to an event, and report back on what their money accomplished. A sponsor who feels appreciated tends to renew, and often increases their gift.

Fundraising is a year-round habit, not a kickoff-week scramble. Build the systems once and your future self will thank you. For deeper templates and operational checklists, head to our [Business and Operations guide](https://learnfrc.systemerr.com/guides/business-operations) and start building your sponsor list today.`,
  },
  {
    slug: "frc-drivetrain-types",
    title: "FRC Drivetrain Types: Tank, Swerve, and Mecanum",
    description: "A beginner-friendly guide to FRC drivetrains: how tank, swerve, and mecanum drives work, their tradeoffs, and how to pick one for your robot.",
    keywords: ["FRC drivetrain types","tank vs swerve drive","FRC swerve drive","mecanum drive FRC","differential drive WPILib","choosing an FRC drivetrain"],
    date: "2026-06-23",
    readMins: 4,
    content: `The drivetrain is the foundation of your robot - it decides how fast you move, how you maneuver around defenders, and how hard the rest of the build will be. If you are weighing tank vs swerve drive (or wondering where mecanum fits in), here is an honest, beginner-friendly breakdown of the three drivetrains you will see most in FIRST Robotics Competition.

## Tank (Differential) Drive

Tank drive, more formally called differential drive, is the classic FRC drivetrain and the easiest to build and program. You have wheels on the left side and wheels on the right side, and each side is driven together. The robot moves by sending different amounts of power to each side - drive both sides forward to go straight, and spin the sides in opposite directions to turn in place.

The tradeoff is simple: a tank drive cannot move sideways. To reach a spot to its left, it has to turn and then drive. In exchange you get a drivetrain that is cheap, rugged, easy to repair, and hard to get wrong - which is exactly why it is the standard recommendation for rookie teams.

In code, WPILib handles this with the 'DifferentialDrive' class, which gives you a few control styles:

- Tank drive: one joystick axis controls each side independently.
- Arcade drive: one input for forward/back speed, another for turning rate.
- Curvature drive: turning controls the radius of the turn, more like the steering wheel of a car.

If you are building your first robot, start here. Our [Mechanical & Build guides](https://learnfrc.systemerr.com/guides/mechanical-build) walk through laying out a solid differential chassis step by step.

## Mecanum Drive

Mecanum drive trades some of that simplicity for the ability to move in any direction. The trick is the wheels: each mecanum wheel has free-spinning rollers mounted at a 45-degree angle around its rim. Because the rollers (not the wheel itself) contact the floor, each wheel pushes at an angle instead of straight ahead.

Mecanum wheels come in pairs - two with rollers angled one way, two the other - and are mounted so that diagonally opposite wheels match (front-left matches back-right, front-right matches back-left). By driving the four wheels in the right combination, the angled forces add up or cancel out, letting the robot strafe sideways, drive diagonally, and rotate. That makes it a holonomic drivetrain: it can translate while rotating.

A couple of honest caveats. Because of friction in those rollers, a mecanum robot drives a little faster straight forward and back than it does sideways, and it tends to have less pushing power and traction than a comparable tank drive - a real disadvantage if a match involves shoving. WPILib supports it through the 'MecanumDrive' class, with cartesian and polar control and an optional gyro input for field-oriented driving.

## Swerve Drive

Swerve is the most capable drivetrain in FRC and now the most popular among competitive teams. Instead of fixed wheels, swerve uses an independent module at each corner of the robot. Every module has two motors: one to spin the wheel and one to steer it to any angle, plus an encoder so the code always knows which way the wheel is pointing.

Because each wheel can point anywhere, swerve can do something neither tank nor mecanum can do cleanly: translate in any direction while rotating to face wherever you want, all at full traction. That control is a huge advantage for dodging defense and lining up to score.

The cost is real complexity. Swerve needs roughly twice the drive motors of a tank drive (a typical four-module setup uses eight motors), it is heavier and more expensive, and it demands more maintenance and far more careful programming. WPILib treats swerve through its kinematics system rather than a single simple drive class - you describe the robot's desired motion as a 'ChassisSpeeds' object (forward, sideways, and rotational speed), and swerve kinematics converts that into a target speed and angle for each module.

Most teams do not machine their own modules. Commercial off-the-shelf options like Swerve Drive Specialties MK4, REV MAXSwerve, and WCP Swerve X are widely used and well documented, which has made swerve far more approachable than it was a few years ago.

## So Which Should You Pick?

There is no single right answer - it depends on your team's experience, budget, and time:

- New team, limited resources, or tight build timeline: tank drive. Reliable, affordable, and forgiving.
- Want omnidirectional movement without the full swerve commitment: mecanum, accepting the traction and pushing tradeoffs.
- Experienced team with the budget, programming depth, and time to maintain it: swerve, for best-in-class maneuverability.

Whatever you choose, get the fundamentals right - frame geometry, gear ratios, and wiring matter more than the drivetrain badge. Dig into the full [Mechanical & Build department on LearnFRC](https://learnfrc.systemerr.com/guides/mechanical-build) to plan and build your chassis the right way.`,
  },
  {
    slug: "frc-kit-of-parts-explained",
    title: "The FRC Kit of Parts, Explained",
    description: "What rookie FRC teams actually get in the Kit of Parts: the totes, drive base, KitBot, control system, and the Virtual Kit of software and vouchers.",
    keywords: ["FRC kit of parts","FRC rookie team kit","FRC drive base AM14U6","FRC KitBot","FRC virtual kit vouchers","FRC control system parts"],
    date: "2026-06-23",
    readMins: 4,
    content: `If you just registered a rookie FIRST Robotics Competition team, the "Kit of Parts" is one of the first things you will hear about, and one of the most misunderstood. Here is what it actually is, what rookies get that veterans do not, and what it does and does not cover.

## What the Kit of Parts actually is

The Kit of Parts (KOP) is the bundle of physical parts, a drive base, and digital resources that FIRST and its suppliers provide to registered teams each season. It is not a complete robot in a box. Think of it as a strong starting point: enough core hardware to build a basic driving robot, plus a pile of software licenses and vendor vouchers to fill in the rest.

The KOP comes in a few pieces. There is a season-specific box with game-related items that every team gets, one or more totes of mechanical and electrical components, a drive base chassis kit, and the Virtual Kit, which is the catalog of software and vouchers. You unlock the Virtual Kit at Kickoff, the event in early January where the new game is revealed.

## What rookie teams get that veterans do not

This is the part that confuses new teams. Rookies and veterans do not receive the same physical kit.

- Rookie teams receive a Gray Tote, sometimes called the Rookie Tote. It holds the harder-to-source, reusable components a brand-new team has never owned, things you keep and reuse year after year.
- Veteran teams instead get a Black Tote of season-restock items, and they can opt out of it in exchange for vendor vouchers.
- Both rookies and veterans are offered the Drive Base Kit, the AM14U6 six-wheel chassis. Rookies cannot opt out of it; veterans can trade it for an AndyMark voucher because most already own a chassis.

So the rookie kit is deliberately heavier and more complete. FIRST front-loads the expensive, foundational parts to teams in their first year. If you are still figuring out how all of this fits together, our [Getting Started guide](https://learnfrc.systemerr.com/guides/getting-started) walks through the first-season basics.

## The control system inside the kit

The single most valuable thing in a rookie kit is a legal, working control system, the electronics that make the robot move. The core pieces are:

- A roboRIO, the main robot controller, often called the brain.
- A power distribution device (the REV Power Distribution Hub, CTRE Power Distribution Panel, or AndyMark Power Distribution Board are all legal options) to split 12V power across the robot.
- A VH-109 radio for wireless communication with the driver station.
- A Robot Signal Light (RSL), motor controllers, a 12V battery, and a main 120A breaker.

These are exactly the parts the game manual requires, so building from the kit keeps you legal without having to research every rule on day one.

## The KitBot and the drive base

The Drive Base Kit is the AM14U6 chassis, a rolling frame that a small group can assemble in roughly a day. On top of that, FIRST releases a KitBot each season: a free set of instructions and a parts list for a simple, competitive robot built around that chassis. Many strong rookie teams build the KitBot in year one rather than designing something custom, because it reliably scores and gives you a working robot to practice driving. There is no shame in it, and it is genuinely good advice.

## The Virtual Kit: software and vouchers

A huge share of the kit's value is digital. The Virtual Kit includes free professional CAD software (options have included Autodesk Fusion, Onshape, SOLIDWORKS, and Mastercam), engineering tools like MATLAB, and a stack of vouchers and credits toward parts and manufacturing services such as laser cutting. The exact lineup changes every season, so always check the current Virtual Kit catalog at Kickoff rather than assuming last year's list.

One thing that is always free and never in a voucher: WPILib, the official open-source software you use to program the robot. Anyone can download it, no kit required.

## What the kit is not

The Kit of Parts will not, by itself, win you a regional. It gives you a drivetrain and electronics; the mechanisms that actually play the game, intakes, arms, shooters, and the like, are up to you to design, buy, or fabricate. Treat the kit as your foundation, not your finished robot, and plan a budget for the parts you will add on top.

New to all of this? Start with our [Getting Started guide](https://learnfrc.systemerr.com/guides) for a step-by-step path from unboxing the kit to a robot that drives.`,
  },
  {
    slug: "frc-drive-team-guide",
    title: "FRC Drive Team Guide: Roles and How to Win",
    description: "A clear, accurate guide to FRC drive team roles - drivers, coach, human player, and technician - plus practical tips for winning more matches.",
    keywords: ["FRC drive team roles","FRC driver and operator","FRC drive coach","FRC human player","FRC technician role","how to win FRC matches"],
    date: "2026-06-23",
    readMins: 4,
    content: `The drive team is the small group of people who actually run your robot during a match, and a great one can win games an average robot would lose. Here is exactly who does what and how the best teams turn those roles into wins.

## What counts as a drive team

In FIRST Robotics Competition, a drive team is up to 5 people from the same team who are responsible for that team's performance in a specific match. The official rule is strict on two points: it is a maximum of 5 people, and no more than 1 of them may be a non-student. Everyone else has to be a student. That single adult slot is usually used for the coach, which means students do almost all of the on-field work - which is the whole point.

The game manual defines four roles a drive team can fill: Drivers, Human Players, a Drive Coach, and a Technician. You do not have to fill all of them every match, but understanding each one is the foundation for getting better.

## The four roles

- Drivers (up to 3, must be students): The people holding controllers and operating the robot. Importantly, only Drivers and Human Players are allowed to operate the robot - the coach cannot grab a controller mid-match.
- Human Players (up to 3, must be students): The students who handle game pieces from the field perimeter - loading pieces into the robot, feeding them through a station, or scoring them by hand, depending on that season's game.
- Drive Coach (1, any team member): The strategist and on-field leader. The coach calls the game, watches the whole field, and communicates with the two alliance partners. This is the role that most often uses the team's one non-student slot.
- Technician (1, any team member): The technical resource for pre-match setup, robot connectivity, operator console troubleshooting, and removing the robot after the match. The technician does not stand in the alliance station during play - they work from an event-designated area near the field and are not part of the in-match action.

## Driver vs. "operator": one robot, split controls

A common point of confusion: most teams run two people on controllers and call them the "driver" and the "operator," but the rulebook only uses the word Drivers. There is no separate official operator role. What is really happening is that the team splits robot control across two of its allowed driver slots. Typically:

- The driver handles base movement - driving around the field, lining up, playing defense or dodging it.
- The operator (also a driver) runs the mechanisms - intake, arm or elevator, shooter, and any auto-align or scoring sequences.

Splitting the controls this way keeps any one person from being overloaded, so the driver can focus on positioning while the operator focuses on scoring actions. It only works if those two people communicate constantly and practice together as a pair.

## How good drive teams actually win

The robot gets you to the field; the drive team decides what happens next. A few habits separate the alliances that win:

- Practice on real game tasks, not cones. Driving figure-eights around obstacles does not measure whether your operator can score under pressure. Practice the actual scoring cycles the game rewards.
- Pick a driver-operator pair, not two individuals. The best individual driver plus the best individual operator loses to two people who already work well together. Chemistry beats raw skill.
- Let the coach watch the whole field. Drivers should be heads-down on their robot. The coach tracks the clock, the other five robots, and when to switch from offense to defense or to set up the endgame.
- Plan with your alliance partners before the match. Coaches meet between matches and at the start to divide jobs - who scores where, who plays defense, who handles the endgame. A coordinated three-robot plan almost always beats three robots freelancing.
- Count on consistent cycles over hero plays. Reliable, repeatable scoring runs win more qualification matches than one spectacular highlight that only works half the time.

Drive team is a skill you build over a season, not a tryout you pass once. Rotate practice drivers early, keep notes on what each role struggled with, and treat every practice match like a scouting opportunity on yourselves.

Want role-by-role drills, controller layout ideas, and tryout templates? Dig into the full [LearnFRC Drive Team guide](https://learnfrc.systemerr.com/guides/drive-team) and the rest of the [LearnFRC guides](https://learnfrc.systemerr.com/guides) to get your whole drive team match-ready.`,
  },
  {
    slug: "pid-control-frc",
    title: "PID Control in FRC, Explained Simply",
    description: "A beginner-friendly guide to PID control in FRC: what kP, kI, and kD actually do, how to tune them, and why most teams skip the I term.",
    keywords: ["PID control FRC","FRC PID tuning","WPILib PIDController","kP kI kD tuning","FRC closed-loop control","tuning PID FRC"],
    date: "2026-06-23",
    readMins: 4,
    content: `If your arm overshoots its target, your drivetrain drifts off a straight line, or your shooter never quite hits the right speed, PID control is usually the tool that fixes it. It sounds intimidating, but the core idea is simple: measure how far off you are, and adjust your motors to close that gap.

## What PID actually means

PID is a feedback controller, which means it constantly compares where your mechanism is to where you want it to be. The difference between those two numbers is called the error. PID looks at that error and outputs a value to send to your motors. The name comes from its three terms, each of which reacts to the error in a different way.

- Proportional (P): contributes to the output in proportion to the current error. Big error, big push; small error, small push. This is the workhorse and does most of the job.
- Integral (I): adds up all the past error over time. The longer an error sticks around, the more the I term pushes to eliminate it.
- Derivative (D): reacts to how fast the error is changing. It acts like a brake, slowing the mechanism as it approaches the target so it does not blow past it.

Each term has a constant you tune, written as kP, kI, and kD. The controller multiplies each term by its constant and adds them together to get the final motor output.

## How it looks in code

In WPILib you create a 'PIDController' with your three gains, then call its 'calculate' method every loop. You pass in your current measurement first and your setpoint (the target) second, for example 'pid.calculate(encoder.getDistance(), setpoint)'. The number it returns is what you send to your motor. By default the controller assumes it runs every 20 milliseconds, which matches the standard robot loop, so you just call it once per cycle. If you are new to structuring this kind of code, our [programming and software guide](https://learnfrc.systemerr.com/guides/programming-software) walks through where this fits in a command-based robot.

## How to tune it

Tuning means finding kP, kI, and kD values that make your mechanism fast and stable. The standard manual process is straightforward:

1. Start with all three gains at zero.
2. Slowly raise kP until the mechanism reaches its target. Keep increasing until it just starts to oscillate (bounce back and forth around the setpoint), then back it off slightly.
3. If it still overshoots or oscillates, add a small amount of kD to dampen the motion. A well-tuned kP with a bit of kD handles the vast majority of FRC mechanisms.
4. Change one value at a time and watch the result before moving on. Tuning two gains at once makes it impossible to tell what helped.

A quick symptom guide: too little kP and the mechanism is sluggish or never reaches the target; too much kP and it oscillates or overshoots; kD that is too high makes the motion jittery or slow to start.

## Why most teams skip the I term

This trips up a lot of new programmers, so it is worth being clear: integral gain is generally not recommended for FRC use. Both the official WPILib documentation and REV Robotics advise against it for most mechanisms. The I term can introduce instability and a problem called integral windup, where accumulated error keeps building and causes a big delayed overshoot.

If your mechanism settles close to but not exactly on the target (steady-state error), the better fix is usually a feedforward controller rather than reaching for kI. Feedforward predicts the output your mechanism needs based on physics, instead of waiting for error to pile up. For modeling your system and getting solid starting kP and kD values automatically, the WPILib SysId tool is the recommended route and beats guessing by hand.

## Start simple

Do not overthink it. Begin with P only, add D if you see overshoot, and leave I alone unless nothing else works. Most FRC mechanisms are well controlled with a tuned kP, a touch of kD, and a feedforward term.

Want the full picture on closed-loop control, command-based structure, and writing clean robot code? Head over to the [LearnFRC programming and software guides](https://learnfrc.systemerr.com/guides/programming-software).`,
  },
  {
    slug: "frc-robot-design-process",
    title: "The FRC Robot Design Process, Step by Step",
    description: "A clear, beginner-friendly walkthrough of the FRC robot design process, from game analysis and strategic prioritization to prototyping, CAD, and iteration.",
    keywords: ["FRC robot design process","FRC strategic design","FRC game analysis","FRC build season","FRC prototyping","FRC CAD design"],
    date: "2026-06-23",
    readMins: 4,
    content: `Every January, thousands of FIRST Robotics Competition teams watch the same game reveal and then face the same question: what robot should we actually build? The teams that win consistently are rarely the ones with the flashiest mechanisms. They are the ones who follow a disciplined design process that starts with strategy, not with a CAD model.

Here is how that process works, step by step.

## Start with the game manual, not with ideas

When Kickoff drops in early January, you get the season's game video and a 100-plus-page game manual. The single most important thing you can do in week one is read it carefully, then read it again. Everything downstream, from your robot's drivetrain to its smallest bracket, follows from how points are scored.

As you read, write down every way to earn points and roughly how many points each is worth. This raw list of scoring opportunities is the foundation of what FRC mentors call strategic design, an approach popularized by people like Karthik Kanagasabapathy of Simbotics (Team 1114) in his widely shared "Effective FIRST Strategies" presentation.

## Rank the scoring opportunities

Now turn that list into priorities. For each scoring action, weigh two things: how many points it returns, and how hard it is for your team to do reliably given your budget, tools, and experience. This is a cost-benefit analysis.

A common method is to lay the scoring tasks out and sort them, putting the non-negotiables on one end:

- Driving and maneuvering well (every competitive robot needs this)
- The highest-value, most-achievable scoring tasks next
- "Nice to have" actions that you only attempt if time and resources allow

The goal is a ranked priority list, not a wish list. You almost never have time to build a robot that does everything.

## Choose consistency over capability

This is the principle experienced teams repeat the most: a robot that does one thing consistently beats a robot that does everything unreliably. Resources like FRCDesign.org and Game Manual 0 both stress that scoring reliably at a low or medium level usually earns more, and makes you a more attractive alliance pick, than scoring high but rarely.

So pick a focused set of capabilities you can actually nail, and resist the urge to bolt on a mechanism for every game element.

It is also worth knowing that FIRST provides an official KitBot each season, a baseline robot designed to play some part of the year's game. For newer teams, building and lightly iterating on the KitBot is a legitimate, competitive strategy rather than a fallback. You can learn more about turning priorities into mechanisms in the LearnFRC CAD and Design guide at https://learnfrc.systemerr.com/guides/cad-design.

## Settle the drivetrain early

Your drivetrain is the one subsystem every other part bolts onto, so decide it fast. The classic tradeoff is tank drive (simpler mechanically, electrically, and in code) versus swerve (far more maneuverable, but harder on all three fronts). Swerve has become much more accessible in recent years, but most teams who run it well practiced in the off-season first. Getting a solid drivebase locked in early frees the rest of the season for your scoring mechanisms.

## Prototype before you commit to CAD

Before you model a final mechanism, build rough, fast prototypes out of cheap materials like plywood, scrap aluminum, polycarbonate, and 3D-printed parts. The point is to answer questions quickly: does this intake grab the game piece? Does this arm reach high enough? Prototyping turns guesses into evidence, and it is far cheaper to fail with plywood than with machined aluminum.

## Move into CAD and refine

Once a prototype proves a concept, formalize it in CAD. A full robot model lets you check for collisions, confirm the design fits within the season's frame perimeter and height rules, plan wiring and packaging, and hand clean drawings to whoever is fabricating parts. Treat CAD as iteration, not decoration: expect to revise the model as you test. The LearnFRC CAD and Design department at https://learnfrc.systemerr.com/guides walks through the tools and conventions for this stage.

## Build, test, and iterate continuously

The build period runs roughly six weeks from Kickoff to your first competition. Importantly, the old "bag and tag" and Stop Build Day rules ended after the 2019-20 season, so you can keep working on and improving your robot throughout the season. Use that freedom: build, test against real game tasks, find what breaks, and refine. A driver who has practiced for weeks on a finished robot is worth more than one extra mechanism added the night before bag-up used to happen.

## The short version

Read the manual, list and rank scoring opportunities, pick a focused and consistent strategy, lock the drivetrain, prototype cheaply, refine in CAD, then test and iterate. Strategy first, hardware second, every time.

Ready to turn your priority list into a real design? Start with the LearnFRC CAD and Design guide at https://learnfrc.systemerr.com/guides/cad-design.`,
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
