import Link from "next/link";
import { ArrowUpRight, Sprout, Radio, MoveUpRight } from "lucide-react";
import "./intelligence-showcase.css";

function BuddyVisual() {
  return <svg className="intelligence-art buddy-art" viewBox="0 0 520 330" role="img" aria-label="Simple product illustration of a compact personal AI companion with a small display and folding stand">
    <defs><linearGradient id="buddy-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d9dce0"/><stop offset=".48" stopColor="#777e89"/><stop offset="1" stopColor="#303641"/></linearGradient><linearGradient id="buddy-screen" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#28394b"/><stop offset="1" stopColor="#101923"/></linearGradient></defs>
    <ellipse cx="260" cy="286" rx="145" ry="15" fill="#000" opacity=".28"/>
    <path d="M195 222 L174 277 Q171 287 183 290 L338 290 Q351 287 346 276 L324 222" fill="#252c35" stroke="#7f8791" strokeWidth="2"/>
    <rect x="164" y="36" width="192" height="224" rx="38" fill="url(#buddy-metal)" stroke="#c8cdd4" strokeWidth="2"/>
    <rect x="178" y="50" width="164" height="194" rx="29" fill="#10151d" stroke="#89919b" strokeWidth="1.5"/>
    <rect x="191" y="66" width="138" height="140" rx="19" fill="url(#buddy-screen)"/>
    <circle cx="260" cy="129" r="28" fill="#d9c49c" opacity=".95"/>
    <circle cx="249" cy="124" r="3.5" fill="#18212c"/><circle cx="271" cy="124" r="3.5" fill="#18212c"/>
    <path d="M250 139 Q260 148 270 139" fill="none" stroke="#18212c" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M235 181 H285" stroke="#a9b9c9" opacity=".6" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="260" cy="225" r="4" fill="#b7c0cb"/>
    <path d="M164 103 H146 Q132 103 132 117 V180 Q132 194 146 194 H164" fill="none" stroke="#c3c8cf" strokeWidth="5" strokeLinecap="round"/>
    <path d="M356 105 H373 Q387 105 387 119 V180 Q387 194 373 194 H356" fill="none" stroke="#c3c8cf" strokeWidth="5" strokeLinecap="round"/>
    <path d="M260 25 V10 M251 17 L260 8 L269 17" stroke="#d9c49c" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="260" y="316" textAnchor="middle" fill="#8794a5" fontSize="10" letterSpacing="3">KITTY CORE / CONCEPT</text>
  </svg>;
}
function AgriyaanVisual() {
  return <svg className="intelligence-art agriyaan-art" viewBox="0 0 520 330" role="img" aria-label="Simple line illustration of an agricultural rover moving between crop rows">
    <defs><linearGradient id="field-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#293c37"/><stop offset="1" stopColor="#111b1a"/></linearGradient></defs>
    <rect x="25" y="18" width="470" height="276" rx="18" fill="url(#field-sky)" stroke="#66796a" strokeOpacity=".45"/>
    <path d="M45 220 Q150 175 260 220 T475 220 V277 H45Z" fill="#314a38" opacity=".8"/>
    <path d="M45 260 Q155 206 260 260 T475 260" fill="none" stroke="#77946a" strokeWidth="2" opacity=".8"/>
    <path d="M75 275 Q150 215 225 275 M295 275 Q370 215 445 275" fill="none" stroke="#9ab47b" strokeWidth="2" opacity=".65"/>
    <g stroke="#9bb17c" strokeWidth="4" strokeLinecap="round" fill="none">
      <path d="M82 213 V149 M82 179 Q57 160 49 143 M82 190 Q105 168 117 151"/>
      <path d="M130 206 V128 M130 164 Q110 142 101 124 M130 178 Q151 151 166 136"/>
      <path d="M390 207 V130 M390 163 Q369 140 360 121 M390 180 Q411 152 426 137"/>
      <path d="M438 216 V151 M438 180 Q417 160 408 143 M438 191 Q458 170 470 154"/>
    </g>
    <g transform="translate(175 105)">
      <rect x="20" y="55" width="150" height="65" rx="12" fill="#b4b9aa" stroke="#e0e2d9" strokeWidth="2"/>
      <rect x="38" y="35" width="112" height="28" rx="8" fill="#6c7e70" stroke="#aab9a9" strokeWidth="2"/>
      <rect x="83" y="10" width="35" height="28" rx="5" fill="#1b2c2a" stroke="#a8c3ad" strokeWidth="2"/>
      <circle cx="96" cy="22" r="6" fill="#b7d4bf"/>
      <path d="M101 10 V-2 M94 2 L101 -5 L108 2" stroke="#b7d4bf" strokeWidth="2" fill="none"/>
      <circle cx="49" cy="122" r="22" fill="#151b1c" stroke="#9ba79e" strokeWidth="4"/>
      <circle cx="144" cy="122" r="22" fill="#151b1c" stroke="#9ba79e" strokeWidth="4"/>
      <circle cx="49" cy="122" r="7" fill="#8b9a8d"/><circle cx="144" cy="122" r="7" fill="#8b9a8d"/>
      <path d="M20 84 H4 M170 84 H186" stroke="#c5d3bd" strokeWidth="3" strokeLinecap="round"/>
    </g>
    <text x="260" y="316" textAnchor="middle" fill="#9aaa91" fontSize="10" letterSpacing="3">AGRIYAAN / CONCEPT</text>
  </svg>;
}

export function IntelligenceShowcase() {
  return <section className="intelligence-showcase wrap" aria-labelledby="intelligence-title">
    <div className="intelligence-heading">
      <div><span className="eyebrow">KITTY CORP / INTELLIGENCE & ROBOTICS</span><h2 id="intelligence-title">Building beyond the screen.</h2></div>
      <p>Alongside our digital products, we are exploring physical AI systems for personal use and practical work in the field.</p>
    </div>
    <div className="intelligence-grid">
      <article className="intelligence-card buddy-card">
        <div className="intelligence-visual"><BuddyVisual/><span className="visual-note">01 / PRODUCT CONCEPT</span></div>
        <div className="intelligence-copy"><div className="intelligence-meta"><span>PERSONAL AI</span><span>IN DEVELOPMENT</span></div><h3>KITTY BUDDY</h3><p>A compact AI companion designed to be carried, worn or placed on a desk. A separate detachable wheel base is being explored to add movement when needed.</p><Link href="/projects" className="text-link">Discuss the project <ArrowUpRight size={15}/></Link></div>
      </article>
      <article className="intelligence-card agriyaan-card">
        <div className="intelligence-visual"><AgriyaanVisual/><span className="visual-note">02 / RESEARCH CONCEPT</span></div>
        <div className="intelligence-copy"><div className="intelligence-meta"><span>AGRICULTURAL ROBOTICS</span><span>CONCEPT STAGE</span></div><h3>AGRIYAAN</h3><p>An agricultural AI rover being developed around the needs of farmers. We plan to present the concept to the Government of India and explore a path towards field testing.</p><Link href="/projects" className="text-link">Discuss the project <ArrowUpRight size={15}/></Link></div>
      </article>
    </div>
    <div className="intelligence-foot"><span><Radio size={15}/> CONCEPTS SHOWN FOR VISUALISATION. PHYSICAL PROTOTYPES AND FIELD VALIDATION ARE PENDING.</span><Link href="/research">Explore our research <MoveUpRight size={15}/></Link></div>
  </section>;
}
