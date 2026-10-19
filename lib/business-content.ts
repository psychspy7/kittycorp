export const serviceOffers = [
  { id: "websites", title: "Business Websites", audience: "For local businesses, consultants and teams improving their first impression online.", problem: "Visitors need to understand your offer and know how to enquire.", deliverables: ["Responsive pages with clear content and navigation", "A contact or lead-capture path", "Launch setup and an agreed handover"], separate: "Domains, hosting, paid integrations and ongoing content work are separate unless included in your quote.", service: "Website" },
  { id: "applications", title: "Apps & Custom Software", audience: "For teams that need more than a brochure site.", problem: "Spreadsheets, messages and disconnected tools make an everyday task harder than it should be.", deliverables: ["Scoped web applications, Android apps or internal dashboards", "Agreed accounts, data flows and admin tools", "Testing, release planning and source handover"], separate: "App-store fees, infrastructure, third-party APIs and future features are scoped separately.", service: "Web application" },
  { id: "automation", title: "AI Agents & Automation", audience: "For businesses repeating the same enquiry, support or administration tasks.", problem: "Useful information arrives in one tool, but the next step still depends on manual copying and follow-up.", deliverables: ["One clearly defined workflow with connected tools", "AI assistance where it helps, with human review for sensitive actions", "Failure handling, logs and operating instructions"], separate: "Model usage, n8n or other hosting, CRM plans and paid APIs are confirmed before development.", service: "AI agents & automation" },
] as const;

export const serviceSegments = {
  "coaching-centres": {
    title: "Websites & automation for coaching centres",
    description: "Course pages, admission enquiries and organised follow-ups for coaching centres and education businesses.",
    eyebrow: "FOR COACHING & EDUCATION BUSINESSES",
    heading: "Make the next admission enquiry easier.",
    intro: "Help students and parents find the right course, understand how to apply and reach your team. We build the website and enquiry workflow around how your centre operates.",
    outcomes: ["Course and batch information that is easy to find on a phone", "An enquiry form that collects the details your team needs", "A shared dashboard or spreadsheet for follow-up, if included"],
    workflow: ["A parent opens a course page and sends an enquiry.", "The request reaches the agreed inbox or CRM with the course context.", "Your admissions team reviews it and follows up. Automated acknowledgements can be added with consent."],
    boundary: "This is an example workflow, not a completed client case study. Student records, payment collection, bulk messaging and learning platforms require a separate scope and appropriate access controls.",
    service: "Website",
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
    service: "AI agents & automation",
  },
} as const;
export type ServiceSegment = keyof typeof serviceSegments;
