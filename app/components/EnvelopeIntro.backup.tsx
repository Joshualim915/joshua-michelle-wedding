"use client";

/*
 * Backup of the original layered SVG/raster envelope experience.
 * It is intentionally not imported by the live page while the GIF cover is active.
 * Its matching styles remain in app/globals.css under the envelope panel classes.
 */
import { useEffect, useRef, useState } from "react";

type IntroState = "loading" | "idle" | "opening" | "opened" | "transitioning" | "complete";

const assetRoot = "/assets/envelope";
const criticalAssets = [
  `${assetRoot}/panel-left.png`,
  `${assetRoot}/panel-top.png`,
  `${assetRoot}/panel-right.png`,
  `${assetRoot}/panel-bottom.png`,
  `${assetRoot}/paper-texture-real.jpg`,
  `${assetRoot}/wax-seal.png`,
];

export function LegacyEnvelopeIntro({ onComplete }: { onComplete: () => void }) {
  const [state, setState] = useState<IntroState>("loading");
  const timers = useRef<number[]>([]);
  const openingStarted = useRef(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all(criticalAssets.map((src) => new Promise<void>((resolve) => {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = src;
    }))).then(() => {
      if (!cancelled) setState("idle");
    });
    return () => {
      cancelled = true;
      timers.current.forEach(window.clearTimeout);
    };
  }, []);

  function finish() {
    setState("complete");
    document.body.classList.remove("envelope-locked");
    onComplete();
    window.setTimeout(() => document.querySelector<HTMLElement>("#invitation-hero")?.focus(), 40);
  }

  function openInvitation() {
    if (openingStarted.current) return;
    openingStarted.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("transitioning");
      timers.current.push(window.setTimeout(finish, 420));
      return;
    }
    setState("opening");
    timers.current.push(window.setTimeout(() => setState("opened"), 1900));
    timers.current.push(window.setTimeout(() => setState("transitioning"), 2050));
    timers.current.push(window.setTimeout(finish, 3050));
  }

  if (state === "complete") return null;

  return (
    <section className={`envelope-intro intro-${state}`} aria-label="Wedding invitation introduction">
      {state === "loading" ? <div className="intro-loader" role="status"><span /><p>Preparing your invitation</p></div> : (
        <div className="envelope-stage">
          <div className="opening-bloom" aria-hidden="true" />
          <div className="interior-glow" />
          <div className="envelope-assembly">
            <div className="flap-wrap flap-left"><img src={`${assetRoot}/panel-left.png`} alt="" /></div>
            <div className="flap-wrap flap-right"><img src={`${assetRoot}/panel-right.png`} alt="" /></div>
            <div className="flap-wrap flap-bottom"><img src={`${assetRoot}/panel-bottom.png`} alt="" /></div>
            <div className="flap-wrap flap-top">
              <img src={`${assetRoot}/panel-top.png`} alt="" />
              <button className="wax-trigger" type="button" onPointerDown={openInvitation} onClick={openInvitation} disabled={state !== "idle"} aria-label="Open wedding invitation">
                <span className="wax-halo" aria-hidden="true" />
                <img src={`${assetRoot}/wax-seal.png`} alt="" aria-hidden="true" />
              </button>
              <span className="seal-cue" aria-hidden="true"><i />Tap to Open</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
