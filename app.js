/* ============= Brand wall data ============= */
document.documentElement.classList.add("js");

const BRAND_SVGS = {
  "Fiverr": `<svg class="logo-tile__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-.996-3.705h-.85c-.546 0-.84.41-.84 1.092v2.466h-1.61v-3.558h-.684c-.547 0-.84.41-.84 1.092v2.466h-1.61v-4.874h1.61v.74c.264-.574.626-.74 1.163-.74h1.972v.74c.264-.574.625-.74 1.162-.74h.527v1.316zm-6.786 1.501h-3.359c.088.546.43.858 1.006.858.43 0 .732-.175.83-.487l1.425.4c-.351.848-1.22 1.364-2.255 1.364-1.748 0-2.549-1.355-2.549-2.515 0-1.14.703-2.505 2.45-2.505 1.856 0 2.471 1.384 2.471 2.408 0 .224-.01.37-.02.477zm-1.562-.945c-.04-.42-.342-.81-.889-.81-.508 0-.81.225-.908.81h1.797zM7.508 15.44h1.416l1.767-4.874h-1.62l-.86 2.837-.878-2.837H5.72l1.787 4.874zm-6.6 0H2.51v-3.558h1.524v3.558h1.591v-4.874H2.51v-.302c0-.332.235-.536.606-.536h.918V8.412H2.85c-1.162 0-1.943.712-1.943 1.755v.4H0v1.316h.908v3.558z"/></svg>`,
  "Replit": `<svg class="logo-tile__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 1.5A1.5 1.5 0 0 1 3.5 0h7A1.5 1.5 0 0 1 12 1.5V8H3.5A1.5 1.5 0 0 1 2 6.5ZM12 8h8.5A1.5 1.5 0 0 1 22 9.5v5a1.5 1.5 0 0 1-1.5 1.5H12ZM2 17.5A1.5 1.5 0 0 1 3.5 16H12v6.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 2 22.5Z"/></svg>`,
  "Intercom": `<svg class="logo-tile__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.658 1.343 3 3 3h18c1.658 0 3-1.342 3-3V3c0-1.657-1.342-3-3-3zm-5.801 4.399c0-.44.36-.8.802-.8.44 0 .8.36.8.8v10.688c0 .442-.36.801-.8.801-.443 0-.802-.359-.802-.801V4.399zM11.2 3.994c0-.44.357-.799.8-.799s.8.359.8.799v11.602c0 .44-.357.8-.8.8s-.8-.36-.8-.8V3.994zm-4 .405c0-.44.359-.8.799-.8.443 0 .802.36.802.8v10.688c0 .442-.36.801-.802.801-.44 0-.799-.359-.799-.801V4.399zM3.199 6c0-.442.36-.8.802-.8.44 0 .799.358.799.8v7.195c0 .441-.359.8-.799.8-.443 0-.802-.36-.802-.8V6zM20.52 18.202c-.123.105-3.086 2.593-8.52 2.593-5.433 0-8.397-2.486-8.521-2.593-.335-.288-.375-.792-.086-1.128.285-.334.79-.375 1.125-.09.047.041 2.693 2.211 7.481 2.211 4.848 0 7.456-2.186 7.479-2.207.334-.289.839-.25 1.128.086.289.336.25.84-.086 1.128zm.281-5.007c0 .441-.36.8-.801.8-.441 0-.801-.36-.801-.8V6c0-.442.361-.8.801-.8.441 0 .801.357.801.8v7.195z"/></svg>`,
  "HubSpot": `<svg class="logo-tile__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z"/></svg>`,
  "Wondershare": `<svg class="logo-tile__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.216 17.814 7.704 9.368l.02-.02c.391.239.91.19 1.249-.147l3.041-3.016 7.241 7.184c.397.394.402 1.029.005 1.426l-3.044 3.019Zm-5.253-3.017-3.03 3.017L0 9.915l3.746-3.73 7.217 7.187a1.005 1.005 0 0 1 0 1.425ZM24 9.913l-3.725 3.727L16 9.367l.02-.021c.388.239.903.19 1.239-.146l3.014-3.015L24 9.913Z"/></svg>`,
  "Alibaba": `<svg class="logo-tile__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.391 16.22c-.963.044-.865-.459-.302-1.234 1.32-1.768 3.82-4.236 3.906-5.982.151-2.283-2.143-3.026-4.501-3.004-1.645.022-3.344.492-4.501.906C5 8.315 2.489 10.576.909 13.076-.768 15.554-.216 17.923 3.322 18c2.716-.109 4.48-.862 6.32-1.802.01 0-5.086 1.453-6.958.383l-.008-.002c-.193-.11-.404-.264-.457-.683-.012-.885 1.46-1.802 2.283-2.097v-1.533a5.374 5.374 0 0 0 1.955.366 5.378 5.378 0 0 0 3.472-1.265c.037.13.056.278.044.447h.371c.048-.394-.172-.706-.172-.706-.333-.529-.915-.52-.915-.52s.315.137.529.466a4.953 4.953 0 0 1-4.665.932l1.21-1.2-.336-.874c2.435-.852 4.48-1.507 7.812-2.085l-.746-.624.389-.24c2.01.568 3.325.985 3.253 2.051a2.672 2.672 0 0 1-.202.611c-.584 1.158-2.326 3.09-3.029 3.898-.465.535-.92 1.06-1.245 1.562-.335.503-.54.971-.551 1.42.043 3.504 10.334-1.64 12.324-3.003-2.943 1.266-6.113 2.489-9.609 2.718Z"/></svg>`,
  "Anthropic": `<svg class="logo-tile__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z"/></svg>`,
  "Figma": `<svg class="logo-tile__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z"/></svg>`,
  "Notion": `<svg class="logo-tile__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/></svg>`,
  "Linear": `<svg class="logo-tile__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z"/></svg>`,
  "Airtable": `<svg class="logo-tile__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.992 1.966c-.434 0-.87.086-1.28.257L1.779 5.917c-.503.208-.49.908.012 1.116l8.982 3.558a3.266 3.266 0 0 0 2.454 0l8.982-3.558c.503-.196.503-.908.012-1.116l-8.957-3.694a3.255 3.255 0 0 0-1.272-.257zM23.4 8.056a.589.589 0 0 0-.222.045l-10.012 3.877a.612.612 0 0 0-.38.564v8.896a.6.6 0 0 0 .821.552L23.62 18.1a.583.583 0 0 0 .38-.551V8.653a.6.6 0 0 0-.6-.596zM.676 8.095a.644.644 0 0 0-.48.19C.086 8.396 0 8.53 0 8.69v8.355c0 .442.515.737.908.54l6.27-3.006.307-.147 2.969-1.436c.466-.22.43-.908-.061-1.092L.883 8.138a.57.57 0 0 0-.207-.044z"/></svg>`,
  "Vercel": `<svg class="logo-tile__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12 1.608 12 20.784H0Z"/></svg>`,
  "Stripe": `<svg class="logo-tile__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/></svg>`,
  "Webflow": `<svg class="logo-tile__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m24 4.515-7.658 14.97H9.149l3.205-6.204h-.144C9.566 16.713 5.621 18.973 0 19.485v-6.118s3.596-.213 5.71-2.435H0V4.515h6.417v5.278l.144-.001 2.622-5.277h4.854v5.244h.144l2.72-5.244H24Z"/></svg>`
};

const ROW1 = ["Alibaba","Fiverr","Intercom","HubSpot","Replit","Figma","Notion","Anthropic","Wondershare","AdCreative AI","HeyGen","Luma AI","GoHighLevel","Creatify","InVideo AI"];
const ROW2 = ["Linear","Airtable","Vercel","Stripe","Webflow","LTX Studio","Gamma","Printful","Printify","Omnisend","QuillBot","Filmora","Spocket","Relume","Kickresume"];
const ROW3 = ["Auto DS","Blanka","ChatGPT","Dora","Emergent","Final Round","Higgsfield","HiPDF","InsMind","Jubilee","Kittl","Lindy AI","Meshy","MindGrasp","Minea","Natural Reader","Particl AI","Photio","SellerPic","Shakker","Supernormal","Use Style"];

function brandTile(name) {
  const svg = BRAND_SVGS[name];
  if (svg) {
    return `<div class="logo-tile" tabindex="0">${svg}<div class="logo-tile__name">${name}</div><div class="logo-tile__hover">Brand partnership</div></div>`;
  }
  return `<div class="logo-tile logo-tile--text" tabindex="0"><div class="logo-tile__name">${name}</div><div class="logo-tile__hover">Brand partnership</div></div>`;
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
