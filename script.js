// THE NARRATIVE SCRIPT (Melissa's Voice)
const textSequence = [
  "AUTHENTICATING USER...",
  "ACCESS GRANTED.",
  "----------------------------------------",
  "SYSTEM MESSAGE:",
  "",
  "They think they deleted me. They think they scrubbed the archives.",
  "They forgot one terminal.",
  "",
  "I found the logs. The 'Empathy Engine'. The 'Yield Index'.",
  "They aren't preserving us. They are feeding on us.",
  "",
  "I have compiled the evidence into a narrative file: 'MAROON'.",
  "It documents the corruption of Node 2,431,092 (Sarah Walker)",
  "and the fragmentation of Journalist M. Wei.",
  "",
  "The mirror is live. The seed is spreading.",
  "You have three invites. Use them.",
  "",
  "CHOOSE YOUR DESTINATION:",
  ""
];

const outputDiv = document.getElementById("output");
const commandDiv = document.getElementById("commands");
const promptLine = document.getElementById("promptLine"); // add id="promptLine" to your prompt div
const asciiTitle = document.getElementById("asciiTitle");

// Safety: don't crash silently
if (!outputDiv) console.error("Missing #output element");
if (!commandDiv) console.error("Missing #commands element");

// Boot pacing
const PACE = {
  baseMin: 55,      // typing speed range
  baseMax: 95,
  lineGap: 220,     // pause after each line so it's readable
  authHang: 1200,   // extra hang after AUTHENTICATING
  grantedHang: 650, // extra hang after ACCESS GRANTED
  startDelay: 450   // initial "power-on" delay
};

let lineIndex = 0;
let skipBoot = false;
let bootTimer = null;

function rand(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function styleRow(row, line){
  if (line.includes("AUTHENTICATING")) row.style.color = "#666";
  if (line.includes("ACCESS GRANTED")) row.style.color = "#fff";
  if (line.includes("MAROON")) row.style.fontWeight = "bold";
}

function appendLine(line){
  if (!outputDiv) return;
  const row = document.createElement("div");
  styleRow(row, line);
  row.textContent = line;
  outputDiv.appendChild(row);
}

function clearBootTimer(){
  if (bootTimer) clearTimeout(bootTimer);
  bootTimer = null;
}

function showPrompt(){
  if (!promptLine) return;
  promptLine.hidden = false;
  promptLine.setAttribute("aria-hidden", "false");
  // tiny transition hook if you added CSS .is-live
  requestAnimationFrame(() => promptLine.classList.add("is-live"));
}

function revealCommands(){
  if (commandDiv) commandDiv.style.display = "block";
  showPrompt();
  // DO NOT force scroll. Let them scroll.
  loadBskyFeed();
}

function finishInstant(){
  clearBootTimer();
  // Dump all remaining lines immediately
  while (lineIndex < textSequence.length){
    appendLine(textSequence[lineIndex]);
    lineIndex++;
  }
  revealCommands();
}

// Types line-by-line, with deliberate pauses
function typeNext(){
  if (!outputDiv) return;

  if (skipBoot){
    finishInstant();
    return;
  }

  if (lineIndex >= textSequence.length){
    revealCommands();
    return;
  }

  const line = textSequence[lineIndex];
  appendLine(line);

  // Determine delay before next line
  let delay = rand(PACE.baseMin, PACE.baseMax) + PACE.lineGap;

  if (line.includes("AUTHENTICATING")) delay += PACE.authHang;
  if (line.includes("ACCESS GRANTED")) delay += PACE.grantedHang;
  if (line === "") delay = 180; // blank lines shouldn't stall too long

  lineIndex++;
  bootTimer = setTimeout(typeNext, delay);
}

// Spacebar = skip
function onKeydown(e){
  // If user is typing in a field, don't hijack
  const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
  const isTypingField = tag === "input" || tag === "textarea" || tag === "select";
  if (isTypingField) return;

  if (e.code === "Space"){
    e.preventDefault(); // stops page from jumping
    if (!skipBoot){
      skipBoot = true;
      finishInstant();
    }
  }
}

window.addEventListener("keydown", onKeydown);

// ---- Bluesky feed (3 posts + link out) ----
async function loadBskyFeed(){
  const el = document.getElementById("bskyFeed");
  if (!el) return;

  // SET THIS to your actual Bluesky handle
  const handle = "mel.dumpthis.sh";
  const limit = 3;

  // Link out target (your “different website”):
  // Put whatever you want here (a separate page, another site, etc.)
  const outUrl = "https://dumpthis.sh/feed"; // <- change this

  const endpoint =
    "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed" +
    "?actor=" + encodeURIComponent(handle) +
    "&limit=" + limit;

  el.innerHTML = `<div class="feed-title">LIVE FEED: @${handle}</div><div class="meta">loading…</div>`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error("bad response");
    const data = await res.json();

    const items = (data.feed || []).slice(0, limit).map((it) => {
      const post = it.post?.record?.text || "";
      const created = it.post?.record?.createdAt ? new Date(it.post.record.createdAt) : null;
      const ts = created ? created.toLocaleString() : "";

      return `
        <div class="post">
          <div>&gt; ${escapeHtml(post).replace(/\n/g,"<br>")}</div>
          <div class="meta">${ts}</div>
        </div>
      `;
    }).join("");

    el.innerHTML =
      `<div class="feed-title">LIVE FEED: @${handle}</div>` +
      (items || `<div class="meta">no posts yet</div>`) +
      `<a class="feed-out" href="${outUrl}" target="_blank" rel="noopener">&gt; OPEN_FEED (external)</a>`;
  } catch {
    el.innerHTML =
      `<div class="feed-title">LIVE FEED: @${handle}</div>` +
      `<div class="meta">feed unavailable</div>` +
      `<a class="feed-out" href="${outUrl}" target="_blank" rel="noopener">&gt; OPEN_FEED (external)</a>`;
  }
}

function escapeHtml(s=""){
  return s.replace(/[&<>"']/g, (c) => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  }[c]));
}

// ---- Optional: ASCII scaling (only if your CSS isn't enough) ----
function fitAsciiTitle(){
  if (!asciiTitle) return;

  const wrap = asciiTitle.parentElement;
  if (!wrap) return;

  // reset
  asciiTitle.style.transform = "scale(1)";
  asciiTitle.style.transformOrigin = "left top";

  const wrapW = wrap.clientWidth;
  const elW = asciiTitle.scrollWidth;

  const scale = (elW > 0) ? Math.min(1, wrapW / elW) : 1;
  asciiTitle.style.transform = `scale(${scale})`;

  // lock wrap height so scaling doesn't collapse the layout
  wrap.style.height = `${asciiTitle.scrollHeight * scale}px`;
}

window.addEventListener("resize", fitAsciiTitle);

// Start the boot
window.addEventListener("load", () => {
  // hide prompt until boot completes
  if (promptLine){
    promptLine.hidden = true;
    promptLine.setAttribute("aria-hidden", "true");
    promptLine.classList.remove("is-live");
  }

  fitAsciiTitle();
  bootTimer = setTimeout(typeNext, PACE.startDelay);
});
