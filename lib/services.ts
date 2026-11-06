// Engineering contract offer. /services, the home page, and the /contact form
// all read from here so service names stay consistent.

export interface Service {
  id: string;
  name: string;
  summary: string;
  detail: string;
  deliverables: string[];
}

export const SERVICES: Service[] = [
  {
    id: "features",
    name: "Feature ownership",
    summary: "We take a roadmap feature and own it until it ships.",
    detail:
      "The features that sit on the roadmap for quarters are usually the ones nobody has time to own. We take one end to end: spec, build, tests, release, and the follow-up fixes. We work in your codebase and your release process, and report to whoever owns the roadmap.",
    deliverables: [
      "Spec and estimate agreed before we start",
      "Frontend, backend, and API work in your repositories",
      "Tests, review, and release through your pipeline",
      "Written notes your team can maintain from",
    ],
  },
  {
    id: "aws-architecture",
    name: "AWS architecture",
    summary: "Review, fix, or design the backend your product runs on.",
    detail:
      "We read your AWS accounts and code, map what is actually running, and rank what is fragile, slow, or over-built. Then we fix it, or design and build what is missing, with infrastructure as code and staged migrations so production keeps running.",
    deliverables: [
      "Current-state architecture map and ranked findings",
      "Services on ECS, Lambda, or EC2 with RDS, DynamoDB, S3",
      "Terraform or CDK, CI/CD, monitoring, and alerting",
      "IAM and network review from a security background",
    ],
  },
  {
    id: "optimization",
    name: "Cost and performance",
    summary: "Lower the platform bill and the response times without a rewrite.",
    detail:
      "We start from your bill and your traces, not a checklist. Idle capacity, chatty services, the wrong storage classes, missing caches, and slow queries are fixed in order of savings, and each change is measured before and after.",
    deliverables: [
      "Cost breakdown by service, team, and feature",
      "Fixes ranked by monthly savings or latency gained",
      "Before and after numbers for every change",
      "Budgets and alerts so the bill stays down",
    ],
  },
  {
    id: "long-term",
    name: "Long-term engineering",
    summary: "An owner for the goals that take quarters, not sprints.",
    detail:
      "Platform migrations, a new product line, a compliance target, an ML capability. Long-form goals need someone accountable across many months. We plan the milestones with you and deliver them on a retainer, with written progress every week.",
    deliverables: [
      "Milestone plan tied to your business goal",
      "Senior engineers on a monthly retainer",
      "Weekly written progress and risks",
      "Handover at each milestone, not only at the end",
    ],
  },
];

export const ENGAGEMENTS = [
  {
    name: "Assessment",
    terms: "Fixed scope, fixed fee",
    desc: "An architecture, cost, or codebase review with a written plan. The usual start when the scope is not clear yet.",
  },
  {
    name: "Project",
    terms: "Milestone-based",
    desc: "A feature or fix scoped in writing and priced per milestone. Delivered in your accounts and repositories.",
  },
  {
    name: "Retainer",
    terms: "Monthly hours",
    desc: "Ongoing engineering for long-term goals and a roadmap, rather than a single project.",
  },
];

export const PROCESS = [
  { title: "Scoping call", desc: "We talk through your product, your platform, and what is stuck. Free, no preparation needed." },
  { title: "Written proposal", desc: "Scope, approach, timeline, and price in writing, so you know exactly what you are agreeing to." },
  { title: "Build in your repos", desc: "We work in your accounts and repositories, with weekly written updates and working software at each milestone." },
  { title: "Measured handover", desc: "Results against the plan, documentation, and runbooks. Your team owns the code and the IP." },
];

// Conditions we are usually called in for. The label is the signal a client
// would recognise in their own numbers, not a claim about past results.
export const PROBLEMS = [
  {
    label: "Roadmap item older than two quarters",
    title: "Features that never get started",
    desc: "Your team is busy keeping the product running, so the feature customers ask for keeps slipping. We own it from spec to release.",
  },
  {
    label: "Bill growing faster than usage",
    title: "AWS costs out of proportion",
    desc: "Spend climbs every month while traffic does not. Usually idle capacity, data transfer, and storage nobody reads. We find it and cut it.",
  },
  {
    label: "p95 latency climbing",
    title: "A platform slowing down as it grows",
    desc: "What worked for the first customers does not hold at today's load. We find the bottleneck and fix it without a big-bang rewrite.",
  },
  {
    label: "Multi-quarter goal, no owner",
    title: "Long-term goals with no one to drive them",
    desc: "A migration, a new capability, or a compliance target that needs months of steady work. We plan it and own the delivery.",
  },
];

export const BACKGROUND = [
  {
    label: "Security",
    title: "Security background",
    desc: "We come from security work, so least privilege, audit trails, and threat modeling are part of every change, not a review at the end.",
  },
  {
    label: "AI / computer vision",
    title: "AI industry background",
    desc: "Our focus is computer vision: datasets, training, and models deployed at the edge or on AWS. We built the visual positioning behind Macula.",
  },
  {
    label: "In-house products",
    title: "We run our own software",
    desc: "Proxigo Desktop and Macula are ours to operate, which keeps us honest about what a platform needs after launch.",
  },
];

// Extra choices on the contact form that are not headline services.
export const OTHER_INTERESTS = ["Computer vision", "Licensing Proxigo Desktop"];

export const TIMELINES = ["As soon as possible", "Within 1–3 months", "3–6 months out", "Just exploring"];
export const BUDGETS = ["Under $10k", "$10k–$25k", "$25k–$75k", "$75k+", "Not sure yet"];
