import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function IntelligenceRobotics() {
  return <section className="intelligence-robotics wrap" aria-labelledby="intelligence-heading">
    <div className="section-heading">
      <div><span className="eyebrow">KITTY CORP / INTELLIGENCE & ROBOTICS</span><h2 id="intelligence-heading">Projects we are working on.</h2></div>
      <p>Alongside our digital work, we are exploring products that bring AI into everyday life and practical field settings.</p>
    </div>
    <div className="ir-grid">
      <article className="ir-card">
        <div className="ir-visual"><Image src="/projects/kitty-buddy-concept.svg" alt="Simple concept illustration of the KITTY BUDDY device" width={900} height={620} /></div>
        <div className="ir-copy">
          <div className="ir-meta"><span>01 / PERSONAL AI</span><span className="ir-status">CONCEPT · EARLY ENGINEERING</span></div>
          <h3>KITTY BUDDY</h3>
          <p>A small personal AI companion designed to be carried, worn or kept on a desk. The planned product has a main device and an optional detachable wheeled base.</p>
          <Link className="text-link" href="/contact?subject=KITTY%20BUDDY">Discuss the project <ArrowUpRight size={15}/></Link>
        </div>
      </article>
      <article className="ir-card">
        <div className="ir-visual"><Image src="/projects/agriyaan-rover-concept.svg" alt="Simple concept illustration of an agricultural rover between crop rows" width={900} height={620} /></div>
        <div className="ir-copy">
          <div className="ir-meta"><span>02 / AGRICULTURE</span><span className="ir-status">IN DEVELOPMENT</span></div>
          <h3>AGRIYAAN</h3>
          <p>An agricultural AI rover we are exploring to support farmers with field-related tasks and information. We plan to present the project to the Government of India for consideration and support.</p>
          <Link className="text-link" href="/contact?subject=AGRIYAAN">Discuss the project <ArrowUpRight size={15}/></Link>
        </div>
      </article>
    </div>
    <p className="ir-note">Both visuals are illustrative concept sketches, not photographs or final engineering designs.</p>
  </section>;
}
