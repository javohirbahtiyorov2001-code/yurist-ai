const path = require("path");
const PptxGenJS = require("pptxgenjs");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";

// ── Colors ──────────────────────────────────────────────
const BG       = "080810";
const BG2      = "0d0d1f";
const CARD     = "0f0f28";
const PURPLE   = "A855F7";
const PURPLE2  = "C084FC";
const PURPLE3  = "7C3AED";
const WHITE    = "FFFFFF";
const MUTED    = "6B6B88";
const GREEN    = "34D399";
const AMBER    = "FBBF24";
const RED      = "F87171";
const BLUE     = "60A5FA";
const DARK_P   = "1a0533";

const shadow = () => ({ type:"outer", blur:16, offset:3, angle:90, color:"000000", opacity:0.45 });
const glow   = () => ({ type:"outer", blur:30, offset:0, angle:90, color:PURPLE3, opacity:0.35 });

function slide(opts = {}) {
  const s = pptx.addSlide();
  // Background
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:"100%", h:"100%", fill:{ color: BG }, line:{ color: BG } });
  // Subtle top gradient stripe
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:"100%", h:0.04, fill:{ color: PURPLE3 }, line:{ color: PURPLE3 } });
  if (opts.label) {
    s.addText(opts.label, { x:0.4, y:0.15, w:9, h:0.28, fontSize:9, bold:true, color:PURPLE2, charSpacing:4 });
  }
  if (opts.title) {
    s.addText(opts.title, { x:0.4, y: opts.label ? 0.38 : 0.22, w:12.4, h:0.7, fontSize: opts.titleSize || 34, bold:true, color:WHITE, charSpacing:-1 });
  }
  return s;
}

function card(s, x, y, w, h, opts = {}) {
  s.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: opts.color || CARD },
    line: { color: opts.border || PURPLE3, width: opts.lineW || 0.5 },
    rectRadius: 0.12,
    shadow: opts.glow ? glow() : shadow(),
  });
}

function pill(s, x, y, text, color) {
  s.addShape(pptx.ShapeType.roundRect, { x, y, w:1.9, h:0.28, fill:{ color:"000000", transparency:70 }, line:{ color, width:0.75 }, rectRadius:0.14 });
  s.addText(text, { x, y, w:1.9, h:0.28, fontSize:8, bold:true, color, align:"center", valign:"middle" });
}

// ════════════════════════════════════════════════════════
// SLIDE 1 — COVER
// ════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:"100%", h:"100%", fill:{ color: BG }, line:{ color: BG } });

  // Purple orb glow
  s.addShape(pptx.ShapeType.ellipse, { x:4.2, y:0.4, w:4.9, h:4.9, fill:{ color: PURPLE3, transparency:85 }, line:{ color: PURPLE3, transparency:85 }, shadow:{ type:"outer", blur:120, offset:0, angle:90, color:PURPLE3, opacity:0.6 } });
  s.addShape(pptx.ShapeType.ellipse, { x:4.8, y:0.9, w:3.7, h:3.7, fill:{ color: PURPLE, transparency:78 }, line:{ color: PURPLE, transparency:78 }, shadow:{ type:"outer", blur:80, offset:0, angle:90, color:PURPLE, opacity:0.5 } });
  s.addShape(pptx.ShapeType.ellipse, { x:5.4, y:1.4, w:2.5, h:2.5, fill:{ color: PURPLE2, transparency:55 }, line:{ color: PURPLE2, transparency:55 } });

  // Badge
  s.addShape(pptx.ShapeType.roundRect, { x:5.6, y:0.22, w:2.1, h:0.28, fill:{ color: PURPLE3, transparency:75 }, line:{ color: PURPLE2, width:0.5 }, rectRadius:0.14 });
  s.addText("AI · LEGAL PLATFORM", { x:5.6, y:0.22, w:2.1, h:0.28, fontSize:7.5, bold:true, color:PURPLE2, align:"center", valign:"middle", charSpacing:2 });

  // Title
  s.addText("Yurist AI", { x:0.5, y:0.85, w:12.3, h:1.5, fontSize:80, bold:true, color:WHITE, align:"center", charSpacing:-3 });

  // Subtitle gradient look — two lines
  s.addText("AI-Powered Legal Platform for 300M+ CIS Citizens", { x:0.5, y:2.2, w:12.3, h:0.55, fontSize:22, color:PURPLE2, align:"center", charSpacing:-0.5 });

  // Divider
  s.addShape(pptx.ShapeType.line, { x:4.5, y:2.95, w:4.3, h:0, line:{ color: PURPLE3, width:0.75 } });

  // Taglines
  s.addText([
    { text:"B2C  ", options:{ color:PURPLE2, bold:true } },
    { text:"Freemium legal app for every citizen   ", options:{ color:MUTED } },
    { text:"B2B  ", options:{ color:GREEN, bold:true } },
    { text:"SaaS platform for legal firms & enterprises", options:{ color:MUTED } },
  ], { x:0.5, y:3.1, w:12.3, h:0.38, fontSize:12.5, align:"center" });

  // Language pills
  pill(s, 4.55, 3.65, "🇷🇺  Русский", PURPLE2);
  pill(s, 6.62, 3.65, "🇺🇿  O'zbek", GREEN);
  pill(s, 8.69, 3.65, "🇬🇧  English", BLUE);

  // Bottom meta
  s.addText("SEED ROUND  ·  $150,000  ·  2026", { x:0.5, y:4.55, w:12.3, h:0.28, fontSize:10, bold:true, color:MUTED, align:"center", charSpacing:3 });
}

// ════════════════════════════════════════════════════════
// SLIDE 2 — THE PROBLEM
// ════════════════════════════════════════════════════════
{
  const s = slide({ label:"THE PROBLEM", title:"Legal Help is Broken for 300M CIS People — and Their Businesses" });

  // B2C column header
  card(s, 0.4, 1.18, 5.9, 0.38, { color:"1a0533", border:PURPLE });
  s.addText("👤  B2C  —  Individual Citizens", { x:0.4, y:1.18, w:5.9, h:0.38, fontSize:13, bold:true, color:PURPLE2, align:"center", valign:"middle" });

  const b2cItems = [
    { icon:"💸", title:"Lawyers cost $150–400/session", sub:"8% of CIS citizens ever consult a lawyer" },
    { icon:"⏳", title:"Weeks of waiting for appointments", sub:"No online booking, no instant answers" },
    { icon:"🌐", title:"Language barrier kills access", sub:"Legal docs only in formal Russian, no Uzbek" },
    { icon:"😰", title:"People waive rights out of ignorance", sub:"70% don't know they can sue for unpaid wages" },
  ];
  b2cItems.forEach(({ icon, title, sub }, i) => {
    const y = 1.7 + i * 0.74;
    card(s, 0.4, y, 5.9, 0.65, { color:"120820" });
    s.addText(icon, { x:0.55, y, w:0.5, h:0.65, fontSize:20, valign:"middle" });
    s.addText(title, { x:1.12, y: y+0.06, w:5.1, h:0.28, fontSize:12.5, bold:true, color:WHITE });
    s.addText(sub,   { x:1.12, y: y+0.32, w:5.1, h:0.22, fontSize:10, color:MUTED });
  });

  // B2B column header
  card(s, 6.95, 1.18, 5.9, 0.38, { color:"0a2018", border:GREEN });
  s.addText("🏢  B2B  —  Legal Firms & Enterprises", { x:6.95, y:1.18, w:5.9, h:0.38, fontSize:13, bold:true, color:GREEN, align:"center", valign:"middle" });

  const b2bItems = [
    { icon:"📋", title:"Contract review takes 3–5 days", sub:"Lawyers bill $200+/hr for routine document checks" },
    { icon:"👩‍💼", title:"SMEs can't afford in-house legal", sub:"85% of CIS businesses have no legal dept" },
    { icon:"🔄", title:"Repetitive low-value work kills firms", sub:"60% of lawyer time is on templated documents" },
    { icon:"📊", title:"No AI tools built for CIS law", sub:"Western legaltech doesn't cover CIS jurisdiction" },
  ];
  b2bItems.forEach(({ icon, title, sub }, i) => {
    const y = 1.7 + i * 0.74;
    card(s, 6.95, y, 5.9, 0.65, { color:"081510" });
    s.addText(icon, { x:7.1, y, w:0.5, h:0.65, fontSize:20, valign:"middle" });
    s.addText(title, { x:7.67, y: y+0.06, w:5.1, h:0.28, fontSize:12.5, bold:true, color:WHITE });
    s.addText(sub,   { x:7.67, y: y+0.32, w:5.1, h:0.22, fontSize:10, color:MUTED });
  });

  // Divider line
  s.addShape(pptx.ShapeType.line, { x:6.57, y:1.18, w:0, h:3.55, line:{ color: PURPLE3, width:0.5 } });

  // Bottom stat
  card(s, 0.4, 4.58, 12.45, 0.42, { color:"0d0418", border:PURPLE3 });
  s.addText([
    { text:"Only 8% ", options:{ color:RED, bold:true } },
    { text:"of CIS citizens consult lawyers  ·  ", options:{ color:MUTED } },
    { text:"$2B+ ", options:{ color:AMBER, bold:true } },
    { text:"legal services market  ·  ", options:{ color:MUTED } },
    { text:"<5% ", options:{ color:GREEN, bold:true } },
    { text:"digital penetration", options:{ color:MUTED } },
  ], { x:0.4, y:4.58, w:12.45, h:0.42, fontSize:12, align:"center", valign:"middle" });
}

// ════════════════════════════════════════════════════════
// SLIDE 3 — THE SOLUTION
// ════════════════════════════════════════════════════════
{
  const s = slide({ label:"THE SOLUTION", title:"One Platform. Two Engines. Zero Barriers." });

  // Central orb glow
  s.addShape(pptx.ShapeType.ellipse, { x:5.3, y:1.3, w:2.7, h:2.7, fill:{ color:PURPLE3, transparency:80 }, line:{ color:PURPLE3, transparency:80 }, shadow:{ type:"outer", blur:60, offset:0, angle:90, color:PURPLE3, opacity:0.5 } });
  s.addText("⚖️", { x:5.3, y:1.65, w:2.7, h:1.5, fontSize:52, align:"center", valign:"middle" });
  s.addText("Yurist AI", { x:4.9, y:3.1, w:3.5, h:0.45, fontSize:18, bold:true, color:WHITE, align:"center" });

  // B2C left features
  const b2cFeats = [
    { icon:"💬", t:"AI Legal Chat", d:"Rights explained in plain language" },
    { icon:"📄", t:"Contract Review", d:"Risky clauses flagged instantly" },
    { icon:"📝", t:"Document Drafting", d:"Complaints, claims in seconds" },
    { icon:"🌐", t:"3 Languages", d:"RU · UZ · EN — all supported" },
  ];
  b2cFeats.forEach(({ icon, t, d }, i) => {
    const y = 1.18 + i * 0.82;
    card(s, 0.35, y, 4.55, 0.7, { color:"120820" });
    s.addText(icon, { x:0.5, y, w:0.55, h:0.7, fontSize:22, valign:"middle" });
    s.addText(t, { x:1.12, y: y+0.08, w:3.7, h:0.26, fontSize:12.5, bold:true, color:WHITE });
    s.addText(d, { x:1.12, y: y+0.36, w:3.7, h:0.22, fontSize:10, color:MUTED });
    // Arrow to center
    s.addShape(pptx.ShapeType.line, { x:4.9, y: y+0.35, w:0.42, h:0, line:{ color:PURPLE3, width:0.5 } });
  });

  // B2B right features
  const b2bFeats = [
    { icon:"🤖", t:"AI Contract Analyzer", d:"Bulk document processing via API" },
    { icon:"🔗", t:"API & Integrations", d:"Embed into any legal workflow" },
    { icon:"👥", t:"Team Accounts", d:"Multi-seat with role management" },
    { icon:"📊", t:"Analytics Dashboard", d:"Track usage, risk scores, savings" },
  ];
  b2bFeats.forEach(({ icon, t, d }, i) => {
    const y = 1.18 + i * 0.82;
    card(s, 8.43, y, 4.55, 0.7, { color:"081510" });
    s.addText(icon, { x:8.58, y, w:0.55, h:0.7, fontSize:22, valign:"middle" });
    s.addText(t, { x:9.2, y: y+0.08, w:3.7, h:0.26, fontSize:12.5, bold:true, color:WHITE });
    s.addText(d, { x:9.2, y: y+0.36, w:3.7, h:0.22, fontSize:10, color:MUTED });
    s.addShape(pptx.ShapeType.line, { x:8.1, y: y+0.35, w:0.35, h:0, line:{ color:GREEN, width:0.5 } });
  });

  // Labels
  s.addText("B2C  Consumer App", { x:0.35, y:4.85, w:4.55, h:0.28, fontSize:10, bold:true, color:PURPLE2, align:"center" });
  s.addText("B2B  Enterprise SaaS", { x:8.43, y:4.85, w:4.55, h:0.28, fontSize:10, bold:true, color:GREEN, align:"center" });
}

// ════════════════════════════════════════════════════════
// SLIDE 4 — MARKET OPPORTUNITY
// ════════════════════════════════════════════════════════
{
  const s = slide({ label:"MARKET OPPORTUNITY", title:"A $2B+ Market with <5% Digital Penetration" });

  const stats = [
    { v:"300M+", l:"CIS Population", s:"Total addressable audience", c:PURPLE2 },
    { v:"$2B+",  l:"Legal Services Market", s:"Annual legal spend in CIS", c:GREEN },
    { v:"<5%",   l:"Digital Penetration", s:"Legaltech adoption today", c:AMBER },
    { v:"74%",   l:"Smartphone Users", s:"Growing YoY — our channel", c:BLUE },
  ];
  stats.forEach(({ v, l, s: sub, c }, i) => {
    const x = 0.35 + i * 3.22;
    card(s, x, 1.18, 3.05, 2.0, { color:CARD });
    s.addText(v, { x, y:1.3, w:3.05, h:0.95, fontSize:52, bold:true, color:c, align:"center", charSpacing:-2 });
    s.addText(l, { x, y:2.28, w:3.05, h:0.32, fontSize:13, bold:true, color:WHITE, align:"center" });
    s.addText(sub, { x, y:2.6, w:3.05, h:0.22, fontSize:9.5, color:MUTED, align:"center" });
  });

  // TAM / SAM / SOM
  card(s, 0.35, 3.35, 12.63, 0.88, { color: CARD });
  s.addText("Market Sizing", { x:0.55, y:3.4, w:2.5, h:0.28, fontSize:10, bold:true, color:MUTED });

  const sizing = [
    { l:"TAM", v:"$2.1B", d:"Total CIS legal services market" },
    { l:"SAM", v:"$420M", d:"Digital-ready urban segments (B2C + B2B)" },
    { l:"SOM", v:"$21M", d:"Realistic 3-year capture target (1% SAM)" },
  ];
  sizing.forEach(({ l, v, d }, i) => {
    const x = 0.7 + i * 4.2;
    const colors = [PURPLE, GREEN, AMBER];
    s.addText(l, { x, y:3.42, w:0.7, h:0.28, fontSize:11, bold:true, color:colors[i] });
    s.addText(v, { x: x+0.75, y:3.38, w:1.4, h:0.36, fontSize:22, bold:true, color:WHITE });
    s.addText(d, { x: x+2.2, y:3.46, w:1.8, h:0.24, fontSize:9, color:MUTED });
  });

  // B2C vs B2B split
  card(s, 0.35, 4.35, 6.1, 0.7, { color:"120820", border:PURPLE3 });
  s.addText("B2C Opportunity", { x:0.55, y:4.38, w:5.7, h:0.24, fontSize:11, bold:true, color:PURPLE2 });
  s.addText("300M potential users · Avg $2.50/month → $750M ARR potential at 10% conversion", { x:0.55, y:4.62, w:5.7, h:0.36, fontSize:10, color:MUTED });

  card(s, 6.88, 4.35, 6.1, 0.7, { color:"081510", border:GREEN });
  s.addText("B2B Opportunity", { x:7.08, y:4.38, w:5.7, h:0.24, fontSize:11, bold:true, color:GREEN });
  s.addText("50,000+ CIS legal firms + 500K SMEs · Avg $50/month → $300M ARR potential at 1% penetration", { x:7.08, y:4.62, w:5.7, h:0.36, fontSize:10, color:MUTED });
}

// ════════════════════════════════════════════════════════
// SLIDE 5 — BUSINESS MODEL
// ════════════════════════════════════════════════════════
{
  const s = slide({ label:"BUSINESS MODEL", title:"Two Revenue Engines — One Platform" });

  // B2C tiers
  s.addText("B2C  —  Consumer Subscriptions", { x:0.35, y:1.15, w:6.1, h:0.32, fontSize:13, bold:true, color:PURPLE2 });
  const b2c = [
    { name:"Free",   price:"$0",  period:"forever",  note:"3 queries/mo · Viral acquisition", color:MUTED,   bg:"0a0a1a", border:"333355" },
    { name:"Pro",    price:"$5",  period:"/ month",  note:"Unlimited · Docs · Priority AI",   color:PURPLE2, bg:"120820", border:PURPLE3 },
    { name:"Family", price:"$12", period:"/ month",  note:"5 members · Full access",          color:BLUE,    bg:"080e20", border:"1e3a8a" },
  ];
  b2c.forEach(({ name, price, period, note, color, bg, border }, i) => {
    const y = 1.55 + i * 0.92;
    card(s, 0.35, y, 6.1, 0.82, { color:bg, border });
    s.addText(name, { x:0.55, y: y+0.06, w:1.5, h:0.28, fontSize:13, bold:true, color });
    s.addText(price, { x:2.4, y: y+0.04, w:1.2, h:0.38, fontSize:26, bold:true, color:WHITE, align:"right" });
    s.addText(period, { x:3.65, y: y+0.16, w:1.2, h:0.22, fontSize:11, color:MUTED });
    s.addText(note, { x:0.55, y: y+0.5, w:5.7, h:0.22, fontSize:10, color:MUTED });
  });

  // Conversion note
  card(s, 0.35, 4.35, 6.1, 0.55, { color:"0a0a1a", border:PURPLE3 });
  s.addText([
    { text:"Freemium funnel → ", options:{ color:MUTED } },
    { text:"8% ", options:{ color:PURPLE2, bold:true } },
    { text:"Pro conversion target → ", options:{ color:MUTED } },
    { text:"$120K ARR ", options:{ color:GREEN, bold:true } },
    { text:"at 2,000 paid users", options:{ color:MUTED } },
  ], { x:0.5, y:4.35, w:5.9, h:0.55, fontSize:11, valign:"middle" });

  // B2B tiers
  s.addText("B2B  —  Enterprise SaaS", { x:7.0, y:1.15, w:5.98, h:0.32, fontSize:13, bold:true, color:GREEN });
  const b2b = [
    { name:"Starter",    price:"$49",  period:"/ month", note:"3 seats · 100 contracts/mo · API",     color:GREEN,  bg:"081510", border:"14532d" },
    { name:"Business",   price:"$199", period:"/ month", note:"10 seats · Unlimited · Dashboard",    color:AMBER,  bg:"0e0c08", border:"713f12" },
    { name:"Enterprise", price:"Custom", period:"",       note:"White-label · Custom AI · Dedicated", color:RED,    bg:"120808", border:"7f1d1d" },
  ];
  b2b.forEach(({ name, price, period, note, color, bg, border }, i) => {
    const y = 1.55 + i * 0.92;
    card(s, 7.0, y, 5.98, 0.82, { color:bg, border });
    s.addText(name, { x:7.18, y: y+0.06, w:2.0, h:0.28, fontSize:13, bold:true, color });
    s.addText(price, { x:9.5, y: y+0.04, w:1.5, h:0.38, fontSize:price === "Custom" ? 16 : 26, bold:true, color:WHITE, align:"right" });
    s.addText(period, { x:11.05, y: y+0.16, w:1.0, h:0.22, fontSize:11, color:MUTED });
    s.addText(note, { x:7.18, y: y+0.5, w:5.6, h:0.22, fontSize:10, color:MUTED });
  });

  card(s, 7.0, 4.35, 5.98, 0.55, { color:"081510", border:GREEN });
  s.addText([
    { text:"Target 50 B2B clients year 1 → ", options:{ color:MUTED } },
    { text:"$150K ARR ", options:{ color:GREEN, bold:true } },
    { text:"from B2B alone", options:{ color:MUTED } },
  ], { x:7.15, y:4.35, w:5.7, h:0.55, fontSize:11, valign:"middle" });

  // Divider
  s.addShape(pptx.ShapeType.line, { x:6.62, y:1.15, w:0, h:3.78, line:{ color:PURPLE3, width:0.5 } });
}

// ════════════════════════════════════════════════════════
// SLIDE 6 — GO-TO-MARKET
// ════════════════════════════════════════════════════════
{
  const s = slide({ label:"GO-TO-MARKET STRATEGY", title:"Viral B2C Growth + Direct B2B Sales" });

  // B2C GTM
  card(s, 0.35, 1.15, 6.1, 3.82, { color:CARD, border:PURPLE3 });
  s.addText("B2C Growth Engine", { x:0.55, y:1.22, w:5.7, h:0.3, fontSize:14, bold:true, color:PURPLE2 });

  const b2cGTM = [
    { step:"01", title:"Viral Content Loop", desc:"Share AI legal advice on Telegram & TikTok.\n'Got fired illegally — here's what Yurist AI said'" },
    { step:"02", title:"Telegram Mini-App", desc:"Launch in CIS's #1 app.\n200M+ Telegram users in target markets" },
    { step:"03", title:"SEO Arbitrage", desc:"'Что делать если...' — zero competition,\nhigh intent legal queries in Russian & Uzbek" },
    { step:"04", title:"Partnership with NGOs", desc:"Consumer rights orgs, women's shelters,\nlabor unions — free tier distribution" },
  ];
  b2cGTM.forEach(({ step, title, desc }, i) => {
    const y = 1.62 + i * 0.82;
    s.addText(step, { x:0.5, y, w:0.5, h:0.38, fontSize:13, bold:true, color:PURPLE3, align:"center" });
    s.addText(title, { x:1.08, y: y+0.02, w:5.2, h:0.26, fontSize:12, bold:true, color:WHITE });
    s.addText(desc, { x:1.08, y: y+0.3, w:5.2, h:0.42, fontSize:9.5, color:MUTED });
    if (i < 3) s.addShape(pptx.ShapeType.line, { x:0.72, y: y+0.4, w:0, h:0.44, line:{ color:PURPLE3, width:0.5 } });
  });

  // B2B GTM
  card(s, 6.88, 1.15, 6.1, 3.82, { color:CARD, border:GREEN });
  s.addText("B2B Sales Pipeline", { x:7.08, y:1.22, w:5.7, h:0.3, fontSize:14, bold:true, color:GREEN });

  const b2bGTM = [
    { step:"01", title:"Direct Outreach", desc:"Target 500 law firms in Uzbekistan & Kazakhstan.\nDemo: '60% routine work eliminated in 30 days'" },
    { step:"02", title:"Legal Hackathons", desc:"Sponsor & run legaltech events.\nBuild brand among CIS legal professionals" },
    { step:"03", title:"API First", desc:"Developers embed Yurist AI into their products.\nRevenue share model for integration partners" },
    { step:"04", title:"Bar Association Partners", desc:"Official partnerships with Uzbek, Kazakh,\nRussian bar associations for credibility" },
  ];
  b2bGTM.forEach(({ step, title, desc }, i) => {
    const y = 1.62 + i * 0.82;
    s.addText(step, { x:7.02, y, w:0.5, h:0.38, fontSize:13, bold:true, color:GREEN, align:"center" });
    s.addText(title, { x:7.6, y: y+0.02, w:5.2, h:0.26, fontSize:12, bold:true, color:WHITE });
    s.addText(desc, { x:7.6, y: y+0.3, w:5.2, h:0.42, fontSize:9.5, color:MUTED });
    if (i < 3) s.addShape(pptx.ShapeType.line, { x:7.24, y: y+0.4, w:0, h:0.44, line:{ color:GREEN, width:0.5 } });
  });

  s.addShape(pptx.ShapeType.line, { x:6.62, y:1.15, w:0, h:3.82, line:{ color:PURPLE3, width:0.5 } });
}

// ════════════════════════════════════════════════════════
// SLIDE 7 — TRACTION & ROADMAP
// ════════════════════════════════════════════════════════
{
  const s = slide({ label:"TRACTION & ROADMAP", title:"Built. Shipped. Growing." });

  // Milestones — left
  const done = [
    { icon:"✅", t:"Full-stack platform live", d:"React · Node.js · PostgreSQL · production-ready" },
    { icon:"✅", t:"Multilingual AI engine", d:"CIS law trained · UZ / RU / EN supported" },
    { icon:"✅", t:"Core features complete", d:"Chat · Contract review · Document drafting" },
    { icon:"✅", t:"Pitch deck & video demo", d:"Investor materials complete" },
  ];
  s.addText("COMPLETED", { x:0.35, y:1.15, w:5.9, h:0.28, fontSize:9, bold:true, color:GREEN, charSpacing:3 });
  done.forEach(({ icon, t, d }, i) => {
    const y = 1.5 + i * 0.8;
    card(s, 0.35, y, 5.9, 0.7, { color:"081510", border:"14532d" });
    s.addText(icon, { x:0.5, y, w:0.5, h:0.7, fontSize:20, valign:"middle" });
    s.addText(t, { x:1.08, y: y+0.08, w:5.0, h:0.26, fontSize:12.5, bold:true, color:WHITE });
    s.addText(d, { x:1.08, y: y+0.36, w:5.0, h:0.22, fontSize:10, color:MUTED });
  });

  // Roadmap — right
  const roadmap = [
    { q:"Q3 2026", items:["1,000 registered users (B2C)", "5 paying B2B pilot clients", "Telegram Mini-App launch"], c:PURPLE2 },
    { q:"Q4 2026", items:["$10K MRR milestone", "50 B2B clients", "Kazakhstan market expansion"], c:AMBER },
    { q:"Q1 2027", items:["Series A preparation", "100K registered users", "White-label B2B product"], c:GREEN },
  ];
  s.addText("ROADMAP", { x:6.88, y:1.15, w:5.98, h:0.28, fontSize:9, bold:true, color:PURPLE2, charSpacing:3 });
  roadmap.forEach(({ q, items, c }, i) => {
    const y = 1.5 + i * 1.18;
    card(s, 6.88, y, 5.98, 1.08, { color:CARD });
    s.addShape(pptx.ShapeType.roundRect, { x:6.88, y, w:1.15, h:1.08, fill:{ color:PURPLE3, transparency:75 }, line:{ color:c, width:0.75 }, rectRadius:0.08 });
    s.addText(q, { x:6.88, y, w:1.15, h:1.08, fontSize:10, bold:true, color:c, align:"center", valign:"middle" });
    items.forEach((item, j) => {
      s.addText(`→  ${item}`, { x:8.1, y: y + 0.12 + j * 0.29, w:4.6, h:0.27, fontSize:10.5, color:j===0?WHITE:MUTED });
    });
  });

  s.addShape(pptx.ShapeType.line, { x:6.62, y:1.15, w:0, h:3.82, line:{ color:PURPLE3, width:0.5 } });
}

// ════════════════════════════════════════════════════════
// SLIDE 8 — COMPETITIVE LANDSCAPE
// ════════════════════════════════════════════════════════
{
  const s = slide({ label:"COMPETITIVE LANDSCAPE", title:"No One Owns CIS Legaltech — Yet" });

  // Table header
  const cols = ["Feature", "Yurist AI", "DoNotPay", "LegalZoom", "Local Lawyers"];
  const colW = [2.55, 2.3, 2.3, 2.3, 2.3];
  const colX = [0.35, 2.9, 5.2, 7.5, 9.8];
  const headerColors = [BG2, PURPLE3, "1e3a5f", "1e3a5f", "1e1e1e"];

  cols.forEach((col, i) => {
    s.addShape(pptx.ShapeType.rect, { x:colX[i], y:1.18, w:colW[i], h:0.36, fill:{ color:headerColors[i] }, line:{ color:PURPLE3, width:0.3 } });
    s.addText(col, { x:colX[i], y:1.18, w:colW[i], h:0.36, fontSize:11, bold:true, color: i===1 ? WHITE : MUTED, align:"center", valign:"middle" });
  });

  const rows = [
    ["CIS Law Coverage",      "✅ Full",    "❌ None",   "❌ None",   "✅ Varies"],
    ["Uzbek Language",        "✅ Native",  "❌ None",   "❌ None",   "⚠️ Rare"],
    ["AI-Powered",            "✅ Yes",     "✅ Yes",    "⚠️ Partial","❌ No"],
    ["<$10/month",            "✅ $0–$5",   "✅ $3",     "❌ $39+",   "❌ $150+"],
    ["Contract Review",       "✅ Yes",     "⚠️ Limited","✅ Yes",    "✅ Yes"],
    ["B2B API",               "✅ Yes",     "❌ No",     "⚠️ Limited","❌ No"],
    ["Available 24/7",        "✅ Yes",     "✅ Yes",    "⚠️ Partial","❌ No"],
    ["Document Generation",   "✅ Yes",     "✅ Yes",    "✅ Yes",    "✅ Slow"],
  ];

  rows.forEach((row, ri) => {
    const y = 1.62 + ri * 0.4;
    const rowBg = ri % 2 === 0 ? "0a0a18" : BG;
    row.forEach((cell, ci) => {
      s.addShape(pptx.ShapeType.rect, { x:colX[ci], y, w:colW[ci], h:0.38, fill:{ color: ci===1 ? "180830" : rowBg }, line:{ color:"1a1a35", width:0.3 } });
      const isGreen = cell.startsWith("✅");
      const isRed   = cell.startsWith("❌");
      const isAmber = cell.startsWith("⚠️");
      s.addText(cell, { x:colX[ci], y, w:colW[ci], h:0.38, fontSize:10.5, color: ci===1 ? GREEN : isGreen ? GREEN : isRed ? RED : isAmber ? AMBER : MUTED, align:"center", valign:"middle" });
    });
  });

  card(s, 0.35, 4.88, 12.63, 0.28, { color:"0d0418", border:PURPLE3 });
  s.addText("Yurist AI is the only platform built specifically for CIS law, in CIS languages, at CIS price points — with full B2B API.", { x:0.5, y:4.88, w:12.4, h:0.28, fontSize:10.5, color:PURPLE2, align:"center", valign:"middle" });
}

// ════════════════════════════════════════════════════════
// SLIDE 9 — FINANCIAL PROJECTIONS
// ════════════════════════════════════════════════════════
{
  const s = slide({ label:"FINANCIAL PROJECTIONS", title:"Path to $1M ARR by Year 3" });

  const years = [
    { y:"Year 1\n2026", b2c:12000, b2b:28000, total:40000, users:"500", clients:"20" },
    { y:"Year 2\n2027", b2c:85000, b2b:165000, total:250000, users:"5,000", clients:"150" },
    { y:"Year 3\n2028", b2c:350000, b2b:650000, total:1000000, users:"25,000", clients:"500" },
  ];

  years.forEach(({ y, b2c, b2b, total, users, clients }, i) => {
    const x = 0.35 + i * 4.32;
    card(s, x, 1.15, 4.05, 3.62, { color:CARD, border: i===2 ? PURPLE : PURPLE3, glow: i===2 });

    // Year label
    s.addText(y, { x, y:1.22, w:4.05, h:0.5, fontSize:14, bold:true, color: i===2?PURPLE2:WHITE, align:"center" });

    // ARR
    s.addText(total >= 1000000 ? "$1M ARR" : total >= 100000 ? `$${(total/1000).toFixed(0)}K ARR` : `$${(total/1000).toFixed(0)}K ARR`,
      { x, y:1.75, w:4.05, h:0.65, fontSize:38, bold:true, color: i===2?PURPLE2:WHITE, align:"center", charSpacing:-2 });

    // B2C bar
    const maxVal = 1000000;
    const b2cPct = b2c / maxVal;
    const b2bPct = b2b / maxVal;
    const barW = 3.3;
    const barX = x + 0.38;

    s.addText("B2C", { x:barX, y:2.5, w:0.5, h:0.24, fontSize:9, bold:true, color:PURPLE2 });
    s.addShape(pptx.ShapeType.rect, { x:barX+0.52, y:2.52, w:barW*b2cPct, h:0.2, fill:{ color:PURPLE }, line:{ color:PURPLE } });
    s.addText(`$${(b2c/1000).toFixed(0)}K`, { x:barX+0.56+barW*b2cPct, y:2.5, w:0.8, h:0.24, fontSize:9, color:PURPLE2 });

    s.addText("B2B", { x:barX, y:2.8, w:0.5, h:0.24, fontSize:9, bold:true, color:GREEN });
    s.addShape(pptx.ShapeType.rect, { x:barX+0.52, y:2.82, w:barW*b2bPct, h:0.2, fill:{ color:GREEN }, line:{ color:GREEN } });
    s.addText(`$${(b2b/1000).toFixed(0)}K`, { x:barX+0.56+barW*b2bPct, y:2.8, w:0.8, h:0.24, fontSize:9, color:GREEN });

    // Stats
    s.addShape(pptx.ShapeType.line, { x:x+0.3, y:3.2, w:3.45, h:0, line:{ color:PURPLE3, width:0.3 } });
    s.addText(`👤 ${users} paid users`, { x, y:3.28, w:4.05, h:0.26, fontSize:10, color:MUTED, align:"center" });
    s.addText(`🏢 ${clients} B2B clients`, { x, y:3.56, w:4.05, h:0.26, fontSize:10, color:MUTED, align:"center" });
    s.addText(i===0?"Conservative":"" + (i===2?" 🎯 Target":""), { x, y:3.85, w:4.05, h:0.26, fontSize:9, color: i===2?PURPLE2:MUTED, align:"center", bold: i===2 });
  });

  // Assumptions
  card(s, 0.35, 4.88, 12.63, 0.3, { color:"0d0418", border:PURPLE3 });
  s.addText("Assumptions: B2C 8% free→paid conversion · B2B avg $200/mo · 15% monthly growth · Conservative churn 5%/mo", { x:0.5, y:4.88, w:12.4, h:0.3, fontSize:9, color:MUTED, align:"center", valign:"middle" });
}

// ════════════════════════════════════════════════════════
// SLIDE 10 — THE TEAM
// ════════════════════════════════════════════════════════
{
  const s = slide({ label:"THE TEAM", title:"Built by Someone Who Lived the Problem" });

  // Founder card
  card(s, 1.5, 1.2, 10.3, 2.2, { color:CARD, border:PURPLE3, glow:true });

  // Avatar placeholder
  s.addShape(pptx.ShapeType.ellipse, { x:2.0, y:1.38, w:1.6, h:1.6, fill:{ color:PURPLE3 }, line:{ color:PURPLE2, width:1 } });
  s.addText("👨‍💻", { x:2.0, y:1.38, w:1.6, h:1.6, fontSize:44, align:"center", valign:"middle" });

  s.addText("Founder & CEO", { x:3.85, y:1.32, w:7.5, h:0.28, fontSize:11, color:MUTED, bold:true, charSpacing:2 });
  s.addText("Javohir Bahtiyorov", { x:3.85, y:1.58, w:7.5, h:0.52, fontSize:30, bold:true, color:WHITE });
  s.addText("Full-stack engineer · Legal domain specialist · Based in Uzbekistan", { x:3.85, y:2.1, w:7.5, h:0.28, fontSize:12, color:PURPLE2 });

  const traits = ["React · Node.js · PostgreSQL", "Multilingual (UZ/RU/EN)", "CIS legal system expertise", "Built Yurist AI solo"];
  traits.forEach((t, i) => {
    s.addText(`✦  ${t}`, { x:3.85 + (i%2)*3.8, y:2.48 + Math.floor(i/2)*0.28, w:3.7, h:0.26, fontSize:11, color:i<2?WHITE:MUTED });
  });

  // Advisors wanted
  card(s, 0.35, 3.58, 12.63, 1.0, { color:"0a0a1a", border:PURPLE3 });
  s.addText("Advisors & Hiring with Funding", { x:0.55, y:3.64, w:12.2, h:0.28, fontSize:12, bold:true, color:PURPLE2 });
  const hires = [
    { role:"Legal Advisor", desc:"CIS-licensed attorney to validate AI outputs" },
    { role:"Growth Hacker", desc:"CIS social media & Telegram growth specialist" },
    { role:"B2B Sales Lead", desc:"Legal firm relationships & enterprise deals" },
    { role:"ML Engineer", desc:"Fine-tune legal AI models on CIS case law" },
  ];
  hires.forEach(({ role, desc }, i) => {
    s.addText(`${role} — `, { x:0.55 + (i%2)*6.35, y:4.0, w:1.8, h:0.26, fontSize:10, bold:true, color:GREEN });
    s.addText(desc, { x:0.55 + (i%2)*6.35 + 1.82, y:4.0, w:4.4, h:0.26, fontSize:10, color:MUTED });
  });

  s.addText("javohirbahtiyorov2001@gmail.com", { x:0.35, y:4.7, w:12.63, h:0.24, fontSize:10, color:MUTED, align:"center" });
}

// ════════════════════════════════════════════════════════
// SLIDE 11 — THE ASK
// ════════════════════════════════════════════════════════
{
  const s = slide({ label:"THE ASK", title:"$150,000 Seed Round — Join the Mission" });

  // Big ask number
  s.addShape(pptx.ShapeType.ellipse, { x:4.5, y:0.9, w:4.3, h:2.5, fill:{ color:PURPLE3, transparency:88 }, line:{ color:PURPLE3, transparency:88 }, shadow:{ type:"outer", blur:80, offset:0, angle:90, color:PURPLE, opacity:0.4 } });
  s.addText("$150K", { x:3.5, y:1.05, w:6.3, h:1.5, fontSize:82, bold:true, color:WHITE, align:"center", charSpacing:-4, shadow: glow() });
  s.addText("SEED ROUND  ·  18-MONTH RUNWAY", { x:3.5, y:2.5, w:6.3, h:0.3, fontSize:11, color:MUTED, align:"center", bold:true, charSpacing:2 });

  // Use of funds
  const funds = [
    { pct:"40%", label:"Product & AI",       desc:"Model fine-tuning, features, mobile app",    color:PURPLE, x:0.35 },
    { pct:"30%", label:"Marketing & Growth",  desc:"B2C acquisition, B2B outreach, content",     color:AMBER,  x:3.58 },
    { pct:"20%", label:"Legal & Compliance",  desc:"CIS legal validation, bar partnerships",     color:GREEN,  x:6.81 },
    { pct:"10%", label:"Operations",          desc:"Infrastructure, team, office",               color:BLUE,   x:10.04 },
  ];
  funds.forEach(({ pct, label, desc, color, x }) => {
    card(s, x, 2.95, 3.05, 1.38, { color:CARD });
    s.addShape(pptx.ShapeType.rect, { x, y:2.95, w:3.05, h:0.06, fill:{ color }, line:{ color } });
    s.addText(pct, { x, y:3.05, w:3.05, h:0.62, fontSize:36, bold:true, color, align:"center", charSpacing:-1 });
    s.addText(label, { x, y:3.68, w:3.05, h:0.26, fontSize:11, bold:true, color:WHITE, align:"center" });
    s.addText(desc, { x, y:3.96, w:3.05, h:0.3, fontSize:9, color:MUTED, align:"center" });
  });

  // What they get
  card(s, 0.35, 4.45, 12.63, 0.72, { color:"0d0418", border:PURPLE3 });
  s.addText("What Investors Get", { x:0.55, y:4.5, w:3.0, h:0.24, fontSize:10, bold:true, color:PURPLE2 });
  const gets = ["Equity stake in the first CIS AI legaltech platform", "First-mover advantage in a $2B untapped market", "Conservative 10× return potential in 3–4 years", "Monthly investor updates & board seat (lead)"];
  gets.forEach((g, i) => {
    s.addText(`✦  ${g}`, { x:0.55 + (i%2)*6.4, y:4.75 + Math.floor(i/2)*0.26, w:6.2, h:0.24, fontSize:10, color:i < 2 ? WHITE : MUTED });
  });
}

// ════════════════════════════════════════════════════════
// SLIDE 12 — CLOSING
// ════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:"100%", h:"100%", fill:{ color:BG }, line:{ color:BG } });
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:"100%", h:0.04, fill:{ color:PURPLE3 }, line:{ color:PURPLE3 } });

  // Orb
  s.addShape(pptx.ShapeType.ellipse, { x:4.3, y:0.3, w:4.7, h:4.7, fill:{ color:PURPLE3, transparency:86 }, line:{ color:PURPLE3, transparency:86 }, shadow:{ type:"outer", blur:100, offset:0, angle:90, color:PURPLE, opacity:0.55 } });
  s.addShape(pptx.ShapeType.ellipse, { x:4.95, y:0.85, w:3.4, h:3.4, fill:{ color:PURPLE, transparency:78 }, line:{ color:PURPLE, transparency:78 } });
  s.addShape(pptx.ShapeType.ellipse, { x:5.6, y:1.4, w:2.1, h:2.1, fill:{ color:PURPLE2, transparency:60 }, line:{ color:PURPLE2, transparency:60 } });

  s.addText("Yurist AI", { x:0.5, y:0.9, w:12.3, h:1.3, fontSize:90, bold:true, color:WHITE, align:"center", charSpacing:-3 });
  s.addText("Know Your Rights.", { x:0.5, y:2.05, w:12.3, h:0.55, fontSize:28, color:PURPLE2, align:"center" });
  s.addText("Huquqingizni biling.   ·   Знайте свои права.", { x:0.5, y:2.62, w:12.3, h:0.38, fontSize:16, color:MUTED, align:"center" });

  s.addShape(pptx.ShapeType.line, { x:4.8, y:3.15, w:3.7, h:0, line:{ color:PURPLE3, width:0.6 } });

  s.addText("javohirbahtiyorov2001@gmail.com  ·  yurist.ai  ·  Tashkent, Uzbekistan", { x:0.5, y:3.28, w:12.3, h:0.32, fontSize:13, color:MUTED, align:"center" });

  // Pills
  const tags = ["🇷🇺 Русский","🇺🇿 O'zbek","🇬🇧 English","⚖️ AI Юрист","💼 B2B SaaS","👤 B2C App","🌍 CIS Market"];
  const startX = (13.33 - tags.length * 1.92) / 2;
  tags.forEach((tag, i) => {
    pill(s, startX + i * 1.93, 3.78, tag, PURPLE2);
  });

  s.addText("Seed Round  ·  $150,000  ·  2026", { x:0.5, y:4.55, w:12.3, h:0.3, fontSize:12, bold:true, color:PURPLE3, align:"center", charSpacing:3 });
}

// ── Save ─────────────────────────────────────────────────
const outPath = path.join(__dirname, "yurist-ai-investor-deck.pptx");
pptx.writeFile({ fileName: outPath })
  .then(() => console.log("✅  Saved:", outPath))
  .catch(e  => console.error("❌", e));
