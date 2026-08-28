#!/usr/bin/env node
/**
 * Hit the live public pages after deploy so each colo we reach stores HTML in
 * the Worker Cache API. Later visitors then skip the Next.js render that was
 * causing Error 1102.
 */

const ORIGIN = "https://navahathayoga.com";

const PATHS = [
  "/",
  "/programs",
  "/events",
  "/events/archive",
  "/retreats",
  "/retreats/archive",
  "/about",
  "/contact",
  "/register",
  "/privacy-policy",
  "/terms-of-service",
  "/cookie-policy",
  "/robots.txt",
  "/sitemap.xml",
];

const RETRY_STATUSES = new Set([408, 429, 500, 502, 503, 504, 520, 521, 522, 523, 524, 530]);

async function fetchOnce(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "nava-hatha-yoga-warmup/1.0" },
    redirect: "follow",
  });
  await response.arrayBuffer();
  return response.status;
}

async function warmup(path) {
  const url = new URL(path, ORIGIN).toString();
  let lastStatus = 0;

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      lastStatus = await fetchOnce(url);
      if (!RETRY_STATUSES.has(lastStatus)) {
        console.log(`${lastStatus} ${url}`);
        return lastStatus < 500;
      }
      console.warn(`retry ${attempt} after ${lastStatus} ${url}`);
    } catch (error) {
      lastStatus = 0;
      console.warn(`retry ${attempt} after error ${url}:`, error);
    }
    await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
  }

  console.error(`failed ${lastStatus} ${url}`);
  return false;
}

const results = [];
for (const path of PATHS) {
  results.push(await warmup(path));
}

const ok = results.filter(Boolean).length;
console.log(`Warmed ${ok}/${PATHS.length} routes.`);
if (ok === 0) process.exit(1);
