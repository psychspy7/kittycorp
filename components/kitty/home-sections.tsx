"use client";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  Box,
  Check,
  Copy,
  FlaskConical,
  Heart,
  LockKeyhole,
  MessageSquare,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Reveal } from "./motion";
import { FilmButton } from "./site";
import { wallets, type Notice } from "@/lib/kitty-types";

const visions = [
  {
    icon: Sparkles,
    title: "AI without the ceiling.",
    text: "Uncensored AI. More room to think, explore, and make it your own.",
    category: "INTELLIGENCE",
  },
  {
    icon: LockKeyhole,
    title: "A room of your own.",
    text: "Private, secure chat rooms built around a simple idea: your conversations belong to you.",
    category: "CONNECTION",
  },
  {
    icon: FlaskConical,
    title: "Permission to experiment.",
    text: "Useful little tools. Unusual solutions. Ideas that deserve to leave the notebook.",
    category: "EXPERIMENTS",
  },
  {
    icon: SlidersHorizontal,
    title: "Systems that make sense.",
    text: "Intelligent systems that work with people and make complicated things feel simpler.",
    category: "SYSTEMS",
  },
  {
    icon: Box,
    title: "Make it yours.",
    text: "Customizable digital and physical products, shaped around the person using them.",
    category: "PERSONALIZATION",
  },
  {
    icon: ArrowUpRight,
    title: "Leave the door open.",
    text: "Kitty Corp is bigger than one product. There’s room here for the next unexpected idea.",
    category: "WHATEVER COMES NEXT",
  },
];
export function StorySection() {
  return (
    <section id="story" className="section story-section">
      <div className="section-kicker">
        <span>01 / THE BEGINNING</span>
        <span className="kicker-line" />
      </div>
      <div className="story-grid">
        <Reveal>
          <h2>
            One person.
            <br />A thousand
            <br />
            <em>“what ifs.”</em>
          </h2>
          <div className="story-signature">
            <span className="tiny-star">✳</span> SMALL BY DESIGN. BIG ON
            POSSIBILITY.
          </div>
        </Reveal>
        <Reveal className="story-copy">
          <p className="lead">
            I’m at the beginning.
            <br />
            And I’m not pretending otherwise.
          </p>
          <p>
            Right now, it’s just me. I’m building, testing, breaking, fixing,
            and following the ideas I can’t stop thinking about.
          </p>
          <p>
            Kitty Corp is my place to turn those ideas into something real.
            Some will become products. Others will show me what to try next. It
            all starts with doing the work.
          </p>
          <p className="story-ending">
            Not a finished story. The start of one.
          </p>
          <div className="story-facts">
            <div>
              <strong>01</strong>
              <span>Independent founder</span>
            </div>
            <div>
              <strong>∞</strong>
              <span>Reasons to keep going</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
export function VisionSection() {
  return (
    <section id="vision" className="section vision-section">
      <div className="section-kicker">
        <span>02 / THE HORIZON</span>
        <span className="kicker-line" />
      </div>
      <Reveal className="section-heading">
        <h2>
          One home.
          <br />
          <em>Many possibilities.</em>
        </h2>
        <p>
          These are the directions I’m exploring.
          <br />A little ambitious. Deliberately open-ended.
        </p>
      </Reveal>
      <div className="vision-grid">
        {visions.map((v, i) => (
          <Reveal className="vision-card" key={v.title}>
            <div className="vision-card-top">
              <v.icon size={24} strokeWidth={1.2} />
              <span>0{i + 1}</span>
            </div>
            <span className="micro-label">{v.category}</span>
            <h3>{v.title}</h3>
            <p>{v.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
export function FlagshipSection() {
  return (
    <section id="kitty-ai" className="section flagship-section">
      <div className="section-kicker">
        <span>03 / MY FLAGSHIP</span>
        <span className="kicker-line" />
      </div>
      <div className="flagship-panel">
        <Reveal className="flagship-copy">
          <span className="status-pill">
            <span /> CONCEPT IN DEVELOPMENT
          </span>
          <h2>
            KITTY <em>AI.</em>
          </h2>
          <p className="flagship-tagline">
            Intelligence.
            <br />
            With a life beyond the screen.
          </p>
          <p>
            My vision for fully uncensored, physical AI. Something you can work
            with, shape, and customize around yourself.
          </p>
          <p>
            Personal by nature. Adaptable by design. I’m working toward
            something that feels truly yours.
          </p>
          <div className="product-traits">
            <span>Personal</span>
            <span>Adaptable</span>
            <span>Physical</span>
          </div>
          <a href="/contact?subject=Kitty%20AI" className="text-link">
            Be part of the conversation <ArrowUpRight size={17} />
          </a>
        </Reveal>
        <div className="flagship-art">
          <img
            src="/brand/silver-mark.png"
            alt="Kitty Corp’s silver cat monogram"
            width="1254"
            height="1254"
            loading="lazy"
          />
          <span className="concept-caption">
            THE VISION IS TAKING SHAPE.
            <br />
            PRODUCT DETAILS WILL FOLLOW.
          </span>
        </div>
      </div>
      <div className="film-strip">
        <div>
          <span className="micro-label">THE IDENTITY BEHIND THE IDEAS</span>
          <p>Every story starts with a mark.</p>
        </div>
        <img
          src="/brand/wordmark.png"
          width="2048"
          height="768"
          alt="Kitty Corp"
          loading="lazy"
        />
        <FilmButton />
      </div>
    </section>
  );
}
export function UpdatesSection() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<Notice | null>(null);
  const refresh = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const res = await fetch("/api/notices");
      if (!res.ok) throw Error();
      setNotices(((await res.json()) as { notices: Notice[] }).notices);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return (
    <section id="updates" className="section updates-section">
      <div className="section-kicker">
        <span>04 / NOTES FROM THE STUDIO</span>
        <span className="kicker-line" />
      </div>
      <Reveal className="section-heading">
        <h2>
          A little closer.
          <br />
          <em>One update at a time.</em>
        </h2>
        <p>
          What I’m working on, what I’m learning,
          <br />
          and the occasional small win.
        </p>
      </Reveal>
      <div className="updates-list" aria-live="polite">
        {loading ? (
          <p className="empty-message">Opening the studio notebook…</p>
        ) : failed ? (
          <div className="empty-message">
            The notebook couldn’t load.{" "}
            <button className="text-link" onClick={() => void refresh()}>
              Try again
            </button>
          </div>
        ) : notices.length === 0 ? (
          <p className="empty-message">
            Heads down, building. My first studio note is on its way.
          </p>
        ) : (
          notices.map((notice, i) => (
            <button
              className="update-row"
              key={notice.id}
              onClick={() => setSelected(notice)}
            >
              <span className="update-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="update-info">
                <span className="micro-label">{notice.category}</span>
                <h3>{notice.title}</h3>
              </span>
              <time dateTime={notice.published_at ?? notice.created_at}>
                {new Date(
                  notice.published_at ?? notice.created_at,
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </time>
              <ArrowUpRight size={23} />
            </button>
          ))
        )}
      </div>
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="notice-dialog">
          <span className="micro-label">{selected?.category}</span>
          <DialogTitle>{selected?.title}</DialogTitle>
          <DialogDescription asChild>
            <div className="notice-body">{selected?.body}</div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </section>
  );
}
export function SupportSection() {
  const [copied, setCopied] = useState("");
  const copy = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(address);
      toast.success("Wallet address copied");
      setTimeout(() => setCopied(""), 2000);
    } catch {
      toast.error("Couldn’t copy. Select and copy the address below.");
    }
  };
  return (
    <section id="support" className="section support-section">
      <div className="section-kicker">
        <span>05 / KEEP THE IDEAS MOVING</span>
        <span className="kicker-line" />
      </div>
      <Reveal className="support-intro">
        <Heart size={25} strokeWidth={1.3} />
        <h2>
          Back the person
          <br />
          <em>behind the possibilities.</em>
        </h2>
        <p>
          Independent building takes time, late nights, and a little belief.
          <br />
          If you like where I’m headed, you can help me keep going.
        </p>
      </Reveal>
      <div className="wallet-grid">
        {wallets.map((wallet) => (
          <Reveal className="wallet-card" key={wallet.symbol}>
            <div className="wallet-heading">
              <span className={`coin-icon ${wallet.symbol.toLowerCase()}`}>
                {wallet.symbol === "BTC" ? "₿" : "₮"}
              </span>
              <div>
                <h3>
                  {wallet.name} <span>{wallet.symbol}</span>
                </h3>
                <span className="micro-label">NETWORK: {wallet.network}</span>
              </div>
              <img
                className="wallet-qr"
                src={wallet.qr}
                alt={`${wallet.name} wallet address QR code`}
                width="80"
                height="80"
                loading="lazy"
              />
            </div>
            <div className="wallet-address">
              <code>{wallet.address}</code>
              <button
                aria-label={`Copy ${wallet.name} address`}
                onClick={() => void copy(wallet.address)}
              >
                {copied === wallet.address ? (
                  <Check size={17} />
                ) : (
                  <Copy size={17} />
                )}
              </button>
            </div>
            <p className="wallet-network-note">
              Send {wallet.symbol} on the{" "}
              {wallet.network === "ETHEREUM" ? "Ethereum (ERC-20)" : "Bitcoin"}{" "}
              network only.
            </p>
          </Reveal>
        ))}
      </div>
      <p className="support-note">
        Support is optional, but it helps me keep building.
      </p>
    </section>
  );
}
export function ContactBanner() {
  return (
    <section className="contact-banner">
      <div>
        <span className="micro-label">
          GOOD THINGS START WITH A CONVERSATION.
        </span>
        <h2>
          Got a <em>“what if”?</em>
        </h2>
      </div>
      <a
        className="contact-circle"
        href="/contact"
        aria-label="Contact Kitty Corp"
      >
        <ArrowUpRight size={42} strokeWidth={1} />
      </a>
    </section>
  );
}
