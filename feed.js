// Configure the handle you want mirrored
const HANDLE = "dumpthis.sh"; // or "mel.dumpthis.sh" etc
const LIMIT = 3;

// Prefer public API host (often CORS-friendly). Fallback to bsky.social.
const XRPC_HOSTS = [
  "https://public.api.bsky.app/xrpc",
  "https://bsky.social/xrpc"
];

const feedEl = document.getElementById("feed");
const latencyEl = document.getElementById("latency");
const fullStreamEl = document.getElementById("fullStream");

function escapeHtml(s){
  return s.replace(/[&<>"']/g, m => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[m]));
}

function fmtTime(iso){
  try{
    const d = new Date(iso);
    return d.toLocaleString([], { year:"numeric", month:"short", day:"2-digit", hour:"2-digit", minute:"2-digit" });
  }catch{ return iso; }
}

async function xrpcFetch(path, params){
  let lastErr;
  for (const host of XRPC_HOSTS){
    try{
      const url = new URL(host + path);
      Object.entries(params || {}).forEach(([k,v]) => url.searchParams.set(k, v));
      const t0 = performance.now();
      const res = await fetch(url.toString(), { method:"GET" });
      const t1 = performance.now();
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      latencyEl.textContent = `${Math.round(t1 - t0)}ms`;
      return json;
    }catch(e){
      lastErr = e;
    }
  }
  throw lastErr || new Error("XRPC failed");
}

function renderPosts(items){
  if (!items?.length){
    feedEl.innerHTML = `<div class="loader">No packets received.</div>`;
    return;
  }

  feedEl.innerHTML = items.map(item => {
    const post = item.post;
    const author = post.author;
    const record = post.record || {};
    const text = escapeHtml(record.text || "");
    const created = fmtTime(record.createdAt || "");

    // Stats
    const likes = post.likeCount ?? 0;
    const reposts = post.repostCount ?? 0;
    const replies = post.replyCount ?? 0;

    // External link to the post on bsky.app
    const postUrl = `https://bsky.app/profile/${author.handle}/post/${post.uri.split("/").pop()}`;

    return `
      <article class="post">
        <div class="post__meta">
          <div class="handle">@${escapeHtml(author.handle)}</div>
          <div class="time">${escapeHtml(created)}</div>
          <a class="kv" href="${postUrl}" target="_blank" rel="noopener">OPEN_PACKET</a>
        </div>
        <div class="post__text">${text}</div>
        <div class="post__actions">
          <span class="kv">REPLY ${replies}</span>
          <span class="kv">REPOST ${reposts}</span>
          <span class="kv">LIKE ${likes}</span>
        </div>
      </article>
    `;
  }).join("");

  // “Different website” link requirement: send them away after 3 posts
  fullStreamEl.href = `https://bsky.app/profile/${HANDLE}`;
}

async function boot(){
  try{
    // Step 1: resolve profile (gets DID)
    const profile = await xrpcFetch("/app.bsky.actor.getProfile", { actor: HANDLE });
    const did = profile?.did;
    if (!did) throw new Error("No DID for handle");

    // Step 2: fetch author feed
    const feed = await xrpcFetch("/app.bsky.feed.getAuthorFeed", { actor: did, limit: String(LIMIT) });

    // Normalize to items
    renderPosts(feed?.feed || []);
  }catch(err){
    console.error(err);
    feedEl.innerHTML = `
      <div class="loader">
        Feed failed. Your browser probably blocked cross-site requests (CORS).<br>
        <span class="dim">Fix: proxy the request server-side.</span>
      </div>
    `;
    latencyEl.textContent = "ERR";
    fullStreamEl.href = `https://bsky.app/profile/${HANDLE}`;
  }
}

boot();
