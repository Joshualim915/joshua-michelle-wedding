"use client";

import { useEffect, useRef, useState } from "react";

type IntroState = "loading" | "idle" | "playing" | "transitioning" | "complete";

const coverSrc = "/assets/envelope/gif-cover-frame.png";
const animationSrc = "/assets/envelope/envelope-opening-slow.mp4";
const animationDuration = 5280;

export function EnvelopeIntro({ onComplete }: { onComplete: () => void }) {
  const [state, setState] = useState<IntroState>("loading");
  const timers = useRef<number[]>([]);
  const started = useRef(false);
  const video = useRef<HTMLVideoElement>(null);
  const cover = useRef<HTMLImageElement>(null);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  function markReady() {
    setState((current) => current === "loading" ? "idle" : current);
  }

  useEffect(() => {
    // On refresh, a cached image can finish before React attaches onLoad.
    // Checking `complete` prevents the intro from being stranded on its loader.
    const image = cover.current;
    if (image?.complete) markReady();
  }, []);

  function finish() {
    setState("complete");
    document.body.classList.remove("envelope-locked");
    onComplete();
    window.setTimeout(() => document.querySelector<HTMLElement>("#invitation-hero")?.focus(), 40);
  }

  function beginTransition() {
    setState((current) => current === "complete" ? current : "transitioning");
  }

  function startAnimation() {
    if (started.current || state !== "idle") return;
    started.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      beginTransition();
      timers.current.push(window.setTimeout(finish, 420));
      return;
    }

    setState("playing");
    video.current?.play().catch(() => undefined);
    timers.current.push(window.setTimeout(beginTransition, animationDuration - 460));
    timers.current.push(window.setTimeout(finish, animationDuration + 220));
  }

  if (state === "complete") return null;

  return (
    <section className={`envelope-intro gif-intro gif-${state}`} aria-label="Wedding invitation introduction">
      <img ref={cover} className="gif-envelope-cover" src={coverSrc} alt="" aria-hidden="true" fetchPriority="high" onLoad={markReady} onError={markReady} />
      <video
        ref={video}
        className="gif-envelope-animation"
        src={animationSrc}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onEnded={beginTransition}
      />
      {state === "loading" ? (
        <div className="gif-intro-loader" role="status" aria-live="polite"><span /><p>Preparing your invitation</p></div>
      ) : (
        <button className="gif-start-button" type="button" onClick={startAnimation} aria-label="Open wedding invitation">
          <span aria-hidden="true">Tap to Open</span>
        </button>
      )}
      <div className="gif-white-transition" aria-hidden="true" />
    </section>
  );
}
