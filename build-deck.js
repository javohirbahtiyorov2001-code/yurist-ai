const pptxgen = require("pptxgenjs");

const BG = "080810";
const CARD = "0E0E1C";
const PURPLE = "A855F7";
const PURPLE_LIGHT = "C084FC";
const PURPLE_DIM = "7C3AED";
const WHITE = "FFFFFF";
const MUTED = "888899";
const GREEN = "34D399";
const AMBER = "FBBF24";
const BLUE = "60A5FA";

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "Yurist AI — Investor Pitch Deck";
pres.author = "Yurist AI";

const makeShadow = () => ({ type: "outer", blur: 20, offset: 4, angle: 90, color: "000000", opacity: 0.4 });
const makeCardShadow = () => ({ type: "outer", blur: 10, offset: 2, angle: 90, color: "000000", opacity: 0.3 });

// ── SLIDE 1: COVER ──────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };

  // Decorative orbs
  s.addShape(pres.shapes.OVAL, { x: 1.5, y: -1.2, w: 7, h: 7, fill: { color: PURPLE_DIM, transparency: 88 }, line: { color: PURPLE_DIM, transparency: 90, width: 0 } });
  s.addShape(pres.shapes.OVAL, { x: 3.2, y: -0.6, w: 3.6, h: 3.6, fill: { color: PURPLE, transparency: 82 }, line: { color: PURPLE, transparency: 80, width: 0 } });

  // Top badge
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 3.6, y: 0.9, w: 2.8, h: 0.34, fill: { color: PURPLE, transparency: 86 }, line: { color: PURPLE, transparency: 55, width: 1 }, rectRadius: 0.1 });
  s.addText("✦  AI-POWERED LEGAL ASSISTANT  ✦", { x: 3.6, y: 0.9, w: 2.8, h: 0.34, color: PURPLE_LIGHT, fontSize: 8, bold: true, align: "center", valign: "middle", charSpacing: 1.5, margin: 0 });

  // Title
  s.addText("Yurist AI", { x: 0.5, y: 1.38, w: 9, h: 1.5, color: WHITE, fontSize: 88, bold: true, align: "center", fontFace: "Arial", charSpacing: -3, margin: 0 });

  // Taglines
  s.addText("Know Your Rights.", { x: 0.5, y: 3.0, w: 9, h: 0.6, color: PURPLE_LIGHT, fontSize: 26, align: "center", fontFace: "Arial", margin: 0 });
  s.addText("In 30 Seconds.", { x: 0.5, y: 3.58, w: 9, h: 0.44, color: MUTED, fontSize: 18, align: "center", fontFace: "Arial", margin: 0 });

  // Language chips
  [["🇺🇿 Uzbek", 0], ["🇷🇺 Russian", 1], ["🇬🇧 English", 2]].forEach(([chip, i]) => {
    const x = 3.15 + i * 1.28;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 4.62, w: 1.15, h: 0.3, fill: { color: "141428" }, line: { color: PURPLE, transparency: 55, width: 1 }, rectRadius: 0.08 });
    s.addText(chip, { x, y: 4.62, w: 1.15, h: 0.3, color: MUTED, fontSize: 9.5, align: "center", valign: "middle", margin: 0 });
  });

  // Slide number
  s.addText("1", { x: 9.4, y: 5.28, w: 0.3, h: 0.2, color: "333345", fontSize: 9, align: "right", margin: 0 });

  s.addNotes("Open with confidence. This is a working product, not a concept. Yurist AI is live today.");
}

// ── SLIDE 2: THE PROBLEM ────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };

  s.addText("THE PROBLEM", { x: 0.5, y: 0.28, w: 9, h: 0.26, color: PURPLE, fontSize: 10, bold: true, charSpacing: 3, align: "center", margin: 0 });
  s.addText("Legal Help Is Broken in CIS", { x: 0.5, y: 0.6, w: 9, h: 0.8, color: WHITE, fontSize: 38, bold: true, align: "center", fontFace: "Arial", charSpacing: -1, margin: 0 });

  const pains = [
    { icon: "💼", title: "Unpaid Salary", desc: "Lawyer consultation costs $200+.\nMost workers just give up.", color: PURPLE },
    { icon: "🏠", title: "Rental Dispute", desc: "Weeks of uncertainty.\nTenants don't know their rights.", color: GREEN },
    { icon: "🛒", title: "Defective Product", desc: "No idea how to file a claim\nor where to even start.", color: AMBER },
  ];

  pains.forEach(({ icon, title, desc, color }, i) => {
    const x = 0.42 + i * 3.12;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.65, w: 2.95, h: 2.6, fill: { color: CARD }, line: { color: "FFFFFF", transparency: 92, width: 1 }, rectRadius: 0.14, shadow: makeCardShadow() });
    s.addShape(pres.shapes.OVAL, { x: x + 0.22, y: 1.86, w: 0.58, h: 0.58, fill: { color, transparency: 83 }, line: { color, transparency: 65, width: 1 } });
    s.addText(icon, { x: x + 0.22, y: 1.86, w: 0.58, h: 0.58, fontSize: 20, align: "center", valign: "middle", margin: 0 });
    s.addText(title, { x: x + 0.2, y: 2.58, w: 2.58, h: 0.38, color: WHITE, fontSize: 15, bold: true, fontFace: "Arial", margin: 0 });
    s.addText(desc, { x: x + 0.2, y: 3.0, w: 2.58, h: 0.88, color: MUTED, fontSize: 12, fontFace: "Arial", margin: 0 });
  });

  // Big stat banner
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.2, y: 4.42, w: 7.6, h: 0.78, fill: { color: PURPLE, transparency: 90 }, line: { color: PURPLE, transparency: 55, width: 1 }, rectRadius: 0.1 });
  s.addText("Only 8% of CIS citizens ever consult a lawyer — millions suffer in silence.", { x: 1.2, y: 4.42, w: 7.6, h: 0.78, color: PURPLE_LIGHT, fontSize: 13.5, align: "center", valign: "middle", fontFace: "Arial", margin: 0 });

  s.addText("2", { x: 9.4, y: 5.28, w: 0.3, h: 0.2, color: "333345", fontSize: 9, align: "right", margin: 0 });
  s.addNotes("The problem is not awareness — people know their rights are being violated. The problem is access.");
}

// ── SLIDE 3: THE SOLUTION ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };

  s.addText("THE SOLUTION", { x: 0.5, y: 0.28, w: 9, h: 0.26, color: PURPLE, fontSize: 10, bold: true, charSpacing: 3, align: "center", margin: 0 });
  s.addText("Yurist AI: Legal Clarity in Seconds", { x: 0.5, y: 0.6, w: 9, h: 0.8, color: WHITE, fontSize: 36, bold: true, align: "center", fontFace: "Arial", charSpacing: -1, margin: 0 });
  s.addText("AI-powered platform that explains your rights, reviews contracts, and drafts\ndocuments — instantly, in your language, for a fraction of the cost.", { x: 1, y: 1.5, w: 8, h: 0.7, color: MUTED, fontSize: 13, align: "center", fontFace: "Arial", margin: 0 });

  const features = [
    { icon: "🧠", title: "AI Case Analysis", desc: "Describe your situation in plain language. Get instant rights-based analysis with CIS law citations." },
    { icon: "📄", title: "Contract Review", desc: "Upload any PDF contract. AI flags risky clauses, unfair terms, and protective gaps in seconds." },
    { icon: "💬", title: "Chat with Yurist", desc: "24/7 AI legal assistant. Ask follow-ups, get document templates, draft demand letters." },
  ];

  features.forEach(({ icon, title, desc }, i) => {
    const x = 0.38 + i * 3.12;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.38, w: 2.98, h: 2.85, fill: { color: CARD }, line: { color: PURPLE, transparency: 78, width: 1 }, rectRadius: 0.14, shadow: makeCardShadow() });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.22, y: 2.58, w: 0.58, h: 0.58, fill: { color: PURPLE, transparency: 80 }, line: { color: PURPLE, transparency: 62, width: 1 }, rectRadius: 0.1 });
    s.addText(icon, { x: x + 0.22, y: 2.58, w: 0.58, h: 0.58, fontSize: 20, align: "center", valign: "middle", margin: 0 });
    s.addText(title, { x: x + 0.2, y: 3.28, w: 2.6, h: 0.4, color: WHITE, fontSize: 14, bold: true, fontFace: "Arial", margin: 0 });
    s.addText(desc, { x: x + 0.2, y: 3.72, w: 2.6, h: 1.14, color: MUTED, fontSize: 11.5, fontFace: "Arial", margin: 0 });
  });

  s.addText("3× faster than a traditional lawyer  ·  100× cheaper  ·  Available 24/7", { x: 0.5, y: 5.28, w: 9, h: 0.28, color: PURPLE_LIGHT, fontSize: 11.5, bold: true, align: "center", charSpacing: 0.5, margin: 0 });

  s.addText("3", { x: 9.4, y: 5.28, w: 0.3, h: 0.2, color: "333345", fontSize: 9, align: "right", margin: 0 });
  s.addNotes("This isn't just a chatbot. It's a full legal stack: analysis, contracts, documents. Three products, one app.");
}

// ── SLIDE 4: HOW IT WORKS ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };

  s.addText("HOW IT WORKS", { x: 0.5, y: 0.28, w: 9, h: 0.26, color: PURPLE, fontSize: 10, bold: true, charSpacing: 3, align: "center", margin: 0 });
  s.addText("Simple. Fast. Accurate.", { x: 0.5, y: 0.6, w: 9, h: 0.8, color: WHITE, fontSize: 38, bold: true, align: "center", fontFace: "Arial", charSpacing: -1, margin: 0 });

  const steps = [
    { num: "01", title: "Describe your situation", desc: "Type or speak your legal problem in Uzbek, Russian, or English. No jargon required — use your own words." },
    { num: "02", title: "AI analyzes CIS law instantly", desc: "The model scans thousands of legal statutes, court precedents, and consumer protection articles in real time." },
    { num: "03", title: "Get your rights + next steps", desc: "Receive a plain-language explanation of your rights, actionable next steps, and optional document templates." },
  ];

  steps.forEach(({ num, title, desc }, i) => {
    const y = 1.65 + i * 1.26;

    s.addShape(pres.shapes.OVAL, { x: 0.48, y: y + 0.02, w: 0.72, h: 0.72, fill: { color: PURPLE, transparency: 76 }, line: { color: PURPLE, transparency: 38, width: 1.5 } });
    s.addText(num, { x: 0.48, y: y + 0.02, w: 0.72, h: 0.72, color: PURPLE_LIGHT, fontSize: 15, bold: true, align: "center", valign: "middle", margin: 0 });

    if (i < 2) {
      s.addShape(pres.shapes.RECTANGLE, { x: 0.81, y: y + 0.76, w: 0.06, h: 0.52, fill: { color: PURPLE, transparency: 72 }, line: { color: PURPLE, transparency: 72, width: 0 } });
    }

    s.addText(title, { x: 1.5, y: y + 0.06, w: 8, h: 0.4, color: WHITE, fontSize: 18, bold: true, fontFace: "Arial", margin: 0 });
    s.addText(desc, { x: 1.5, y: y + 0.48, w: 8, h: 0.6, color: MUTED, fontSize: 12.5, fontFace: "Arial", margin: 0 });
  });

  s.addText("4", { x: 9.4, y: 5.28, w: 0.3, h: 0.2, color: "333345", fontSize: 9, align: "right", margin: 0 });
  s.addNotes("Average time from question to answer: under 10 seconds. Users don't need to know any law.");
}

// ── SLIDE 5: MARKET OPPORTUNITY ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };

  s.addText("MARKET OPPORTUNITY", { x: 0.5, y: 0.28, w: 9, h: 0.26, color: PURPLE, fontSize: 10, bold: true, charSpacing: 3, align: "center", margin: 0 });
  s.addText("Massive Underserved Market", { x: 0.5, y: 0.6, w: 9, h: 0.8, color: WHITE, fontSize: 38, bold: true, align: "center", fontFace: "Arial", charSpacing: -1, margin: 0 });

  const stats = [
    { value: "300M+", label: "CIS Population", sub: "Total addressable audience", color: PURPLE },
    { value: "$2B+",  label: "Legal Services Market", sub: "Annual CIS legal spend", color: GREEN },
    { value: "<5%",   label: "Digital Penetration", sub: "Legal tech adoption rate", color: AMBER },
    { value: "74%",   label: "Smartphone Users", sub: "And growing year-over-year", color: BLUE },
  ];

  stats.forEach(({ value, label, sub, color }, i) => {
    const x = 0.38 + (i % 2) * 4.7;
    const y = 1.65 + Math.floor(i / 2) * 1.75;

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 4.35, h: 1.55, fill: { color: CARD }, line: { color: "FFFFFF", transparency: 93, width: 1 }, rectRadius: 0.14, shadow: makeCardShadow() });
    s.addText(value, { x: x + 0.28, y: y + 0.14, w: 3.6, h: 0.7, color, fontSize: 46, bold: true, fontFace: "Arial", charSpacing: -2, margin: 0 });
    s.addText(label, { x: x + 0.28, y: y + 0.82, w: 3.6, h: 0.32, color: WHITE, fontSize: 13, bold: true, fontFace: "Arial", margin: 0 });
    s.addText(sub, { x: x + 0.28, y: y + 1.15, w: 3.6, h: 0.28, color: MUTED, fontSize: 11, fontFace: "Arial", margin: 0 });
  });

  s.addText("5", { x: 9.4, y: 5.28, w: 0.3, h: 0.2, color: "333345", fontSize: 9, align: "right", margin: 0 });
  s.addNotes("The CIS legal gap is not a niche. 300M people face legal problems constantly with almost no digital options.");
}

// ── SLIDE 6: BUSINESS MODEL ─────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };

  s.addText("BUSINESS MODEL", { x: 0.5, y: 0.28, w: 9, h: 0.26, color: PURPLE, fontSize: 10, bold: true, charSpacing: 3, align: "center", margin: 0 });
  s.addText("Simple, Scalable Pricing", { x: 0.5, y: 0.6, w: 9, h: 0.8, color: WHITE, fontSize: 38, bold: true, align: "center", fontFace: "Arial", charSpacing: -1, margin: 0 });

  const tiers = [
    { name: "Free", price: "$0", period: "forever", feats: ["3 questions / month", "Basic case analysis", "Uzbek & Russian"], popular: false, color: MUTED, accent: "1A1A28" },
    { name: "Pro",  price: "$5", period: "per month", feats: ["Unlimited questions", "Contract review", "Document drafting", "All 3 languages"], popular: true, color: PURPLE, accent: "1A0E35" },
    { name: "Entity", price: "$20", period: "per month", feats: ["Everything in Pro", "5 team accounts", "Priority support", "API access"], popular: false, color: GREEN, accent: "0C1F18" },
  ];

  tiers.forEach(({ name, price, period, feats, popular, color, accent }, i) => {
    const x = 0.42 + i * 3.12;

    if (popular) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.6, y: 1.52, w: 1.7, h: 0.3, fill: { color: PURPLE }, line: { color: PURPLE, transparency: 0, width: 0 }, rectRadius: 0.08 });
      s.addText("MOST POPULAR", { x: x + 0.6, y: 1.52, w: 1.7, h: 0.3, color: WHITE, fontSize: 8, bold: true, align: "center", valign: "middle", charSpacing: 1, margin: 0 });
    }

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.68, w: 2.95, h: 3.55, fill: { color: accent }, line: { color: popular ? PURPLE : "FFFFFF", transparency: popular ? 20 : 93, width: popular ? 1.5 : 1 }, rectRadius: 0.14, shadow: popular ? { type: "outer", blur: 30, offset: 3, angle: 90, color: "000000", opacity: 0.5 } : makeCardShadow() });

    s.addText(name, { x: x + 0.2, y: 1.82, w: 2.58, h: 0.4, color, fontSize: 16, bold: true, fontFace: "Arial", margin: 0 });
    s.addText(price, { x: x + 0.2, y: 2.26, w: 1.8, h: 0.78, color: WHITE, fontSize: 48, bold: true, fontFace: "Arial", charSpacing: -2, margin: 0 });
    s.addText(period, { x: x + 0.2, y: 3.06, w: 2.58, h: 0.28, color: MUTED, fontSize: 11, fontFace: "Arial", margin: 0 });

    feats.forEach((f, j) => {
      s.addText("✓  " + f, { x: x + 0.2, y: 3.44 + j * 0.34, w: 2.58, h: 0.3, color: popular ? "D8B4FE" : MUTED, fontSize: 11.5, fontFace: "Arial", margin: 0 });
    });
  });

  s.addText("Freemium model → viral organic growth → 8% Pro conversion target", { x: 0.5, y: 5.3, w: 9, h: 0.26, color: MUTED, fontSize: 11, align: "center", margin: 0 });

  s.addText("6", { x: 9.4, y: 5.28, w: 0.3, h: 0.2, color: "333345", fontSize: 9, align: "right", margin: 0 });
  s.addNotes("Free plan creates viral loops — users share answers, friends sign up. Pro converts on the 4th question.");
}

// ── SLIDE 7: TRACTION ───────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };

  s.addText("TRACTION", { x: 0.5, y: 0.28, w: 9, h: 0.26, color: PURPLE, fontSize: 10, bold: true, charSpacing: 3, align: "center", margin: 0 });
  s.addText("Built. Launched. Growing.", { x: 0.5, y: 0.6, w: 9, h: 0.8, color: WHITE, fontSize: 38, bold: true, align: "center", fontFace: "Arial", charSpacing: -1, margin: 0 });

  const milestones = [
    { done: true,  text: "Full-stack platform live — React frontend, Node.js API, PostgreSQL", date: "Q1 2026" },
    { done: true,  text: "Multilingual AI legal engine (Uzbek · Russian · English)", date: "Q1 2026" },
    { done: true,  text: "Contract review + document drafting features shipped", date: "Q2 2026" },
    { done: true,  text: "Premium dark UI redesign — investor-demo ready", date: "Q2 2026" },
    { done: false, text: "1,000 registered users milestone", date: "Q3 2026" },
    { done: false, text: "Legal partnership deals in UZ & KZ", date: "Q4 2026" },
    { done: false, text: "10,000 users · $5,000 MRR", date: "Q1 2027" },
  ];

  milestones.forEach(({ done, text, date }, i) => {
    const y = 1.6 + i * 0.52;
    const col = done ? GREEN : PURPLE;

    s.addShape(pres.shapes.OVAL, { x: 0.45, y: y + 0.05, w: 0.32, h: 0.32, fill: { color: col, transparency: done ? 0 : 78 }, line: { color: col, transparency: done ? 0 : 42, width: 1 } });
    s.addText(done ? "✓" : "→", { x: 0.45, y: y + 0.05, w: 0.32, h: 0.32, color: done ? BG : col, fontSize: 9, bold: true, align: "center", valign: "middle", margin: 0 });
    s.addText(text, { x: 1.02, y, w: 7.3, h: 0.38, color: done ? WHITE : MUTED, fontSize: 13, fontFace: "Arial", bold: done, margin: 0 });
    s.addText(date, { x: 8.35, y, w: 1.3, h: 0.38, color: col, fontSize: 10, bold: true, align: "right", margin: 0 });
  });

  s.addText("7", { x: 9.4, y: 5.28, w: 0.3, h: 0.2, color: "333345", fontSize: 9, align: "right", margin: 0 });
  s.addNotes("This is a working product — not a deck, not a prototype. Everything in green is live today.");
}

// ── SLIDE 8: THE ASK ────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };

  s.addText("THE ASK", { x: 0.5, y: 0.28, w: 9, h: 0.26, color: PURPLE, fontSize: 10, bold: true, charSpacing: 3, align: "center", margin: 0 });
  s.addText("Join the Mission", { x: 0.5, y: 0.6, w: 9, h: 0.8, color: WHITE, fontSize: 38, bold: true, align: "center", fontFace: "Arial", charSpacing: -1, margin: 0 });

  // Raise box
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 2.3, y: 1.6, w: 5.4, h: 1.14, fill: { color: PURPLE, transparency: 86 }, line: { color: PURPLE, transparency: 42, width: 1.5 }, rectRadius: 0.14 });
  s.addText("Seeking", { x: 2.3, y: 1.68, w: 5.4, h: 0.3, color: MUTED, fontSize: 11, align: "center", margin: 0 });
  s.addText("$150,000 Seed Round", { x: 2.3, y: 1.98, w: 5.4, h: 0.68, color: WHITE, fontSize: 32, bold: true, align: "center", fontFace: "Arial", charSpacing: -1.5, margin: 0 });

  // Use of funds header
  s.addText("USE OF FUNDS", { x: 0.5, y: 2.92, w: 9, h: 0.28, color: PURPLE, fontSize: 9, bold: true, charSpacing: 3, align: "center", margin: 0 });

  const funds = [
    { pct: "40%", label: "Product & AI R&D", color: PURPLE },
    { pct: "30%", label: "Marketing & Growth", color: GREEN },
    { pct: "20%", label: "Legal Partnerships", color: AMBER },
    { pct: "10%", label: "Operations", color: BLUE },
  ];

  funds.forEach(({ pct, label, color }, i) => {
    const x = 0.42 + i * 2.32;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 3.28, w: 2.15, h: 1.55, fill: { color: CARD }, line: { color: "FFFFFF", transparency: 93, width: 1 }, rectRadius: 0.12, shadow: makeCardShadow() });
    s.addText(pct, { x, y: 3.4, w: 2.15, h: 0.72, color, fontSize: 40, bold: true, align: "center", fontFace: "Arial", charSpacing: -2, margin: 0 });
    s.addText(label, { x, y: 4.14, w: 2.15, h: 0.55, color: MUTED, fontSize: 11, align: "center", fontFace: "Arial", margin: 0 });
  });

  s.addText("Vision: The legal infrastructure layer for every CIS citizen", { x: 0.5, y: 4.95, w: 9, h: 0.34, color: PURPLE_LIGHT, fontSize: 12.5, bold: true, italic: true, align: "center", margin: 0 });

  s.addText("8", { x: 9.4, y: 5.28, w: 0.3, h: 0.2, color: "333345", fontSize: 9, align: "right", margin: 0 });
  s.addNotes("$150K gets us to 10K users and $5K MRR in 12 months. Unit economics: CAC $3, LTV $60. Strong payback.");
}

// ── SLIDE 9: CLOSING ────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };

  s.addShape(pres.shapes.OVAL, { x: 1.5, y: -1.5, w: 7, h: 7, fill: { color: PURPLE_DIM, transparency: 88 }, line: { color: PURPLE_DIM, transparency: 90, width: 0 } });
  s.addShape(pres.shapes.OVAL, { x: 3.2, y: -0.8, w: 3.6, h: 3.6, fill: { color: PURPLE, transparency: 82 }, line: { color: PURPLE, transparency: 80, width: 0 } });

  s.addText("Yurist AI", { x: 0.5, y: 1.0, w: 9, h: 1.55, color: WHITE, fontSize: 80, bold: true, align: "center", fontFace: "Arial", charSpacing: -3, margin: 0 });
  s.addText("Know Your Rights.", { x: 0.5, y: 2.65, w: 9, h: 0.65, color: PURPLE_LIGHT, fontSize: 28, align: "center", fontFace: "Arial", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 3.9, y: 3.5, w: 2.2, h: 0.02, fill: { color: PURPLE, transparency: 58 }, line: { color: PURPLE, transparency: 58, width: 0 } });

  s.addText("javohirbahtiyorov2001@gmail.com", { x: 0.5, y: 3.68, w: 9, h: 0.4, color: MUTED, fontSize: 14, align: "center", fontFace: "Arial", margin: 0 });
  s.addText("yurist.ai", { x: 0.5, y: 4.1, w: 9, h: 0.38, color: PURPLE, fontSize: 15, bold: true, align: "center", fontFace: "Arial", margin: 0 });
  s.addText("Built in Uzbekistan · For the CIS World", { x: 0.5, y: 4.78, w: 9, h: 0.28, color: "333345", fontSize: 11, align: "center", margin: 0 });

  s.addText("9", { x: 9.4, y: 5.28, w: 0.3, h: 0.2, color: "333345", fontSize: 9, align: "right", margin: 0 });
  s.addNotes("Leave 10 minutes for questions. Have the live app ready for demo. yurist.ai is live.");
}

// ── WRITE FILE ───────────────────────────────────────────────────────────────
const OUT = "D:/claude code/lexcis/yurist-ai-pitch-deck.pptx";
pres.writeFile({ fileName: OUT })
  .then(() => console.log("done:" + OUT))
  .catch(err => { console.error(err); process.exit(1); });
