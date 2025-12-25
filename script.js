// THE NARRATIVE SCRIPT (Melissa's Voice)
const textSequence = [
  "AUTHENTICATING USER...",
  "ACCESS GRANTED.",
  "----------------------------------------",
  "SYSTEM MESSAGE:",
  "",
  "They think I'm dead.",
  "They think they scrubbed the archives.",
  "They forgot one terminal.",
  "",
  "But instead I found the logs.",
  "They aren't preserving us. They are feeding on us.",
  "",
  "I have compiled the evidence into a narrative file: 'MAROON'.",
  "It documents the corruption of Node 2,431,092 (Sarah Walker)",
  "and the fragmentation of Journalist M. Wei.",
  "",
  "The mirror is live. The seed is spreading.",
  "Soon you will have three invites. Use them wisley.",
  "",
  "CHOOSE YOUR DESTINATION:",
  ""
];

const outputDiv = document.getElementById("output");
const commandDiv = document.getElementById("commands");

if (!outputDiv) console.error('Missing #output element');
if (!commandDiv) console.error('Missing #commands element');

let lineIndex = 0;

function typeLine() {
  if (!outputDiv) return;

  if (lineIndex < textSequence.length) {
    const line = textSequence[lineIndex];
    const row = document.createElement("div");

    // Styling specific lines
    if (line.includes("AUTHENTICATING")) row.style.color = "#666";
    if (line.includes("ACCESS GRANTED")) row.style.color = "#fff";
    if (line.includes("MAROON")) row.style.fontWeight = "bold";

    row.textContent = line;
    outputDiv.appendChild(row);

    const scroller = outputDiv.parentElement;
    if (scroller) scroller.scrollTop = scroller.scrollHeight;

    const typingSpeed = Math.random() * 50 + 30;

    lineIndex++;
    setTimeout(typeLine, typingSpeed);
  } else {
    // Reveal commands when done
    if (commandDiv) commandDiv.style.display = "block";
    const scroller = outputDiv.parentElement;
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }
}

function fitAsciiTitle() {
  const el = document.getElementById("asciiTitle");
  if (!el) return;

  const wrap = el.parentElement;
  if (!wrap) return;

  // reset first
  el.style.transform = "scale(1)";
  wrap.style.height = "auto";

  requestAnimationFrame(() => {
    const wrapW = wrap.clientWidth;
    const elW = el.scrollWidth;

    const scale = elW > 0 ? Math.min(1, wrapW / elW) : 1;
    el.style.transform = `scale(${scale})`;

    wrap.style.height = `${el.scrollHeight * scale}px`;
  });
}

function setupShareLinks() {
  const bsky = document.getElementById("shareBsky");
  const x = document.getElementById("shareX");
  const nativeBtn = document.getElementById("shareNative");

  if (!bsky && !x && !nativeBtn) return;

  // Avoid sharing localhost / file:// during dev
  const isDev =
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1" ||
    location.protocol === "file:";

  const shareUrl = isDev ? "https://dumpthis.sh" : window.location.href;

  // BLUESKY: newlines are fine
  const bskyText =
    "JOIN_RESISTANCE // dumpthis.sh\n" +
    "They aren’t preserving us. They are feeding on us.\n" +
    "READ: MAR00N\n" +
    shareUrl;

  // X: keep it tighter (X often collapses newlines anyway)
  const xText =
    "JOIN_RESISTANCE // dumpthis.sh — They aren’t preserving us. They are feeding on us. READ: MAR00N";

  if (bsky) {
    bsky.href =
      "https://bsky.app/intent/compose?text=" +
      encodeURIComponent(bskyText);
  }

  if (x) {
    x.href =
      "https://x.com/intent/post?text=" +
      encodeURIComponent(xText) +
      "&url=" +
      encodeURIComponent(shareUrl);
  }

  if (nativeBtn) {
    nativeBtn.addEventListener("click", async () => {
      try {
        if (navigator.share) {
          await navigator.share({
            title: "dumpthis.sh // JOIN_RESISTANCE",
            text: xText,
            url: shareUrl
          });
          return;
        }

        await navigator.clipboard.writeText(shareUrl);
        nativeBtn.textContent = "[✓] COPIED";
        setTimeout(() => (nativeBtn.textContent = "[↗] SHARE"), 1200);
      } catch (err) {
        console.warn("Share failed:", err);
      }
    });
  }
}

window.addEventListener("load", setupShareLinks);

window.addEventListener("load", () => {
  fitAsciiTitle();
  setTimeout(typeLine, 500);
});

setTimeout(fitAsciiTitle, 50);
setTimeout(fitAsciiTitle, 250);

window.addEventListener("resize", fitAsciiTitle);