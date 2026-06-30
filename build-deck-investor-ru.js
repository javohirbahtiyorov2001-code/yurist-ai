const path = require("path");
const PptxGenJS = require("pptxgenjs");
const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE"; // 13.33" × 7.5"

const BG = "080810"; const CARD = "0f0f28";
const PURPLE = "A855F7"; const PURPLE2 = "C084FC"; const PURPLE3 = "7C3AED";
const WHITE = "FFFFFF"; const MUTED = "6B6B88";
const GREEN = "34D399"; const AMBER = "FBBF24"; const RED = "F87171"; const BLUE = "60A5FA";

// ── Layout — fills 7.5" tall slide ──────────────────
const STRIPE = 0.08;   // top accent bar
const LABEL_Y = 0.32;  // section label
const TITLE_Y = 0.68;  // slide title
const C = 1.52;        // content start Y
const F = 6.75;        // footer Y  (was 4.82 — was leaving 2.7" empty!)
// ────────────────────────────────────────────────────

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
// СЛАЙД 1 — ОБЛОЖКА
// ═══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:"100%", h:"100%", fill:{ color:BG }, line:{ color:BG } });
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:"100%", h:STRIPE, fill:{ color:PURPLE3 }, line:{ color:PURPLE3 } });
  // orb
  s.addShape(pptx.ShapeType.ellipse, { x:4.2, y:0.6, w:4.9, h:4.9, fill:{ color:PURPLE3, transparency:86 }, line:{ color:PURPLE3, transparency:86 }, shadow:{ type:"outer", blur:110, offset:0, angle:90, color:PURPLE3, opacity:0.55 } });
  s.addShape(pptx.ShapeType.ellipse, { x:4.8, y:1.15, w:3.7, h:3.7, fill:{ color:PURPLE, transparency:78 }, line:{ color:PURPLE, transparency:78 } });
  s.addShape(pptx.ShapeType.ellipse, { x:5.4, y:1.65, w:2.5, h:2.5, fill:{ color:PURPLE2, transparency:60 }, line:{ color:PURPLE2, transparency:60 } });
  // badge
  s.addShape(pptx.ShapeType.roundRect, { x:5.5, y:0.35, w:2.3, h:0.3, fill:{ color:PURPLE3, transparency:75 }, line:{ color:PURPLE2, width:0.5 }, rectRadius:0.15 });
  s.addText("ИИ · ЮРИДИЧЕСКАЯ ПЛАТФОРМА", { x:5.5, y:0.35, w:2.3, h:0.3, fontSize:7, bold:true, color:PURPLE2, align:"center", valign:"middle", charSpacing:2 });
  // title
  s.addText("Юрист AI", { x:0.5, y:1.25, w:12.3, h:1.55, fontSize:92, bold:true, color:WHITE, align:"center", charSpacing:-3 });
  s.addText("ИИ-платформа юридической помощи для 300 млн жителей СНГ", { x:0.5, y:2.75, w:12.3, h:0.55, fontSize:21, color:PURPLE2, align:"center" });
  s.addShape(pptx.ShapeType.line, { x:4.5, y:3.5, w:4.3, h:0, line:{ color:PURPLE3, width:0.75 } });
  s.addText([
    { text:"B2C  ", options:{ color:PURPLE2, bold:true } },
    { text:"Приложение для граждан  ·  ", options:{ color:MUTED } },
    { text:"B2B  ", options:{ color:GREEN, bold:true } },
    { text:"SaaS-платформа для бизнеса и юридических фирм", options:{ color:MUTED } },
  ], { x:0.5, y:3.65, w:12.3, h:0.38, fontSize:12.5, align:"center" });
  pill(s, 4.0, 4.25, "🇷🇺  Русский", PURPLE2);
  pill(s, 6.17, 4.25, "🇺🇿  O'zbek", GREEN);
  pill(s, 8.34, 4.25, "🇬🇧  English", BLUE);
  s.addText("ПОСЕВНОЙ РАУНД  ·  $150 000  ·  2026", { x:0.5, y:5.2, w:12.3, h:0.32, fontSize:11, bold:true, color:MUTED, align:"center", charSpacing:3 });
}

// ═══════════════════════════════════════════════
// СЛАЙД 2 — ПРОБЛЕМА
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"ПРОБЛЕМА", title:"Юридическая помощь недоступна 300 млн жителей СНГ — и их бизнесу" });
  // headers
  card(s, 0.4, C, 5.9, 0.4, { color:"1a0533", border:PURPLE });
  s.addText("👤  B2C  —  Граждане", { x:0.4, y:C, w:5.9, h:0.4, fontSize:13, bold:true, color:PURPLE2, align:"center", valign:"middle" });
  card(s, 6.93, C, 5.9, 0.4, { color:"0a2018", border:GREEN });
  s.addText("🏢  B2B  —  Бизнес и юридические фирмы", { x:6.93, y:C, w:5.9, h:0.4, fontSize:13, bold:true, color:GREEN, align:"center", valign:"middle" });

  const RH = 1.08; const RS = 1.2; // row height, row stride
  const b2c = [
    { icon:"💸", t:"Юрист стоит $150–400 за консультацию", s:"Только 8% граждан СНГ обращаются к юристу" },
    { icon:"⏳", t:"Недели ожидания приёма", s:"Нет онлайн-записи, нет мгновенных ответов" },
    { icon:"🌐", t:"Языковой барьер закрывает доступ", s:"Документы на официальном русском, нет узбекского" },
    { icon:"😰", t:"Люди отказываются от прав по незнанию", s:"70% не знают, что могут подать в суд за зарплату" },
  ];
  const b2b = [
    { icon:"📋", t:"Проверка договора занимает 3–5 дней", s:"Юристы берут $200+/час за рутинную работу" },
    { icon:"👩‍💼", t:"МСП не могут позволить себе юриста", s:"85% бизнесов СНГ без юридического отдела" },
    { icon:"🔄", t:"Повторяющаяся работа убивает прибыль", s:"60% времени юристов — типовые документы" },
    { icon:"📊", t:"Нет ИИ-инструментов для права СНГ", s:"Западный легалтех не охватывает юрисдикцию СНГ" },
  ];
  b2c.forEach(({ icon, t, s: sub }, i) => {
    const y = C + 0.5 + i * RS;
    card(s, 0.4, y, 5.9, RH, { color:"120820" });
    s.addText(icon, { x:0.55, y, w:0.55, h:RH, fontSize:22, valign:"middle" });
    s.addText(t,   { x:1.18, y: y+0.1,  w:4.95, h:0.3, fontSize:12.5, bold:true, color:WHITE });
    s.addText(sub, { x:1.18, y: y+0.46, w:4.95, h:0.26, fontSize:10.5, color:MUTED });
  });
  b2b.forEach(({ icon, t, s: sub }, i) => {
    const y = C + 0.5 + i * RS;
    card(s, 6.93, y, 5.9, RH, { color:"081510" });
    s.addText(icon, { x:7.08, y, w:0.55, h:RH, fontSize:22, valign:"middle" });
    s.addText(t,   { x:7.7,  y: y+0.1,  w:4.95, h:0.3, fontSize:12.5, bold:true, color:WHITE });
    s.addText(sub, { x:7.7,  y: y+0.46, w:4.95, h:0.26, fontSize:10.5, color:MUTED });
  });
  s.addShape(pptx.ShapeType.line, { x:6.57, y:C, w:0, h:5.12, line:{ color:PURPLE3, width:0.5 } });
  card(s, 0.4, F, 12.53, 0.38, { color:"0d0418", border:PURPLE3 });
  s.addText([
    { text:"Только 8% ", options:{ color:RED, bold:true } }, { text:"граждан СНГ у юриста  ·  ", options:{ color:MUTED } },
    { text:"$2 млрд+ ", options:{ color:AMBER, bold:true } }, { text:"рынок юруслуг  ·  ", options:{ color:MUTED } },
    { text:"<5% ", options:{ color:GREEN, bold:true } }, { text:"цифровое проникновение", options:{ color:MUTED } },
  ], { x:0.4, y:F, w:12.53, h:0.38, fontSize:12, align:"center", valign:"middle" });
}

// ═══════════════════════════════════════════════
// СЛАЙД 3 — РЕШЕНИЕ
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"РЕШЕНИЕ", title:"Одна платформа. Два направления. Без барьеров." });
  // orb center
  s.addShape(pptx.ShapeType.ellipse, { x:5.18, y:1.6, w:2.95, h:2.95, fill:{ color:PURPLE3, transparency:80 }, line:{ color:PURPLE3, transparency:80 }, shadow:{ type:"outer", blur:65, offset:0, angle:90, color:PURPLE3, opacity:0.5 } });
  s.addText("⚖️", { x:5.18, y:2.0, w:2.95, h:1.6, fontSize:54, align:"center", valign:"middle" });
  s.addText("Юрист AI", { x:4.8, y:3.65, w:3.7, h:0.42, fontSize:18, bold:true, color:WHITE, align:"center" });

  const FS = 1.28; const FH = 1.12; // feature stride, feature height
  [
    { icon:"💬", t:"ИИ-консультация", d:"Права объяснены простым языком" },
    { icon:"📄", t:"Анализ договоров", d:"Рискованные пункты — мгновенно" },
    { icon:"📝", t:"Составление документов", d:"Жалобы, претензии за секунды" },
    { icon:"🌐", t:"3 языка поддержки", d:"RU · UZ · EN — все включены" },
  ].forEach(({ icon, t, d }, i) => {
    const y = C + i * FS;
    card(s, 0.35, y, 4.65, FH, { color:"120820" });
    s.addText(icon, { x:0.5,  y, w:0.58, h:FH, fontSize:24, valign:"middle" });
    s.addText(t, { x:1.16, y: y+0.1,  w:3.72, h:0.3,  fontSize:13, bold:true, color:WHITE });
    s.addText(d, { x:1.16, y: y+0.46, w:3.72, h:0.26, fontSize:10.5, color:MUTED });
    s.addShape(pptx.ShapeType.line, { x:5.0, y: y+FH/2, w:0.45, h:0, line:{ color:PURPLE3, width:0.5 } });
  });
  [
    { icon:"🤖", t:"ИИ-анализатор договоров", d:"Массовая обработка через API" },
    { icon:"🔗", t:"API и интеграции", d:"Встройте в любой рабочий процесс" },
    { icon:"👥", t:"Командные аккаунты", d:"Мультиместные, управление ролями" },
    { icon:"📊", t:"Аналитика и дашборд", d:"Риски, использование, экономия" },
  ].forEach(({ icon, t, d }, i) => {
    const y = C + i * FS;
    card(s, 8.33, y, 4.65, FH, { color:"081510" });
    s.addText(icon, { x:8.48, y, w:0.58, h:FH, fontSize:24, valign:"middle" });
    s.addText(t, { x:9.12, y: y+0.1,  w:3.72, h:0.3,  fontSize:13, bold:true, color:WHITE });
    s.addText(d, { x:9.12, y: y+0.46, w:3.72, h:0.26, fontSize:10.5, color:MUTED });
    s.addShape(pptx.ShapeType.line, { x:7.88, y: y+FH/2, w:0.47, h:0, line:{ color:GREEN, width:0.5 } });
  });
  s.addText("B2C  Приложение для граждан", { x:0.35, y:C+4*FS+0.12, w:4.65, h:0.28, fontSize:10, bold:true, color:PURPLE2, align:"center" });
  s.addText("B2B  Корпоративный SaaS", { x:8.33, y:C+4*FS+0.12, w:4.65, h:0.28, fontSize:10, bold:true, color:GREEN, align:"center" });
}

// ═══════════════════════════════════════════════
// СЛАЙД 4 — РЫНОК
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"ВОЗМОЖНОСТЬ РЫНКА", title:"Рынок $2 млрд+ с цифровым проникновением менее 5%" });
  [
    { v:"300 млн+", l:"Население СНГ",        s:"Целевая аудитория",          c:PURPLE2 },
    { v:"$2 млрд+", l:"Рынок юруслуг",        s:"Годовые расходы на юристов", c:GREEN },
    { v:"<5%",      l:"Цифровое проникн.",    s:"Освоение легалтека сегодня", c:AMBER },
    { v:"74%",      l:"Пользователи смарт.",  s:"Растёт год к году",          c:BLUE },
  ].forEach(({ v, l, s: sub, c }, i) => {
    const x = 0.35 + i * 3.22;
    card(s, x, C, 3.05, 2.32, { color:CARD });
    s.addText(v,   { x, y:C+0.12, w:3.05, h:1.08, fontSize:52, bold:true, color:c, align:"center", charSpacing:-2 });
    s.addText(l,   { x, y:C+1.22, w:3.05, h:0.34, fontSize:13, bold:true, color:WHITE, align:"center" });
    s.addText(sub, { x, y:C+1.58, w:3.05, h:0.26, fontSize:10, color:MUTED, align:"center" });
  });
  // TAM/SAM/SOM
  card(s, 0.35, C+2.48, 12.63, 1.02, { color:CARD });
  s.addText("Объём рынка", { x:0.55, y:C+2.54, w:2.0, h:0.28, fontSize:10.5, bold:true, color:MUTED });
  [{ l:"TAM", v:"$2,1 млрд", d:"Весь рынок юруслуг СНГ" },
   { l:"SAM", v:"$420 млн",  d:"Цифровой сегмент B2C+B2B" },
   { l:"SOM", v:"$21 млн",   d:"Цель 3 года (1% SAM)" }].forEach(({ l, v, d }, i) => {
    const x = 0.7 + i * 4.2;
    s.addText(l, { x, y:C+2.56, w:0.7,  h:0.28, fontSize:12, bold:true, color:[PURPLE,GREEN,AMBER][i] });
    s.addText(v, { x:x+0.76, y:C+2.5,  w:1.6,  h:0.38, fontSize:26, bold:true, color:WHITE });
    s.addText(d, { x:x+2.42, y:C+2.58, w:1.7,  h:0.24, fontSize:9.5, color:MUTED });
  });
  // B2C / B2B opportunity
  card(s, 0.35, C+3.68, 6.1, 0.96, { color:"120820", border:PURPLE3 });
  s.addText("Возможность B2C", { x:0.55, y:C+3.74, w:5.7, h:0.26, fontSize:12, bold:true, color:PURPLE2 });
  s.addText("300 млн потенц. пользователей · $2.50/мес → $750 млн ARR при 10% конверсии", { x:0.55, y:C+4.02, w:5.7, h:0.42, fontSize:10.5, color:MUTED });
  card(s, 6.88, C+3.68, 6.05, 0.96, { color:"081510", border:GREEN });
  s.addText("Возможность B2B", { x:7.08, y:C+3.74, w:5.6, h:0.26, fontSize:12, bold:true, color:GREEN });
  s.addText("50 000+ юрфирм СНГ + 500 тыс. МСП · $50/мес → $300 млн ARR при 1% проникновения", { x:7.08, y:C+4.02, w:5.6, h:0.42, fontSize:10.5, color:MUTED });
}

// ═══════════════════════════════════════════════
// СЛАЙД 5 — БИЗНЕС-МОДЕЛЬ
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"БИЗНЕС-МОДЕЛЬ", title:"Два источника дохода — одна платформа" });
  s.addText("B2C  —  Подписки для граждан", { x:0.35, y:C, w:6.1, h:0.34, fontSize:13.5, bold:true, color:PURPLE2 });
  const TH = 1.38; const TS = 1.52;
  [
    { n:"Бесплатно", p:"$0",  per:"навсегда",  note:"3 запроса/мес · Вирусное привлечение",     c:MUTED,   bg:"0a0a1a", brd:"333355" },
    { n:"Про",       p:"$5",  per:"/ месяц",   note:"Безлимит · Документы · Приоритетный ИИ",  c:PURPLE2, bg:"120820", brd:PURPLE3 },
    { n:"Семья",     p:"$12", per:"/ месяц",   note:"5 участников · Полный доступ",            c:BLUE,    bg:"080e20", brd:"1e3a8a" },
  ].forEach(({ n, p, per, note, c, bg, brd }, i) => {
    const y = C + 0.44 + i * TS;
    card(s, 0.35, y, 6.1, TH, { color:bg, border:brd });
    s.addText(n,    { x:0.55, y: y+0.1,  w:2.0, h:0.32, fontSize:14, bold:true, color:c });
    s.addText(p,    { x:2.8,  y: y+0.06, w:1.3, h:0.44, fontSize:30, bold:true, color:WHITE, align:"right" });
    s.addText(per,  { x:4.16, y: y+0.18, w:1.3, h:0.26, fontSize:12, color:MUTED });
    s.addText(note, { x:0.55, y: y+0.62, w:5.7, h:0.26, fontSize:10.5, color:MUTED });
    s.addText("✓ Включено", { x:0.55, y: y+0.94, w:5.7, h:0.28, fontSize:10, color: i===0?MUTED:GREEN });
  });
  card(s, 0.35, C+4.0+0.54, 6.1, 0.72, { color:"0a0a1a", border:PURPLE3 });
  s.addText([{ text:"Freemium → ", options:{ color:MUTED } }, { text:"8% ", options:{ color:PURPLE2, bold:true } },
    { text:"конверсия в Pro → ", options:{ color:MUTED } }, { text:"$120К ARR ", options:{ color:GREEN, bold:true } },
    { text:"при 2 000 платных", options:{ color:MUTED } }],
    { x:0.5, y:C+4.0+0.54, w:5.9, h:0.72, fontSize:11, valign:"middle" });

  s.addText("B2B  —  Корпоративный SaaS", { x:7.0, y:C, w:5.98, h:0.34, fontSize:13.5, bold:true, color:GREEN });
  [
    { n:"Стартер",    p:"$49",    per:"/ мес",  note:"3 места · 100 договоров/мес · API",          c:GREEN, bg:"081510", brd:"14532d" },
    { n:"Бизнес",     p:"$199",   per:"/ мес",  note:"10 мест · Безлимит · Дашборд",              c:AMBER, bg:"0e0c08", brd:"713f12" },
    { n:"Энтерп.",    p:"Договор",per:"",        note:"Вайтлейбл · Своя ИИ-модель · Поддержка 24/7",c:RED,   bg:"120808", brd:"7f1d1d" },
  ].forEach(({ n, p, per, note, c, bg, brd }, i) => {
    const y = C + 0.44 + i * TS;
    card(s, 7.0, y, 5.98, TH, { color:bg, border:brd });
    s.addText(n,    { x:7.18, y: y+0.1,  w:2.0,  h:0.32, fontSize:14, bold:true, color:c });
    s.addText(p,    { x:9.2,  y: y+0.06, w:1.7,  h:0.44, fontSize: p==="Договор"?18:30, bold:true, color:WHITE, align:"right" });
    s.addText(per,  { x:10.95,y: y+0.18, w:0.95, h:0.26, fontSize:11, color:MUTED });
    s.addText(note, { x:7.18, y: y+0.62, w:5.6,  h:0.26, fontSize:10.5, color:MUTED });
  });
  card(s, 7.0, C+4.0+0.54, 5.98, 0.72, { color:"081510", border:GREEN });
  s.addText([{ text:"Цель: 50 B2B клиентов год 1 → ", options:{ color:MUTED } },
    { text:"$150К ARR ", options:{ color:GREEN, bold:true } }, { text:"только от B2B", options:{ color:MUTED } }],
    { x:7.15, y:C+4.0+0.54, w:5.7, h:0.72, fontSize:11.5, valign:"middle" });

  s.addShape(pptx.ShapeType.line, { x:6.62, y:C, w:0, h:5.2, line:{ color:PURPLE3, width:0.5 } });
}

// ═══════════════════════════════════════════════
// СЛАЙД 6 — ВЫХОД НА РЫНОК
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"СТРАТЕГИЯ ВЫХОДА НА РЫНОК", title:"Вирусный рост B2C + Прямые продажи B2B" });
  const CH = 5.12; // column content height
  card(s, 0.35, C, 6.1, CH, { color:CARD, border:PURPLE3 });
  s.addText("Двигатель роста B2C", { x:0.55, y:C+0.1, w:5.7, h:0.3, fontSize:13.5, bold:true, color:PURPLE2 });
  [
    { step:"01", t:"Вирусный контент", d:"ИИ-советы в Telegram и TikTok.\n«Уволили незаконно — вот что сказал Юрист AI»" },
    { step:"02", t:"Telegram Mini-App", d:"Главное приложение СНГ.\n200 млн+ пользователей Telegram в целевых рынках" },
    { step:"03", t:"SEO-арбитраж", d:"«Что делать если...» — нулевая конкуренция,\nвысокий спрос на юридические запросы" },
    { step:"04", t:"Партнёрства с НКО", d:"Защита потребителей, профсоюзы —\nбесплатный уровень как канал привлечения" },
  ].forEach(({ step, t, d }, i) => {
    const y = C + 0.52 + i * 1.12;
    s.addText(step, { x:0.5, y: y+0.04, w:0.5, h:0.34, fontSize:13, bold:true, color:PURPLE3, align:"center" });
    s.addText(t,   { x:1.08, y: y+0.04, w:5.15, h:0.28, fontSize:12.5, bold:true, color:WHITE });
    s.addText(d,   { x:1.08, y: y+0.36, w:5.15, h:0.54, fontSize:10, color:MUTED });
    if (i<3) s.addShape(pptx.ShapeType.line, { x:0.72, y: y+0.98, w:0, h:0.16, line:{ color:PURPLE3, width:0.5 } });
  });

  card(s, 6.88, C, 6.1, CH, { color:CARD, border:GREEN });
  s.addText("Воронка продаж B2B", { x:7.08, y:C+0.1, w:5.7, h:0.3, fontSize:13.5, bold:true, color:GREEN });
  [
    { step:"01", t:"Прямые продажи", d:"500 юрфирм Узбекистана и Казахстана.\nДемо: «60% рутины устранено за 30 дней»" },
    { step:"02", t:"Правовые хакатоны", d:"Спонсируем легалтек-мероприятия.\nБренд среди юристов СНГ" },
    { step:"03", t:"API прежде всего", d:"Разработчики встраивают Юрист AI.\nМодель разделения дохода с партнёрами" },
    { step:"04", t:"Партнёрства с коллегиями", d:"Адвокатские ассоциации Узбекистана,\nКазахстана и России — доверие" },
  ].forEach(({ step, t, d }, i) => {
    const y = C + 0.52 + i * 1.12;
    s.addText(step, { x:7.02, y: y+0.04, w:0.5, h:0.34, fontSize:13, bold:true, color:GREEN, align:"center" });
    s.addText(t,   { x:7.6,  y: y+0.04, w:5.15, h:0.28, fontSize:12.5, bold:true, color:WHITE });
    s.addText(d,   { x:7.6,  y: y+0.36, w:5.15, h:0.54, fontSize:10, color:MUTED });
    if (i<3) s.addShape(pptx.ShapeType.line, { x:7.24, y: y+0.98, w:0, h:0.16, line:{ color:GREEN, width:0.5 } });
  });
  s.addShape(pptx.ShapeType.line, { x:6.62, y:C, w:0, h:CH, line:{ color:PURPLE3, width:0.5 } });
}

// ═══════════════════════════════════════════════
// СЛАЙД 7 — ПРОГРЕСС И ДОРОЖНАЯ КАРТА
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"ПРОГРЕСС И ДОРОЖНАЯ КАРТА", title:"Создан. Запущен. Растёт." });
  s.addText("ВЫПОЛНЕНО", { x:0.35, y:C, w:5.9, h:0.28, fontSize:9, bold:true, color:GREEN, charSpacing:3 });
  [
    { icon:"✅", t:"Полнофункциональная платформа запущена", d:"React · Node.js · PostgreSQL · продакшен" },
    { icon:"✅", t:"Многоязычный ИИ-движок",                d:"Обучен на праве СНГ · UZ / RU / EN" },
    { icon:"✅", t:"Основные функции готовы",                d:"Чат · Анализ договоров · Документы" },
    { icon:"✅", t:"Инвесторские материалы готовы",          d:"Питч-дек, видеопрезентация, демо" },
  ].forEach(({ icon, t, d }, i) => {
    const y = C + 0.36 + i * 1.24;
    card(s, 0.35, y, 5.9, 1.1, { color:"081510", border:"14532d" });
    s.addText(icon, { x:0.5,  y, w:0.56, h:1.1, fontSize:24, valign:"middle" });
    s.addText(t,    { x:1.14, y: y+0.12, w:5.0, h:0.3, fontSize:12.5, bold:true, color:WHITE });
    s.addText(d,    { x:1.14, y: y+0.48, w:5.0, h:0.26, fontSize:10.5, color:MUTED });
  });

  s.addText("ДОРОЖНАЯ КАРТА", { x:6.88, y:C, w:5.98, h:0.28, fontSize:9, bold:true, color:PURPLE2, charSpacing:3 });
  [
    { q:"Q3 2026", items:["1 000 зарегистрированных пользователей","5 платных B2B пилотов","Запуск Telegram Mini-App"], c:PURPLE2 },
    { q:"Q4 2026", items:["$10К MRR milestone","50 B2B клиентов","Выход на рынок Казахстана"], c:AMBER },
    { q:"Q1 2027", items:["Подготовка к Серии A","100К пользователей","Вайтлейбл B2B продукт"], c:GREEN },
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
// СЛАЙД 8 — КОНКУРЕНТЫ
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"КОНКУРЕНТНАЯ СРЕДА", title:"Никто не владеет легалтеком СНГ — пока" });
  const cols = ["Функция","Юрист AI","DoNotPay","LegalZoom","Местные юристы"];
  const cW   = [2.55, 2.3, 2.3, 2.3, 2.3];
  const cX   = [0.35, 2.9, 5.2, 7.5, 9.8];
  const RH   = 0.58; const HH = 0.4;
  cols.forEach((col, i) => {
    s.addShape(pptx.ShapeType.rect, { x:cX[i], y:C, w:cW[i], h:HH, fill:{ color:["0d0d1f",PURPLE3,"1e3a5f","1e3a5f","1e1e1e"][i] }, line:{ color:PURPLE3, width:0.3 } });
    s.addText(col, { x:cX[i], y:C, w:cW[i], h:HH, fontSize:11, bold:true, color:i===1?WHITE:MUTED, align:"center", valign:"middle" });
  });
  [
    ["Право СНГ",           "✅ Полное",   "❌ Нет",    "❌ Нет",    "✅ Частично"],
    ["Узбекский язык",      "✅ Нативный", "❌ Нет",    "❌ Нет",    "⚠️ Редко"],
    ["ИИ-движок",           "✅ Да",       "✅ Да",     "⚠️ Частично","❌ Нет"],
    ["Дешевле $10/мес",    "✅ $0–$5",    "✅ $3",     "❌ $39+",   "❌ $150+"],
    ["Анализ договоров",    "✅ Да",       "⚠️ Слабо", "✅ Да",     "✅ Да"],
    ["B2B API",             "✅ Да",       "❌ Нет",    "⚠️ Слабо", "❌ Нет"],
    ["Доступен 24/7",       "✅ Да",       "✅ Да",     "⚠️ Частично","❌ Нет"],
    ["Генерация документов","✅ Да",       "✅ Да",     "✅ Да",     "✅ Медленно"],
  ].forEach((row, ri) => {
    const y = C + HH + ri * RH;
    row.forEach((cell, ci) => {
      s.addShape(pptx.ShapeType.rect, { x:cX[ci], y, w:cW[ci], h:RH, fill:{ color:ci===1?"180830":ri%2===0?"0a0a18":BG }, line:{ color:"1a1a35", width:0.3 } });
      const iG=cell.startsWith("✅"); const iR=cell.startsWith("❌"); const iA=cell.startsWith("⚠️");
      s.addText(cell, { x:cX[ci], y, w:cW[ci], h:RH, fontSize:11, color:ci===1?GREEN:iG?GREEN:iR?RED:iA?AMBER:MUTED, align:"center", valign:"middle" });
    });
  });
  card(s, 0.35, F, 12.63, 0.34, { color:"0d0418", border:PURPLE3 });
  s.addText("Юрист AI — единственная платформа для права СНГ, на языках СНГ, по ценам СНГ — с полным B2B API.", { x:0.5, y:F, w:12.4, h:0.34, fontSize:10.5, color:PURPLE2, align:"center", valign:"middle" });
}

// ═══════════════════════════════════════════════
// СЛАЙД 9 — ФИНАНСОВЫЕ ПРОГНОЗЫ
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"ФИНАНСОВЫЕ ПРОГНОЗЫ", title:"Путь к $1 млн ARR к 3-му году" });
  [
    { y:"Год 1\n2026", b2c:12000,  b2b:28000,  total:40000,   u:"500",    c:"20" },
    { y:"Год 2\n2027", b2c:85000,  b2b:165000, total:250000,  u:"5 000",  c:"150" },
    { y:"Год 3\n2028", b2c:350000, b2b:650000, total:1000000, u:"25 000", c:"500" },
  ].forEach(({ y, b2c, b2b, total, u, c }, i) => {
    const x = 0.35 + i * 4.32; const CH = 4.92;
    card(s, x, C, 4.05, CH, { color:CARD, border:i===2?PURPLE:PURPLE3, glow:i===2 });
    s.addText(y, { x, y:C+0.1,  w:4.05, h:0.52, fontSize:14, bold:true, color:i===2?PURPLE2:WHITE, align:"center" });
    const lbl = total>=1000000?"$1 млн ARR":`$${(total/1000).toFixed(0)} тыс. ARR`;
    s.addText(lbl, { x, y:C+0.64, w:4.05, h:0.72, fontSize:i===2?38:36, bold:true, color:i===2?PURPLE2:WHITE, align:"center", charSpacing:-1.5 });
    const bW = 3.3; const bX = x+0.38;
    // bars
    s.addText("B2C", { x:bX, y:C+1.56, w:0.5, h:0.26, fontSize:10, bold:true, color:PURPLE2 });
    s.addShape(pptx.ShapeType.rect, { x:bX+0.54, y:C+1.58, w:bW*(b2c/1000000), h:0.22, fill:{ color:PURPLE }, line:{ color:PURPLE } });
    s.addText(`$${(b2c/1000).toFixed(0)}К`, { x:bX+0.58+bW*(b2c/1000000), y:C+1.54, w:0.88, h:0.26, fontSize:10, color:PURPLE2 });
    s.addText("B2B", { x:bX, y:C+1.92, w:0.5, h:0.26, fontSize:10, bold:true, color:GREEN });
    s.addShape(pptx.ShapeType.rect, { x:bX+0.54, y:C+1.94, w:bW*(b2b/1000000), h:0.22, fill:{ color:GREEN }, line:{ color:GREEN } });
    s.addText(`$${(b2b/1000).toFixed(0)}К`, { x:bX+0.58+bW*(b2b/1000000), y:C+1.9, w:0.88, h:0.26, fontSize:10, color:GREEN });
    s.addShape(pptx.ShapeType.line, { x:x+0.3, y:C+2.4, w:3.45, h:0, line:{ color:PURPLE3, width:0.3 } });
    s.addText(`👤 ${u} платных пользователей`, { x, y:C+2.5,  w:4.05, h:0.28, fontSize:10.5, color:MUTED, align:"center" });
    s.addText(`🏢 ${c} B2B клиентов`,          { x, y:C+2.82, w:4.05, h:0.28, fontSize:10.5, color:MUTED, align:"center" });
    // growth arrow
    s.addShape(pptx.ShapeType.rect, { x:x+0.3, y:C+3.3, w:3.45, h:0.04, fill:{ color:i===2?PURPLE:PURPLE3 }, line:{ color:i===2?PURPLE:PURPLE3 } });
    s.addText(i===2?"🎯 Целевой показатель":i===1?"📈 Умеренный рост":"📊 Консервативно",
      { x, y:C+3.5, w:4.05, h:0.28, fontSize:10.5, color:i===2?PURPLE2:MUTED, align:"center", bold:i===2 });
  });
  card(s, 0.35, F, 12.63, 0.32, { color:"0d0418", border:PURPLE3 });
  s.addText("Допущения: 8% конверсия free→paid · B2B ср. $200/мес · рост 15%/мес · отток 5%/мес", { x:0.5, y:F, w:12.4, h:0.32, fontSize:10, color:MUTED, align:"center", valign:"middle" });
}

// ═══════════════════════════════════════════════
// СЛАЙД 10 — КОМАНДА
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"КОМАНДА", title:"Создан тем, кто сам столкнулся с проблемой" });
  card(s, 1.2, C, 10.9, 2.62, { color:CARD, border:PURPLE3, glow:true });
  s.addShape(pptx.ShapeType.ellipse, { x:1.7, y:C+0.22, w:1.8, h:1.8, fill:{ color:PURPLE3 }, line:{ color:PURPLE2, width:1.5 } });
  s.addText("👨‍💻", { x:1.7, y:C+0.22, w:1.8, h:1.8, fontSize:50, align:"center", valign:"middle" });
  s.addText("Основатель и CEO", { x:3.72, y:C+0.18, w:8.0, h:0.28, fontSize:11, color:MUTED, bold:true, charSpacing:2 });
  s.addText("Javohir Bahtiyorov", { x:3.72, y:C+0.48, w:8.0, h:0.62, fontSize:33, bold:true, color:WHITE });
  s.addText("Full-stack разработчик · Эксперт права СНГ · Узбекистан", { x:3.72, y:C+1.1, w:8.0, h:0.32, fontSize:12.5, color:PURPLE2 });
  ["React · Node.js · PostgreSQL", "Русский · O'zbek · English", "Экспертиза права СНГ", "Создал Юрист AI единолично"].forEach((t, i) => {
    s.addText(`✦  ${t}`, { x:3.72+(i%2)*4.1, y:C+1.54+Math.floor(i/2)*0.3, w:3.88, h:0.28, fontSize:11, color:i<2?WHITE:MUTED });
  });
  card(s, 0.35, C+2.78, 12.63, 2.52, { color:"0a0a1a", border:PURPLE3 });
  s.addText("Наём с финансированием", { x:0.55, y:C+2.86, w:12.2, h:0.3, fontSize:13, bold:true, color:PURPLE2 });
  [
    { role:"Юридический советник", desc:"Лицензированный адвокат СНГ для валидации ИИ-ответов" },
    { role:"Growth-специалист",    desc:"Рост в Telegram и социальных сетях СНГ" },
    { role:"B2B-менеджер продаж",  desc:"Работа с юрфирмами и корпоративными клиентами" },
    { role:"ML-инженер",           desc:"Дообучение ИИ на прецедентах права СНГ" },
  ].forEach(({ role, desc }, i) => {
    const x = 0.55 + (i%2)*6.4; const y = C+3.28+Math.floor(i/2)*0.62;
    card(s, x-0.12, y-0.06, 6.2, 0.52, { color:"120820", border:PURPLE3, lw:0.4 });
    s.addText(`${role}`, { x, y: y+0.02, w:2.1, h:0.26, fontSize:11, bold:true, color:GREEN });
    s.addText(desc,      { x: x+2.14, y: y+0.02, w:3.9, h:0.26, fontSize:10.5, color:MUTED });
  });
  s.addText("javohirbahtiyorov2001@gmail.com", { x:0.35, y:C+5.38, w:12.63, h:0.26, fontSize:10.5, color:MUTED, align:"center" });
}

// ═══════════════════════════════════════════════
// СЛАЙД 11 — ЗАПРОС
// ═══════════════════════════════════════════════
{
  const s = slide({ label:"ЗАПРОС ИНВЕСТИЦИЙ", title:"$150 000 посевного раунда — присоединяйтесь к миссии" });
  s.addShape(pptx.ShapeType.ellipse, { x:4.3, y:C-0.1, w:4.7, h:2.88, fill:{ color:PURPLE3, transparency:88 }, line:{ color:PURPLE3, transparency:88 }, shadow:{ type:"outer", blur:90, offset:0, angle:90, color:PURPLE, opacity:0.42 } });
  s.addText("$150К", { x:3.2, y:C, w:7.0, h:1.58, fontSize:88, bold:true, color:WHITE, align:"center", charSpacing:-4 });
  s.addText("ПОСЕВНОЙ РАУНД  ·  RUNWAY 18 МЕСЯЦЕВ", { x:3.2, y:C+1.6, w:7.0, h:0.3, fontSize:10.5, color:MUTED, align:"center", bold:true, charSpacing:2 });

  const FW = 3.05; const FH = 1.88;
  [
    { pct:"40%", label:"Продукт и ИИ",        desc:"Дообучение, новые функции, мобильное приложение", color:PURPLE, x:0.35 },
    { pct:"30%", label:"Маркетинг и рост",     desc:"B2C привлечение, B2B продажи, контент-маркетинг", color:AMBER,  x:3.58 },
    { pct:"20%", label:"Юридика",              desc:"Валидация ИИ, партнёрства с адвокатурой СНГ",    color:GREEN,  x:6.81 },
    { pct:"10%", label:"Операции",             desc:"Инфраструктура, команда, офис",                   color:BLUE,   x:10.04 },
  ].forEach(({ pct, label, desc, color, x }) => {
    card(s, x, C+2.08, FW, FH, { color:CARD });
    s.addShape(pptx.ShapeType.rect, { x, y:C+2.08, w:FW, h:0.06, fill:{ color }, line:{ color } });
    s.addText(pct,   { x, y:C+2.16, w:FW, h:0.7,  fontSize:38, bold:true, color, align:"center" });
    s.addText(label, { x, y:C+2.88, w:FW, h:0.3,  fontSize:12, bold:true, color:WHITE, align:"center" });
    s.addText(desc,  { x, y:C+3.2,  w:FW, h:0.52, fontSize:9.5, color:MUTED, align:"center" });
  });
  card(s, 0.35, C+4.14, 12.63, 0.98, { color:"0d0418", border:PURPLE3 });
  s.addText("Что получают инвесторы", { x:0.55, y:C+4.2, w:3.0, h:0.26, fontSize:11, bold:true, color:PURPLE2 });
  [
    "Доля в первой ИИ-легалтех-платформе СНГ",
    "$2 млрд нетронутый рынок — первый игрок",
    "Потенциал возврата 10× за 3–4 года",
    "Ежемесячные отчёты + место в совете (лид)",
  ].forEach((g, i) => {
    s.addText(`✦  ${g}`, { x:0.55+(i%2)*6.4, y:C+4.52+Math.floor(i/2)*0.3, w:6.2, h:0.28, fontSize:11, color:i<2?WHITE:MUTED });
  });
}

// ═══════════════════════════════════════════════
// СЛАЙД 12 — ЗАВЕРШЕНИЕ
// ═══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:"100%", h:"100%", fill:{ color:BG }, line:{ color:BG } });
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:"100%", h:STRIPE, fill:{ color:PURPLE3 }, line:{ color:PURPLE3 } });
  s.addShape(pptx.ShapeType.ellipse, { x:4.1, y:0.5, w:5.1, h:5.1, fill:{ color:PURPLE3, transparency:86 }, line:{ color:PURPLE3, transparency:86 }, shadow:{ type:"outer", blur:110, offset:0, angle:90, color:PURPLE, opacity:0.55 } });
  s.addShape(pptx.ShapeType.ellipse, { x:4.7, y:1.0, w:3.9, h:3.9, fill:{ color:PURPLE, transparency:78 }, line:{ color:PURPLE, transparency:78 } });
  s.addShape(pptx.ShapeType.ellipse, { x:5.3, y:1.5, w:2.7, h:2.7, fill:{ color:PURPLE2, transparency:60 }, line:{ color:PURPLE2, transparency:60 } });
  s.addText("Юрист AI", { x:0.5, y:1.32, w:12.3, h:1.52, fontSize:96, bold:true, color:WHITE, align:"center", charSpacing:-3 });
  s.addText("Знайте свои права.", { x:0.5, y:2.78, w:12.3, h:0.6, fontSize:34, color:PURPLE2, align:"center" });
  s.addText("Huquqingizni biling.   ·   Know Your Rights.", { x:0.5, y:3.4, w:12.3, h:0.4, fontSize:17, color:MUTED, align:"center" });
  s.addShape(pptx.ShapeType.line, { x:4.8, y:3.98, w:3.7, h:0, line:{ color:PURPLE3, width:0.75 } });
  s.addText("javohirbahtiyorov2001@gmail.com  ·  yurist.ai  ·  Ташкент, Узбекистан", { x:0.5, y:4.12, w:12.3, h:0.34, fontSize:13.5, color:MUTED, align:"center" });
  const tags = ["🇷🇺 Русский","🇺🇿 O'zbek","🇬🇧 English","⚖️ ИИ-юрист","💼 B2B SaaS","👤 B2C App","🌍 Рынок СНГ"];
  const sx = (13.33 - tags.length * 1.95) / 2;
  tags.forEach((tag, i) => pill(s, sx + i*1.96, 4.64, tag, PURPLE2));
  s.addText("Посевной раунд  ·  $150 000  ·  2026", { x:0.5, y:5.38, w:12.3, h:0.34, fontSize:13, bold:true, color:PURPLE3, align:"center", charSpacing:3 });
}

const out = path.join(__dirname, "yurist-ai-investor-ru.pptx");
pptx.writeFile({ fileName: out }).then(() => console.log("✅ Сохранено:", out)).catch(e => console.error("❌", e));
