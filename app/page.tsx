"use client";

import { FormEvent, useEffect, useState } from "react";

const events = [
  ["4:30 PM", "Guest arrival"],
  ["5:00 PM", "Wedding ceremony"],
  ["6:00 PM", "Cocktail hour"],
  ["7:00 PM", "Dinner & toasts"],
  ["8:30 PM", "Dancing under the stars"],
];

function Countdown() {
  const wedding = new Date("2026-09-27T17:00:00+08:00").getTime();
  const [left, setLeft] = useState(Math.max(0, wedding - Date.now()));

  useEffect(() => {
    const timer = window.setInterval(() => setLeft(Math.max(0, wedding - Date.now())), 1000);
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
        <div key={label}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>
      ))}
    </div>
  );
}

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className={opened ? "invitation is-open" : "invitation"}>
      <section className="envelope-scene" aria-label="Wedding invitation envelope">
        <div className="envelope-shadow" />
        <div className="envelope">
          <div className="envelope-back" />
          <div className="letter-card"><span>J</span><i>&amp;</i><span>M</span></div>
          <div className="envelope-front" />
          <div className="flap" />
          <button className="seal" onClick={() => setOpened(true)} aria-label="Open the invitation">
            <span>J&amp;M</span>
          </button>
          <p className="tap-note">Tap to open</p>
        </div>
      </section>

      <div className="story">
        <section className="hero section">
          <p className="eyebrow">Together with their families</p>
          <p className="date-top">27 · 09 · 2026</p>
          <h1><span>Joshua</span><em>&amp;</em><span>Michelle</span></h1>
          <p className="invited">joyfully invite you to celebrate their wedding</p>
          <a className="scroll-cue" href="#welcome">Scroll to discover <b>⌄</b></a>
        </section>

        <section className="section paper" id="welcome">
          <p className="arabic">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
          <h2>Two souls.<br />One beautiful beginning.</h2>
          <p className="body-copy">Dear friends and family, join us for an evening filled with love, laughter, and memories we will carry for a lifetime.</p>
          <div className="divider">✦</div>
          <p className="script-label">The celebration begins in</p>
          <Countdown />
        </section>

        <section className="section blush">
          <p className="eyebrow">Sunday · September 27</p>
          <h2>Order of Celebration</h2>
          <div className="timeline">
            {events.map(([time, label], index) => (
              <div className="event" key={time}><time>{time}</time><i>{index === 2 ? "❀" : "◆"}</i><p>{label}</p></div>
            ))}
          </div>
        </section>

        <section className="section venue">
          <p className="eyebrow">The venue</p>
          <h2>The Glasshouse<br />at Seputeh</h2>
          <p className="body-copy">17, Lorong Syed Putra Kiri<br />Taman Seputeh, Kuala Lumpur</p>
          <div className="map-card" aria-hidden="true"><span>Jalan Syed Putra</span><b>⌖</b><i>The Glasshouse</i></div>
          <a className="outline-button" href="https://maps.google.com/?q=The+Glasshouse+at+Seputeh" target="_blank" rel="noreferrer">Open in Maps ↗</a>
        </section>

        <section className="section details">
          <div><span className="detail-icon">♙</span><h2>Dress Code</h2><p>Garden formal<br /><small>Soft neutrals · earthy tones</small></p></div>
          <div className="divider">❦</div>
          <div><span className="detail-icon">⌂</span><h2>Gift Preference</h2><p>Your presence is our greatest gift.<br /><small>Should you wish, a card box will be available.</small></p></div>
        </section>

        <section className="section closing">
          <p className="eyebrow">Kindly reply by August 9</p>
          <h2>Will you join us?</h2>
          <p className="body-copy">We can’t wait to celebrate this beautiful day with the people we love most.</p>
          <button className="primary-button" onClick={() => { setSubmitted(false); setRsvpOpen(true); }}>Confirm your attendance</button>
          <p className="monogram">J <i>&amp;</i> M</p>
        </section>
      </div>

      {rsvpOpen && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="rsvp-title">
          <button className="modal-backdrop" onClick={() => setRsvpOpen(false)} aria-label="Close RSVP form" />
          <div className="modal-sheet">
            <button className="close" onClick={() => setRsvpOpen(false)} aria-label="Close">×</button>
            {submitted ? (
              <div className="thank-you"><span>♡</span><h2>Thank you</h2><p>Your reply has been received. We look forward to celebrating with you.</p><button className="primary-button" onClick={() => setRsvpOpen(false)}>Back to invitation</button></div>
            ) : (
              <form onSubmit={submit}>
                <p className="eyebrow">Joshua &amp; Michelle</p><h2 id="rsvp-title">Confirm your attendance</h2><p>Please RSVP before August 9</p>
                <label>Your name<input required name="name" autoComplete="name" placeholder="Full name" /></label>
                <fieldset><legend>Will you be attending?</legend><label className="choice"><input required type="radio" name="attending" value="yes" /> Joyfully accepts</label><label className="choice"><input type="radio" name="attending" value="no" /> Regretfully declines</label></fieldset>
                <label>Number of guests<select name="guests" defaultValue="1"><option>1</option><option>2</option><option>3</option><option>4</option></select></label>
                <label>Dietary requirements<textarea name="dietary" placeholder="Let us know how we can accommodate you" /></label>
                <label>A song that gets you dancing<input name="song" placeholder="Your dance-floor request" /></label>
                <button className="primary-button" type="submit">Send my RSVP</button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
