/* Second Wind Laptop Care: shared script for every page.
   Prices, services and contact details all live in the "Edit these" section below. */

/* ================= Edit these to update the site ================= */

const CONTACT = {
  phone: "(734) 508-2592",
  email: "swcomputercare@gmail.com",
  wechat: "RiseeH_",
  bookingUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc4OVGgXgs89s4YhvGZPiA2_UBAmck2INqif2CLU_XA8pLO5Q/viewform"
};

/* AI device check (Cloudflare Worker in the worker/ folder). Leave "" to use only keyword matching. */
const AI_ENDPOINT = "https://second-wind.swcomputercare.workers.dev";

/* Google Form question IDs, used to pre-fill the form from the quote builder. */
const FORM_FIELDS = {
  lang: "entry.1667330427",
  device: "entry.656071590",
  model: "entry.812607673",
  services: "entry.127244798",
  compound: "entry.2080357581",
  parts: "entry.1953452545",
  handoff: "entry.1956564436"
};

/* Device types. Prices below are set per type. */
const TIERS = [
  { id: "std", en: "Standard laptop", zh: "普通笔记本",
    dEn: "Everyday, school and work laptops. Quick to open, usually one fan.",
    dZh: "日常、学习和办公笔记本，拆装简单，一般单风扇。",
    ex: "Dell Inspiron · HP Pavilion · Lenovo IdeaPad / ThinkPad · Acer Aspire · ASUS VivoBook" },
  { id: "gam", en: "Gaming laptop", zh: "游戏本",
    dEn: "Two fans, more heatpipes and more screws. Collects more dust.",
    dZh: "双风扇、热管和螺丝更多，积灰也更多。",
    ex: "Lenovo Legion / LOQ · ASUS ROG Strix / TUF · Acer Nitro / Predator · HP Omen / Victus · MSI · Dell G15" },
  { id: "pre", en: "High-end or hard to open", zh: "高端 / 难拆机型",
    dEn: "Tight builds, glued parts or factory liquid metal. Takes extra time and care.",
    dZh: "结构紧凑、部分部件粘胶或出厂液金，需要更多时间和细心。",
    ex: "Alienware m16 / x-series · Razer Blade · ROG Zephyrus / Scar · MSI Stealth / Raider / Titan · Dell XPS · Surface" },
  { id: "pc", en: "Desktop PC", zh: "台式机",
    dEn: "Towers and custom builds. Easy to open, but no battery or screen work.",
    dZh: "台式主机和组装机，拆装方便，不涉及电池和屏幕。",
    ex: "Custom builds · Prebuilt gaming PCs · Office towers" }
];

const TIER_NOTES = {
  pre: { en: "Some high-end models ship with liquid metal instead of thermal paste. I open and check those first, and confirm the price before starting.",
         zh: "部分高端机型出厂使用液金而不是硅脂。这类机器我会先拆开检查，开工前再确认价格。" },
  pc:  { en: "Desktop prices cover standard tower cases. Small-form-factor and custom water-cooled builds are quoted first.",
         zh: "台式机价格适用于标准机箱。ITX 小机箱和分体水冷需要先报价。" }
};

const GROUPS = [
  { id: "cool",  en: "Cleaning & cooling", zh: "清灰散热" },
  { id: "up",    en: "Upgrades",           zh: "升级" },
  { id: "parts", en: "Part replacement",   zh: "更换配件" },
  { id: "soft",  en: "Software",           zh: "系统软件" }
];

/* Labor price in USD for each device type: std / gam / pre / pc. null = not offered for that type.
   parts: true adds "+ parts". thermal: true means the customer picks a thermal compound. */
const SERVICES = [
  { id: "clean", g: "cool", parts: false, thermal: true, p: { std: 50, gam: 80, pre: 100, pc: 60 },
    en: "Deep clean + new thermal compound", zh: "深度清灰 + 更换导热材料",
    nEn: "Fans, heatsinks and vents, plus the thermal compound you choose. Includes a before-and-after temp test.",
    nZh: "清理风扇、散热片和出风口，导热材料可自选，附前后温度测试。" },
  { id: "gpu", g: "cool", parts: false, thermal: true, p: { std: null, gam: null, pre: null, pc: 60 },
    en: "GPU deep clean + repaste", zh: "显卡清灰 + 换硅脂",
    nEn: "Graphics card fans and heatsink, plus the thermal compound you choose. New thermal pads at cost if needed.",
    nZh: "清理显卡风扇和散热器，导热材料可自选；如需更换导热垫按成本另计。" },
  { id: "fan", g: "cool", parts: true, p: { std: 35, gam: 45, pre: 60, pc: 25 },
    en: "Fan replacement", zh: "更换风扇",
    nEn: "For grinding, rattling or dead fans.", nZh: "风扇异响、摩擦或不转。" },
  { id: "ram", g: "up", parts: true, p: { std: 25, gam: 30, pre: 40, pc: 20 },
    en: "RAM or SSD install", zh: "加内存 / 装固态",
    nEn: "Free recommendation for your model and budget. Bring your own part, or I'll buy it for you.",
    nZh: "免费按你的机型和预算推荐。可以自带配件，也可以我帮你买。" },
  { id: "clone", g: "up", parts: true, p: { std: 45, gam: 50, pre: 60, pc: 40 },
    en: "SSD upgrade with full clone", zh: "换固态 + 完整迁移",
    nEn: "Keeps all your files, apps and settings. Free SSD recommendation included.",
    nZh: "系统、软件和资料原样保留，含免费固态推荐。" },
  { id: "wifi", g: "up", parts: true, p: { std: 25, gam: 30, pre: 45, pc: 20 },
    en: "Wi-Fi card upgrade", zh: "升级无线网卡",
    nEn: "I check compatibility with your model first.", nZh: "先确认和你的机型兼容。" },
  { id: "build", g: "up", parts: false, p: { std: null, gam: null, pre: null, pc: 120 },
    en: "PC build from your parts", zh: "代装机（自备配件）",
    nEn: "Assembly, cable management, BIOS setup and a stress test.", nZh: "组装、理线、BIOS 设置和稳定性测试。" },
  { id: "battery", g: "parts", parts: true, p: { std: 35, gam: 45, pre: 60, pc: null },
    en: "Battery replacement", zh: "更换电池",
    nEn: "OEM or reputable brands only.", nZh: "只用原厂或可靠品牌。" },
  { id: "screen", g: "parts", parts: true, p: { std: 55, gam: 65, pre: 85, pc: null },
    en: "Screen replacement", zh: "更换屏幕",
    nEn: "Matched to your exact panel part number.", nZh: "按原屏型号精确匹配。" },
  { id: "keyboard", g: "parts", parts: true, p: { std: 45, gam: 60, pre: 80, pc: null },
    en: "Keyboard replacement", zh: "更换键盘",
    nEn: "Quoted first if it's built into the top cover.", nZh: "如果键盘和 C 壳一体，先单独报价。" },
  { id: "speaker", g: "parts", parts: true, p: { std: 35, gam: 45, pre: 60, pc: null },
    en: "Speaker replacement", zh: "更换喇叭",
    nEn: "For crackling, distorted or silent speakers.", nZh: "喇叭破音、杂音或没声音。" },
  { id: "port", g: "parts", parts: true, p: { std: 45, gam: 55, pre: 70, pc: null },
    en: "Charging port", zh: "更换充电口",
    nEn: "Cable and daughterboard types.", nZh: "排线式或小板式充电口。" },
  { id: "windows", g: "soft", parts: false, p: { std: 50, gam: 50, pre: 50, pc: 50 },
    en: "Windows reinstall / tune-up", zh: "重装系统 / 优化",
    nEn: "Back up your files first.", nZh: "请先备份资料。" },
  { id: "malware", g: "soft", parts: false, p: { std: 50, gam: 50, pre: 50, pc: 50 },
    en: "Malware removal", zh: "清除病毒",
    nEn: "Scan, cleanup and security settings.", nZh: "扫描、清理并设置安全防护。" }
];

/* Thermal compound choices for cleaning services. add = extra USD per cleaning service; null = decided later. */
const COMPOUNDS = [
  { id: "std", add: 0, en: "Standard paste", zh: "标准硅脂", product: "Arctic MX-4",
    form: "Standard paste (Arctic MX-4) / 标准硅脂",
    nEn: "Dependable everyday paste. Fine for most laptops and desktops.",
    nZh: "可靠的日常硅脂，适合大多数笔记本和台式机。" },
  { id: "prem", add: 10, en: "Premium paste", zh: "高端硅脂", product: "Thermal Grizzly Kryonaut",
    form: "Premium paste (Thermal Grizzly Kryonaut) / 高端硅脂",
    nEn: "Top-tier paste that can run slightly cooler under heavy load.",
    nZh: "顶级硅脂，高负载下温度可能更低一些。" },
  { id: "ptm", add: 20, en: "Phase-change pad", zh: "相变片", product: "Honeywell PTM7950",
    form: "Phase-change pad (Honeywell PTM7950) / 相变片",
    nEn: "Lasts much longer than paste on hot laptop chips because it doesn't dry out or pump out. Best for gaming laptops.",
    nZh: "在高温笔记本芯片上比硅脂耐用得多，不会干掉或被挤出，最适合游戏本。" },
  { id: "rec", add: null, en: "Not sure", zh: "不确定", product: "",
    form: "Not sure: recommend one for me / 不确定，帮我推荐",
    nEn: "I'll recommend one for your computer and confirm the price before starting.",
    nZh: "我会根据你的电脑推荐，并在开工前确认价格。" }
];

/* Who supplies parts for services marked parts: true. */
const PARTS = [
  { v: "buy", en: "Please buy the parts for me", zh: "请帮我购买配件",
    nEn: "I recommend parts that fit your computer and budget, then buy them at cost after a deposit.",
    nZh: "我推荐适合你电脑和预算的配件，付定金后按成本价购买。" },
  { v: "own", en: "I'll bring my own parts", zh: "我自备配件",
    nEn: "Ask me before you buy, and I'll confirm what fits your model.",
    nZh: "购买前可以先问我，我帮你确认是否兼容。" }
];

const HANDOFF = [
  { v: "pickup", en: "Pickup and drop-off", zh: "上门取送" },
  { v: "campus", en: "Meet on campus", zh: "校园见面" }
];

/* Model checker keywords. The first match wins, so order matters
   (Apple, then desktops, then hard-to-open models, then gaming, then standard). */
const MATCH = [
  { tier: "mac", words: ["macbook", "imac", "mac mini", "mac studio", "apple", "苹果"] },
  { tier: "pc",  words: ["desktop", "tower", "custom pc", "pc build", "prebuilt", "pre-built", "optiplex", "aurora r10", "aurora r11",
                         "aurora r12", "aurora r13", "aurora r14", "aurora r15", "aurora r16",
                         "ibuypower", "cyberpowerpc", "cyberpower", "nzxt", "skytech", "omen 45l", "omen 40l", "omen 35l",
                         "omen 25l", "legion tower", "台式", "主机", "组装机"] },
  { tier: "pre", words: ["alienware x14", "alienware x15", "alienware x16", "alienware x17", "alienware m16",
                         "alienware m18", "razer", "blade", "zephyrus", "scar", "rog flow", "flow x13", "flow z13", "titan",
                         "raider", "stealth", "legion 9", "legion 9i", "xps", "surface", "spectre", "雷蛇", "枪神"] },
  { tier: "std", words: ["msi modern", "msi prestige", "msi venture"] },
  { tier: "gam", words: ["alienware", "外星人", "legion", "loq", "rog", "strix", "tuf", "nitro", "predator", "helios", "omen", "victus", "msi",
                         "katana", "sword", "cyborg", "pulse", "crosshair", "vector", "gf63", "aorus", "g15", "g16", "gaming",
                         "拯救者", "天选", "暗影精灵", "光影精灵", "机械革命", "雷神", "掠夺者", "游戏本"] },
  { tier: "std", words: ["inspiron", "latitude", "vostro", "ideapad", "thinkpad", "thinkbook", "yoga", "pavilion", "envy",
                         "elitebook", "probook", "aspire", "swift", "vivobook", "zenbook", "expertbook", "chromebook",
                         "galaxy book", "gram", "matebook", "redmibook", "dell", "hp", "lenovo", "acer", "asus", "samsung",
                         "toshiba", "dynabook", "huawei", "xiaomi", "小新", "华为", "小米", "联想", "戴尔", "惠普", "华硕", "宏碁"] }
];

/* ================================================================= */

const root = document.documentElement;
const $ = id => document.getElementById(id);
const both = (en, zh) => `<span class="en">${en}</span><span class="zh">${zh}</span>`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const tierById = id => TIERS.find(t => t.id === id) || TIERS[0];
const compoundById = id => COMPOUNDS.find(c => c.id === id) || COMPOUNDS[0];
const money = n => "$" + n;

/* Choices carry across pages (stored only in this browser). */
const saved = (() => { try { return JSON.parse(localStorage.getItem("sw-state")) || {}; } catch (e) { return {}; } })();
const state = {
  lang: saved.lang === "zh" ? "zh" : "en",
  tier: TIERS.some(t => t.id === saved.tier) ? saved.tier : "std",
  model: typeof saved.model === "string" ? saved.model : "",
  picked: new Set(Array.isArray(saved.picked) ? saved.picked : ["clean"]),
  compound: COMPOUNDS.some(c => c.id === saved.compound) ? saved.compound : "std",
  parts: PARTS.some(p => p.v === saved.parts) ? saved.parts : "buy",
  handoff: HANDOFF.some(h => h.v === saved.handoff) ? saved.handoff : "pickup"
};
function save() {
  try {
    localStorage.setItem("sw-state", JSON.stringify({ ...state, picked: [...state.picked] }));
  } catch (e) {}
}
const tr = o => (state.lang === "zh" ? o.zh : o.en);
const priceOf = (s, tier = state.tier) => s.p[tier];

/* ---------- header ---------- */
function markNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll(".nav a").forEach(a => {
    if (a.dataset.page === page) a.setAttribute("aria-current", "page");
  });
}

/* ---------- "from $X" labels on the home page ---------- */
function renderFrom() {
  document.querySelectorAll("[data-from]").forEach(el => {
    const ids = el.dataset.from.split(",");
    const prices = SERVICES.filter(s => ids.includes(s.id)).flatMap(s => Object.values(s.p)).filter(v => v != null);
    if (prices.length) el.innerHTML = both("From " + money(Math.min(...prices)), money(Math.min(...prices)) + " 起");
  });
}

/* ---------- device types ---------- */
function renderTiers() {
  const list = $("tierList");
  if (!list) return;
  const clean = SERVICES.find(s => s.id === "clean");
  list.insertAdjacentHTML("beforeend", TIERS.map(t => `
    <label class="tier" for="tier-${t.id}">
      <span class="tier-top"><input type="radio" name="tier" id="tier-${t.id}" value="${t.id}"><strong>${both(t.en, t.zh)}</strong></span>
      <p>${both(t.dEn, t.dZh)}</p>
      <p class="ex">${t.ex}</p>
      <p class="from">${both("Deep clean: " + money(clean.p[t.id]), "深度清灰：" + money(clean.p[t.id]))}</p>
    </label>`).join(""));
  list.addEventListener("change", e => { if (e.target.name === "tier") setTier(e.target.value); });
}

function setTier(id) {
  if (!TIERS.some(t => t.id === id)) return;
  state.tier = id;
  const radio = $("tier-" + id);
  if (radio) radio.checked = true;
  if ($("qTier")) $("qTier").value = id;
  renderServices();
  renderCompare();
  renderQuoteList();
  updateQuote();
  save();
}

/* ---------- model checker ---------- */
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function detect(text) {
  const t = text.toLowerCase().trim();
  if (!t) return null;
  for (const rule of MATCH) {
    for (const w of rule.words) {
      const ascii = /^[\x00-\x7f]+$/.test(w);
      const hit = ascii
        ? new RegExp("(^|[^a-z0-9])" + reEsc(w) + "($|[^a-z0-9])").test(t)
        : t.includes(w);
      if (hit) return { tier: rule.tier, word: w };
    }
  }
  return { tier: null };
}

const aiHint = () => AI_ENDPOINT
  ? `<small>${both("For your exact model and generation, tap <b>Check with AI</b>.", "想按具体型号和代数判断，请点 <b>AI 识别</b>。")}</small>`
  : "";

function onModel(value) {
  state.model = value;
  const out = $("devResult");
  const r = detect(value);
  if (out) {
    if (!r) {
      out.className = "dev-result";
      out.innerHTML = "";
    } else if (r.tier === "mac") {
      out.className = "dev-result no";
      out.innerHTML = both("MacBooks and other Apple computers aren't serviced yet.", "暂时不维修 MacBook 等苹果电脑。");
    } else if (r.tier) {
      const t = tierById(r.tier);
      out.className = "dev-result hit";
      out.innerHTML = both(
        `Quick match: <strong>${t.en.toLowerCase()}</strong> (matched “${esc(r.word)}”). Prices are updated.`,
        `快速识别：<strong>${t.zh}</strong>（匹配“${esc(r.word)}”），价格已更新。`) + aiHint();
    } else {
      out.className = "dev-result miss";
      out.innerHTML = both(
        "Couldn't tell from that. Pick the closest type, or text me the model and I'll check.",
        "没能识别这个型号。请选择最接近的类型，或者把型号发给我确认。") + aiHint();
    }
  }
  if (r && r.tier && r.tier !== "mac") setTier(r.tier);
  else { updateQuote(); save(); }
}

async function aiCheck() {
  const text = $("devModel").value.trim();
  const out = $("devResult");
  if (!AI_ENDPOINT) return;
  if (text.length < 2) {
    out.className = "dev-result miss";
    out.innerHTML = both("Type your brand and model first.", "请先输入品牌和型号。");
    return;
  }
  const btn = $("aiBtn");
  btn.disabled = true;
  out.className = "dev-result miss";
  out.innerHTML = both("Checking your model…", "正在识别型号…");
  try {
    const res = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: text })
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 429) {
      out.className = "dev-result no";
      out.innerHTML = both(
        "You've used your AI checks for today. Pick the closest type, or text me the model.",
        "今天的 AI 识别次数已用完。请选择最接近的类型，或者把型号发给我。");
    } else if (!res.ok || !data.tier) {
      throw new Error(data.error || res.status);
    } else {
      showAI(data);
    }
  } catch (e) {
    out.className = "dev-result miss";
    out.innerHTML = both(
      "The AI check isn't available right now. Pick the closest type, or text me the model.",
      "AI 识别暂时不可用。请选择最接近的类型，或者把型号发给我。");
  } finally {
    btn.disabled = false;
  }
}

function showAI(d) {
  const out = $("devResult");
  const n = d.remaining;
  const left = typeof n === "number"
    ? `<small>${both(`${n} AI check${n === 1 ? "" : "s"} left today.`, `今天还剩 ${n} 次 AI 识别。`)}</small>`
    : "";
  if (d.tier === "mac") {
    out.className = "dev-result no";
    out.innerHTML = both("MacBooks and other Apple computers aren't serviced yet.", "暂时不维修 MacBook 等苹果电脑。") + left;
    return;
  }
  if (d.tier === "unknown") {
    out.className = "dev-result miss";
    out.innerHTML = both("The AI couldn't tell what that is. Pick the closest type, or text me the model.",
      "AI 没能识别。请选择最接近的类型，或者把型号发给我。") + left;
    return;
  }
  setTier(d.tier);
  const t = tierById(d.tier);
  const low = d.confidence === "low";
  const name = d.name ? esc(d.name) : "";
  out.className = "dev-result hit";
  out.innerHTML = both(
    `AI check: <strong>${t.en}</strong>${name ? ` (${name})` : ""}. ${esc(d.reason_en)}${low ? " It isn't fully sure, so please double-check the type." : ""}`,
    `AI 识别：<strong>${t.zh}</strong>${name ? `（${name}）` : ""}。${esc(d.reason_zh)}${low ? "AI 不完全确定，请再确认一下类型。" : ""}`) + left;
}

function initFinder() {
  const input = $("devModel");
  if (!input) return;
  input.value = state.model;
  input.addEventListener("input", e => onModel(e.target.value));
  if (AI_ENDPOINT && $("aiBtn")) {
    $("aiBtn").hidden = false;
    $("aiBtn").addEventListener("click", aiCheck);
    input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); aiCheck(); } });
  }
}

/* ---------- price list ---------- */
function priceHTML(s) {
  return money(priceOf(s)) + (s.parts ? `<small>${both("+ parts", "+ 配件")}</small>` : "");
}

function renderServices() {
  const groups = $("svcGroups");
  if (!groups) return;
  groups.innerHTML = GROUPS.map(g => {
    const list = SERVICES.filter(s => s.g === g.id && priceOf(s) != null);
    if (!list.length) return "";
    return `
    <div class="svc-group">
      <h3>${both(g.en, g.zh)}</h3>
      ${list.map(s => `
        <div class="svc">
          <span class="svc-name">${both(s.en, s.zh)}</span>
          <span class="svc-price">${priceHTML(s)}</span>
          <span class="svc-note">${both(s.nEn, s.nZh)}</span>
        </div>`).join("")}
    </div>`;
  }).join("");
  const t = tierById(state.tier);
  if ($("tierNow")) $("tierNow").innerHTML = both(t.en, t.zh);
  const note = TIER_NOTES[state.tier];
  if ($("tierNote")) $("tierNote").innerHTML = note ? both(note.en, note.zh) : "";
}

function addLabel(c) {
  if (c.add == null) return both("Quoted", "另行报价");
  return c.add === 0 ? both("Included", "已含") : "+" + money(c.add);
}

function renderCompounds() {
  const list = $("compoundList");
  if (!list) return;
  list.innerHTML = COMPOUNDS.filter(c => c.id !== "rec").map(c => `
    <div class="opt">
      <div class="opt-top"><strong>${both(c.en, c.zh)}</strong><span class="add">${addLabel(c)}</span></div>
      <span class="prod">${esc(c.product)}</span>
      <p>${both(c.nEn, c.nZh)}</p>
    </div>`).join("");
}

function renderCompare() {
  const table = $("cmpTable");
  if (!table) return;
  const head = `<thead><tr><th>${both("Service", "服务")}</th>${TIERS.map(t =>
    `<th class="${t.id === state.tier ? "on" : ""}">${both(t.en, t.zh)}</th>`).join("")}</tr></thead>`;
  const body = `<tbody>${SERVICES.map(s => `<tr><td>${both(s.en, s.zh)}${s.parts ? `<small>${both("+ parts", "+ 配件")}</small>` : ""}</td>${
    TIERS.map(t => `<td class="${t.id === state.tier ? "on" : ""}">${s.p[t.id] == null ? "—" : money(s.p[t.id])}</td>`).join("")}</tr>`).join("")}</tbody>`;
  table.innerHTML = head + body;
}

/* ---------- quote builder ---------- */
function renderSelects() {
  if ($("qTier")) {
    $("qTier").innerHTML = TIERS.map(t => `<option value="${t.id}">${esc(tr(t))}</option>`).join("");
    $("qTier").value = state.tier;
  }
  if ($("qHandoff")) {
    $("qHandoff").innerHTML = HANDOFF.map(x => `<option value="${x.v}">${esc(tr(x))}</option>`).join("");
    $("qHandoff").value = state.handoff;
  }
}

function renderQuoteList() {
  const list = $("qList");
  if (!list) return;
  list.querySelectorAll(".q-item").forEach(n => n.remove());
  list.insertAdjacentHTML("beforeend", SERVICES.map(s => {
    const p = priceOf(s);
    const off = p == null;
    return `
    <label class="q-item${off ? " off" : ""}" for="q-${s.id}">
      <input type="checkbox" id="q-${s.id}" value="${s.id}"${off ? " disabled" : ""}${!off && state.picked.has(s.id) ? " checked" : ""}>
      <span>${both(s.en, s.zh)}</span>
      <span class="num">${off ? both("Not for this type", "此类型不提供") : money(p) + (s.parts ? both(" + parts", " + 配件") : "")}</span>
    </label>`;
  }).join(""));
}

function renderChoiceLists() {
  const comp = $("qCompoundList");
  if (comp) {
    comp.querySelectorAll(".q-item").forEach(n => n.remove());
    comp.insertAdjacentHTML("beforeend", COMPOUNDS.map(c => `
      <label class="q-item" for="qc-${c.id}">
        <input type="radio" name="compound" id="qc-${c.id}" value="${c.id}"${c.id === state.compound ? " checked" : ""}>
        <span>${both(c.en, c.zh)}${c.product ? `<small>${esc(c.product)}</small>` : ""}</span>
        <span class="num">${addLabel(c)}</span>
      </label>`).join(""));
  }
  const parts = $("qPartsList");
  if (parts) {
    parts.querySelectorAll(".q-item").forEach(n => n.remove());
    parts.insertAdjacentHTML("beforeend", PARTS.map(p => `
      <label class="q-item" for="qp-${p.v}">
        <input type="radio" name="parts" id="qp-${p.v}" value="${p.v}"${p.v === state.parts ? " checked" : ""}>
        <span>${both(p.en, p.zh)}<small>${both(p.nEn, p.nZh)}</small></span>
        <span></span>
      </label>`).join(""));
  }
}

function pickedServices() {
  return SERVICES.filter(s => state.picked.has(s.id) && priceOf(s) != null);
}

function updateQuote() {
  if (!$("qMsg")) return;
  const picked = pickedServices();
  const thermal = picked.filter(s => s.thermal);
  const comp = compoundById(state.compound);
  const needsParts = picked.some(s => s.parts);
  const labor = picked.reduce((a, s) => a + priceOf(s), 0) + (comp.add ? comp.add * thermal.length : 0);
  const t = tierById(state.tier);
  const model = state.model.trim();
  const handoff = HANDOFF.find(h => h.v === state.handoff) || HANDOFF[0];
  const parts = PARTS.find(p => p.v === state.parts) || PARTS[0];

  if ($("qCompoundBlock")) $("qCompoundBlock").hidden = !thermal.length;
  if ($("qPartsBlock")) $("qPartsBlock").hidden = !needsParts;

  $("qTotal").textContent = money(labor);
  const extras = [];
  if (needsParts) extras.push(state.lang === "zh" ? "+ 配件费" : "+ parts");
  if (thermal.length && comp.add == null) extras.push(state.lang === "zh" ? "+ 导热材料另行报价" : "+ compound quoted");
  $("qParts").textContent = extras.join(" ");

  const zh = state.lang === "zh";
  const names = picked.map(s => tr(s)).join(zh ? "、" : ", ");
  const lines = zh
    ? ["你好，我想咨询维修报价。", "电脑类型：" + t.zh, "型号：" + (model || "（请填写型号）"), "服务：" + (names || "（还没选）")]
    : ["Hi! I'd like a quote.", "Device type: " + t.en, "Model: " + (model || "(add your model)"), "Services: " + (names || "(none picked yet)")];
  if (thermal.length) lines.push((zh ? "导热材料：" : "Thermal compound: ") + tr(comp) + (comp.product ? ` (${comp.product})` : ""));
  if (needsParts) lines.push((zh ? "配件：" : "Parts: ") + tr(parts));
  lines.push((zh ? "预估人工费：" : "Estimated labor: ") + money(labor) + (extras.length ? " " + extras.join(" ") : ""));
  lines.push((zh ? "交接方式：" : "Hand-off: ") + tr(handoff));
  lines.push(zh ? "问题描述：" : "What's wrong: ");
  $("qMsg").value = lines.join("\n");
  if ($("copyStatus")) $("copyStatus").textContent = "";

  const send = $("sendForm");
  if (send && CONTACT.bookingUrl) {
    send.hidden = false;
    send.href = formUrl(picked, t, handoff, thermal.length ? comp : null, needsParts ? parts : null);
  }
}

/* Link to the Google Form with this quote's choices filled in. */
function formUrl(picked, t, handoff, comp, parts) {
  const p = new URLSearchParams({ usp: "pp_url" });
  p.append(FORM_FIELDS.lang, state.lang === "zh" ? "中文" : "English");
  p.append(FORM_FIELDS.device, t.en + " / " + t.zh);
  if (state.model.trim()) p.append(FORM_FIELDS.model, state.model.trim());
  picked.forEach(s => p.append(FORM_FIELDS.services, s.en + " / " + s.zh));
  if (comp && FORM_FIELDS.compound) p.append(FORM_FIELDS.compound, comp.form);
  if (parts && FORM_FIELDS.parts) p.append(FORM_FIELDS.parts, parts.en + " / " + parts.zh);
  p.append(FORM_FIELDS.handoff, handoff.en + " / " + handoff.zh);
  return CONTACT.bookingUrl + "?" + p.toString();
}

function initQuote() {
  if (!$("qList")) return;
  renderChoiceLists();
  $("qList").addEventListener("change", e => {
    const box = e.target;
    if (box.type !== "checkbox") return;
    box.checked ? state.picked.add(box.value) : state.picked.delete(box.value);
    updateQuote();
    save();
  });
  $("qTier").addEventListener("change", e => setTier(e.target.value));
  $("qHandoff").addEventListener("change", e => { state.handoff = e.target.value; updateQuote(); save(); });
  $("qCompoundList").addEventListener("change", e => { state.compound = e.target.value; updateQuote(); save(); });
  $("qPartsList").addEventListener("change", e => { state.parts = e.target.value; updateQuote(); save(); });
  $("copyMsg").addEventListener("click", () => copyText($("qMsg").value, $("copyStatus"), $("qMsg")));
}

/* ---------- copy ---------- */
function copyText(text, statusEl, fallbackEl) {
  const done = ok => {
    if (!statusEl) return;
    statusEl.textContent = ok
      ? (state.lang === "zh" ? "已复制" : "Copied")
      : (state.lang === "zh" ? "已选中，请按复制" : "Selected. Press Copy on your keyboard.");
  };
  const fallback = () => {
    if (fallbackEl) {
      if (fallbackEl.select) { fallbackEl.focus(); fallbackEl.select(); }
      else { const r = document.createRange(); r.selectNodeContents(fallbackEl); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    }
    done(false);
  };
  try {
    navigator.clipboard.writeText(text).then(() => done(true), fallback);
  } catch (e) { fallback(); }
}

/* ---------- contact ---------- */
function renderContact() {
  const grid = $("contactGrid");
  if (!grid) return;
  const items = [
    { key: "phone",  en: "Text or call", zh: "短信 / 电话", val: CONTACT.phone },
    { key: "email",  en: "Email", zh: "邮箱", val: CONTACT.email },
    { key: "wechat", en: "WeChat", zh: "微信", val: CONTACT.wechat },
    { key: "book",   en: "Book online", zh: "在线预约", val: CONTACT.bookingUrl, link: true }
  ].filter(i => i.val);
  grid.innerHTML = items.map(i => {
    if (i.link) {
      return `<div class="c-card"><span class="label">${both(i.en, i.zh)}</span><a class="btn" href="${esc(i.val)}" target="_blank" rel="noopener">${both("Open the request form", "打开预约表")}</a></div>`;
    }
    return `<div class="c-card"><span class="label">${both(i.en, i.zh)}</span><span class="c-value" id="cv-${i.key}">${esc(i.val)}</span>
      <button class="ghost" type="button" data-copy="${i.key}">${both("Copy", "复制")}</button><span class="status" id="cs-${i.key}" role="status"></span></div>`;
  }).join("");
  grid.addEventListener("click", e => {
    const b = e.target.closest("[data-copy]");
    if (!b) return;
    const k = b.dataset.copy;
    copyText(CONTACT[k], $("cs-" + k), $("cv-" + k));
  });
}

/* ---------- language ---------- */
function setLang(next) {
  state.lang = next;
  root.dataset.lang = next;
  root.lang = next === "zh" ? "zh-CN" : "en";
  $("langBtn").textContent = next === "zh" ? "English" : "中文";
  renderSelects();
  updateQuote();
  save();
}

/* ---------- start ---------- */
markNav();
renderFrom();
renderTiers();
renderCompounds();
renderContact();
renderSelects();
initFinder();
initQuote();
setTier(state.tier);
setLang(state.lang);
$("langBtn").addEventListener("click", () => setLang(state.lang === "zh" ? "en" : "zh"));
