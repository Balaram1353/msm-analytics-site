#!/usr/bin/env node
/*
 * Consistency checker for the hand-duplicated navbar/footer/head block and
 * per-client copy across index.html and case-studies/*.html.
 *
 * Node built-ins only (fs, path) — no dependencies, no build step, writes
 * nothing. Run manually before pushing:
 *
 *   node scripts/check-consistency.js
 *
 * Exits 1 if anything is found, 0 if clean. See CLAUDE.md's "Case study
 * detail pages" section for why this exists and what it replaced.
 *
 * MUST BE EXTENDED when a fifth page or a new duplicated element is added —
 * see the PAGES list and CLIENT_PAGES map below, both hardcoded on purpose
 * (inferring page ownership from DOM order is exactly the kind of fragile
 * assumption that lets drift back in silently).
 */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const PAGES = [
  "index.html",
  "case-studies/msig-competitive-analysis-dashboard.html",
  "case-studies/quantivrisk-accident-causation-analysis.html",
  "case-studies/zywave-multi-state-premium-prediction.html",
];

// Which page is the canonical <h1>/<title> source for which client. Add an
// entry here for every new case-study page.
const CLIENT_PAGES = {
  "case-studies/msig-competitive-analysis-dashboard.html": "MSIG",
  "case-studies/quantivrisk-accident-causation-analysis.html": "QuantivRisk",
  "case-studies/zywave-multi-state-premium-prediction.html": "Zywave",
};

let failures = 0;

function fail(header, detailLines) {
  console.log("FAIL  " + header);
  for (const line of detailLines || []) console.log("      " + line);
  failures++;
}

function readFile(rel) {
  const full = path.join(ROOT, rel);
  return fs.readFileSync(full, "utf8").replace(/\r\n/g, "\n");
}

function stripComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, "");
}

// Loaded once, comments stripped, so no check below has to worry about
// legitimate per-page comment text (e.g. each case-study page's own
// "hrefs adjusted to point back at the homepage" note) reading as drift.
const fileContents = {};
for (const p of PAGES) fileContents[p] = stripComments(readFile(p));

function htmlCacheFor(absPath) {
  if (!htmlCacheFor._cache) htmlCacheFor._cache = {};
  if (absPath in htmlCacheFor._cache) return htmlCacheFor._cache[absPath];
  let content = null;
  try {
    content = stripComments(fs.readFileSync(absPath, "utf8").replace(/\r\n/g, "\n"));
  } catch {
    content = null;
  }
  htmlCacheFor._cache[absPath] = content;
  return content;
}

// ---------------------------------------------------------------------
// Check 1: navbar and footer blocks, identical across all four pages
// once "../index.html#" and "#" are treated as the same target.
// ---------------------------------------------------------------------

function extractBetween(content, startMarker, endMarker) {
  const start = content.indexOf(startMarker);
  if (start === -1) return null;
  const end = content.indexOf(endMarker, start);
  if (end === -1) return null;
  return content.slice(start, end + endMarker.length);
}

// Case-study pages link back to the homepage as "../index.html#foo";
// index.html links to its own sections as "#foo". Same target, different
// spelling depending on which page it's written on — collapse both to "#foo"
// before comparing so only real differences surface.
function normalizeCrossPageLinks(html) {
  return html.replace(/\.\.\/index\.html#/g, "#");
}

function diffLines(refLabel, refText, otherLabel, otherText) {
  const refLines = refText.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  const otherLines = otherText.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  const max = Math.max(refLines.length, otherLines.length);
  const diffs = [];
  for (let i = 0; i < max; i++) {
    const a = refLines[i] !== undefined ? refLines[i] : "(missing line)";
    const b = otherLines[i] !== undefined ? otherLines[i] : "(missing line)";
    if (a !== b) diffs.push({ index: i, ref: a, other: b });
  }
  return diffs;
}

function checkSharedBlock(name, startMarker, endMarker) {
  const refFile = "index.html";
  const refRaw = extractBetween(fileContents[refFile], startMarker, endMarker);
  if (!refRaw) {
    fail(`[${name}] could not locate "${startMarker}" ... "${endMarker}" in ${refFile}`);
    return;
  }
  const refNorm = normalizeCrossPageLinks(refRaw);

  for (const file of PAGES) {
    if (file === refFile) continue;
    const raw = extractBetween(fileContents[file], startMarker, endMarker);
    if (!raw) {
      fail(`[${name}] could not locate "${startMarker}" ... "${endMarker}" in ${file}`);
      continue;
    }
    const norm = normalizeCrossPageLinks(raw);
    const diffs = diffLines(refFile, refNorm, file, norm);
    for (const d of diffs) {
      fail(`[${name}] ${file} differs from ${refFile}`, [
        `${refFile}:  ${d.ref}`,
        `${file}:  ${d.other}`,
      ]);
    }
  }
}

checkSharedBlock("NAVBAR", '<header class="navbar" id="navbar">', "</header>");
checkSharedBlock("FOOTER", '<footer class="footer">', "</footer>");

// ---------------------------------------------------------------------
// Check 2: per-client <title>/<h1>/<h3>/<p> across every instance.
// ---------------------------------------------------------------------

function firstMatch(content, regex) {
  const m = content.match(regex);
  return m ? m[1] : null;
}

function allCardWorkBlocks(content) {
  const blocks = [];
  const re = /<article\s+class="card card--work[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
  let m;
  while ((m = re.exec(content))) {
    const inner = m[1];
    const client = firstMatch(inner, /<span class="card--work__client">([^<]+)<\/span>/);
    const h3 = firstMatch(inner, /<h3>([\s\S]*?)<\/h3>/);
    const p = firstMatch(inner, /<p>([\s\S]*?)<\/p>/);
    if (client) blocks.push({ client: client.trim(), h3: h3 ? h3.trim() : null, p: p ? p.trim() : null });
  }
  return blocks;
}

// client -> { h1: {file, text}, title: {file, text}, h3s: [{file, role, text}], ps: [{file, role, text}] }
const clientData = {};
function ensureClient(name) {
  if (!clientData[name]) clientData[name] = { h1: null, title: null, h3s: [], ps: [] };
  return clientData[name];
}

for (const file of PAGES) {
  const content = fileContents[file];
  const isOwnPage = file in CLIENT_PAGES;
  const role = file === "index.html" ? "homepage card" : isOwnPage ? "teaser (on its own page? shouldn't happen)" : "teaser";

  if (isOwnPage) {
    const client = CLIENT_PAGES[file];
    const data = ensureClient(client);
    const h1 = firstMatch(content, /<h1>([\s\S]*?)<\/h1>/);
    const title = firstMatch(content, /<title>([\s\S]*?)<\/title>/);
    if (h1) data.h1 = { file, text: h1.trim() };
    else fail(`[CLIENT COPY] ${file} has no <h1>`);
    if (title) data.title = { file, text: title.trim() };
    else fail(`[CLIENT COPY] ${file} has no <title>`);
  }

  for (const block of allCardWorkBlocks(content)) {
    const data = ensureClient(block.client);
    const cardRole = file === "index.html" ? `${file} (homepage card)` : `${file} (teaser)`;
    if (block.h3 !== null) data.h3s.push({ file, role: cardRole, text: block.h3 });
    if (block.p !== null) data.ps.push({ file, role: cardRole, text: block.p });
  }
}

function stripTitleSuffix(text) {
  return text.replace(/\s*—\s*MSM Analytics\s*$/i, "").trim();
}

for (const [client, data] of Object.entries(clientData)) {
  if (!data.h1) {
    fail(`[CLIENT COPY] ${client} has card instances but no owning page in CLIENT_PAGES — add it if this is a new page`);
    continue;
  }

  // <title> must match <h1>, once the "— MSM Analytics" suffix and casing
  // are normalized away (title is deliberately Title Case + suffixed; h1 is
  // deliberately sentence case — that's a style choice, not drift. Content
  // divergence past that normalization is drift.)
  if (data.title) {
    const titleCore = stripTitleSuffix(data.title.text).toLowerCase();
    const h1Core = data.h1.text.toLowerCase();
    if (titleCore !== h1Core) {
      fail(`[CLIENT COPY] ${client} <title> doesn't match its own <h1>`, [
        `${data.h1.file} <h1>:    "${data.h1.text}"`,
        `${data.title.file} <title>: "${data.title.text}"`,
      ]);
    }
  }

  // Every <h3> instance (homepage card + every teaser) must match the
  // client's own <h1> exactly.
  for (const h3 of data.h3s) {
    if (h3.text !== data.h1.text) {
      fail(`[CLIENT COPY] ${client} <h3> doesn't match its own page's <h1>`, [
        `${data.h1.file} <h1>:        "${data.h1.text}"`,
        `${h3.role} <h3>: "${h3.text}"`,
      ]);
    }
  }

  // Every <p> instance (homepage card + every teaser) must match every
  // other instance — compared against the first one found as reference.
  if (data.ps.length > 1) {
    const reference = data.ps[0];
    for (const p of data.ps.slice(1)) {
      if (p.text !== reference.text) {
        fail(`[CLIENT COPY] ${client} <p> description doesn't match across instances`, [
          `${reference.role}: "${reference.text}"`,
          `${p.role}: "${p.text}"`,
        ]);
      }
    }
  }
}

// ---------------------------------------------------------------------
// Check 3: every href/src resolves — to a real file, or to a real id.
// ---------------------------------------------------------------------

function collectIds(content) {
  const ids = new Set();
  const re = /\bid=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(content))) ids.add(m[1]);
  return ids;
}

const SKIP_PREFIXES = ["http://", "https://", "mailto:", "tel:", "data:"];

for (const file of PAGES) {
  const content = fileContents[file];
  const fileAbs = path.join(ROOT, file);
  const fileDir = path.dirname(fileAbs);

  const re = /\b(?:href|src)=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(content))) {
    const raw = m[1];
    if (raw === "#") continue; // known placeholder (social links), not drift
    if (SKIP_PREFIXES.some((p) => raw.startsWith(p))) continue;

    const hashIndex = raw.indexOf("#");
    const pathPart = hashIndex === -1 ? raw : raw.slice(0, hashIndex);
    const idPart = hashIndex === -1 ? null : raw.slice(hashIndex + 1);

    let targetAbs = fileAbs;
    if (pathPart.length > 0) {
      targetAbs = path.resolve(fileDir, pathPart);
      if (!fs.existsSync(targetAbs)) {
        fail(`[LINKS] ${file} references a file that doesn't exist`, [
          `href/src="${raw}"`,
          `resolved to: ${path.relative(ROOT, targetAbs)}`,
        ]);
        continue;
      }
    }

    if (idPart && idPart.length > 0) {
      const targetContent = targetAbs === fileAbs ? content : htmlCacheFor(targetAbs);
      if (targetContent === null) {
        fail(`[LINKS] ${file} has "${raw}" but couldn't read the target to check the id`);
        continue;
      }
      const ids = collectIds(targetContent);
      if (!ids.has(idPart)) {
        fail(`[LINKS] ${file} references an id that doesn't exist on the target page`, [
          `href="${raw}"`,
          `target: ${path.relative(ROOT, targetAbs)}, looking for id="${idPart}"`,
        ]);
      }
    }
  }
}

// ---------------------------------------------------------------------
// Check 4: every "Book a Strategy Call" CTA targets #contact-name.
// ---------------------------------------------------------------------

for (const file of PAGES) {
  const content = fileContents[file];
  const re = /<a href="([^"]+)"[^>]*>\s*Book a Strategy Call\s*<\/a>/g;
  let m;
  while ((m = re.exec(content))) {
    const href = m[1];
    const normalized = href.replace(/^\.\.\/index\.html#/, "#");
    if (normalized !== "#contact-name") {
      fail(`[CTA TARGET] ${file} has a "Book a Strategy Call" CTA not pointing at #contact-name`, [
        `href="${href}"`,
      ]);
    }
  }
}

// ---------------------------------------------------------------------

console.log("");
if (failures === 0) {
  console.log("OK  no drift found across " + PAGES.length + " pages.");
  process.exit(0);
} else {
  console.log(`${failures} issue${failures === 1 ? "" : "s"} found.`);
  process.exit(1);
}
