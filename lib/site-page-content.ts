import { z } from "zod";

export const SITE_PAGE_SLUGS = ["home", "services", "company", "contact"] as const;
export type SitePageSlug = (typeof SITE_PAGE_SLUGS)[number];
export type SitePageContent = Record<string, string>;

export const sitePageDefaults: Record<SitePageSlug, SitePageContent> = {
  home: {
    seoTitle: "Indian AI, software & robotics company",
    seoDescription: "KITTY CORP is an independent Indian technology company building business websites, custom software and AI workflow automation, with early research in robotics and intelligent systems.",
    heroEyebrow: "INDEPENDENT TECHNOLOGY COMPANY · INDIA",
    heroTitle: "Built for business.",
    heroAccent: "Curious about what’s next.",
    heroDescription: "We build websites, software and AI workflows for businesses. In our own lab, we explore intelligent systems and robotics.",
    heroNote: "Independent by design. Robotics ideas are still early.",
    heroPrimaryCta: "Start a project",
    heroSecondaryCta: "Explore what we build",
    digitalHeading: "Technology for",
    digitalAccent: "the work you do.",
    digitalDescription: "We design and build digital tools around real business needs, from a first website to software and AI workflows.",
    websiteCapabilityTitle: "Websites",
    websiteCapabilityDescription: "Clear, fast websites that help people understand your business and take the next step.",
    softwareCapabilityTitle: "Apps & software",
    softwareCapabilityDescription: "Customer applications and internal tools designed around the work they need to do.",
    automationCapabilityTitle: "AI & automation",
    automationCapabilityDescription: "Useful AI features and connected workflows, with people in control of important actions.",
    roboticsHeading: "Ideas moving",
    roboticsAccent: "into the world.",
    roboticsDescription: "Our early research looks at how intelligent systems might help people in daily life, agriculture and energy.",
    buddyDescription: "An AI companion robot idea for everyday interaction. A physical prototype is still ahead.",
    agriyaanDescription: "An autonomous agricultural rover concept shaped around practical needs in the field. Field testing has not started.",
    urjayaanDescription: "Exploring intelligent software and controls for solar generation and energy management.",
  },
  services: {
    seoTitle: "AI automation, websites & software services in India",
    seoDescription: "KITTY CORP designs business websites, custom web and Android applications, AI agents and practical workflow automation for businesses in India. Clear scope and human review for important actions.",
    eyebrow: "SOFTWARE FOR THE WAY YOU WORK",
    title: "Business websites, software & AI automation.",
    intro: "We’re an independent Indian technology team designing, developing and maintaining business websites, applications and useful automation. You work directly with the people building the solution, from the first conversation to handover.",
    primaryCta: "Discuss Your Project",
    secondaryCta: "View our work",
    websiteAudience: "For local businesses, consultants and teams improving their first impression online.",
    websiteProblem: "Visitors need to understand your offer and know how to enquire.",
    websiteDeliverables: "Responsive pages with clear content and navigation\nA contact or lead-capture path\nLaunch setup and an agreed handover",
    websiteSeparate: "Domains, hosting, paid integrations and ongoing content work are separate unless included in your quote.",
    softwareAudience: "For teams that need more than a brochure site.",
    softwareProblem: "Spreadsheets, messages and disconnected tools make an everyday task harder than it should be.",
    softwareDeliverables: "Scoped web applications, Android apps or internal dashboards\nAgreed accounts, data flows and admin tools\nTesting, release planning and source handover",
    softwareSeparate: "App-store fees, infrastructure, third-party APIs and future features are scoped separately.",
    automationAudience: "For businesses repeating the same enquiry, support or administration tasks.",
    automationProblem: "Useful information arrives in one tool, but the next step still depends on manual copying and follow-up.",
    automationDeliverables: "One clearly defined workflow with connected tools\nAI assistance where it helps, with human review for sensitive actions\nFailure handling, logs and operating instructions",
    automationSeparate: "Model usage, n8n or other hosting, CRM plans and paid APIs are confirmed before development.",
    automationHeading: "AI automation for everyday business workflows.",
    automationIntro: "We help businesses identify repetitive work that can be improved with scoped AI agents and connected tools. Each engagement starts with a specific process, its data sources and the actions a person should approve.",
    automationUseCasesHeading: "Potential use cases",
    automationUseCases: "Website enquiry intake, classification and routing\nCustomer support drafts and knowledge lookup\nCRM updates, follow-up reminders and hand-offs\nDocument extraction and structured data entry\nInternal reporting and repeatable operations",
    automationBoundary: "These are example applications, not claims of deployed client projects. Scope, integrations, permissions, human review and failure handling are agreed before implementation.",
    automationCta: "Discuss an AI workflow",
    priceNote: "Approved website packages start at $50 USD. Custom work is quoted against your scope.",
  },
  company: {
    seoTitle: "Company",
    seoDescription: "Meet KITTY CORP, an independent team developing software, AI and autonomous systems.",
    pageEyebrow: "ABOUT KITTY CORP",
    pageTitle: "A company",
    pageAccent: "we’re building.",
    pageIntro: "Independent work in AI, robotics and intelligent software. Client projects and our own products, built by a small team.",
    introEyebrow: "THE COMPANY",
    introTitle: "Independent.",
    introAccent: "Still early.",
    introLead: "KITTY CORP is a small Indian technology company founded by Virat and Sarthak.",
    introBodyFirst: "Our work has two parts: digital solutions for clients, and our own exploration of intelligent products and robotics.",
    introBodySecond: "We are building the company alongside the technology, sharing what is ready and being clear about what is still an idea.",
  },
  contact: {
    seoTitle: "Let’s talk",
    seoDescription: "An idea, some feedback, a question. Talk to the founders building KITTY CORP.",
    eyebrow: "CONTACT THE KITTY TEAM",
    titleLineOne: "A good place",
    titleLineTwo: "to start a",
    titleAccent: "conversation.",
    description: "Tell us what you’re thinking. Feedback on something we’re building. A possible collaboration. Or just a hello.",
    responseNote: "The KITTY team reads the messages here.",
  },
};

export type SitePageEditorField = {
  key: string;
  label: string;
  kind: "text" | "textarea";
  minLength: number;
  maxLength: number;
  rows?: number;
  hint?: string;
};

type SitePageEditorGroup = {
  title: string;
  description?: string;
  fields: SitePageEditorField[];
};

export const sitePageInfo: Record<SitePageSlug, { label: string; route: string; summary: string }> = {
  home: { label: "Homepage", route: "/", summary: "The main headline, company divisions, and search preview." },
  services: { label: "Services", route: "/services", summary: "Service descriptions, enquiry guidance, and search preview." },
  company: { label: "Company", route: "/company", summary: "The company introduction and search preview." },
  contact: { label: "Contact", route: "/contact", summary: "The contact introduction and search preview." },
};

const field = (
  key: string,
  label: string,
  maxLength: number,
  options: { kind?: "text" | "textarea"; minLength?: number; rows?: number; hint?: string } = {},
): SitePageEditorField => ({
  key,
  label,
  kind: options.kind ?? "text",
  minLength: options.minLength ?? 2,
  maxLength,
  rows: options.rows,
  hint: options.hint,
});

export const sitePageEditorGroups: Record<SitePageSlug, SitePageEditorGroup[]> = {
  home: [
    {
      title: "Search appearance",
      description: "Shown in search results and link previews.",
      fields: [
        field("seoTitle", "Search title", 70, { hint: "Keep it clear and specific." }),
        field("seoDescription", "Search description", 240, { kind: "textarea", rows: 3, minLength: 30 }),
      ],
    },
    {
      title: "Homepage hero",
      description: "The first text visitors see. The title is split across two visual lines.",
      fields: [
        field("heroEyebrow", "Small label", 80),
        field("heroTitle", "Headline, first line", 65, { hint: "Short headlines fit the design best." }),
        field("heroAccent", "Headline, highlighted line", 65),
        field("heroDescription", "Introduction", 500, { kind: "textarea", rows: 4, minLength: 20 }),
        field("heroNote", "Short note below the buttons", 140, { minLength: 0 }),
        field("heroPrimaryCta", "Main button label", 40),
        field("heroSecondaryCta", "Second link label", 50),
      ],
    },
    {
      title: "Digital Solutions",
      fields: [
        field("digitalHeading", "Heading, first line", 60),
        field("digitalAccent", "Heading, highlighted line", 60),
        field("digitalDescription", "Introduction", 400, { kind: "textarea", rows: 3, minLength: 20 }),
        field("websiteCapabilityTitle", "Website service label", 45),
        field("websiteCapabilityDescription", "Website service description", 180, { kind: "textarea", rows: 2, minLength: 15 }),
        field("softwareCapabilityTitle", "Apps and software label", 45),
        field("softwareCapabilityDescription", "Apps and software description", 180, { kind: "textarea", rows: 2, minLength: 15 }),
        field("automationCapabilityTitle", "AI service label", 45),
        field("automationCapabilityDescription", "AI service description", 180, { kind: "textarea", rows: 2, minLength: 15 }),
      ],
    },
    {
      title: "Intelligence & Robotics",
      description: "Keep project descriptions accurate about whether work is a concept, prototype, or tested product.",
      fields: [
        field("roboticsHeading", "Heading, first line", 60),
        field("roboticsAccent", "Heading, highlighted line", 60),
        field("roboticsDescription", "Introduction", 400, { kind: "textarea", rows: 3, minLength: 20 }),
        field("buddyDescription", "KITTY BUDDY description", 240, { kind: "textarea", rows: 3, minLength: 20 }),
        field("agriyaanDescription", "AGRIYAAN description", 240, { kind: "textarea", rows: 3, minLength: 20 }),
        field("urjayaanDescription", "URJAYAAN description", 240, { kind: "textarea", rows: 3, minLength: 20 }),
      ],
    },
  ],
  services: [
    {
      title: "Search appearance",
      description: "Shown in search results and link previews.",
      fields: [
        field("seoTitle", "Search title", 80),
        field("seoDescription", "Search description", 240, { kind: "textarea", rows: 3, minLength: 30 }),
      ],
    },
    {
      title: "Services introduction",
      fields: [
        field("eyebrow", "Small label", 80),
        field("title", "Page headline", 100),
        field("intro", "Introduction", 600, { kind: "textarea", rows: 4, minLength: 30 }),
        field("primaryCta", "Main button label", 45),
        field("secondaryCta", "Second link label", 45),
      ],
    },
    {
      title: "Business Websites",
      description: "Put one deliverable on each line. These are displayed as a short list.",
      fields: [
        field("websiteAudience", "Who this helps", 240, { kind: "textarea", rows: 2, minLength: 20 }),
        field("websiteProblem", "Customer need", 240, { kind: "textarea", rows: 2, minLength: 20 }),
        field("websiteDeliverables", "What we deliver", 600, { kind: "textarea", rows: 4, minLength: 30, hint: "One item per line." }),
        field("websiteSeparate", "Costs or items scoped separately", 350, { kind: "textarea", rows: 3, minLength: 20 }),
      ],
    },
    {
      title: "Apps & Custom Software",
      description: "Put one deliverable on each line. These are displayed as a short list.",
      fields: [
        field("softwareAudience", "Who this helps", 240, { kind: "textarea", rows: 2, minLength: 20 }),
        field("softwareProblem", "Customer need", 240, { kind: "textarea", rows: 2, minLength: 20 }),
        field("softwareDeliverables", "What we deliver", 600, { kind: "textarea", rows: 4, minLength: 30, hint: "One item per line." }),
        field("softwareSeparate", "Costs or items scoped separately", 350, { kind: "textarea", rows: 3, minLength: 20 }),
      ],
    },
    {
      title: "AI Agents & Automation",
      description: "Keep the distinction clear between example use cases and work already delivered.",
      fields: [
        field("automationAudience", "Who this helps", 240, { kind: "textarea", rows: 2, minLength: 20 }),
        field("automationProblem", "Customer need", 240, { kind: "textarea", rows: 2, minLength: 20 }),
        field("automationDeliverables", "What we deliver", 600, { kind: "textarea", rows: 4, minLength: 30, hint: "One item per line." }),
        field("automationSeparate", "Costs or items scoped separately", 350, { kind: "textarea", rows: 3, minLength: 20 }),
        field("automationHeading", "Automation section headline", 100),
        field("automationIntro", "Automation introduction", 500, { kind: "textarea", rows: 4, minLength: 30 }),
        field("automationUseCasesHeading", "Examples heading", 60),
        field("automationUseCases", "Example use cases", 800, { kind: "textarea", rows: 6, minLength: 30, hint: "One example per line." }),
        field("automationBoundary", "Clarification below the examples", 500, { kind: "textarea", rows: 4, minLength: 30 }),
        field("automationCta", "Automation link label", 50),
        field("priceNote", "Starting price note", 200, { kind: "textarea", rows: 2, minLength: 20 }),
      ],
    },
  ],
  company: [
    {
      title: "Search appearance",
      description: "Shown in search results and link previews.",
      fields: [
        field("seoTitle", "Search title", 70),
        field("seoDescription", "Search description", 240, { kind: "textarea", rows: 3, minLength: 30 }),
      ],
    },
    {
      title: "Company page introduction",
      fields: [
        field("pageEyebrow", "Small label", 80),
        field("pageTitle", "Headline, first line", 55),
        field("pageAccent", "Headline, highlighted line", 55),
        field("pageIntro", "Introduction", 400, { kind: "textarea", rows: 3, minLength: 20 }),
      ],
    },
    {
      title: "Company story",
      fields: [
        field("introEyebrow", "Small label", 60),
        field("introTitle", "Section heading, first line", 55),
        field("introAccent", "Section heading, second line", 55),
        field("introLead", "Lead sentence", 300, { kind: "textarea", rows: 3, minLength: 20 }),
        field("introBodyFirst", "First paragraph", 500, { kind: "textarea", rows: 4, minLength: 20 }),
        field("introBodySecond", "Second paragraph", 500, { kind: "textarea", rows: 4, minLength: 20 }),
      ],
    },
  ],
  contact: [
    {
      title: "Search appearance",
      description: "Shown in search results and link previews.",
      fields: [
        field("seoTitle", "Search title", 70),
        field("seoDescription", "Search description", 240, { kind: "textarea", rows: 3, minLength: 30 }),
      ],
    },
    {
      title: "Contact introduction",
      description: "The email addresses and enquiry form are managed separately and cannot be changed here.",
      fields: [
        field("eyebrow", "Small label", 80),
        field("titleLineOne", "Headline, first line", 45),
        field("titleLineTwo", "Headline, second line", 45),
        field("titleAccent", "Headline, highlighted line", 45),
        field("description", "Introduction", 400, { kind: "textarea", rows: 4, minLength: 20 }),
        field("responseNote", "Short reassurance", 160, { kind: "textarea", rows: 2, minLength: 10 }),
      ],
    },
  ],
};

export const sitePageContentSchemas: Record<SitePageSlug, z.ZodType<SitePageContent>> = Object.fromEntries(
  SITE_PAGE_SLUGS.map((slug) => {
    const fields = sitePageEditorGroups[slug].flatMap((group) => group.fields);
    const keys = fields.map((item) => item.key);
    const expected = Object.keys(sitePageDefaults[slug]).sort();
    const actual = [...keys].sort();
    if (new Set(keys).size !== keys.length || expected.join("|") !== actual.join("|")) {
      throw new Error("Page editor fields do not match the validated page content.");
    }
    const shape: Record<string, z.ZodString> = {};
    for (const item of fields) {
      shape[item.key] = z.string().trim().min(item.minLength).max(item.maxLength);
    }
    return [slug, z.object(shape).strict()];
  }),
) as Record<SitePageSlug, z.ZodType<SitePageContent>>;

export function isSitePageSlug(value: unknown): value is SitePageSlug {
  return typeof value === "string" && SITE_PAGE_SLUGS.includes(value as SitePageSlug);
}

export function parseSitePageContent(slug: SitePageSlug, value: unknown): SitePageContent {
  return sitePageContentSchemas[slug].parse(value);
}
