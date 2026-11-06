// Engineering contract offer. /services, the home page, and the /contact form
// all read from here so service names stay consistent.

export interface Service {
  id: string;
  name: string;
  /** The situation that usually brings a client to us for this service. */
  when: string;
  summary: string;
  deliverables: string[];
}

export const SERVICES: Service[] = [
  {
    id: "features",
    name: "Feature ownership",
    when: "A roadmap item older than two quarters",
    summary: "We take one feature and own it until it ships: spec, build, tests, and release, in your codebase.",
    deliverables: ["Spec and estimate before we start", "Work in your repositories and pipeline", "Notes your team can maintain from"],
  },
  {
    id: "aws-architecture",
    name: "AWS architecture",
    when: "A backend that grew faster than its design",
    summary: "We map what is running, fix what is fragile, and build what is missing, without taking production down.",
    deliverables: ["Architecture map and ranked findings", "Terraform or CDK, CI/CD, and monitoring", "IAM and network review"],
  },
  {
    id: "optimization",
    name: "Cost and performance",
    when: "A bill growing faster than your usage",
    summary: "We cut spend and latency in order of impact, and measure every change before and after.",
    deliverables: ["Cost breakdown by service and feature", "Fixes ranked by savings or speed", "Budgets and alerts"],
  },
  {
    id: "long-term",
    name: "Long-term engineering",
    when: "A multi-quarter goal with no owner",
    summary: "Migrations, new capabilities, compliance targets. We plan the milestones and own the delivery on a retainer.",
    deliverables: ["Milestone plan tied to the goal", "Weekly written progress", "Handover at every milestone"],
  },
];

export const ENGAGEMENTS = [
  { name: "Assessment", terms: "Fixed fee", desc: "A review with a written plan. The usual start when scope is unclear." },
  { name: "Project", terms: "Per milestone", desc: "One feature or fix, scoped in writing." },
  { name: "Retainer", terms: "Monthly hours", desc: "Ongoing work toward long-term goals." },
];

export const PROCESS = [
  { title: "Scoping call", desc: "Free. We talk through what is stuck." },
  { title: "Written proposal", desc: "Scope, timeline, and price, in writing." },
  { title: "Build in your repos", desc: "Weekly updates, working software at each milestone." },
  { title: "Handover", desc: "Results against the plan. You own the code." },
];

export const BACKGROUND = [
  {
    title: "Security",
    desc: "Least privilege and audit trails are part of every change, not a review at the end.",
  },
  {
    title: "AI and computer vision",
    desc: "Datasets, training, and models at the edge or on AWS. We built Macula's visual positioning.",
  },
  {
    title: "Our own products",
    desc: "We run Proxigo Desktop and Macula ourselves, so we know what software needs after launch.",
  },
];

// Extra choices on the contact form that are not headline services.
export const OTHER_INTERESTS = ["Computer vision", "Licensing Proxigo Desktop"];

export const TIMELINES = ["As soon as possible", "Within 1–3 months", "3–6 months out", "Just exploring"];
export const BUDGETS = ["Under $10k", "$10k–$25k", "$25k–$75k", "$75k+", "Not sure yet"];
