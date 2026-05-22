/* ============= Brand wall data ============= */
document.documentElement.classList.add("js");

// 50+ representative brand names across categories. Replace at will.
const BRANDS = [
  ["Notion", "Linear", "Figma", "Slack", "Loom", "Vercel", "Stripe", "Airtable", "Webflow", "Cron", "Pitch", "Arc", "Raycast", "Granola", "Cursor"],
  ["Anthropic", "OpenAI", "Perplexity", "Mistral", "ElevenLabs", "Suno", "Glean", "Hex", "Decagon", "Sierra", "Harvey", "Codeium", "Replit", "Modal", "Lovable"],
  ["Runway", "Midjourney", "Krea", "Ideogram", "Pika", "Leonardo", "Hedra", "Topaz", "Synthesia", "Captions", "Descript", "Opus", "InVideo", "Submagic", "Veed"],
  ["HubSpot", "Apollo", "Customer.io", "Brevo", "Beehiiv", "Substack", "Mutiny", "Default", "Common Room", "Attio", "Lemlist", "Outreach", "Reachdesk", "Mailchimp", "Mailmodo"]
];

// Each tile: brand + the collaboration line shown on hover
function brandTiles(list) {
  return list.map(b => `
    <div class="logo-tile" tabindex="0">
      <div class="logo-tile__name">${b}</div>
      <div class="logo-tile__hover">[Collab type] &middot; [HEADLINE RESULT]</div>
    </div>
  `).join("");
}

function fillRow(id, brands) {
  const el = document.getElementById(id);
  if (!el) return;
  // duplicate the row so the marquee loops cleanly
  el.innerHTML = brandTiles(brands) + brandTiles(brands);
}

// Build three rows from the four lists
fillRow("wall-row-1", [...BRANDS[0], ...BRANDS[1].slice(0, 5)]);
fillRow("wall-row-2", [...BRANDS[2], ...BRANDS[3].slice(0, 5)]);
fillRow("wall-row-3", [...BRANDS[1].slice(5), ...BRANDS[3].slice(5), ...BRANDS[0].slice(0, 6)]);

/* ============= Entrance reveal ============= */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add("is-in"), i * 70);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* ============= Testimonials carousel ============= */
const track = document.getElementById("notes-track");
if (track) {
  const prev = document.getElementById("notes-prev");
  const next = document.getElementById("notes-next");
  const step = () => Math.min(track.clientWidth * 0.8, 420);
  prev && prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  next && next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
}

/* ============= Magnetic primary buttons ============= */
// Skip on touch devices — magnetic effect is cursor-only
if (!window.matchMedia("(pointer: coarse)").matches) {
  document.querySelectorAll(".btn--primary").forEach(btn => {
    let raf;
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

/* ============= Media kit download placeholder ============= */
document.querySelectorAll("#mediakit-dl").forEach(mk => {
  mk.addEventListener("click", (e) => {
    e.preventDefault();
    // toast
    const t = document.createElement("div");
    t.textContent = "Media kit · drop the PDF at /media-kit.pdf";
    Object.assign(t.style, {
      position: "fixed", bottom: "28px", left: "50%", transform: "translateX(-50%)",
      background: "#0F0D0B", color: "#F5EFE6", padding: "14px 20px",
      borderRadius: "999px", fontSize: "14px", fontWeight: "600", zIndex: "300",
      boxShadow: "0 12px 28px -10px rgba(0,0,0,0.4)"
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2400);
  });
});

/* ============= Tweaks panel ============= */
const SCRIPT_FONTS = {
  "Instrument Serif": "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap",
  "DM Serif Display": "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap",
  "Caveat": "https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap"
};
function loadFont(name) {
  if (!SCRIPT_FONTS[name]) return;
  const id = "font-" + name.replace(/\s+/g, "-");
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = SCRIPT_FONTS[name];
  document.head.appendChild(link);
}

const state = Object.assign({}, window.TWEAK_DEFAULTS || {}, {});
// Fallback in case the inline script attribute differs
try { Object.assign(state, TWEAK_DEFAULTS); } catch(e) {}

function applyTweaks() {
  const root = document.documentElement;
  root.style.setProperty("--orange", state.accent);
  // derive deeper variant for hover
  root.style.setProperty("--orange-deep", state.accent);
  // italic font
  loadFont(state.italic);
  root.style.setProperty("--italic",
    state.italic === "Caveat"
      ? "'Caveat', cursive"
      : `'${state.italic}', 'Iowan Old Style', Georgia, serif`);
  // stickers
  document.body.classList.toggle("no-stickers", state.stickers === "off");
  // bg
  if (state.bg === "paper") {
    root.style.setProperty("--cream", "oklch(0.985 0.005 80)");
    root.style.setProperty("--cream-2", "oklch(0.965 0.005 80)");
  } else {
    root.style.setProperty("--cream", "oklch(0.962 0.012 80)");
    root.style.setProperty("--cream-2", "oklch(0.94 0.012 80)");
  }
  // sync swatches/options
  document.querySelectorAll("#tw-accent button").forEach(b => b.classList.toggle("is-active", b.dataset.color === state.accent));
  document.querySelectorAll("#tw-italic button").forEach(b => b.classList.toggle("is-active", b.dataset.font === state.italic));
  document.querySelectorAll("#tw-stickers button").forEach(b => b.classList.toggle("is-active", b.dataset.val === state.stickers));
  document.querySelectorAll("#tw-bg button").forEach(b => b.classList.toggle("is-active", b.dataset.bg === state.bg));
}
function setTweak(patch) {
  Object.assign(state, patch);
  applyTweaks();
  try {
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: patch }, "*");
  } catch(e) {}
}
applyTweaks();

document.querySelectorAll("#tw-accent button").forEach(b => b.addEventListener("click", () => setTweak({ accent: b.dataset.color })));
document.querySelectorAll("#tw-italic button").forEach(b => b.addEventListener("click", () => setTweak({ italic: b.dataset.font })));
document.querySelectorAll("#tw-stickers button").forEach(b => b.addEventListener("click", () => setTweak({ stickers: b.dataset.val })));
document.querySelectorAll("#tw-bg button").forEach(b => b.addEventListener("click", () => setTweak({ bg: b.dataset.bg })));

const closeBtn = document.getElementById("tweaks-close");
closeBtn && closeBtn.addEventListener("click", () => {
  document.body.classList.remove("tweaks-on");
  try { window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch(e) {}
});

window.addEventListener("message", (e) => {
  const d = e.data || {};
  if (d.type === "__activate_edit_mode") document.body.classList.add("tweaks-on");
  if (d.type === "__deactivate_edit_mode") document.body.classList.remove("tweaks-on");
});
try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch(e) {}
