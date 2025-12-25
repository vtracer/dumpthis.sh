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

    // Keep the "terminal" scrolled to the bottom as it types
    const scroller = outputDiv.parentElement;
    if (scroller) scroller.scrollTop = scroller.scrollHeight;

    // Randomize typing speed for realism
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

  // reset
  el.style.transform = "scale(1)";

  // compute scale needed to fit width
  const wrapW = wrap.clientWidth;
  const elW = el.scrollWidth;

  const scale = (elW > 0) ? Math.min(1, wrapW / elW) : 1;
  el.style.transform = `scale(${scale})`;

  // lock wrap height so scaling doesn't collapse the layout
  wrap.style.height = `${el.scrollHeight * scale}px`;
}

window.addEventListener("load", () => {
  fitAsciiTitle();
  setTimeout(typeLine, 500);
});
window.addEventListener("resize", fitAsciiTitle);