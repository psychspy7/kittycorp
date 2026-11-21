import type { Metadata } from "next";

export const revalidate = 86400;
export const metadata: Metadata = {
  title: "Site in maintenance • KITTY CORP",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#050709] text-[#eaf7fa] flex flex-col items-center justify-center p-6 text-center font-sans">
      <main id="main" className="max-w-[650px] w-full flex flex-col items-center">
        <div className="text-[#83939c] text-[11px] tracking-[0.3em] uppercase mb-4">
          KITTY CORP
        </div>

        <h1 className="text-[clamp(32px,7vw,56px)] font-medium tracking-tight mb-4 text-[#eaf7fa]">
          Site in <span className="text-[#8bf0ea]">maintenance.</span>
        </h1>

        <p className="text-[#9aabb4] text-base leading-relaxed max-w-[420px] mb-8">
          A little repair work is underway.
          <br />
          We will be back as soon as everything is ready.
        </p>

        <div className="inline-flex items-center gap-2 border border-[#233339] rounded-full px-4 py-2 text-[11px] tracking-widest text-[#adc6cd] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#91f0df] shadow-[0_0_8px_#91f0df]" />
          Work in progress
        </div>

        <p className="mt-10 text-[#53656f] text-xs">
          Thanks for giving us a moment.
        </p>
      </main>
    </div>
  );
}
