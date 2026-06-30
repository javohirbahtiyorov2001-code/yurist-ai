const path = require("path");
const PptxGenJS = require("pptxgenjs");
const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE"; // 13.33" × 7.5"

const BG = "080810"; const CARD = "0f0f28";
const PURPLE = "A855F7"; const PURPLE2 = "C084FC"; const PURPLE3 = "7C3AED";
const WHITE = "FFFFFF"; const MUTED = "6B6B88";
const GREEN = "34D399"; const AMBER = "FBBF24"; const RED = "F87171"; const BLUE = "60A5FA";

const STRIPE = 0.08;
const LABEL_Y = 0.32;
const TITLE_Y = 0.68;
const C = 1.52;   // content start
const F = 6.75;   // footer Y

const shadow = () => ({ type:"outer", blur:16, offset:3, angle:90, color:"000000", opacity:0.45 });
const glow   = () => ({ type:"outer", blur:30, offset:0, angle:90, color:PURPLE3, opacity:0.35 });

function slide(opts = {}) {
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:"100%", h:"100%", fill:{ color:BG }, line:{ color:BG } });
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:"100%", h:STRIPE, fill:{ color:PURPLE3 }, line:{ color:PURPLE3 } });
  if (opts.label) s.addText(opts.label, { x:0.42, y:LABEL_Y, w:12.4, h:0.26, fontSize:9, bold:true, color:PURPLE2, charSpacing:4 });
  if (opts.title) s.addText(opts.title, { x:0.42, y:TITLE_Y, w:12.4, h:0.62, fontSize:opts.sz||31, bold:true, color:WHITE, charSpacing:-0.5 });
  return s;
}
function card(s, x, y, w, h, opts = {}) {
  s.addShape(pptx.ShapeType.roundRect, { x, y, w, h,
    fill:{ color:opts.color||CARD }, line:{ color:opts.border||PURPLE3, width:opts.lw||0.5 },
    rectRadius:0.12, shadow:opts.glow ? glow() : shadow() });
}
function pill(s, x, y, text, color) {
  s.addShape(pptx.ShapeType.roundRect, { x, y, w:2.0, h:0.28, fill:{ color:"000000", transparency:70 }, line:{ color, width:0.75 }, rectRadius:0.14 });
  s.addText(text, { x, y, w:2.0, h:0.28, fontSize:8, bold:true, color, align:"center", valign:"middle" });
}

// ═══════════════════════════════════════════════
// SLAYD 1 — MUQOVA
// ═══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:"100%", h:"100%", fill:{ color:BG }, line:{ color:BG } });
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:"100%", h:STRIPE, fill:{ color:PURPLE3 }, line:{ color:PURPLE3 } });
  s.addShape(pptx.ShapeType.ellipse, { x:4.2, y:0.6, w:4.9, h:4.9, fill:{ color:PURPLE3, transparency:86 }, line:{ color:PURPLE3, transparency:86 }, shadow:{ type:"outer", blur:110, offset:0, angle:90, color:PURPLE3, opacity:0.55 } });
  s.addShape(pptx.ShapeType.ellipse, { x:4.8, y:1.15, w:3.7, h:3.7, fill:{ color:PURPLE, transparency:78 }, line:{ color:PURPLE, transparency:78 } });
  s.addShape(pptx.ShapeType.ellipse, { x:5.4, y:1.65, w:2.5, h:2.5, fill:{ color:PURPLE2, transparency:60 }, line:{ color:PURPLE2, transparency:60 } });
  s.addShape(pptx.ShapeType.roundRect, { x:5.5, y:0.35, w:2.3, h:0.3, fill:{ color:PURPLE3, transparency:75 }, line:{ color:PURPLE2, width:0.5 }, rectRadius:0.15 });
  s.addText("AI · YURIDIK PLATFORMA", { x:5.5, y:0.35, w:2.3, h:0.3, fontSize:7, bold:true, color:PURPLE2, align:"center", valign:"middle", charSpacing:2 });
  s.addText("Yurist AI", { x:0.5, y:1.25, w:12.3, h:1.55, fontSize:92, bold:true, color:WHITE, align:"center", charSpacing:-3 });
  s.addText("MDHning 300 mln+ fuqarosi uchun AI yuridik yordamchi platforma", { x:0.5, y:2.75, w:12.3, h:0.55, fontSize:21, color:PURPLE2, align:"center" });
  s.addShape(pptx.ShapeType.line, { x:4.5, y:3.5, w:4.3, h:0, line:{ color:PURPLE3, width:0.75 } });
  s.addText([
    { text:"B2C  ", options:{ color:PURPLE2, bold:true } },
    { text:"Fuqarolar uchun ilova  ·  ", options:{ color:MUTED } },
    { text:"B2B  ", options:{ color:GREEN, bold:true } },
    { text:"Yuridik firmalar va biznes uchun SaaS", options:{ color:MUTED } },
  ], { x:0.5, y:3.65, w:12.3, h:0.38, fontSize:12.5, align:"center" });
  pill(s, 4.0,  4.25, "🇺🇿  O'zbek",  GREEN);
  pill(s, 6.17, 4.25, "🇷🇺  Русский", PURPLE2);
  pill(s, 8.34, 4.25, "🇬🇧  English", BLUE);
  s.addText("URU' RAUND  ·  $150 000  ·  2026", { x:0.5, y:5.2, w:12.3, h:0.32, fontSize:11, bold:true, color:MUTED, align:"center", charSpacing:3 });
}

// ═══════════════════════════════════════════════
// SLAYD 2 — MUAMMO
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"MUAMMO", title:"MDHning 300 mln aholisi va biznesi uchun yuridik yordam mavjud emas" });
  card(s, 0.4, C, 5.9, 0.4, { color:"1a0533", border:PURPLE });
  s.addText("👤  B2C  —  Fuqarolar", { x:0.4, y:C, w:5.9, h:0.4, fontSize:13, bold:true, color:PURPLE2, align:"center", valign:"middle" });
  card(s, 6.93, C, 5.9, 0.4, { color:"0a2018", border:GREEN });
  s.addText("🏢  B2B  —  Biznes va yuridik firmalar", { x:6.93, y:C, w:5.9, h:0.4, fontSize:13, bold:true, color:GREEN, align:"center", valign:"middle" });

  const RH = 1.08; const RS = 1.2;
  [
    { icon:"💸", t:"Advokat $150–400 oladi", s:"MDH fuqarolarining atigi 8% advokatga murojaat qiladi" },
    { icon:"⏳", t:"Qabul uchun haftalar kutiladi", s:"Onlayn yozilish yo'q, darhol javob yo'q" },
    { icon:"🌐", t:"Til to'siqi kirish imkonini yopadi", s:"Hujjatlar rasmiy ruscha, o'zbek tilida yo'q" },
    { icon:"😰", t:"Odamlar huquqini bilmasdan voz kechadi", s:"70% ish haqi kechikishi uchun sudga borish mumkinligini bilmaydi" },
  ].forEach(({ icon, t, s: sub }, i) => {
    const y = C + 0.5 + i * RS;
    card(s, 0.4, y, 5.9, RH, { color:"120820" });
    s.addText(icon, { x:0.55, y, w:0.55, h:RH, fontSize:22, valign:"middle" });
    s.addText(t,   { x:1.18, y: y+0.1,  w:4.95, h:0.3,  fontSize:12.5, bold:true, color:WHITE });
    s.addText(sub, { x:1.18, y: y+0.46, w:4.95, h:0.26, fontSize:10.5, color:MUTED });
  });
  [
    { icon:"📋", t:"Shartnomani ko'rib chiqish 3–5 kun", s:"Advokatlar oddiy hujjatlar uchun $200+/soat oladi" },
    { icon:"👩‍💼", t:"Kichik biznes advokat tutolmaydi", s:"MDH bizneslarining 85% yuridik bo'limsiz ishlaydi" },
    { icon:"🔄", t:"Takroriy ishlar foydani yo'q qiladi", s:"Advokatlar vaqtining 60% andoza hujjatlarga sarflanadi" },
    { icon:"📊", t:"MDH huquqi uchun AI vositasi yo'q", s:"G'arb legaltexi MDH yurisdiktsiyasini qamrab olmaydi" },
  ].forEach(({ icon, t, s: sub }, i) => {
    const y = C + 0.5 + i * RS;
    card(s, 6.93, y, 5.9, RH, { color:"081510" });
    s.addText(icon, { x:7.08, y, w:0.55, h:RH, fontSize:22, valign:"middle" });
    s.addText(t,   { x:7.7,  y: y+0.1,  w:4.95, h:0.3,  fontSize:12.5, bold:true, color:WHITE });
    s.addText(sub, { x:7.7,  y: y+0.46, w:4.95, h:0.26, fontSize:10.5, color:MUTED });
  });
  s.addShape(pptx.ShapeType.line, { x:6.57, y:C, w:0, h:5.12, line:{ color:PURPLE3, width:0.5 } });
  card(s, 0.4, F, 12.53, 0.38, { color:"0d0418", border:PURPLE3 });
  s.addText([
    { text:"Faqat 8% ", options:{ color:RED, bold:true } }, { text:"MDH fuqarosi advokatga boradi  ·  ", options:{ color:MUTED } },
    { text:"$2 mlrd+ ", options:{ color:AMBER, bold:true } }, { text:"yuridik xizm. bozori  ·  ", options:{ color:MUTED } },
    { text:"<5% ", options:{ color:GREEN, bold:true } }, { text:"raqamli kirib borish", options:{ color:MUTED } },
  ], { x:0.4, y:F, w:12.53, h:0.38, fontSize:12, align:"center", valign:"middle" });
}

// ═══════════════════════════════════════════════
// SLAYD 3 — YECHIM
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"YECHIM", title:"Bitta platforma. Ikki yo'nalish. Hech qanday to'siq yo'q." });
  s.addShape(pptx.ShapeType.ellipse, { x:5.18, y:1.6, w:2.95, h:2.95, fill:{ color:PURPLE3, transparency:80 }, line:{ color:PURPLE3, transparency:80 }, shadow:{ type:"outer", blur:65, offset:0, angle:90, color:PURPLE3, opacity:0.5 } });
  s.addText("⚖️", { x:5.18, y:2.0, w:2.95, h:1.6, fontSize:54, align:"center", valign:"middle" });
  s.addText("Yurist AI", { x:4.8, y:3.65, w:3.7, h:0.42, fontSize:18, bold:true, color:WHITE, align:"center" });

  const FS = 1.28; const FH = 1.12;
  [
    { icon:"💬", t:"AI maslahat", d:"Huquqlar oddiy tilda tushuntiriladi" },
    { icon:"📄", t:"Shartnoma tahlili", d:"Xavfli bandlar darhol aniqlanadi" },
    { icon:"📝", t:"Hujjat tuzish", d:"Ariza, shikoyat — soniyalarda" },
    { icon:"🌐", t:"3 til qo'llab-quvvatlash", d:"UZ · RU · EN — barchasi mavjud" },
  ].forEach(({ icon, t, d }, i) => {
    const y = C + i * FS;
    card(s, 0.35, y, 4.65, FH, { color:"120820" });
    s.addText(icon, { x:0.5,  y, w:0.58, h:FH, fontSize:24, valign:"middle" });
    s.addText(t, { x:1.16, y: y+0.1,  w:3.72, h:0.3,  fontSize:13, bold:true, color:WHITE });
    s.addText(d, { x:1.16, y: y+0.46, w:3.72, h:0.26, fontSize:10.5, color:MUTED });
    s.addShape(pptx.ShapeType.line, { x:5.0, y: y+FH/2, w:0.45, h:0, line:{ color:PURPLE3, width:0.5 } });
  });
  [
    { icon:"🤖", t:"AI shartnoma analizatori", d:"API orqali ommaviy hujjat qayta ishlash" },
    { icon:"🔗", t:"API va integratsiyalar", d:"Istalgan yuridik jarayonga ulang" },
    { icon:"👥", t:"Jamoa hisobvaraqlari", d:"Ko'p o'rinli, rol boshqaruvi bilan" },
    { icon:"📊", t:"Analitika paneli", d:"Xavf balli, foydalanish, tejash" },
  ].forEach(({ icon, t, d }, i) => {
    const y = C + i * FS;
    card(s, 8.33, y, 4.65, FH, { color:"081510" });
    s.addText(icon, { x:8.48, y, w:0.58, h:FH, fontSize:24, valign:"middle" });
    s.addText(t, { x:9.12, y: y+0.1,  w:3.72, h:0.3,  fontSize:13, bold:true, color:WHITE });
    s.addText(d, { x:9.12, y: y+0.46, w:3.72, h:0.26, fontSize:10.5, color:MUTED });
    s.addShape(pptx.ShapeType.line, { x:7.88, y: y+FH/2, w:0.47, h:0, line:{ color:GREEN, width:0.5 } });
  });
  s.addText("B2C  Fuqarolar ilovasi", { x:0.35, y:C+4*FS+0.12, w:4.65, h:0.28, fontSize:10, bold:true, color:PURPLE2, align:"center" });
  s.addText("B2B  Korporativ SaaS", { x:8.33, y:C+4*FS+0.12, w:4.65, h:0.28, fontSize:10, bold:true, color:GREEN, align:"center" });
}

// ═══════════════════════════════════════════════
// SLAYD 4 — BOZOR
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"BOZOR IMKONIYATI", title:"$2 mlrd+ bozor, raqamli kirib borish 5% dan kam" });
  [
    { v:"300 mln+", l:"MDH aholisi",          s:"Jami maqsadli auditoriya",        c:PURPLE2 },
    { v:"$2 mlrd+", l:"Yuridik xizm. bozori", s:"MDHda yillik yuridik xarajatlar", c:GREEN },
    { v:"<5%",      l:"Raqamli kirib borish",  s:"Bugungi legaltek qabuli",         c:AMBER },
    { v:"74%",      l:"Smartfon foydalanuvchi",s:"Yildan-yilga o'sib bormoqda",    c:BLUE },
  ].forEach(({ v, l, s: sub, c }, i) => {
    const x = 0.35 + i * 3.22;
    card(s, x, C, 3.05, 2.32, { color:CARD });
    s.addText(v,   { x, y:C+0.12, w:3.05, h:1.08, fontSize:50, bold:true, color:c, align:"center", charSpacing:-2 });
    s.addText(l,   { x, y:C+1.22, w:3.05, h:0.34, fontSize:13, bold:true, color:WHITE, align:"center" });
    s.addText(sub, { x, y:C+1.58, w:3.05, h:0.26, fontSize:10, color:MUTED, align:"center" });
  });
  card(s, 0.35, C+2.48, 12.63, 1.02, { color:CARD });
  s.addText("Bozor hajmi", { x:0.55, y:C+2.54, w:2.0, h:0.28, fontSize:10.5, bold:true, color:MUTED });
  [{ l:"TAM", v:"$2,1 mlrd", d:"MDH yuridik xizm. jami bozori" },
   { l:"SAM", v:"$420 mln",  d:"Raqamli segment B2C+B2B" },
   { l:"SOM", v:"$21 mln",   d:"3 yillik maqsad (SAMning 1%)" }].forEach(({ l, v, d }, i) => {
    const x = 0.7 + i * 4.2;
    s.addText(l, { x, y:C+2.56, w:0.7,  h:0.28, fontSize:12, bold:true, color:[PURPLE,GREEN,AMBER][i] });
    s.addText(v, { x:x+0.76, y:C+2.5,  w:1.6,  h:0.38, fontSize:26, bold:true, color:WHITE });
    s.addText(d, { x:x+2.42, y:C+2.58, w:1.7,  h:0.24, fontSize:9.5, color:MUTED });
  });
  card(s, 0.35, C+3.68, 6.1, 0.96, { color:"120820", border:PURPLE3 });
  s.addText("B2C imkoniyat", { x:0.55, y:C+3.74, w:5.7, h:0.26, fontSize:12, bold:true, color:PURPLE2 });
  s.addText("300 mln potentsial foydalanuvchi · $2.50/oy → 10% konversiyada $750 mln ARR", { x:0.55, y:C+4.02, w:5.7, h:0.42, fontSize:10.5, color:MUTED });
  card(s, 6.88, C+3.68, 6.05, 0.96, { color:"081510", border:GREEN });
  s.addText("B2B imkoniyat", { x:7.08, y:C+3.74, w:5.6, h:0.26, fontSize:12, bold:true, color:GREEN });
  s.addText("50 000+ MDH yuridik firmalari + 500K kichik biznes · $50/oy → 1% da $300 mln ARR", { x:7.08, y:C+4.02, w:5.6, h:0.42, fontSize:10.5, color:MUTED });
}

// ═══════════════════════════════════════════════
// SLAYD 5 — BIZNES MODEL
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"BIZNES MODEL", title:"Ikki daromad manbai — bitta platforma" });
  s.addText("B2C  —  Fuqarolar obunasi", { x:0.35, y:C, w:6.1, h:0.34, fontSize:13.5, bold:true, color:PURPLE2 });
  const TH = 1.38; const TS = 1.52;
  [
    { n:"Bepul",  p:"$0",  per:"abadiy",  note:"3 so'rov/oy · Viral jalb etish",         c:MUTED,   bg:"0a0a1a", brd:"333355" },
    { n:"Pro",    p:"$5",  per:"/ oyiga", note:"Cheksiz · Hujjatlar · Ustuvor AI",        c:PURPLE2, bg:"120820", brd:PURPLE3 },
    { n:"Oila",   p:"$12", per:"/ oyiga", note:"5 a'zo · To'liq kirish imkoniyati",      c:BLUE,    bg:"080e20", brd:"1e3a8a" },
  ].forEach(({ n, p, per, note, c, bg, brd }, i) => {
    const y = C + 0.44 + i * TS;
    card(s, 0.35, y, 6.1, TH, { color:bg, border:brd });
    s.addText(n,    { x:0.55, y: y+0.1,  w:2.0, h:0.32, fontSize:14, bold:true, color:c });
    s.addText(p,    { x:2.8,  y: y+0.06, w:1.3, h:0.44, fontSize:30, bold:true, color:WHITE, align:"right" });
    s.addText(per,  { x:4.16, y: y+0.18, w:1.3, h:0.26, fontSize:12, color:MUTED });
    s.addText(note, { x:0.55, y: y+0.62, w:5.7, h:0.26, fontSize:10.5, color:MUTED });
    s.addText(i===0?"Bepul boshlang":"✓ Kiritilgan", { x:0.55, y: y+0.94, w:5.7, h:0.28, fontSize:10, color:i===0?MUTED:GREEN });
  });
  card(s, 0.35, C+4.0+0.54, 6.1, 0.72, { color:"0a0a1a", border:PURPLE3 });
  s.addText([{ text:"Freemium voronkasi → ", options:{ color:MUTED } }, { text:"8% ", options:{ color:PURPLE2, bold:true } },
    { text:"Pro konversiya → ", options:{ color:MUTED } }, { text:"$120K ARR ", options:{ color:GREEN, bold:true } },
    { text:"2 000 to'lovchi foydalanuvchida", options:{ color:MUTED } }],
    { x:0.5, y:C+4.0+0.54, w:5.9, h:0.72, fontSize:11, valign:"middle" });

  s.addText("B2B  —  Korporativ SaaS", { x:7.0, y:C, w:5.98, h:0.34, fontSize:13.5, bold:true, color:GREEN });
  [
    { n:"Starter",   p:"$49",    per:"/ oy",  note:"3 o'rin · 100 shartnoma/oy · API",        c:GREEN, bg:"081510", brd:"14532d" },
    { n:"Business",  p:"$199",   per:"/ oy",  note:"10 o'rin · Cheksiz · Boshqaruv paneli",   c:AMBER, bg:"0e0c08", brd:"713f12" },
    { n:"Enterprise",p:"Kelish.",per:"",       note:"White-label · O'z AI modeli · 24/7 yordam",c:RED,  bg:"120808", brd:"7f1d1d" },
  ].forEach(({ n, p, per, note, c, bg, brd }, i) => {
    const y = C + 0.44 + i * TS;
    card(s, 7.0, y, 5.98, TH, { color:bg, border:brd });
    s.addText(n,    { x:7.18, y: y+0.1,  w:2.0,  h:0.32, fontSize:14, bold:true, color:c });
    s.addText(p,    { x:9.2,  y: y+0.06, w:1.7,  h:0.44, fontSize:p==="Kelish."?18:30, bold:true, color:WHITE, align:"right" });
    s.addText(per,  { x:10.95,y: y+0.18, w:0.95, h:0.26, fontSize:11, color:MUTED });
    s.addText(note, { x:7.18, y: y+0.62, w:5.6,  h:0.26, fontSize:10.5, color:MUTED });
  });
  card(s, 7.0, C+4.0+0.54, 5.98, 0.72, { color:"081510", border:GREEN });
  s.addText([{ text:"Maqsad: 1-yilda 50 B2B mijoz → ", options:{ color:MUTED } },
    { text:"$150K ARR ", options:{ color:GREEN, bold:true } }, { text:"faqat B2Bdan", options:{ color:MUTED } }],
    { x:7.15, y:C+4.0+0.54, w:5.7, h:0.72, fontSize:11.5, valign:"middle" });

  s.addShape(pptx.ShapeType.line, { x:6.62, y:C, w:0, h:5.2, line:{ color:PURPLE3, width:0.5 } });
}

// ═══════════════════════════════════════════════
// SLAYD 6 — BOZORGA CHIQISH
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"BOZORGA CHIQISH STRATEGIYASI", title:"B2C viral o'sish + B2B to'g'ridan-to'g'ri sotish" });
  const CH = 5.12;
  card(s, 0.35, C, 6.1, CH, { color:CARD, border:PURPLE3 });
  s.addText("B2C o'sish mexanizmi", { x:0.55, y:C+0.1, w:5.7, h:0.3, fontSize:13.5, bold:true, color:PURPLE2 });
  [
    { step:"01", t:"Viral kontent siklasi", d:"Telegram va TikTokda AI yuridik maslahatlar.\n«Noqonuniy ishdan bo'shatildi — Yurist AI nima dedi»" },
    { step:"02", t:"Telegram Mini-App", d:"MDHning 1-raqamli ilovasi.\n200 mln+ Telegram foydalanuvchisi — maqsadli bozor" },
    { step:"03", t:"SEO arbitraj", d:"«Nima qilsam bo'ladi agar...» — raqobat yo'q,\nyuridik so'rovlar bo'yicha yuqori talab" },
    { step:"04", t:"Notijorat tashkilotlar bilan hamkorlik", d:"Iste'molchilar huquqlari, kasaba uyushmalari —\nbepul tarif orqali tarqatish kanali" },
  ].forEach(({ step, t, d }, i) => {
    const y = C + 0.52 + i * 1.12;
    s.addText(step, { x:0.5,  y: y+0.04, w:0.5,  h:0.34, fontSize:13, bold:true, color:PURPLE3, align:"center" });
    s.addText(t,   { x:1.08, y: y+0.04, w:5.15, h:0.28, fontSize:12.5, bold:true, color:WHITE });
    s.addText(d,   { x:1.08, y: y+0.36, w:5.15, h:0.54, fontSize:10, color:MUTED });
    if (i<3) s.addShape(pptx.ShapeType.line, { x:0.72, y: y+0.98, w:0, h:0.16, line:{ color:PURPLE3, width:0.5 } });
  });
  card(s, 6.88, C, 6.1, CH, { color:CARD, border:GREEN });
  s.addText("B2B savdo quvuri", { x:7.08, y:C+0.1, w:5.7, h:0.3, fontSize:13.5, bold:true, color:GREEN });
  [
    { step:"01", t:"To'g'ridan-to'g'ri sotish", d:"O'zbekiston va Qozog'istonda 500 yuridik firma.\nDemo: «30 kunda oddiy ishlarning 60% yo'qoldi»" },
    { step:"02", t:"Huquqiy xakatonlar", d:"Legaltek tadbirlarini homiy va tashkilotchi.\nMDH yuridik mutaxassislari orasida brend" },
    { step:"03", t:"API birinchi yondashuv", d:"Dasturchilar Yurist AIni mahsulotlariga ulaydi.\nIntegratsiya sheriklari uchun daromad ulushish" },
    { step:"04", t:"Advokatlar kollegiyasi hamkorligi", d:"O'zbek, Qozog'iston va Rossiya advokatlik\ntashkilotlari bilan rasmiy shartnomalar" },
  ].forEach(({ step, t, d }, i) => {
    const y = C + 0.52 + i * 1.12;
    s.addText(step, { x:7.02, y: y+0.04, w:0.5,  h:0.34, fontSize:13, bold:true, color:GREEN, align:"center" });
    s.addText(t,   { x:7.6,  y: y+0.04, w:5.15, h:0.28, fontSize:12.5, bold:true, color:WHITE });
    s.addText(d,   { x:7.6,  y: y+0.36, w:5.15, h:0.54, fontSize:10, color:MUTED });
    if (i<3) s.addShape(pptx.ShapeType.line, { x:7.24, y: y+0.98, w:0, h:0.16, line:{ color:GREEN, width:0.5 } });
  });
  s.addShape(pptx.ShapeType.line, { x:6.62, y:C, w:0, h:CH, line:{ color:PURPLE3, width:0.5 } });
}

// ═══════════════════════════════════════════════
// SLAYD 7 — NATIJALAR VA YO'L XARITASI
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"NATIJALAR VA YO'L XARITASI", title:"Yaratildi. Ishga tushirildi. O'smoqda." });
  s.addText("BAJARILDI", { x:0.35, y:C, w:5.9, h:0.28, fontSize:9, bold:true, color:GREEN, charSpacing:3 });
  [
    { icon:"✅", t:"To'liq funksional platforma ishga tushdi", d:"React · Node.js · PostgreSQL · ishlab chiqarishga tayyor" },
    { icon:"✅", t:"Ko'p tilli AI mexanizmi",                  d:"MDH huquqida o'qitilgan · UZ / RU / EN" },
    { icon:"✅", t:"Asosiy funksiyalar tayyor",                d:"Chat · Shartnoma tahlili · Hujjat tuzish" },
    { icon:"✅", t:"Investor materiallari tayyor",              d:"Taqdimot, pitch-dek, demo video" },
  ].forEach(({ icon, t, d }, i) => {
    const y = C + 0.36 + i * 1.24;
    card(s, 0.35, y, 5.9, 1.1, { color:"081510", border:"14532d" });
    s.addText(icon, { x:0.5,  y, w:0.56, h:1.1, fontSize:24, valign:"middle" });
    s.addText(t,    { x:1.14, y: y+0.12, w:5.0, h:0.3,  fontSize:12.5, bold:true, color:WHITE });
    s.addText(d,    { x:1.14, y: y+0.48, w:5.0, h:0.26, fontSize:10.5, color:MUTED });
  });
  s.addText("YO'L XARITASI", { x:6.88, y:C, w:5.98, h:0.28, fontSize:9, bold:true, color:PURPLE2, charSpacing:3 });
  [
    { q:"Q3 2026", items:["1 000 ro'yxatdan o'tgan foydalanuvchi","5 to'lovchi B2B pilot","Telegram Mini-App ishga tushirish"], c:PURPLE2 },
    { q:"Q4 2026", items:["$10K MRR milestone","50 B2B mijoz","Qozog'iston bozoriga chiqish"], c:AMBER },
    { q:"Q1 2027", items:["A seriyaga tayyorlash","100K foydalanuvchi","White-label B2B mahsulot"], c:GREEN },
  ].forEach(({ q, items, c }, i) => {
    const y = C + 0.36 + i * 1.66;
    card(s, 6.88, y, 5.98, 1.52, { color:CARD });
    s.addShape(pptx.ShapeType.roundRect, { x:6.88, y, w:1.2, h:1.52, fill:{ color:PURPLE3, transparency:75 }, line:{ color:c, width:0.75 }, rectRadius:0.08 });
    s.addText(q, { x:6.88, y, w:1.2, h:1.52, fontSize:11, bold:true, color:c, align:"center", valign:"middle" });
    items.forEach((item, j) => {
      s.addText(`→  ${item}`, { x:8.16, y: y+0.18+j*0.42, w:4.55, h:0.38, fontSize:11, color:j===0?WHITE:MUTED });
    });
  });
  s.addShape(pptx.ShapeType.line, { x:6.62, y:C, w:0, h:5.3, line:{ color:PURPLE3, width:0.5 } });
}

// ═══════════════════════════════════════════════
// SLAYD 8 — RAQOBAT MUHITI
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"RAQOBAT MUHITI", title:"Hali hech kim MDH legaltekiga egalik qilmagan" });
  const cols = ["Xususiyat","Yurist AI","DoNotPay","LegalZoom","Mahalliy advokatlar"];
  const cW = [2.55,2.3,2.3,2.3,2.3]; const cX = [0.35,2.9,5.2,7.5,9.8];
  const RH = 0.58; const HH = 0.4;
  cols.forEach((col, i) => {
    s.addShape(pptx.ShapeType.rect, { x:cX[i], y:C, w:cW[i], h:HH, fill:{ color:["0d0d1f",PURPLE3,"1e3a5f","1e3a5f","1e1e1e"][i] }, line:{ color:PURPLE3, width:0.3 } });
    s.addText(col, { x:cX[i], y:C, w:cW[i], h:HH, fontSize:11, bold:true, color:i===1?WHITE:MUTED, align:"center", valign:"middle" });
  });
  [
    ["MDH huquqi qamrovi",  "✅ To'liq",    "❌ Yo'q",   "❌ Yo'q",   "✅ Qisman"],
    ["O'zbek tili",         "✅ Tabiiy",    "❌ Yo'q",   "❌ Yo'q",   "⚠️ Kam"],
    ["AI mexanizmi",        "✅ Ha",        "✅ Ha",     "⚠️ Qisman", "❌ Yo'q"],
    ["$10/oydan arzon",     "✅ $0–$5",     "✅ $3",     "❌ $39+",   "❌ $150+"],
    ["Shartnoma tahlili",   "✅ Ha",        "⚠️ Zaif",  "✅ Ha",     "✅ Ha"],
    ["B2B API",             "✅ Ha",        "❌ Yo'q",   "⚠️ Zaif",  "❌ Yo'q"],
    ["24/7 mavjudligi",     "✅ Ha",        "✅ Ha",     "⚠️ Qisman", "❌ Yo'q"],
    ["Hujjat yaratish",     "✅ Ha",        "✅ Ha",     "✅ Ha",     "✅ Sekin"],
  ].forEach((row, ri) => {
    const y = C + HH + ri * RH;
    row.forEach((cell, ci) => {
      s.addShape(pptx.ShapeType.rect, { x:cX[ci], y, w:cW[ci], h:RH, fill:{ color:ci===1?"180830":ri%2===0?"0a0a18":BG }, line:{ color:"1a1a35", width:0.3 } });
      const iG=cell.startsWith("✅"); const iR=cell.startsWith("❌"); const iA=cell.startsWith("⚠️");
      s.addText(cell, { x:cX[ci], y, w:cW[ci], h:RH, fontSize:11, color:ci===1?GREEN:iG?GREEN:iR?RED:iA?AMBER:MUTED, align:"center", valign:"middle" });
    });
  });
  card(s, 0.35, F, 12.63, 0.34, { color:"0d0418", border:PURPLE3 });
  s.addText("Yurist AI — MDH huquqi, tillari va narxlari uchun maxsus qurilgan va to'liq B2B APIga ega yagona platforma.", { x:0.5, y:F, w:12.4, h:0.34, fontSize:10.5, color:PURPLE2, align:"center", valign:"middle" });
}

// ═══════════════════════════════════════════════
// SLAYD 9 — MOLIYAVIY PROGNOZLAR
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"MOLIYAVIY PROGNOZLAR", title:"3-yilga kelib $1 mln ARRga yo'l" });
  [
    { y:"1-yil\n2026", b2c:12000,  b2b:28000,  total:40000,   u:"500",    c:"20" },
    { y:"2-yil\n2027", b2c:85000,  b2b:165000, total:250000,  u:"5 000",  c:"150" },
    { y:"3-yil\n2028", b2c:350000, b2b:650000, total:1000000, u:"25 000", c:"500" },
  ].forEach(({ y, b2c, b2b, total, u, c }, i) => {
    const x = 0.35 + i * 4.32; const CH = 4.92;
    card(s, x, C, 4.05, CH, { color:CARD, border:i===2?PURPLE:PURPLE3, glow:i===2 });
    s.addText(y, { x, y:C+0.1, w:4.05, h:0.52, fontSize:14, bold:true, color:i===2?PURPLE2:WHITE, align:"center" });
    const lbl = total>=1000000?"$1 mln ARR":`$${(total/1000).toFixed(0)}K ARR`;
    s.addText(lbl, { x, y:C+0.64, w:4.05, h:0.72, fontSize:i===2?38:36, bold:true, color:i===2?PURPLE2:WHITE, align:"center", charSpacing:-1.5 });
    const bW=3.3; const bX=x+0.38;
    s.addText("B2C", { x:bX, y:C+1.56, w:0.5, h:0.26, fontSize:10, bold:true, color:PURPLE2 });
    s.addShape(pptx.ShapeType.rect, { x:bX+0.54, y:C+1.58, w:bW*(b2c/1000000), h:0.22, fill:{ color:PURPLE }, line:{ color:PURPLE } });
    s.addText(`$${(b2c/1000).toFixed(0)}K`, { x:bX+0.58+bW*(b2c/1000000), y:C+1.54, w:0.9, h:0.26, fontSize:10, color:PURPLE2 });
    s.addText("B2B", { x:bX, y:C+1.92, w:0.5, h:0.26, fontSize:10, bold:true, color:GREEN });
    s.addShape(pptx.ShapeType.rect, { x:bX+0.54, y:C+1.94, w:bW*(b2b/1000000), h:0.22, fill:{ color:GREEN }, line:{ color:GREEN } });
    s.addText(`$${(b2b/1000).toFixed(0)}K`, { x:bX+0.58+bW*(b2b/1000000), y:C+1.9, w:0.9, h:0.26, fontSize:10, color:GREEN });
    s.addShape(pptx.ShapeType.line, { x:x+0.3, y:C+2.4, w:3.45, h:0, line:{ color:PURPLE3, width:0.3 } });
    s.addText(`👤 ${u} to'lovchi foydalanuvchi`, { x, y:C+2.5,  w:4.05, h:0.28, fontSize:10.5, color:MUTED, align:"center" });
    s.addText(`🏢 ${c} B2B mijoz`,               { x, y:C+2.82, w:4.05, h:0.28, fontSize:10.5, color:MUTED, align:"center" });
    s.addShape(pptx.ShapeType.rect, { x:x+0.3, y:C+3.3, w:3.45, h:0.04, fill:{ color:i===2?PURPLE:PURPLE3 }, line:{ color:i===2?PURPLE:PURPLE3 } });
    s.addText(i===2?"🎯 Maqsad ko'rsatkichi":i===1?"📈 Mo''tadil o'sish":"📊 Konservativ",
      { x, y:C+3.5, w:4.05, h:0.28, fontSize:10.5, color:i===2?PURPLE2:MUTED, align:"center", bold:i===2 });
  });
  card(s, 0.35, F, 12.63, 0.32, { color:"0d0418", border:PURPLE3 });
  s.addText("Taxminlar: 8% bepul→to'lovli konversiya · B2B o'rt. $200/oy · 15%/oy o'sish · 5%/oy chiqib ketish", { x:0.5, y:F, w:12.4, h:0.32, fontSize:10, color:MUTED, align:"center", valign:"middle" });
}

// ═══════════════════════════════════════════════
// SLAYD 10 — JAMOA
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"JAMOA", title:"Muammoni o'zi boshidan o'tkazgan kishi tomonidan yaratildi" });
  card(s, 1.2, C, 10.9, 2.62, { color:CARD, border:PURPLE3, glow:true });
  s.addShape(pptx.ShapeType.ellipse, { x:1.7, y:C+0.22, w:1.8, h:1.8, fill:{ color:PURPLE3 }, line:{ color:PURPLE2, width:1.5 } });
  s.addText("👨‍💻", { x:1.7, y:C+0.22, w:1.8, h:1.8, fontSize:50, align:"center", valign:"middle" });
  s.addText("Asoschisi va Bosh Direktori", { x:3.72, y:C+0.18, w:8.0, h:0.28, fontSize:11, color:MUTED, bold:true, charSpacing:2 });
  s.addText("Javohir Bahtiyorov", { x:3.72, y:C+0.48, w:8.0, h:0.62, fontSize:33, bold:true, color:WHITE });
  s.addText("Full-stack dasturchi · MDH yuridik tizimi mutaxassisi · O'zbekiston", { x:3.72, y:C+1.1, w:8.0, h:0.32, fontSize:12.5, color:PURPLE2 });
  ["React · Node.js · PostgreSQL", "O'zbek · Rus · Ingliz", "MDH huquqi bo'yicha tajriba", "Yurist AIni yolg'iz yaratdi"].forEach((t, i) => {
    s.addText(`✦  ${t}`, { x:3.72+(i%2)*4.1, y:C+1.54+Math.floor(i/2)*0.3, w:3.88, h:0.28, fontSize:11, color:i<2?WHITE:MUTED });
  });
  card(s, 0.35, C+2.78, 12.63, 2.52, { color:"0a0a1a", border:PURPLE3 });
  s.addText("Moliyalashtirishdan keyin yollash", { x:0.55, y:C+2.86, w:12.2, h:0.3, fontSize:13, bold:true, color:PURPLE2 });
  [
    { role:"Yuridik maslahatchi", desc:"MDH litsenziyali advokat — AI javoblarini tasdiqlash" },
    { role:"Growth mutaxassisi",  desc:"MDH Telegram va ijtimoiy tarmoqlar bo'yicha" },
    { role:"B2B savdo menejeri",  desc:"Yuridik firmalar va korporativ mijozlar bilan ishlash" },
    { role:"ML muhandisi",        desc:"MDH sud amaliyotida AI modellarini sozlash" },
  ].forEach(({ role, desc }, i) => {
    const x = 0.55+(i%2)*6.4; const y = C+3.28+Math.floor(i/2)*0.62;
    card(s, x-0.12, y-0.06, 6.2, 0.52, { color:"120820", border:PURPLE3, lw:0.4 });
    s.addText(`${role}`, { x, y: y+0.02, w:2.2,  h:0.26, fontSize:11, bold:true, color:GREEN });
    s.addText(desc,      { x: x+2.24, y: y+0.02, w:3.9, h:0.26, fontSize:10.5, color:MUTED });
  });
  s.addText("javohirbahtiyorov2001@gmail.com", { x:0.35, y:C+5.38, w:12.63, h:0.26, fontSize:10.5, color:MUTED, align:"center" });
}

// ═══════════════════════════════════════════════
// SLAYD 11 — SO'ROV
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"INVESTITSIYA SO'ROVI", title:"$150 000 urug' raundi — missiyaga qo'shiling" });
  s.addShape(pptx.ShapeType.ellipse, { x:4.3, y:C-0.1, w:4.7, h:2.88, fill:{ color:PURPLE3, transparency:88 }, line:{ color:PURPLE3, transparency:88 }, shadow:{ type:"outer", blur:90, offset:0, angle:90, color:PURPLE, opacity:0.42 } });
  s.addText("$150K", { x:3.2, y:C, w:7.0, h:1.58, fontSize:88, bold:true, color:WHITE, align:"center", charSpacing:-4 });
  s.addText("URU' RAUND  ·  18 OYLIK RUNWAY", { x:3.2, y:C+1.6, w:7.0, h:0.3, fontSize:10.5, color:MUTED, align:"center", bold:true, charSpacing:2 });
  const FW=3.05; const FH=1.88;
  [
    { pct:"40%", label:"Mahsulot va AI",       desc:"Model sozlash, yangi funksiyalar, mobil ilova", color:PURPLE, x:0.35 },
    { pct:"30%", label:"Marketing va o'sish",   desc:"B2C jalb etish, B2B sotish, kontent",          color:AMBER,  x:3.58 },
    { pct:"20%", label:"Yuridik muvofiqlik",    desc:"AI tasdiqlash, advokatlik hamkorligi",          color:GREEN,  x:6.81 },
    { pct:"10%", label:"Operatsiyalar",          desc:"Infratuzilma, jamoa",                           color:BLUE,   x:10.04 },
  ].forEach(({ pct, label, desc, color, x }) => {
    card(s, x, C+2.08, FW, FH, { color:CARD });
    s.addShape(pptx.ShapeType.rect, { x, y:C+2.08, w:FW, h:0.06, fill:{ color }, line:{ color } });
    s.addText(pct,   { x, y:C+2.16, w:FW, h:0.7,  fontSize:38, bold:true, color, align:"center" });
    s.addText(label, { x, y:C+2.88, w:FW, h:0.3,  fontSize:12, bold:true, color:WHITE, align:"center" });
    s.addText(desc,  { x, y:C+3.2,  w:FW, h:0.52, fontSize:9.5, color:MUTED, align:"center" });
  });
  card(s, 0.35, C+4.14, 12.63, 0.98, { color:"0d0418", border:PURPLE3 });
  s.addText("Investorlar nima oladi", { x:0.55, y:C+4.2, w:3.0, h:0.26, fontSize:11, bold:true, color:PURPLE2 });
  [
    "MDHning birinchi AI legaltek platformasida ulush",
    "$2 mlrd naqd bozorda birinchi o'yinchi afzalligi",
    "3–4 yilda 10× daromad potentsiali",
    "Oylik hisobotlar + kengash o'rni (lider investor)",
  ].forEach((g, i) => {
    s.addText(`✦  ${g}`, { x:0.55+(i%2)*6.4, y:C+4.52+Math.floor(i/2)*0.3, w:6.2, h:0.28, fontSize:11, color:i<2?WHITE:MUTED });
  });
}

// ═══════════════════════════════════════════════
// SLAYD 12 — YAKUNLASH
// ═══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:"100%", h:"100%", fill:{ color:BG }, line:{ color:BG } });
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:"100%", h:STRIPE, fill:{ color:PURPLE3 }, line:{ color:PURPLE3 } });
  s.addShape(pptx.ShapeType.ellipse, { x:4.1, y:0.5, w:5.1, h:5.1, fill:{ color:PURPLE3, transparency:86 }, line:{ color:PURPLE3, transparency:86 }, shadow:{ type:"outer", blur:110, offset:0, angle:90, color:PURPLE, opacity:0.55 } });
  s.addShape(pptx.ShapeType.ellipse, { x:4.7, y:1.0, w:3.9, h:3.9, fill:{ color:PURPLE, transparency:78 }, line:{ color:PURPLE, transparency:78 } });
  s.addShape(pptx.ShapeType.ellipse, { x:5.3, y:1.5, w:2.7, h:2.7, fill:{ color:PURPLE2, transparency:60 }, line:{ color:PURPLE2, transparency:60 } });
  s.addText("Yurist AI", { x:0.5, y:1.32, w:12.3, h:1.52, fontSize:96, bold:true, color:WHITE, align:"center", charSpacing:-3 });
  s.addText("Huquqingizni biling.", { x:0.5, y:2.78, w:12.3, h:0.6, fontSize:34, color:PURPLE2, align:"center" });
  s.addText("Знайте свои права.   ·   Know Your Rights.", { x:0.5, y:3.4, w:12.3, h:0.4, fontSize:17, color:MUTED, align:"center" });
  s.addShape(pptx.ShapeType.line, { x:4.8, y:3.98, w:3.7, h:0, line:{ color:PURPLE3, width:0.75 } });
  s.addText("javohirbahtiyorov2001@gmail.com  ·  yurist.ai  ·  Toshkent, O'zbekiston", { x:0.5, y:4.12, w:12.3, h:0.34, fontSize:13.5, color:MUTED, align:"center" });
  const tags = ["🇺🇿 O'zbek","🇷🇺 Русский","🇬🇧 English","⚖️ AI Yurist","💼 B2B SaaS","👤 B2C App","🌍 MDH Bozori"];
  const sx = (13.33 - tags.length * 1.95) / 2;
  tags.forEach((tag, i) => pill(s, sx + i*1.96, 4.64, tag, PURPLE2));
  s.addText("Urug' raund  ·  $150 000  ·  2026", { x:0.5, y:5.38, w:12.3, h:0.34, fontSize:13, bold:true, color:PURPLE3, align:"center", charSpacing:3 });
}

const out = path.join(__dirname, "yurist-ai-investor-uz.pptx");
pptx.writeFile({ fileName: out }).then(() => console.log("✅ Saqlandi:", out)).catch(e => console.error("❌", e));
