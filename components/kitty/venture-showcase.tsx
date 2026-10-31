"use client";

import React from "react";

function BuddySketch() {
  return (
    <svg viewBox="0 0 560 330" role="img" aria-label="Simple line illustration of a compact personal AI companion" className="venture-sketch">
      <defs><linearGradient id="buddyGlow" x1="0" x2="1"><stop offset="0" stopColor="#d7c49a" stopOpacity=".2"/><stop offset="1" stopColor="#8ca4d8" stopOpacity=".08"/></linearGradient></defs>
      <ellipse cx="280" cy="286" rx="142" ry="16" fill="#000" opacity=".35"/>
      <g stroke="#d8d0bd" strokeWidth="2" fill="url(#buddyGlow)">
        <rect x="202" y="64" width="156" height="190" rx="35"/>
        <rect x="218" y="81" width="124" height="154" rx="25" fill="#101827"/>
        <path d="M280 254v20m-32 0h64" fill="none" strokeLinecap="round"/>
        <path d="M201 115h-18v86h18M359 115h18v86h-18" fill="none" stroke="#aab8d0"/>
      </g>
      <g fill="#e6d5aa"><circle cx="256" cy="151" r="5"/><circle cx="304" cy="151" r="5"/></g>
      <path d="M263 177q17 13 34 0" fill="none" stroke="#e6d5aa" strokeWidth="3" strokeLinecap="round"/>
      <path d="M168 95l-25-16m249 16 25-16M164 226l-27 15m259-15 27 15" stroke="#8296b8" strokeWidth="1.5" opacity=".65"/>
      <g fill="#9aa9c1" fontSize="10" letterSpacing="2"><text x="36" y="66">KITTY CORE</text><text x="390" y="267">POCKET / DESK</text></g>
      <path d="M112 73h67l18 19M388 257h-42l-14-14" fill="none" stroke="#8296b8" strokeWidth="1" opacity=".65"/>
    </svg>
  );
}

function AgriyaanSketch() {
  return (
    <svg viewBox="0 0 560 330" role="img" aria-label="Simple line illustration of an agricultural rover moving between crop rows" className="venture-sketch">
      <path d="M0 260h560" stroke="#a9b995" strokeOpacity=".35"/>
      <g fill="none" stroke="#8fa88b" strokeWidth="2" opacity=".8">
        <path d="M38 255q16-36 31-72m-31 72q-17-27-24-49m24 49q22-28 37-42M520 255q-16-36-31-72m31 72q17-27 24-49m-24 49q-22-28-37-42"/>
        <path d="M112 260q15-44 26-92m-26 92q-18-30-28-52m28 52q24-29 42-45M448 260q-15-44-26-92m26 92q18-30 28-52m-28 52q-24-29-42-45"/>
      </g>
      <ellipse cx="280" cy="269" rx="155" ry="14" fill="#000" opacity=".28"/>
      <g stroke="#d6d0c0" strokeWidth="2" fill="#18251f">
        <rect x="192" y="145" width="176" height="83" rx="16"/>
        <rect x="219" y="115" width="122" height="36" rx="8" fill="#202d28"/>
        <path d="M242 115V88h76v27" fill="none"/>
        <circle cx="216" cy="235" r="27" fill="#0c1111"/><circle cx="344" cy="235" r="27" fill="#0c1111"/>
        <circle cx="216" cy="235" r="10" fill="#9eaa9a"/><circle cx="344" cy="235" r="10" fill="#9eaa9a"/>
        <path d="M280 145V99m-13 14 13-14 13 14" fill="none" stroke="#c6b98e" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <g fill="#b6c6a6" fontSize="10" letterSpacing="2"><text x="35" y="57">AGRIYAAN</text><text x="394" y="70">FIELD ROVER</text></g>
      <path d="M35 65h94l52 52m340-40h-76l-49 44" stroke="#8fa88b" strokeWidth="1" fill="none" opacity=".7"/>
    </svg>
  );
}

export function VentureShowcase() {
  return (
    <section className="venture-section" aria-labelledby="venture-heading">
      <div className="venture-wrap">
        <div className="venture-topline"><span>01 / PRODUCT DEVELOPMENT</span><span>WORK IN PROGRESS</span></div>
        <div className="venture-heading">
          <div><p className="venture-kicker">BEYOND CLIENT PROJECTS</p><h2 id="venture-heading">Products we’re<br/><em>working on.</em></h2></div>
          <p>Alongside our client work, we are developing our own technology. These projects are at an early stage, and we’ll share more as they take shape.</p>
        </div>
        <div className="venture-grid">
          <article className="venture-card">
            <div className="venture-visual venture-visual-buddy"><span className="venture-visual-label">CONCEPT VISUAL / 01</span><BuddySketch/></div>
            <div className="venture-card-body">
              <div className="venture-meta"><span>PERSONAL AI DEVICE</span><span>IN DEVELOPMENT</span></div>
              <h3>KITTY BUDDY</h3>
              <p>A compact personal AI companion designed to be carried, worn or placed on a desk. An optional detachable wheeled base is part of the concept.</p>
              <a href="/contact?subject=KITTY%20BUDDY">Discuss the project <span aria-hidden="true">↗</span></a>
            </div>
          </article>
          <article className="venture-card">
            <div className="venture-visual venture-visual-agriyaan"><span className="venture-visual-label">CONCEPT VISUAL / 02</span><AgriyaanSketch/></div>
            <div className="venture-card-body">
              <div className="venture-meta"><span>AGRICULTURAL ROBOTICS</span><span>EARLY CONCEPT</span></div>
              <h3>AGRIYAAN</h3>
              <p>An agricultural AI rover being explored with farmers in mind. We plan to present the project to the Government of India for consideration and support.</p>
              <a href="/contact?subject=AGRIYAAN">Discuss the project <span aria-hidden="true">↗</span></a>
            </div>
          </article>
        </div>
        <p className="venture-footnote">The illustrations are simple concept visualisations, not photographs or final engineering designs.</p>
      </div>
    </section>
  );
}
