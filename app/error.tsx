"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main id="main" className="public-page wrap"><div className="page-heading"><span className="eyebrow">KITTY CORP</span><h1>This page couldn’t load.</h1><p>Please try again in a moment. If you’re having trouble with a payment, check your account before trying to pay again.</p><div className="hero-actions"><button className="button button-gold" onClick={reset}>Try again</button><Link href="/" className="button button-outline">Return home</Link><a className="text-link" href="mailto:kittycorp.info@gmail.com">Contact KITTY CORP</a></div></div></main>;
}
