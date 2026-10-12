import "server-only";
import { companyProducts, companySettings, companyTeam } from "./company-server";
import { publishedLaunches } from "./launches-server";
import { launchHref } from "./launches";
import { publicJournal } from "./journal-server";
import { technologyBrands } from "./technology-ecosystem";
import type { WebsiteAssistantSource } from "./website-assistant-types";

const publicPages: WebsiteAssistantSource[] = [
  { label: "Start a project", href: "/projects" },
  { label: "Our products", href: "/products" },
  { label: "KITTY AI", href: "/kitty-ai" },
  { label: "Meet the team", href: "/team" },
  { label: "Build log", href: "/build-log" },
  { label: "Research & experiments", href: "/research" },
  { label: "Contact the team", href: "/contact" },
];

export async function websiteAssistantContext() {
  const [products, releases, team, company, updates] = await Promise.all([
    companyProducts(),
    publishedLaunches().catch(() => []),
    companyTeam(),
    companySettings(),
    publicJournal().catch(() => []),
  ]);
  // Explicitly allowlist public fields. This module never queries the inbox,
  // early-access list, auth records, admin configuration or the AI app database.
  const context = {
    company: "KITTY CORP is an independent early-stage technology company. It builds websites and applications for clients while developing its own AI software and robotics experiments. Do not infer company registration, partnerships or customer counts.",
    services: { website: "/services", enquiry: "/projects", offer: "Website and application development, from planning to launch. Six months of maintenance are included after delivery. Scope and support terms are agreed per project; maintenance is not unlimited new features. KITTY AI can help refine a brief; it must not invent a payable amount. Pricing rules are awaiting owner input. Confirmed quotes offer full advance with 2.5% off, half now/half after review with 1.2% off the total, or review-first with no advance and no discount. Project checkout uses the private quote link; contributions and product plans are separate.", contact: "/contact" },
    overview: { intro: company.team_intro.slice(0, 1000), body: company.team_body.slice(0, 2000) },
    products: products.slice(0, 10).map(product => ({ name: product.name, status: product.status, description: product.description.slice(0, 1000), intro: product.intro.slice(0, 1000), href: `/${product.slug}` })),
    shipped: releases.slice(0, 10).map(release => ({ name: release.name, version: release.version, type: release.launch_type, description: release.description.slice(0, 800), href: launchHref(release) })),
    team: team.slice(0, 20).map(member => ({ name: member.name, role: member.role })),
    ecosystem: { tools_and_platforms: technologyBrands.filter(brand => !["kitty", "digital-india", "startup-india"].includes(brand.id)).map(brand => brand.name), initiatives: ["Digital India", "Startup India"], relationship: "Tools and platform references describe our workflow. Innovation initiatives are shown for reference. Inclusion does not imply partnership, endorsement, recognition, sponsorship or official affiliation.", href: "/company" },
    development: updates.slice(0, 6).map(update => ({ title: update.title, summary: update.summary.slice(0, 300), date: update.entry_date, status: update.status })),
    pages: publicPages,
  };
  const encoder = new TextEncoder();
  const serialized = JSON.stringify(context);
  // Bound UTF-8 bytes as well as characters; non-English public copy must not
  // push a valid visitor question beyond the upstream request ceiling.
  if (encoder.encode(serialized).length <= 12000) return serialized;
  const concise = JSON.stringify({ ...context, products: context.products.slice(0, 4).map(product => ({ ...product, description: product.description.slice(0, 250), intro: product.intro.slice(0, 250) })), shipped: context.shipped.slice(0, 4).map(release => ({ ...release, description: release.description.slice(0, 250) })), development: context.development.slice(0, 3), overview: { intro: context.overview.intro.slice(0, 300), body: context.overview.body.slice(0, 300) } });
  if (encoder.encode(concise).length <= 12000) return concise;
  const essential = { company: context.company, services: context.services, products: context.products.map(({ name, status, href }) => ({ name, status, href })), shipped: context.shipped.map(({ name, version, href }) => ({ name, version, href })), team: context.team, ecosystem: context.ecosystem, pages: publicPages };
  while (encoder.encode(JSON.stringify(essential)).length > 12000) {
    if (essential.team.length > 1) essential.team.pop();
    else if (essential.shipped.length > 1) essential.shipped.pop();
    else if (essential.products.length > 1) essential.products.pop();
    else break;
  }
  return JSON.stringify(essential);
}

export function websiteAssistantSources(question: string): WebsiteAssistantSource[] {
  const text = question.toLowerCase();
  const selected: WebsiteAssistantSource[] = [];
  if (/website|business|client|build.{0,12}app|project|cost|price|maintain|support|service|develop/.test(text)) selected.push(publicPages[0]);
  if (/kitty.?ai|voice|memory|personal.?ai/.test(text)) selected.push(publicPages[2]);
  if (/product|release|ship|try|download|secret.?chat|lisa|sentinel/.test(text)) selected.push(publicPages[1]);
  if (/founder|team|virat|sarthak|company/.test(text)) selected.push(publicPages[3]);
  if (/progress|log|update|building|research|experiment|robot/.test(text)) selected.push(publicPages[4]);
  if (selected.length === 0) selected.push(publicPages[0], publicPages[1]);
  return selected.slice(0, 3);
}
