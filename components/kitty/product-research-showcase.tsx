import Link from "next/link";
import { ArrowUpRight, Bot, Sprout } from "lucide-react";

function ProductSketch() {
  return <svg className="product-sketch" viewBox="0 0 560 330" role="img" aria-labelledby="sketch-title sketch-desc">
    <title id="sketch-title">Simple concept illustration of an agricultural rover</title>
    <desc id="sketch-desc">A small wheeled field rover moving between crop rows.</desc>
    <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 278H536" opacity=".25"/><path d="M52 278c35-58 66-89 102-112M508 278c-35-58-66-89-102-112" opacity=".35"/>
      <path d="M92 278c20-37 42-56 66-71M468 278c-20-37-42-56-66-71" opacity=".35"/>
      <path d="M170 205h220l-20 43H190z" fill="currentColor" fillOpacity=".06"/>
      <path d="M205 205v-40h150v40M230 165v-26h100v26" />
      <rect x="242" y="92" width="76" height="47" rx="8" fill="currentColor" fillOpacity=".07"/>
      <circle cx="280" cy="115" r="10"/><path d="M280 92V77m-10 0h20"/>
      <path d="M190 248h180"/><circle cx="215" cy="258" r="24" fill="currentColor" fillOpacity=".08"/><circle cx="345" cy="258" r="24" fill="currentColor" fillOpacity=".08"/>
      <circle cx="215" cy="258" r="8"/><circle cx="345" cy="258" r="8"/>
      <path d="M140 278v-22m0 0-12-16m12 16 12-16M420 278v-22m0 0-12-16m12 16 12-16" opacity=".55"/>
      <path d="M70 278v-34m0 0-15-17m15 17 15-17M490 278v-34m0 0-15-17m15 17 15-17" opacity=".55"/>
    </g>
    <g fill="currentColor" opacity=".5"><circle cx="280" cy="115" r="3"/><circle cx="215" cy="258" r="3"/><circle cx="345" cy="258" r="3"/></g>
  </svg>;
}

export function ProductResearchShowcase() {
  return <section className="product-research wrap" aria-labelledby="product-research-title">
    <div className="section-heading product-research-heading">
      <div><span className="eyebrow">HARDWARE &amp; FIELD RESEARCH</span><h2 id="product-research-title">Two ideas we’re working on.</h2></div>
      <p>Alongside our software products, we are exploring practical AI devices for everyday use and agriculture.</p>
    </div>
    <div className="product-research-grid">
      <article className="research-product-card buddy-card">
        <div className="research-card-top"><span className="research-icon"><Bot size={21}/></span><span className="quiet-status">CONCEPT · EARLY ENGINEERING</span></div>
        <h3>KITTY BUDDY</h3>
        <p className="research-product-lead">A personal AI companion you can carry, wear or keep on your desk.</p>
        <p>The concept has a compact core device for voice and screen interaction, with an optional detachable wheeled base for movement. A working physical prototype is a next development step.</p>
        <Link className="text-link" href="/contact?subject=KITTY%20BUDDY">Discuss KITTY BUDDY <ArrowUpRight size={15}/></Link>
        <div className="buddy-outline" aria-hidden="true"><div className="buddy-device"><span/><i/><b/></div><div className="buddy-caption">KITTY CORE / CONCEPT</div></div>
      </article>
      <article className="research-product-card agriyaan-card">
        <div className="research-card-top"><span className="research-icon"><Sprout size={21}/></span><span className="quiet-status">RESEARCH · CONCEPT STAGE</span></div>
        <h3>AGRIYAAN</h3>
        <p className="research-product-lead">An agricultural AI rover being explored with farmers’ field needs in mind.</p>
        <p>We are developing the concept around a mobile rover that could support farmers with field-level tasks and information. We plan to present the idea to the Government of India for consideration and support.</p>
        <Link className="text-link" href="/contact?subject=AGRIYAAN">Discuss AGRIYAAN <ArrowUpRight size={15}/></Link>
        <div className="agriyaan-visual"><ProductSketch/><span>CONCEPT VISUAL / NOT A PROTOTYPE</span></div>
      </article>
    </div>
  </section>;
}
