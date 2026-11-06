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
    name: "Feature development",
    summary: "Roadmap features built and shipped inside your product.",
    detail:
      "You have a backlog and not enough engineers for it. We take a feature from spec to production in your codebase, following your review, testing, and release process. Each feature ships with tests and documentation your team can maintain.",
    deliverables: [
      "Frontend, backend, and API work in your repositories",
      "Tests and CI checks alongside every change",
      "Release through your existing deploy pipeline",
      "Written notes your team can maintain from",
    ],
  },
  {
    id: "computer-vision",
    name: "Computer vision",
    summary: "Camera and image data turned into something your product can act on.",
    detail:
      "Detection, tracking, measurement, and visual positioning, from dataset to deployed model. We built the vision stack behind Macula, our own GPS-free positioning module, so we know what it takes to run models on real cameras, at the edge or in the cloud.",
    deliverables: [
      "Data collection, labeling plan, and evaluation set",
      "Model training and accuracy reports against your data",
      "Edge deployment (Jetson, embedded) or cloud inference on AWS",
      "Integration of results into your app, API, or dashboard",
    ],
  },
  {
    id: "product-completion",
    name: "Product completion",
    summary: "A half-built product taken to finished and running in your platform.",
    detail:
      "Prototypes stall at 80%. We take the product the rest of the way: the missing features, the edge cases, auth and billing, deployment, monitoring, and the integration into your existing platform. You get a product your customers can use, not another demo.",
    deliverables: [
      "Gap review: what is left between the prototype and launch",
      "The missing features, hardening, and security work",
      "Integration into your platform, accounts, and data",
      "Production deployment, monitoring, and handover",
    ],
  },
  {
    id: "cloud-integrations",
    name: "AWS backends and integrations",
    summary: "Fix, extend, or build the backend and connect the systems around it.",
    detail:
      "We review the AWS architecture you run, fix what is slow, fragile, or expensive, and build what is missing. When systems need to share data, we connect them through your existing APIs with integrations that are versioned and monitored.",
    deliverables: [
      "Architecture review with findings ranked by impact",
      "APIs and services on ECS, Lambda, or EC2",
      "Infrastructure as code (Terraform or CDK) and CI/CD",
      "API integrations, webhooks, and data syncs",
    ],
  },
];

export const ENGAGEMENTS = [
  {
    name: "Assessment",
    terms: "Fixed scope, fixed fee",
    desc: "A short review of your code, architecture, or prototype with a written plan. The usual start when the scope is not clear yet.",
  },
  {
    name: "Project",
    terms: "Milestone-based",
    desc: "A feature, model, or product scoped in writing and priced per milestone. Delivered in your accounts and repositories.",
  },
  {
    name: "Retainer",
    terms: "Monthly hours",
    desc: "A block of engineering hours each month for teams that need contractors on a roadmap rather than a single project.",
  },
];

export const PROCESS = [
  { title: "Scoping call", desc: "A short call about your product, your platform, and what needs to ship. No preparation required." },
  { title: "Written proposal", desc: "Scope, approach, timeline, and price in writing, so you know exactly what you are agreeing to." },
  { title: "Build in your repos", desc: "We work in your accounts and repositories, with weekly written updates and working software at each milestone." },
  { title: "Handover", desc: "Documentation, runbooks, and a walkthrough. Your team owns the code and the IP." },
];

export const SCENARIOS = [
  {
    problem: "A feature your customers keep asking for has sat on the roadmap for two quarters.",
    response: "We scope it with your team, build it in your codebase, and ship it through your release process.",
  },
  {
    problem: "You have camera data and an idea for what it could tell you, but no one on staff who has shipped a vision model.",
    response: "We run a short feasibility test on your data first, so you know the achievable accuracy before committing to a build.",
  },
  {
    problem: "A prototype works in demos but is not ready for paying customers.",
    response: "We list the gap to launch, then close it: hardening, auth, billing, deployment, and monitoring.",
  },
  {
    problem: "Your backend is slowing down or getting expensive as you grow.",
    response: "We find the bottleneck or the waste, fix it in order of impact, and migrate without a big-bang cutover.",
  },
];

// Extra choices on the contact form that are not engineering services.
export const OTHER_INTERESTS = ["Licensing Proxigo Desktop"];

export const TIMELINES = ["As soon as possible", "Within 1–3 months", "3–6 months out", "Just exploring"];
export const BUDGETS = ["Under $10k", "$10k–$25k", "$25k–$75k", "$75k+", "Not sure yet"];
