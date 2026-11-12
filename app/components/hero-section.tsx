"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const PixelPhoneCanvas = dynamic(() => import("./pixel-phone-canvas"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="flex h-full w-full items-center justify-center"
    >
      <div className="h-[52dvh] max-h-[430px] aspect-[194/418] -translate-y-[4%] -rotate-[16deg] rounded-[2.2rem] border border-[#008c45]/20 bg-gradient-to-br from-[#f7faee] via-[#dffbc0]/60 to-[#008c45]/25 shadow-[0_30px_70px_-20px_rgba(0,140,69,0.35)] animate-pulse" />
    </div>
  ),
});

export function HeroSection() {
  const [downloadOpen, setDownloadOpen] = useState(false);

  useEffect(() => {
    if (!downloadOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDownloadOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [downloadOpen]);

  return (
    <section
      aria-label="Kupass hero"
      className="relative flex h-dvh min-h-[600px] w-full flex-col items-center justify-between overflow-hidden bg-white px-4 pt-[clamp(1.25rem,3.5dvh,2.75rem)] pb-[clamp(1.25rem,3.5dvh,2.5rem)] sm:px-6"
    >
      {/* Bottom security-green & electric-lime luminous dome (#008c45 + #afec2c + #dffbc0) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 60% at 50% 106%, #004d25 0%, #006b34 11%, #008c45 23%, #26a73e 34%, #5dc736 44%, #8ce030 53%, #afec2c 61%, #cbf57a 70%, #dffbc0 79%, rgba(223, 251, 192, 0.45) 87%, rgba(255, 255, 255, 0) 96%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 left-1/2 h-[38%] w-[115%] -translate-x-1/2 rounded-[100%] opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, #004d25 0%, rgba(0, 140, 69, 0.72) 55%, rgba(0, 140, 69, 0) 100%)",
        }}
      />
      {/* Subtle tactile film-grain noise texture (zero runtime cost, softens gradient banding) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.30] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "160px 160px",
        }}
      />

      <div className="relative z-10 flex w-full max-w-7xl flex-col items-center">
        <h1 className="w-full text-center font-bold tracking-[-0.045em] leading-[0.9] text-[#008c45] select-none whitespace-nowrap text-[clamp(3.35rem,15vw,12.5rem)]">
          Stay secure
        </h1>
      </div>

      {/* Full-hero 3D canvas layer so float/orbit never clips at container bounds */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="pointer-events-auto h-full w-full">
          <PixelPhoneCanvas />
        </div>
      </div>

      {/* Bottom CTA & 2-line trust copy */}
      <div className="relative z-30 mt-auto flex w-full max-w-lg flex-col items-center text-center">
        <button
          type="button"
          onClick={() => setDownloadOpen(true)}
          className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-[#004d25] shadow-[0_14px_38px_-10px_rgba(0,77,37,0.42)] transition duration-200 hover:scale-[1.025] hover:bg-[#dffbc0] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#afec2c]/70 sm:px-9 sm:py-4 sm:text-lg"
        >
          {/* Cupertino Icons: arrow_down_to_line */}
          <svg
            className="h-5 w-5 shrink-0 text-[#008c45]"
            viewBox="0 0 56 56"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M 12.1797 44.4648 C 10.9610 44.4648 10.1406 45.3320 10.1406 46.5508 C 10.1406 47.7695 10.9610 48.6602 12.1797 48.6602 L 43.7734 48.6602 C 45.0156 48.6602 45.8594 47.7695 45.8594 46.5508 C 45.8594 45.3320 45.0156 44.4648 43.7734 44.4648 L 28.4922 44.4648 C 28.8906 44.3477 29.2422 44.1367 29.5703 43.7852 L 45.0859 28.2695 C 45.5547 27.7773 45.7656 27.2617 45.7656 26.6992 C 45.7656 25.5273 44.9219 24.6367 43.7266 24.6367 C 43.1641 24.6367 42.6250 24.8476 42.2266 25.2227 L 36.9766 30.4024 L 29.9219 38.1133 L 30.1094 33.0976 L 30.1094 9.4258 C 30.1094 8.2071 29.2188 7.3398 28 7.3398 C 26.7812 7.3398 25.9141 8.2071 25.9141 9.4258 L 25.9141 33.0976 L 26.0781 38.1367 L 19.0234 30.4024 L 13.7734 25.2227 C 13.3984 24.8476 12.8359 24.6367 12.2734 24.6367 C 11.1016 24.6367 10.2344 25.5273 10.2344 26.6992 C 10.2344 27.2617 10.4688 27.7773 10.9375 28.2695 L 26.4297 43.7852 C 26.7578 44.1367 27.1328 44.3477 27.5312 44.4648 Z" />
          </svg>
          <span>Download Kupass</span>
        </button>

        <p className="mt-3.5 max-w-md px-2 text-xs leading-relaxed text-white/95 sm:text-sm">
          Open source, zero-knowledge, and audited end-to-end. Free forever on
          Android, desktop, and self-hosted vaults.
        </p>
      </div>

      {/* Lightweight platform download modal */}
      {downloadOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="kupass-download-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#004d25]/55 p-4 backdrop-blur-sm"
          onClick={() => setDownloadOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-[#dffbc0] bg-white p-6 text-left shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dffbc0] px-3 py-1 text-xs font-semibold text-[#004d25]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#008c45]" />
                  Open Source · Apache-2.0
                </span>
                <h2
                  id="kupass-download-title"
                  className="mt-3 text-xl font-bold tracking-tight text-[#004d25]"
                >
                  Get Kupass
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Zero-knowledge encrypted vault built for Pixel &amp; desktop.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDownloadOpen(false)}
                aria-label="Close download dialog"
                className="cursor-pointer rounded-full p-2 text-zinc-500 transition hover:bg-[#dffbc0]/60 hover:text-[#004d25] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008c45]"
              >
                {/* Cupertino Icons: xmark */}
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 56 56"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M 10.0234 43.0234 C 9.2266 43.8203 9.2031 45.1797 10.0234 45.9766 C 10.8438 46.7734 12.1797 46.7734 13.0000 45.9766 L 28.0000 30.9766 L 43.0000 45.9766 C 43.7969 46.7734 45.1563 46.7969 45.9766 45.9766 C 46.7734 45.1562 46.7734 43.8203 45.9766 43.0234 L 30.9531 28.0000 L 45.9766 13.0000 C 46.7734 12.2031 46.7969 10.8437 45.9766 10.0469 C 45.1328 9.2266 43.7969 9.2266 43.0000 10.0469 L 28.0000 25.0469 L 13.0000 10.0469 C 12.1797 9.2266 10.8203 9.2031 10.0234 10.0469 C 9.2266 10.8672 9.2266 12.2031 10.0234 13.0000 L 25.0234 28.0000 Z" />
                </svg>
              </button>
            </div>

            <div className="mt-5 grid gap-2.5">
              <a
                href="#android-release"
                onClick={() => setDownloadOpen(false)}
                className="flex items-center justify-between rounded-2xl border border-[#afec2c]/60 bg-[#dffbc0]/45 px-4 py-3.5 transition hover:border-[#008c45] hover:bg-[#dffbc0]/75"
              >
                <div>
                  <div className="text-sm font-semibold text-[#004d25]">
                    Android / Google Pixel
                  </div>
                  <div className="text-xs text-[#006632]">
                    Passkeys, Biometric StrongBox &amp; Autofill
                  </div>
                </div>
                <span className="rounded-full bg-[#008c45] px-3 py-1 text-xs font-semibold text-white">
                  APK / Play
                </span>
              </a>

              <a
                href="#desktop-release"
                onClick={() => setDownloadOpen(false)}
                className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-[#f7faee] px-4 py-3.5 transition hover:border-[#008c45]/50 hover:bg-[#dffbc0]/35"
              >
                <div>
                  <div className="text-sm font-semibold text-zinc-900">
                    Desktop Vault
                  </div>
                  <div className="text-xs text-zinc-600">
                    Linux, macOS &amp; Windows CLI / App
                  </div>
                </div>
                <span className="rounded-full bg-[#afec2c] px-3 py-1 text-xs font-semibold text-[#004d25]">
                  v2.4
                </span>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-[#008c45]/40 hover:bg-[#f7faee]"
              >
                <span>Inspect reproducible builds on GitHub</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
