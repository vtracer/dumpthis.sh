const OWNER = "vtracer";
const REPO = "dumpthis.sh";
const BRANCH = "main";

async function listLogs() {
  try {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/dump?ref=${BRANCH}`;
    const res = await fetch(url, {
      headers: {
        "Accept": "application/vnd.github.v3+json"
      },
      cache: "no-store"
    });
    if (!res.ok) {
      let detail = "";
      try { detail = (await res.json()).message || ""; } catch {}
      throw new Error(`GitHub API error ${res.status} ${detail}`);
    }
    const body = await res.json();
    if (!Array.isArray(body)) throw new Error("Unexpected API shape");
    return body
      .filter(it => it.type === "file")
      .map(it => ({ name: it.name, url: it.download_url || "" }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

function print(line = "") {
  const p = document.createElement("div");
  p.textContent = line;
  terminal.appendChild(p);
  terminal.scrollTop = terminal.scrollHeight;
}

function maybeCorrupt(line) {
  if (Math.random() < 0.2) return "[[CORRUPT BLOCK]] ▒▒▒▒▒▒▒▒▒";
  return line;
}

async function handleCommand(cmd) {
  const parts = cmd.trim().split(/\s+/);
  const base = (parts[0] || "").toLowerCase();

  print("nlt> " + cmd);

  if (base === "dir" || base === "ls") {
    const files = await listLogs();
    if (files.length === 0) {
      print("<error: cannot access server log>");
    } else {
      files.forEach(f => print(" " + maybeCorrupt(f.name)));
    }
  } else if (base === "open" && parts[1]) {
    const target = parts[1];
    const files = await listLogs();
    const match = files.find(f => f.name === target);

    if (!match) {
      print(`<error: file not found: ${target}>`);
      return;
    }

    print(`Opening ${match.name}...`);
    const href = match.url || (`dump/${match.name}`);
    window.open(href, "_blank", "noopener,noreferrer");
  } else if (base === "help") {
    print("Available commands:");
    print("  dir         - list available logs");
    print("  open <file> - open a log file");
    print("  help        - show this help");
    print("  clear       - clear screen");
  } else if (base === "clear") {
    terminal.innerHTML = "";
  } else if (base) {
    print("Unknown command. Type 'help'.");
  }
}

commandInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const cmd = commandInput.value;
    commandInput.value = "";
    if (cmd.trim()) await handleCommand(cmd);
  }
});
print("Welcome to New Life Technologies' central database! Please type 'help' for a list of commands.");