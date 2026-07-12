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
  assert.match(page, /Confirm your attendance/);
  assert.match(page, /getSupabase/);
  assert.match(page, /from\("rsvps"\)/);
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