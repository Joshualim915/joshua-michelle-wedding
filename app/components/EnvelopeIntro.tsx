"use client";

import { useEffect, useRef, useState } from "react";

type IntroState = "loading" | "idle" | "opening" | "opened" | "transitioning" | "complete";

const assetRoot = "/assets/envelope";
const criticalAssets = [
  "envelope-back.svg",
  "envelope-inner-lining.svg",
  "envelope-top-flap.svg",
  "envelope-left-flap.svg",
  "envelope-right-flap.svg",
  "envelope-front-panel.svg",
  "paper-texture-real.jpg",
  "wax-seal.png",
].map((asset) => `${assetRoot}/${asset}`);

export function EnvelopeIntro({ onComplete }: { onComplete: () => void }) {
  const [state, setState] = useState<IntroState>("loading");
  const timers = useRef<number[]>([]);
  const openingStarted = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const activeTimers = timers.current;
    Promise.all(
      criticalAssets.map((src) => new Promise<void>((resolve) => {
        const image = new Image();
        image.onload = () => resolve();
        image.onerror = () => resolve();
        image.src = src;
      })),
    ).then(() => {
      if (!cancelled) setState("idle");
    });
    return () => {
      cancelled = true;
      activeTimers.forEach(window.clearTimeout);
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
    timers.current.push(window.setTimeout(() => setState("opened"), 900));
    timers.current.push(window.setTimeout(() => setState("transitioning"), 1080));
    timers.current.push(window.setTimeout(finish, 2180));
  }

  if (state === "complete") return null;

  return (
    <section className={`envelope-intro intro-${state}`} aria-label="Wedding invitation introduction">
      <button className="skip-intro" type="button" onClick={finish}>Skip intro</button>

      {state === "loading" ? (
        <div className="intro-loader" role="status"><span /><p>Preparing your invitation</p></div>
      ) : (
        <div className="envelope-stage">
          <div className="envelope-assembly">
            <img className="envelope-layer layer-back" src={`${assetRoot}/envelope-back.svg`} alt="" />
            <img className="envelope-layer layer-lining" src={`${assetRoot}/envelope-inner-lining.svg`} alt="" />
            <div className="interior-glow" />
            <div className="flap-wrap flap-left"><img src={`${assetRoot}/envelope-left-flap.svg`} alt="" /></div>
            <div className="flap-wrap flap-right"><img src={`${assetRoot}/envelope-right-flap.svg`} alt="" /></div>
            <div className="flap-wrap flap-bottom"><img src={`${assetRoot}/envelope-front-panel.svg`} alt="" /></div>
            <div className="flap-wrap flap-top">
              <img src={`${assetRoot}/envelope-top-flap.svg`} alt="" />
              <button
                className="wax-trigger"
                type="button"
                onPointerDown={openInvitation}
                onClick={openInvitation}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openInvitation();
                  }
                }}
                disabled={state !== "idle"}
                aria-label="Open wedding invitation"
              >
                <span className="wax-halo" aria-hidden="true" />
                <img src={`${assetRoot}/wax-seal.png`} alt="" aria-hidden="true" />
              </button>
            </div>
            <img className="envelope-layer layer-texture" src={`${assetRoot}/paper-texture-real.jpg`} alt="" />
          </div>
          <p className="intro-prompt">Tap the seal to open</p>
        </div>
      )}
    </section>
  );
}
