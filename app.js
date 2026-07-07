/* ============= Brand wall data ============= */
document.documentElement.classList.add("js");

/* ---- Mobile nav toggle ---- */
const hamburger = document.querySelector('.nav__hamburger');
const navEl = document.querySelector('.nav');
if (hamburger && navEl) {
  hamburger.addEventListener('click', () => {
    const open = navEl.classList.toggle('nav--open');
    hamburger.setAttribute('aria-expanded', open);
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  document.querySelector('.nav__mobile')?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navEl.classList.remove('nav--open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
    });
  });
}

// PNG logos are already pre-rendered as white-on-transparent — skip the invert filter
const PRE_WHITE = new Set([
  "Higgsfield","LTX Studio","Use Style",
  "Supernormal","SellerPic","Relume","Photio","GoHighLevel","Blanka","Auto DS","Minea","Wondershare",
  "Fiverr","Replit","ChatGPT","Intercom","Wispr Flow"
]);

const BRAND_LOGOS = {
  "AdCreative AI": "logos/adcreative-ai.svg",
  "Alibaba":       "logos/alibabadotcom.svg",
  "Auto DS":       "logos/autods.png",
  "Blanka":        "logos/blanka.png",
  "ChatGPT":       "logos/chatgpt.png",
  "Creatify":      "logos/creatify.svg",
  "Emergent":      "logos/emergent.svg",
  "Final Round":   "logos/final-round.svg",
  "Fiverr":        "logos/fiverr.png",
  "Gamma":         "logos/gamma.svg",
  "GoHighLevel":   "logos/gohighlevel.png",
  "HeyGen":        "logos/heygen.svg",
  "Higgsfield":    "logos/Higgsfield.png",
  "InsMind":       "logos/insmind.svg",
  "Intercom":      "logos/intercom.png",
  "InVideo AI":    "logos/invideo-ai.svg",
  "Kickresume":    "logos/kickresume.svg",
  "Kittl":         "logos/kittl.svg",
  "Lindy AI":      "logos/lindy-ai.svg",
  "LTX Studio":    "logos/LTXstudio.png",
  "Luma AI":       "logos/luma-ai.svg",
  "Meshy":         "logos/meshy.svg",
  "MindGrasp":     "logos/mindgrasp.svg",
  "Minea":         "logos/minea.png",
  "Omnisend":      "logos/omnisend.svg",
  "Particl AI":    "logos/particl-ai.svg",
  "Photio":        "logos/photio.png",
  "Printful":      "logos/printful.svg",
  "Printify":      "logos/printify.svg",
  "Wispr Flow":    "logos/wispr-flow.png",
  "Relume":        "logos/relume.png",
  "Replit":        "logos/replit.png",
  "SellerPic":     "logos/sellerpic.png",
  "Spocket":       "logos/spocket.svg",
  "Supernormal":   "logos/supernormal.png",
  "Use Style":     "logos/Usestyle.png",
  "Wondershare":   "logos/wondershare.png",
};

// Instagram reel link per brand. Empty string = no link yet (non-clickable tile).
const BRAND_REELS = {
  "AdCreative AI": "https://www.instagram.com/reel/DNkiJJJxIdf/",
  "Alibaba":       "https://www.instagram.com/reel/DXoQ7cIjlPi/",
  "Auto DS":       "https://www.instagram.com/reel/C5vFrhdyvTV/",
  "Blanka":        "https://www.instagram.com/reel/C8oaAF_yxoT/",
  "ChatGPT":       "https://www.instagram.com/reel/DQJHqgoE4Qr/",
  "Creatify":      "https://www.instagram.com/reel/C8bmeaQyo0v/",
  "Emergent":      "https://www.instagram.com/reel/DWG4XpvE-ql/",
  "Final Round":   "https://www.instagram.com/reel/DGNIrkKzNSI/",
  "Fiverr":        "https://www.instagram.com/reel/DILaBOUT7qM/",
  "Gamma":         "https://www.instagram.com/reel/DFUbX2sz8VI/",
  "GoHighLevel":   "https://www.instagram.com/reel/DKtkjlhzdCR/",
  "HeyGen":        "https://www.instagram.com/reel/DWaz4qNDktQ/",
  "Higgsfield":    "https://www.instagram.com/reel/DQgkqFEE8gS/",
  "InsMind":       "https://www.instagram.com/reel/DDv-4VLTWL8/",
  "Intercom":      "https://www.instagram.com/reel/DUFjQN3E87l/",
  "InVideo AI":    "https://www.instagram.com/reel/DERolZPTYOP/",
  "Kickresume":    "https://www.instagram.com/reel/C96zDYtgenT/",
  "Kittl":         "https://www.instagram.com/reel/C7BYITPyZCk/",
  "Lindy AI":      "https://www.instagram.com/reel/DNAVtwusTie/",
  "LTX Studio":    "https://www.instagram.com/reel/DHsMcqdTPvc/",
  "Luma AI":       "https://www.instagram.com/reel/DGhsqRoTvkK/",
  "Meshy":         "https://www.instagram.com/reel/C6tAMOIyWI9/",
  "MindGrasp":     "https://www.instagram.com/reel/C9zJN-6g96H/",
  "Minea":         "",
  "Omnisend":      "https://www.instagram.com/reel/DFPanNAzEHM/",
  "Particl AI":    "https://www.instagram.com/reel/DKG4PRtzTaz/",
  "Photio":        "https://www.instagram.com/reel/DQ_EzMIE2jN/",
  "Printful":      "https://www.instagram.com/reel/DGFZbJVTdzC/",
  "Printify":      "https://www.instagram.com/reel/DEjfp8YTF36/",
  "Wispr Flow":    "https://www.instagram.com/reel/DYhlgtsTFiX/",
  "Relume":        "https://www.instagram.com/reel/DTH_ThNE1id/",
  "Replit":        "https://www.instagram.com/reel/DQOZBTYk3Kt/",
  "SellerPic":     "https://www.instagram.com/reel/DHQCvA7zQvV/",
  "Spocket":       "https://www.instagram.com/reel/C_xJPR9AvFZ/",
  "Supernormal":   "https://www.instagram.com/reel/DCQw7RRAKSy/",
  "Use Style":     "https://www.instagram.com/reel/C5X-qnnyBB0/",
  "Wondershare":   "https://www.instagram.com/reel/DEzJWqsTxkW/",
};

// 37 confirmed brands, split across 3 rows
const ROW1 = ["AdCreative AI","HeyGen","Luma AI","GoHighLevel","Creatify","InVideo AI","Intercom","Replit","Fiverr","Wondershare","Omnisend","Spocket","Printful"];
const ROW2 = ["Printify","Wispr Flow","LTX Studio","Gamma","Kickresume","Relume","Alibaba","Meshy","MindGrasp","Lindy AI","Kittl","Minea","SellerPic"];
const ROW3 = ["Supernormal","Auto DS","Blanka","ChatGPT","Emergent","Final Round","Higgsfield","InsMind","Particl AI","Photio","Use Style"];

function brandTile(name) {
  const src = BRAND_LOGOS[name];
  const reel = BRAND_REELS[name];
  const filterClass = src && PRE_WHITE.has(name) ? " logo-tile__icon--prewhite" : "";
  const inner = src
    ? `<img class="logo-tile__icon${filterClass}" src="${src}" alt="${name}" loading="lazy">`
    : `<div class="logo-tile__name">${name}</div>`;
  const baseClass = src ? "logo-tile" : "logo-tile logo-tile--text";
  if (reel) {
    return `<a class="${baseClass} logo-tile--linked" href="${reel}" target="_blank" rel="noopener" aria-label="${name} — watch the reel">${inner}<div class="logo-tile__hover">Watch the reel &rarr;</div></a>`;
  }
  return `<div class="${baseClass}">${inner}</div>`;
}

function fillRow(id, names) {
  const el = document.getElementById(id);
  if (!el) return;
  const tiles = names.map(brandTile).join("");
  el.innerHTML = tiles + tiles;
}

fillRow("wall-row-1", ROW1);
fillRow("wall-row-2", ROW2);
fillRow("wall-row-3", ROW3);

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
document.querySelectorAll(".mediakit-dl").forEach(mk => {
  mk.addEventListener("click", async (e) => {
    // Check if PDF exists; if not, show a friendly toast instead of a 404
    try {
      const res = await fetch("media-kit.pdf", { method: "HEAD" });
      if (res.ok) return; // let the browser handle the download normally
    } catch (_) { /* fall through to toast */ }
    e.preventDefault();
    const t = document.createElement("div");
    t.textContent = "Media kit coming soon — email kunwar@thecomjet.com to get it now";
    Object.assign(t.style, {
      position: "fixed", bottom: "28px", left: "50%", transform: "translateX(-50%)",
      background: "#0F0D0B", color: "#F5EFE6", padding: "14px 22px",
      borderRadius: "999px", fontSize: "14px", fontWeight: "600", zIndex: "300",
      boxShadow: "0 12px 28px -10px rgba(0,0,0,0.4)",
      maxWidth: "calc(100vw - 40px)", textAlign: "center"
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
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
