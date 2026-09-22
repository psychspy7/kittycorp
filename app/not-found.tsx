import { SiteHeader, SiteFooter } from "@/components/kitty/site";
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="not-found">
        <span className="micro-label">404 / UNCHARTED TERRITORY</span>
        <h1>
          This idea hasn’t
          <br />
          taken shape yet.
        </h1>
        <p>The page you’re looking for isn’t here.</p>
        <a className="button button-gold" href="/">
          Back to the beginning ↗
        </a>
      </main>
      <SiteFooter />
    </>
  );
}
