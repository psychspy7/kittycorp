import { productPages } from "./products";

export const MEDIA_BUCKET = "kitty-website-media";
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
export type MediaKind = "icons" | "portraits" | "screenshots";
export const mediaPathPattern = /^(icons|portraits|screenshots)\/[0-9a-f-]{36}\.webp$/;
export const mediaHref = (path: string) => `/api/media/${path}`;
export const socialLabels = { github: "GitHub", linkedin: "LinkedIn", x: "X", instagram: "Instagram", youtube: "YouTube", website: "Website" } as const;
export type SocialLinks = Partial<Record<keyof typeof socialLabels, string>>;
export const teamRoles = ["Founder & CEO", "Co-Founder & CTO (Chief Technology Officer)", "Co-Founder & CMO (Chief Marketing Officer)", "Co-Founder & CFO (Chief Financial Officer)", "Co-Founder", "Chief Operating Officer (COO)", "Head of AI & Product", "Head of Engineering", "Head of Design", "Head of Marketing & Growth", "Head of Business Development", "Finance & Operations Manager", "HR & Recruitment Manager", "Software Engineer", "AI/ML Engineer", "UI/UX Designer", "Cybersecurity Engineer", "Marketing & Social Media Executive", "Business Development Executive", "Content Creator", "Intern / Trainee"] as const;
export type CompanyProduct = {
  slug: string; name: string; label: string; status: string; description: string; intro: string;
  category: string; media: string; principles: [string, string][]; icon_path: string | null;
  sort_order: number; published: boolean; updated_at?: string;
};
export type TeamMember = {
  id: string; name: string; role: string; bio: string; photo_path: string | null;
  links: SocialLinks; sort_order: number; published: boolean; updated_at?: string;
};
// The homepage introduction focuses on the founder; the full roster lives on /team.
export function homepageFounders(members: TeamMember[]) {
  const person = members.find(member => {
    const role = member.role.trim().toLowerCase();
    return member.published && (role === "founder & ceo" || (role.startsWith("founder & ceo") && [" ", ",", "|", "·", "—", "–", "("].includes(role.charAt("founder & ceo".length))));
  });
  return person ? [person] : [];
}
export type CompanySettings = { id: string; socials: SocialLinks; team_heading: string; team_intro: string; team_body: string; updated_at?: string };
export const defaultProducts: CompanyProduct[] = Object.entries(productPages).map(([slug, value], index) => ({...value, slug, principles: value.principles.map(([a,b]) => [a,b]), icon_path: null, sort_order: index, published: true}));
export const defaultTeam: TeamMember[] = [
  {id:"virat",name:"Virat Anand",role:"Founder & CEO",bio:"",photo_path:null,links:{},sort_order:0,published:true},
  {id:"aman",name:"Aman",role:"Co-Founder & CTO (Chief Technology Officer)",bio:"",photo_path:null,links:{},sort_order:1,published:true},
  {id:"prashant",name:"Prashant",role:"Co-Founder & CMO (Chief Marketing Officer)",bio:"",photo_path:null,links:{},sort_order:2,published:true},
  {id:"sarthak",name:"Sarthak",role:"Co-Founder & CFO (Chief Financial Officer)",bio:"",photo_path:null,links:{},sort_order:3,published:true},
];
export const defaultSettings: CompanySettings = {id:"company",socials:{github:"https://github.com/psychspy7"},team_heading:"A small team.\nPlenty to figure out.",team_intro:"We’re a small team interested in AI, robotics, cybersecurity and building things from scratch.",team_body:"KITTY CORP started from experiments, prototypes and a lot of curiosity. We’re still early, and we’re building the company alongside the technology."};
