"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSupabase } from "./supabase";
import { EnvelopeIntro } from "./components/EnvelopeIntro";

const events = [
  ["4:30 PM", "Guest arrival & welcome drinks"],
  ["5:15 PM", "Garden ceremony"],
  ["6:00 PM", "Cocktail hour"],
  ["7:00 PM", "Dinner & toasts"],
  ["8:30 PM", "Dancing under the stars"],
];

// Replace these placeholder food images with your own course photos.
// Each key must match the dish name exactly.
const courseImages: Record<string, Record<string, string>> = {
  appetizer: {
    "Forest mushroom tart":
      "https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&w=600&q=80",
    "Burrata & heirloom tomato":
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    "Citrus-cured salmon":
      "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=600&q=80",
  },
  main: {
    "Herb-roasted chicken":
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80",
    "Miso-glazed seabass":
      "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80",
    "Garden vegetable risotto":
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80",
  },
  carbs: {
    "Truffle potato purée":
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80",
    "Fragrant butter rice":
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80",
    "Herb pappardelle":
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80",
  },
  dessert: {
    "Vanilla bean panna cotta":
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
    "Lemon garden tart":
      "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=600&q=80",
    "Dark chocolate crémeux":
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
  },
};

const courses = {
  appetizer: ["Forest mushroom tart", "Burrata & heirloom tomato", "Citrus-cured salmon"],
  main: ["Herb-roasted chicken", "Miso-glazed seabass", "Garden vegetable risotto"],
  carbs: ["Truffle potato purée", "Fragrant butter rice", "Herb pappardelle"],
  dessert: ["Vanilla bean panna cotta", "Lemon garden tart", "Dark chocolate crémeux"],
} as const;

type CourseKey = keyof typeof courses;

function Countdown() {
  const wedding = new Date("2027-06-19T17:15:00+08:00").getTime();
  const [left, setLeft] = useState(0);

  useEffect(() => {
    const tick = () => setLeft(Math.max(0, wedding - Date.now()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [wedding]);

  const values = [
    [Math.floor(left / 86400000), "Days"],
    [Math.floor((left / 3600000) % 24), "Hours"],
    [Math.floor((left / 60000) % 60), "Minutes"],
    [Math.floor((left / 1000) % 60), "Seconds"],
  ];

  return (
    <div className="countdown" aria-label="Countdown to the wedding">
      {values.map(([value, label]) => (
        <div key={label}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function CourseSelector({ category }: { category: CourseKey }) {
  const options = courses[category];
  const [selected, setSelected] = useState<string>(options[0]);
  const image = courseImages[category][selected];

  return (
    <div className="course-picker">
      <label htmlFor={category}>{category}</label>
      <div className="course-preview">
        <img src={image} alt={selected} />
      </div>
      <select
        id={category}
        name={category}
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        required
      >
        {options.map((dish) => (
          <option key={dish} value={dish}>
            {dish}
          </option>
        ))}
      </select>
    </div>
  );
}

function MenuChoices() {
  return (
    <div className="menu-choices">
      {(Object.keys(courses) as CourseKey[]).map((category) => (
        <CourseSelector category={category} key={category} />
      ))}
    </div>
  );
}

function FallingPetals() {
  return (
    <div className="floating-flowers" aria-hidden="true">
      {Array.from({ length: 10 }, (_, index) => <span className="petal" key={index} />)}
    </div>
  );
}

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [attending, setAttending] = useState("yes");

  useEffect(() => {
    document.body.classList.toggle("envelope-locked", !introComplete);
    return () => document.body.classList.remove("envelope-locked");
  }, [introComplete]);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -6%" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const isAttending = String(data.get("attending") ?? "").trim();
    const row = {
      name,
      attending: (isAttending === "no" ? "no" : "yes") as "yes" | "no",
      guests: isAttending === "no" ? null : Number(data.get("guests") ?? "1") || 1,
      appetizer: isAttending === "no" ? null : String(data.get("appetizer") ?? "").trim() || null,
      main: isAttending === "no" ? null : String(data.get("main") ?? "").trim() || null,
      carbs: isAttending === "no" ? null : String(data.get("carbs") ?? "").trim() || null,
      dessert: isAttending === "no" ? null : String(data.get("dessert") ?? "").trim() || null,
      dietary: String(data.get("dietary") ?? "").trim() || null,
      song: String(data.get("song") ?? "").trim() || null,
    };
    try {
      const { error } = await getSupabase().from("rsvps").insert(row);
      if (error) throw error;
      setSubmitted(true);
      form.reset();
      setAttending("yes");
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Sorry, we couldn't save your RSVP. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={introComplete ? "invitation intro-complete" : "invitation intro-pending"}>
      <EnvelopeIntro onComplete={() => setIntroComplete(true)} />
      <FallingPetals />

      <div className="story">
        <section className="hero section" id="invitation-hero" tabIndex={-1}>
          <div className="hero-photo" />
          <div className="hero-wash" />
          <img className="flower-corner flower-left" src="/assets/florals/garden-floral-left.png" alt="" aria-hidden="true" />
          <img className="flower-corner flower-right" src="/assets/florals/garden-floral-right.png" alt="" aria-hidden="true" />
          <div className="reveal hero-copy">
            <p className="eyebrow">Together with their families</p>
            <p className="date-top">19 · 06 · 2027</p>
            <h1>
              <span>Joshua</span>
              <em>&amp;</em>
              <span>Michelle</span>
            </h1>
            <p className="invited">invite you to a celebration of love in the garden</p>
          </div>
          <a className="scroll-cue" href="#welcome">
            Discover our day <b>⌄</b>
          </a>
        </section>

        <section className="section welcome" id="welcome">
          <img className="botanical-stem stem-one" src="/assets/florals/garden-floral-right.png" alt="" aria-hidden="true" />
          <div className="reveal">
            <p className="eyebrow">Our next chapter</p>
            <h2>
              Where love
              <br />
              grows wild.
            </h2>
            <p className="body-copy">
              Dear friends and family, join us among the trees and white blooms for an intimate
              evening of love, laughter, and new beginnings.
            </p>
            <div className="flower-divider">
              <span />
              <span className="divider-flower" aria-hidden="true">
                <img src="/white-flowers-composition-arrangement-delicate-petals-blossom.png" alt="" />
              </span>
              <span />
            </div>
            <p className="script-label">The garden awaits in</p>
            <Countdown />
          </div>
        </section>

        <section className="gallery-section section">
          <div className="reveal gallery-copy">
            <p className="eyebrow">Where we’ll celebrate</p>
            <h2>Takun Retreat Club</h2>
            <p className="body-copy">Nestled beside the forested hills of Rawang.</p>
            <a className="outline-button gallery-location" href="https://maps.google.com/?q=Takun+Retreat+Club" target="_blank" rel="noreferrer">View location</a>
          </div>
          <div className="venue-gallery">
            <figure className="reveal"><img src="/takun-garden.png" alt="Garden path and white arches at Takun Retreat Club" /><figcaption>The garden</figcaption></figure>
            <figure className="reveal"><img src="/takun-arches.png" alt="Arched windows overlooking the green grounds" /><figcaption>The arches</figcaption></figure>
            <figure className="reveal"><img src="/takun-entrance.png" alt="White arched entrance at Takun Retreat Club" /><figcaption>The arrival</figcaption></figure>
          </div>
        </section>

        <section className="section schedule">
          <div className="reveal">
            <p className="eyebrow">Saturday · Nineteenth of June</p>
            <h2>Order of Celebration</h2>
            <div className="timeline">
              {events.map(([time, label], index) => (
                <div
                  className="event"
                  key={time}
                  style={{ transitionDelay: `${index * 90}ms` }}
                >
                  <time>{time}</time>
                  <i>·</i>
                  <p>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section closing">
          <img src="/takun-garden.png" alt="" aria-hidden="true" />
          <div className="closing-wash" />
          <div className="reveal closing-copy">
            <p className="eyebrow">Kindly reply by 19 May 2027</p>
            <h2>
              Will you join us
              <br />
              in the garden?
            </h2>
            <p className="body-copy">
              We can’t wait to celebrate this beautiful day with the people we love most.
            </p>
            <button
              className="primary-button rsvp-button"
              onClick={() => {
                setSubmitted(false);
                setSubmitError(null);
                setRsvpOpen(true);
              }}
            >
              RSVP
            </button>
            <p className="monogram">
              J <i>&amp;</i> M
            </p>
          </div>
        </section>
      </div>

      {rsvpOpen && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="rsvp-title">
          <button
            className="modal-backdrop"
            onClick={() => setRsvpOpen(false)}
            aria-label="Close RSVP form"
          />
          <div className="modal-sheet">
            <button className="close" onClick={() => setRsvpOpen(false)} aria-label="Close">
              ×
            </button>
            {submitted ? (
              <div className="thank-you">
                <span />
                <p className="eyebrow">Your reply is received</p>
                <h2>Thank you</h2>
                <p>We look forward to celebrating with you at Takun Retreat Club.</p>
                <button className="primary-button" onClick={() => setRsvpOpen(false)}>
                  Back to invitation
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <p className="eyebrow">Joshua &amp; Michelle · 19 June 2027</p>
                <h2 id="rsvp-title">Confirm your attendance</h2>
                <p>Please reply before 19 May 2027</p>
                <label>
                  Your name
                  <input required name="name" autoComplete="name" placeholder="Full name" />
                </label>
                <fieldset>
                  <legend>Will you be attending?</legend>
                  <label className="choice">
                    <input
                      required
                      type="radio"
                      name="attending"
                      value="yes"
                      checked={attending === "yes"}
                      onChange={() => setAttending("yes")}
                    />{" "}
                    Joyfully accepts
                  </label>
                  <label className="choice">
                    <input
                      type="radio"
                      name="attending"
                      value="no"
                      checked={attending === "no"}
                      onChange={() => setAttending("no")}
                    />{" "}
                    Regretfully declines
                  </label>
                </fieldset>
                {attending === "yes" && (
                  <>
                    <label>
                      Number of guests
                      <select name="guests" defaultValue="1">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                      </select>
                    </label>
                    <div className="menu-heading">
                      <p className="eyebrow">Your dinner selections</p>
                      <h3>Choose one from each course</h3>
                    </div>
                    <MenuChoices />
                    <label>
                      Dietary requirements
                      <textarea name="dietary" placeholder="Allergies or dietary needs" />
                    </label>
                    <label>
                      A song that gets you dancing
                      <input name="song" placeholder="Your dance-floor request" />
                    </label>
                  </>
                )}
                {submitError && (
                  <p className="rsvp-error" role="alert">
                    {submitError}
                  </p>
                )}
                <button className="primary-button" type="submit" disabled={submitting}>
                  {submitting ? "Sending…" : "Send my RSVP"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
