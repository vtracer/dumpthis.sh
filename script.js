// THE NARRATIVE SCRIPT (Melissa's Voice)
const textSequence = [
  "AUTHENTICATING USER: M.HOLLOWAY.EXT_34...",
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

let lineIndex = 0;

function typeLine() {
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
    outputDiv.parentElement.scrollTop = outputDiv.parentElement.scrollHeight;

    // Randomize typing speed for realism
    const typingSpeed = Math.random() * 50 + 30;

    lineIndex++;
    setTimeout(typeLine, typingSpeed);
  } else {
    // Reveal commands when done
    commandDiv.style.display = "block";
    outputDiv.parentElement.scrollTop = outputDiv.parentElement.scrollHeight;
  }
}

// Start the boot sequence
setTimeout(typeLine, 500);