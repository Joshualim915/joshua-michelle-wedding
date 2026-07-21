import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("layout declares the Joshua & Michelle wedding metadata", async () => {
  const layout = await read("app/layout.tsx");
  assert.match(layout, /Joshua & Michelle/);
  assert.match(layout, /Takun Retreat Club/);
  assert.match(layout, /19 · 06 · 2027|19.*06.*2027/);
});

test("page renders the invitation, countdown, and RSVP flow", async () => {
  const page = await read("app/page.tsx");
  assert.match(page, /Joshua/);
  assert.match(page, /Michelle/);
  assert.match(page, /Countdown/);
  assert.match(page, /2027-06-19/);
  assert.match(page, /RSVP/);
  assert.match(page, /until-i-found-you\.mp3/);
  assert.doesNotMatch(page, /Add to calendar/);
  assert.match(page, /getSupabase/);
  assert.match(page, /from\("rsvps"\)/);
  assert.match(page, /CourseSelector/);
  assert.doesNotMatch(page, /Garden formal/);
});

test("GIF-derived intro only begins on activation", async () => {
  const intro = await read("app/components/EnvelopeIntro.tsx");
  assert.match(intro, /opening-animation\.mp4/);
  assert.match(intro, /opening-cover\.png/);
  assert.match(intro, /animationDuration = 2667/);
  assert.match(intro, /onClick=\{startAnimation\}/);
  assert.match(intro, /onOpen\?\.\(\)/);
  assert.match(intro, /image\?\.complete/);
  assert.match(intro, /gif-white-transition/);
});

test("agenda section has a scroll-tracking flower and the closing RSVP has no monogram", async () => {
  const page = await read("app/page.tsx");
  const styles = await read("app/globals.css");
  assert.match(page, /<h2>Agenda<\/h2>/);
  assert.doesNotMatch(page, /Order of Celebration/);
  assert.match(page, /AgendaTimeline/);
  assert.match(styles, /agenda-flower/);
  assert.match(styles, /--agenda-progress/);
  assert.match(styles, /\.closing \.rsvp-button/);
  assert.doesNotMatch(page, /<p className="monogram">/);
});

test("the RSVP content is server-gated until the intro completes", async () => {
  const page = await read("app/page.tsx");
  const layout = await read("app/layout.tsx");
  assert.match(page, /invitation intro-pending/);
  assert.match(layout, /\.intro-pending \.story\{visibility:hidden\}/);
});

test("venue gathering details follow the welcome and retired sections stay removed", async () => {
  const page = await read("app/page.tsx");
  const welcome = page.indexOf('className="section welcome"');
  const gathering = page.indexOf('className="gallery-section section"');
  assert.ok(welcome >= 0 && gathering > welcome, "gathering details should follow the welcome");
  assert.match(page, /Where we’ll celebrate/);
  assert.match(page, /Takun Retreat Club/);
  assert.match(page, /Nestled beside the forested hills of Rawang/);
  assert.match(page, /https:\/\/maps\.google\.com\/\?q=Takun\+Retreat\+Club/);
  assert.doesNotMatch(page, /className="venue-intro/);
  assert.doesNotMatch(page, /className="venue-details/);
  assert.doesNotMatch(page, /className="menu-preview/);
});

test("supabase client is wired with public env vars", async () => {
  const client = await read("app/supabase.ts");
  assert.match(client, /NEXT_PUBLIC_SUPABASE_URL/);
  assert.match(client, /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  assert.match(client, /createClient/);
});

test("env example documents the required Supabase variables", async () => {
  const example = await read(".env.example");
  assert.match(example, /NEXT_PUBLIC_SUPABASE_URL/);
  assert.match(example, /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
});

test("rsvps table migration exists with insert policy", async () => {
  const sql = await read("supabase/migrations/0001_create_rsvps.sql");
  assert.match(sql, /create table if not exists public\.rsvps/);
  assert.match(sql, /alter table public\.rsvps enable row level security/);
  assert.match(sql, /anyone can insert rsvps/);
});
