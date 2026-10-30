export const serviceOffers = [
  {
    id: "websites",
    title: "Websites & Digital Experiences",
    audience: "For modern companies, startups and brands needing an exceptional online presence that drives conversion.",
    problem: "Visitors leave within seconds if positioning is vague, navigation is sluggish, or mobile experience is clumsy.",
    deliverables: [
      "Stripe-grade typography, responsive layout and fluid interactions",
      "Streamlined project inquiry and lead-capture pipelines",
      "Technical SEO, Open Graph cards, sitemap and sub-second load times",
      "Complete source code repository handover with 6 months included maintenance"
    ],
    separate: "Domain acquisition, third-party hosting subscriptions, and copywriting are scoped in your quote.",
    service: "Website"
  },
  {
    id: "ai-agents",
    title: "AI Agents & Intelligent Systems",
    audience: "For businesses wanting applied AI that solves real operational bottlenecks without hallucination risks.",
    problem: "Disconnected generic chatbots frustrate users and lack access to company context and secure tools.",
    deliverables: [
      "Context-aware domain assistants with structured knowledge retrieval",
      "Strict safety rails, quota bounding and deterministic tool invocation",
      "Human-in-the-loop review for critical actions and outbound decisions",
      "Private API integration with complete audit trails"
    ],
    separate: "LLM token usage, specialized GPU runtime, and third-party model credits are confirmed upfront.",
    service: "AI agents & automation"
  },
  {
    id: "automation",
    title: "Business Automation & Workflows",
    audience: "For operational teams repeating manual data entry, lead qualification, or fragmented coordination.",
    problem: "Valuable customer data gets trapped across separate tools, leading to delayed follow-ups and lost revenue.",
    deliverables: [
      "End-to-end event-driven orchestration (n8n, webhooks, serverless tasks)",
      "Automated lead enrichment, instant notifications and CRM synchronization",
      "Idempotent retry mechanisms, transaction logs and error alerts",
      "Operational runbooks and team walkthroughs"
    ],
    separate: "Third-party SaaS API limits, database hosting, and workspace licenses are scoped separately.",
    service: "AI agents & automation"
  },
  {
    id: "mobile-apps",
    title: "Mobile Applications",
    audience: "For products requiring dedicated device capabilities, offline utility, or direct mobile access.",
    problem: "Generic hybrid wrappers feel sluggish, drain battery, and fail to provide native device reliability.",
    deliverables: [
      "Performant Android native applications with modern Jetpack Compose architecture",
      "Offline-first local caching, encrypted preferences and SQLite persistence",
      "Hardware integrations (camera, biometrics, background services)",
      "Production-ready APK and Play Store release packaging"
    ],
    separate: "Google Play developer registration fees and ongoing third-party push notification quotas are separate.",
    service: "Android app"
  },
  {
    id: "digital-transformation",
    title: "Digital Transformation & Custom Portals",
    audience: "For organizations outgrowing disparate spreadsheets and seeking a cohesive software backbone.",
    problem: "Off-the-shelf software rarely fits specialized business logic, forcing staff to maintain awkward manual workarounds.",
    deliverables: [
      "Tailored web applications, internal administration tools and customer portals",
      "Role-based access control (RBAC), multi-tenant schemas and audit logging",
      "Seamless integration with existing databases, spreadsheets and payment rails",
      "Deployment to client-owned cloud environments (Vercel, Firebase, AWS, Cloud Run)"
    ],
    separate: "Enterprise SSO integrations, compliance audits, and specialized legacy migrations are scoped by milestone.",
    service: "Web application"
  }
] as const;

export const serviceSegments = {
  "website-development": {
    title: "Websites & Digital Experiences — KITTY CORP",
    description: "High-performance business websites and digital platforms built with Stripe-grade discipline, crisp typography, and sub-second load times.",
    eyebrow: "CAPABILITY / WEBSITES & DIGITAL EXPERIENCES",
    heading: "Websites that make your engineering credibility unmistakable.",
    intro: "We partner directly with founders and executive teams to design, architect and deploy digital experiences that present your company with authority and convert serious prospects.",
    outcomes: [
      "Fluid, responsive presentation optimized for desktop and mobile form factors",
      "Integrated conversion forms with instant delivery to your team",
      "Rigorous Core Web Vitals, accessible semantic HTML, and technical SEO metadata",
      "Full IP ownership, clean TypeScript repository, and 6 months included maintenance"
    ],
    workflow: [
      "Discovery & Positioning: We clarify your core offering, key audience, and primary conversion objectives.",
      "Architecture & Design: We produce high-fidelity interactive wireframes focusing on content hierarchy and visual discipline.",
      "Engineering & Integration: We build production-ready Next.js components with strict type safety and zero AI slop.",
      "Handover & Support: We deploy to your infrastructure, train your team, and provide 6 months of inclusive maintenance."
    ],
    boundary: "All project scope, milestones, deliverables, and payment terms are fixed and agreed in writing prior to commencing development.",
    service: "Website" as const
  },
  "ai-agents": {
    title: "AI Agents & Intelligent Systems — KITTY CORP",
    description: "Practical applied AI agents, context-aware assistants, and deterministic automation engineered for business reliability.",
    eyebrow: "CAPABILITY / APPLIED AI SYSTEMS",
    heading: "Intelligent systems with human review where it counts.",
    intro: "Cut through AI hype with production-ready agents engineered around your proprietary knowledge bases, strict verification bounds, and transparent audit logging.",
    outcomes: [
      "Context-aware domain agents with low-latency response streaming",
      "Human-in-the-loop approval gates for sensitive operations",
      "Strict data isolation and zero leakage of customer context",
      "Deterministic tool invocation connected directly to your existing database and APIs"
    ],
    workflow: [
      "Use Case Definition: We isolate the exact repetitive workflows suitable for reliable automated reasoning.",
      "Knowledge Architecture: We structure your reference documents, schemas, and API contracts into clean retrieval contexts.",
      "Agent Development: We implement guardrails, fallback behaviors, and quota protections.",
      "Evaluation & Rollout: We stress-test accuracy, conduct red-teaming, and launch with continuous telemetry."
    ],
    boundary: "Third-party model API tokens, dedicated GPU inference instances, and custom fine-tuning are scoped transparently.",
    service: "AI agents & automation" as const
  },
  "business-automation": {
    title: "Business Automation & Workflow Engineering — KITTY CORP",
    description: "Automate complex business operations, connect fragmented tools, and eliminate manual data entry with robust background workflows.",
    eyebrow: "CAPABILITY / BUSINESS AUTOMATION",
    heading: "Connect your operations. Remove manual friction.",
    intro: "We engineer resilient automation bridges between your website, inboxes, CRMs, accounting tools, and communication channels so work moves forward automatically.",
    outcomes: [
      "Automated lead triage and instantaneous customer routing",
      "Synchronized customer data across inboxes, spreadsheets, and databases",
      "Self-healing workflows with failure alerts and retry queues",
      "Complete operating runbooks and source code ownership"
    ],
    workflow: [
      "Process Mapping: We audit your team's manual steps and pinpoint latency bottlenecks.",
      "Integration Design: We construct webhook listeners and data transformation pipelines.",
      "Automated Execution: We deploy orchestration workflows with strict idempotency and validation.",
      "Monitoring & Tuning: We verify zero message loss and ensure end-to-end auditability."
    ],
    boundary: "API rate limits of third-party SaaS services and automation server hosting are confirmed before kickoff.",
    service: "AI agents & automation" as const
  },
  "mobile-apps": {
    title: "Mobile Application Development — KITTY CORP",
    description: "Performant native Android mobile applications engineered with offline persistence, crisp UI, and reliable background services.",
    eyebrow: "CAPABILITY / MOBILE APPLICATIONS",
    heading: "Native mobile performance built for real-world reliability.",
    intro: "From standalone Android consumer products like KITTY AI and SecretChat to custom field tools, we build mobile software that is responsive, secure, and intuitive.",
    outcomes: [
      "Native Android architecture (Kotlin, Jetpack Compose, modern architecture components)",
      "Offline-first local data synchronization with SQLite persistence",
      "Hardware sensor, camera, biometric, and notification integration",
      "Signed release binaries and complete store listing assets"
    ],
    workflow: [
      "Interface Architecture: We prototype touch flows, device ergonomics, and navigation hierarchies.",
      "Core Engineering: We build native screens with responsive state management and background workers.",
      "Device Verification: We test across screen form factors, memory constraints, and Android API versions.",
      "Deployment: We deliver cryptographically signed APKs or manage Google Play publishing."
    ],
    boundary: "App store developer fees and specialized hardware peripheral costs are handled directly by the client.",
    service: "Android app" as const
  },
  "digital-transformation": {
    title: "Digital Transformation & Custom Portals — KITTY CORP",
    description: "Bespoke software platforms, customer account portals, and internal operations tools that modernize legacy business workflows.",
    eyebrow: "CAPABILITY / DIGITAL TRANSFORMATION",
    heading: "Tailored software that fits how your business actually works.",
    intro: "Replace fragile spreadsheets and manual coordination with unified cloud applications designed specifically around your team's unique operational needs.",
    outcomes: [
      "Custom client portals with authenticated quote reviews and milestone tracking",
      "Role-based administrative dashboards for staff and management",
      "Clean REST/RPC APIs and relational database architecture",
      "Scalable deployment to client cloud accounts with full IP handover"
    ],
    workflow: [
      "System Audit: We analyze existing data stores, manual friction, and security boundaries.",
      "Schema & UI Design: We design normalized databases and fast, intuitive interfaces.",
      "Iterative Engineering: We build features in milestone sprints with live staging previews.",
      "Handover & Training: We conduct administrator walkthroughs and hand over all source code."
    ],
    boundary: "Enterprise migrations, data sanitation, and cloud infrastructure costs are agreed upon per milestone.",
    service: "Web application" as const
  },
  "coaching-centres": {
    title: "Websites & automation for coaching centres",
    description: "Course pages, admission enquiries and organised follow-ups for coaching centres and education businesses.",
    eyebrow: "FOR COACHING & EDUCATION BUSINESSES",
    heading: "Make the next admission enquiry easier.",
    intro: "Help students and parents find the right course, understand how to apply and reach your team. We build the website and enquiry workflow around how your centre operates.",
    outcomes: ["Course and batch information that is easy to find on a phone", "An enquiry form that collects the details your team needs", "A shared dashboard or spreadsheet for follow-up, if included"],
    workflow: ["A parent opens a course page and sends an enquiry.", "The request reaches the agreed inbox or CRM with the course context.", "Your admissions team reviews it and follows up. Automated acknowledgements can be added with consent."],
    boundary: "This is an example workflow, not a completed client case study. Student records, payment collection, bulk messaging and learning platforms require a separate scope and appropriate access controls.",
    service: "Website" as const,
  },
  "agencies": {
    title: "Websites & internal tools for small agencies",
    description: "Clear service websites, project enquiry workflows and practical automation for agencies and service businesses.",
    eyebrow: "FOR AGENCIES & SERVICE BUSINESSES",
    heading: "A clearer offer. A better handoff.",
    intro: "Give prospects a clear view of your services, then keep the enquiry organised as it moves into your team’s working tools.",
    outcomes: ["A service website with selected work and one clear contact path", "Project requests organised by the information you actually use", "Scoped CRM, email or task-tool integrations"],
    workflow: ["A prospect selects a service and describes the project.", "The brief reaches your team with a reference and agreed routing.", "A person qualifies the work and approves the quote before an automation creates the next task."],
    boundary: "This is an example, not a claimed client result. CRM subscriptions, workflow hosting, paid models and third-party usage are separate unless your written quote includes them.",
    service: "AI agents & automation" as const,
  },
} as const;

export type ServiceSegment = keyof typeof serviceSegments;
