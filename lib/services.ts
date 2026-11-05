// Consulting offer. The home page, /services, and the /contact form all read
// from here so service names stay consistent.

export interface Service {
  id: string;
  name: string;
  summary: string;
  detail: string;
  deliverables: string[];
}

export const SERVICES: Service[] = [
  {
    id: "architecture-review",
    name: "Architecture review",
    summary: "Find out what is slowing you down, costing too much, or one bad day from an outage.",
    detail:
      "A fixed-scope assessment of the systems you run today: AWS accounts, services, data stores, deployment, and how they hold up under load. You get a written report with findings ranked by impact and a plan your team can act on with or without us.",
    deliverables: [
      "Current-state architecture diagram",
      "Cost, reliability, and security findings, ranked",
      "Scaling bottlenecks and failure points",
      "A phased remediation plan with effort estimates",
    ],
  },
  {
    id: "aws-backend",
    name: "AWS backend engineering",
    summary: "Fix the architecture you have, or design and build something new.",
    detail:
      "We design and build backends on AWS: APIs, containers or serverless, databases, queues and event pipelines, with infrastructure as code and CI/CD from day one. Migrations are staged so production keeps running while we change it.",
    deliverables: [
      "APIs and services on ECS, Lambda, or EC2",
      "Data stores: RDS/Aurora, DynamoDB, S3",
      "Infrastructure as code (Terraform or CDK)",
      "CI/CD, monitoring, alerting, and runbooks",
    ],
  },
  {
    id: "integrations",
    name: "Integrations",
    summary: "Connect the systems that should already be talking to each other.",
    detail:
      "We work with your existing APIs and infrastructure, not around them. Third-party platforms, internal services, field devices, and data feeds get connected through integrations that are versioned, monitored, and documented.",
    deliverables: [
      "API integrations and webhooks",
      "Data pipelines and syncs between systems",
      "Auth and SSO between platforms",
      "Field device and telemetry ingestion",
    ],
  },
  {
    id: "contract-engineering",
    name: "Contract engineering",
    summary: "Senior engineers who join your team for a defined scope.",
    detail:
      "When you need capacity rather than a project, we work as independent contractors inside your repositories, cloud accounts, and processes. You direct the work; we bring the experience to get it done without hand-holding.",
    deliverables: [
      "Feature and platform work in your codebase",
      "Code review and pairing with your engineers",
      "On-call and incident support by arrangement",
      "Documentation and handover as we go",
    ],
  },
];

export const ENGAGEMENTS = [
  {
    name: "Assessment",
    terms: "Fixed scope, fixed fee",
    desc: "A bounded review with a written report and plan. The usual starting point if you are not sure where the problems are.",
  },
  {
    name: "Project",
    terms: "Milestone-based",
    desc: "Scoped from an assessment or your own spec, priced per milestone, delivered in your accounts and repositories.",
  },
  {
    name: "Retainer",
    terms: "Monthly hours",
    desc: "Ongoing engineering capacity for teams that need contractors on call for a roadmap rather than a single project.",
  },
];

export const PROCESS = [
  { title: "Scoping call", desc: "A short call about what you run, what is breaking, and what you need. No preparation required." },
  { title: "Written proposal", desc: "Scope, approach, timeline, and price in writing, so you know exactly what you are agreeing to." },
  { title: "Build in the open", desc: "We work in your accounts and repositories with weekly written updates and working software at each milestone." },
  { title: "Handover", desc: "Documentation, runbooks, and a walkthrough. Your team owns everything we built." },
];

export const SCENARIOS = [
  {
    problem: "Your backend grew up on one server and it is starting to fall over at peak.",
    response: "We split out the parts under load, move them onto managed AWS services, and migrate without a big-bang cutover.",
  },
  {
    problem: "Your AWS bill grew faster than your customer count.",
    response: "We find the waste: idle capacity, chatty services, the wrong storage classes, and fix it in order of savings.",
  },
  {
    problem: "Two systems that should share data rely on someone exporting a spreadsheet.",
    response: "We build an integration against the APIs you already have, with retries, monitoring, and an audit trail.",
  },
  {
    problem: "There is a feature on the roadmap and nobody free to build it.",
    response: "We join your team as contractors for that scope, work your way, and leave it documented.",
  },
];

export const TIMELINES = ["As soon as possible", "Within 1–3 months", "3–6 months out", "Just exploring"];
export const BUDGETS = ["Under $10k", "$10k–$25k", "$25k–$75k", "$75k+", "Not sure yet"];
