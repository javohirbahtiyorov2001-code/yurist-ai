const pptxgen = require("pptxgenjs");

const BG = "080810"; const CARD = "0E0E1C"; const PURPLE = "A855F7";
const PURPLE_LIGHT = "C084FC"; const PURPLE_DIM = "7C3AED";
const WHITE = "FFFFFF"; const MUTED = "888899";
const GREEN = "34D399"; const AMBER = "FBBF24"; const BLUE = "60A5FA";

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "Yurist AI — Инвесторская Презентация";
pres.author = "Yurist AI";

const makeShadow = () => ({ type:"outer", blur:20, offset:4, angle:90, color:"000000", opacity:0.4 });
const makeCardShadow = () => ({ type:"outer", blur:10, offset:2, angle:90, color:"000000", opacity:0.3 });

// ── СЛАЙД 1: ОБЛОЖКА ──
{
  const s = pres.addSlide(); s.background = { color:BG };
  s.addShape(pres.shapes.OVAL, { x:1.5, y:-1.2, w:7, h:7, fill:{color:PURPLE_DIM,transparency:88}, line:{color:PURPLE_DIM,transparency:90,width:0} });
  s.addShape(pres.shapes.OVAL, { x:3.2, y:-0.6, w:3.6, h:3.6, fill:{color:PURPLE,transparency:82}, line:{color:PURPLE,transparency:80,width:0} });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:2.8, y:0.9, w:4.4, h:0.34, fill:{color:PURPLE,transparency:86}, line:{color:PURPLE,transparency:55,width:1}, rectRadius:0.1 });
  s.addText("ИИ-ПРАВОВОЙ ПОМОЩНИК ДЛЯ СНГ", { x:2.8, y:0.9, w:4.4, h:0.34, color:PURPLE_LIGHT, fontSize:8, bold:true, align:"center", valign:"middle", charSpacing:1.5, margin:0 });
  s.addText("Yurist AI", { x:0.5, y:1.38, w:9, h:1.5, color:WHITE, fontSize:88, bold:true, align:"center", fontFace:"Arial", charSpacing:-3, margin:0 });
  s.addText("Знайте свои права.", { x:0.5, y:3.0, w:9, h:0.6, color:PURPLE_LIGHT, fontSize:26, align:"center", fontFace:"Arial", margin:0 });
  s.addText("За 30 секунд.", { x:0.5, y:3.58, w:9, h:0.44, color:MUTED, fontSize:18, align:"center", fontFace:"Arial", margin:0 });
  [["Узбекский",0],["Русский",1],["Английский",2]].forEach(([chip,i]) => {
    const x = 2.9 + i*1.45;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y:4.62, w:1.3, h:0.3, fill:{color:"141428"}, line:{color:PURPLE,transparency:55,width:1}, rectRadius:0.08 });
    s.addText(chip, { x, y:4.62, w:1.3, h:0.3, color:MUTED, fontSize:9.5, align:"center", valign:"middle", margin:0 });
  });
  s.addNotes("Открывайте уверенно. Это работающий продукт, а не концепция. Yurist AI уже запущен.");
}

// ── СЛАЙД 2: ПРОБЛЕМА ──
{
  const s = pres.addSlide(); s.background = { color:BG };
  s.addText("ПРОБЛЕМА", { x:0.5, y:0.28, w:9, h:0.26, color:PURPLE, fontSize:10, bold:true, charSpacing:3, align:"center", margin:0 });
  s.addText("Юридическая помощь в СНГ недоступна", { x:0.5, y:0.6, w:9, h:0.8, color:WHITE, fontSize:34, bold:true, align:"center", fontFace:"Arial", charSpacing:-1, margin:0 });
  const pains = [
    { icon:"💼", title:"Невыплата зарплаты", desc:"Консультация юриста — от $200. Большинство работников просто смиряется.", color:PURPLE },
    { icon:"🏠", title:"Спор об аренде",    desc:"Недели неопределённости. Арендаторы не знают своих прав.", color:GREEN },
    { icon:"🛒", title:"Бракованный товар", desc:"Непонятно, с чего начать. Права потребителей есть — никто не знает.", color:AMBER },
  ];
  pains.forEach(({icon,title,desc,color},i) => {
    const x = 0.42+i*3.12;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y:1.65, w:2.95, h:2.6, fill:{color:CARD}, line:{color:"FFFFFF",transparency:92,width:1}, rectRadius:0.14, shadow:makeCardShadow() });
    s.addShape(pres.shapes.OVAL, { x:x+0.22, y:1.86, w:0.58, h:0.58, fill:{color,transparency:83}, line:{color,transparency:65,width:1} });
    s.addText(icon, { x:x+0.22, y:1.86, w:0.58, h:0.58, fontSize:20, align:"center", valign:"middle", margin:0 });
    s.addText(title, { x:x+0.2, y:2.58, w:2.58, h:0.38, color:WHITE, fontSize:14, bold:true, fontFace:"Arial", margin:0 });
    s.addText(desc, { x:x+0.2, y:3.0, w:2.58, h:0.88, color:MUTED, fontSize:12, fontFace:"Arial", margin:0 });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:1.2, y:4.42, w:7.6, h:0.78, fill:{color:PURPLE,transparency:90}, line:{color:PURPLE,transparency:55,width:1}, rectRadius:0.1 });
  s.addText("Только 8% жителей СНГ когда-либо обращались к юристу — миллионы страдают молча.", { x:1.2, y:4.42, w:7.6, h:0.78, color:PURPLE_LIGHT, fontSize:13.5, align:"center", valign:"middle", fontFace:"Arial", margin:0 });
  s.addNotes("Проблема не в осведомлённости — люди знают о нарушениях. Проблема в доступе.");
}

// ── СЛАЙД 3: РЕШЕНИЕ ──
{
  const s = pres.addSlide(); s.background = { color:BG };
  s.addText("РЕШЕНИЕ", { x:0.5, y:0.28, w:9, h:0.26, color:PURPLE, fontSize:10, bold:true, charSpacing:3, align:"center", margin:0 });
  s.addText("Yurist AI: правовая ясность за секунды", { x:0.5, y:0.6, w:9, h:0.8, color:WHITE, fontSize:34, bold:true, align:"center", fontFace:"Arial", charSpacing:-1, margin:0 });
  s.addText("Платформа на базе ИИ, которая объясняет ваши права, проверяет договоры и\nсоставляет документы — мгновенно, на вашем языке.", { x:1, y:1.5, w:8, h:0.7, color:MUTED, fontSize:13, align:"center", fontFace:"Arial", margin:0 });
  const features = [
    { icon:"🧠", title:"AI-анализ дела",    desc:"Опишите ситуацию простыми словами. Получите правовой анализ со ссылками на статьи законов СНГ." },
    { icon:"📄", title:"Проверка договора", desc:"Загрузите PDF-договор. ИИ выявит рискованные пункты и несправедливые условия за секунды." },
    { icon:"💬", title:"Чат с юристом",     desc:"Правовой ИИ-помощник 24/7. Задавайте уточняющие вопросы, получайте шаблоны документов." },
  ];
  features.forEach(({icon,title,desc},i) => {
    const x = 0.38+i*3.12;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y:2.38, w:2.98, h:2.85, fill:{color:CARD}, line:{color:PURPLE,transparency:78,width:1}, rectRadius:0.14, shadow:makeCardShadow() });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:x+0.22, y:2.58, w:0.58, h:0.58, fill:{color:PURPLE,transparency:80}, line:{color:PURPLE,transparency:62,width:1}, rectRadius:0.1 });
    s.addText(icon, { x:x+0.22, y:2.58, w:0.58, h:0.58, fontSize:20, align:"center", valign:"middle", margin:0 });
    s.addText(title, { x:x+0.2, y:3.28, w:2.6, h:0.4, color:WHITE, fontSize:13, bold:true, fontFace:"Arial", margin:0 });
    s.addText(desc, { x:x+0.2, y:3.72, w:2.6, h:1.14, color:MUTED, fontSize:11.5, fontFace:"Arial", margin:0 });
  });
  s.addText("В 3 РАЗА БЫСТРЕЕ  ·  В 100 РАЗ ДЕШЕВЛЕ  ·  ДОСТУПНО 24/7", { x:0.5, y:5.28, w:9, h:0.28, color:PURPLE_LIGHT, fontSize:11.5, bold:true, align:"center", charSpacing:0.5, margin:0 });
  s.addNotes("Это не просто чат-бот. Это полный правовой стек: анализ, договоры, документы.");
}

// ── СЛАЙД 4: КАК ЭТО РАБОТАЕТ ──
{
  const s = pres.addSlide(); s.background = { color:BG };
  s.addText("КАК ЭТО РАБОТАЕТ", { x:0.5, y:0.28, w:9, h:0.26, color:PURPLE, fontSize:10, bold:true, charSpacing:3, align:"center", margin:0 });
  s.addText("Просто. Быстро. Точно.", { x:0.5, y:0.6, w:9, h:0.8, color:WHITE, fontSize:38, bold:true, align:"center", fontFace:"Arial", charSpacing:-1, margin:0 });
  const steps = [
    { num:"01", title:"Опишите свою ситуацию", desc:"Напишите или скажите о своей правовой проблеме на узбекском, русском или английском языке. Юридические термины не нужны." },
    { num:"02", title:"ИИ мгновенно анализирует законы СНГ", desc:"Модель сканирует тысячи правовых статей, судебных прецедентов и норм защиты прав потребителей в режиме реального времени." },
    { num:"03", title:"Получите свои права и следующие шаги", desc:"Чёткое объяснение ваших прав, практические шаги, ссылки на статьи закона и шаблоны документов при необходимости." },
  ];
  steps.forEach(({num,title,desc},i) => {
    const y = 1.65+i*1.26;
    s.addShape(pres.shapes.OVAL, { x:0.48, y:y+0.02, w:0.72, h:0.72, fill:{color:PURPLE,transparency:76}, line:{color:PURPLE,transparency:38,width:1.5} });
    s.addText(num, { x:0.48, y:y+0.02, w:0.72, h:0.72, color:PURPLE_LIGHT, fontSize:15, bold:true, align:"center", valign:"middle", margin:0 });
    if(i<2) s.addShape(pres.shapes.RECTANGLE, { x:0.81, y:y+0.76, w:0.06, h:0.52, fill:{color:PURPLE,transparency:72}, line:{color:PURPLE,transparency:72,width:0} });
    s.addText(title, { x:1.5, y:y+0.06, w:8, h:0.4, color:WHITE, fontSize:17, bold:true, fontFace:"Arial", margin:0 });
    s.addText(desc, { x:1.5, y:y+0.48, w:8, h:0.6, color:MUTED, fontSize:12, fontFace:"Arial", margin:0 });
  });
  s.addNotes("Среднее время от вопроса до ответа — менее 10 секунд. Знание законов не требуется.");
}

// ── СЛАЙД 5: РЫНОК ──
{
  const s = pres.addSlide(); s.background = { color:BG };
  s.addText("РЫНОЧНАЯ ВОЗМОЖНОСТЬ", { x:0.5, y:0.28, w:9, h:0.26, color:PURPLE, fontSize:10, bold:true, charSpacing:3, align:"center", margin:0 });
  s.addText("Огромный недостаточно обслуживаемый рынок", { x:0.5, y:0.6, w:9, h:0.8, color:WHITE, fontSize:32, bold:true, align:"center", fontFace:"Arial", charSpacing:-1, margin:0 });
  const stats = [
    { value:"300М+", label:"Население СНГ",         sub:"Общий адресуемый рынок",    color:PURPLE_LIGHT },
    { value:"$2B+",  label:"Рынок юридических услуг", sub:"Ежегодные расходы в СНГ",  color:GREEN },
    { value:"<5%",   label:"Цифровое проникновение",  sub:"Уровень принятия legaltech", color:AMBER },
    { value:"74%",   label:"Пользователи смартфонов", sub:"И растёт с каждым годом",   color:BLUE },
  ];
  stats.forEach(({value,label,sub,color},i) => {
    const x = 0.38+(i%2)*4.7; const y = 1.65+Math.floor(i/2)*1.75;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w:4.35, h:1.55, fill:{color:CARD}, line:{color:"FFFFFF",transparency:93,width:1}, rectRadius:0.14, shadow:makeCardShadow() });
    s.addText(value, { x:x+0.28, y:y+0.14, w:3.6, h:0.7, color, fontSize:46, bold:true, fontFace:"Arial", charSpacing:-2, margin:0 });
    s.addText(label, { x:x+0.28, y:y+0.82, w:3.6, h:0.32, color:WHITE, fontSize:13, bold:true, fontFace:"Arial", margin:0 });
    s.addText(sub,   { x:x+0.28, y:y+1.15, w:3.6, h:0.28, color:MUTED, fontSize:11, fontFace:"Arial", margin:0 });
  });
  s.addNotes("300 млн человек регулярно сталкиваются с правовыми проблемами почти без цифровых решений.");
}

// ── СЛАЙД 6: БИЗНЕС-МОДЕЛЬ ──
{
  const s = pres.addSlide(); s.background = { color:BG };
  s.addText("БИЗНЕС-МОДЕЛЬ", { x:0.5, y:0.28, w:9, h:0.26, color:PURPLE, fontSize:10, bold:true, charSpacing:3, align:"center", margin:0 });
  s.addText("Простое масштабируемое ценообразование", { x:0.5, y:0.6, w:9, h:0.8, color:WHITE, fontSize:34, bold:true, align:"center", fontFace:"Arial", charSpacing:-1, margin:0 });
  const tiers = [
    { name:"БЕСПЛАТНО", price:"$0",  period:"навсегда",  feats:["3 вопроса в месяц","Базовый анализ дела","Узбекский и русский язык"], popular:false, color:MUTED,       accent:"1A1A28" },
    { name:"PRO",        price:"$5",  period:"в месяц",   feats:["Неограниченные вопросы","Проверка договора","Составление документов","Все 3 языка"], popular:true, color:PURPLE_LIGHT, accent:"1A0E35" },
    { name:"КОМПАНИЯ",   price:"$20", period:"в месяц",   feats:["Всё из Pro","5 аккаунтов команды","Приоритетная поддержка","Доступ к API"], popular:false, color:GREEN, accent:"0C1F18" },
  ];
  tiers.forEach(({name,price,period,feats,popular,color,accent},i) => {
    const x = 0.42+i*3.12;
    if(popular){ s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:x+0.45, y:1.52, w:2.0, h:0.3, fill:{color:PURPLE}, line:{color:PURPLE,transparency:0,width:0}, rectRadius:0.08 }); s.addText("НАИБОЛЕЕ ПОПУЛЯРНЫЙ", { x:x+0.45, y:1.52, w:2.0, h:0.3, color:WHITE, fontSize:7.5, bold:true, align:"center", valign:"middle", charSpacing:0.5, margin:0 }); }
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y:1.68, w:2.95, h:3.55, fill:{color:accent}, line:{color:popular?PURPLE:"FFFFFF",transparency:popular?20:93,width:popular?1.5:1}, rectRadius:0.14, shadow:popular?{type:"outer",blur:30,offset:3,angle:90,color:"000000",opacity:0.5}:makeCardShadow() });
    s.addText(name,  { x:x+0.2, y:1.82, w:2.58, h:0.4, color, fontSize:13, bold:true, fontFace:"Arial", margin:0 });
    s.addText(price, { x:x+0.2, y:2.26, w:1.8,  h:0.78, color:WHITE, fontSize:48, bold:true, fontFace:"Arial", charSpacing:-2, margin:0 });
    s.addText(period,{ x:x+0.2, y:3.06, w:2.58, h:0.28, color:MUTED, fontSize:11, fontFace:"Arial", margin:0 });
    feats.forEach((f,j) => s.addText("✓  "+f, { x:x+0.2, y:3.44+j*0.34, w:2.58, h:0.3, color:popular?"D8B4FE":MUTED, fontSize:11, fontFace:"Arial", margin:0 }));
  });
  s.addText("Freemium-модель → вирусный органический рост → целевая конверсия в Pro: 8%", { x:0.5, y:5.3, w:9, h:0.26, color:MUTED, fontSize:11, align:"center", margin:0 });
  s.addNotes("Бесплатный план создаёт вирусные петли — пользователи делятся ответами, друзья регистрируются.");
}

// ── СЛАЙД 7: ТРЕКШН ──
{
  const s = pres.addSlide(); s.background = { color:BG };
  s.addText("ТРЕКШН", { x:0.5, y:0.28, w:9, h:0.26, color:PURPLE, fontSize:10, bold:true, charSpacing:3, align:"center", margin:0 });
  s.addText("Создан. Запущен. Растёт.", { x:0.5, y:0.6, w:9, h:0.8, color:WHITE, fontSize:38, bold:true, align:"center", fontFace:"Arial", charSpacing:-1, margin:0 });
  const milestones = [
    { done:true,  text:"Полнофункциональная платформа — React, Node.js, PostgreSQL", date:"Q1 2026" },
    { done:true,  text:"Многоязычный ИИ-движок (Узбекский · Русский · Английский)", date:"Q1 2026" },
    { done:true,  text:"Функции проверки договоров и составления документов", date:"Q2 2026" },
    { done:true,  text:"Премиальный тёмный интерфейс — готов для инвесторов", date:"Q2 2026" },
    { done:false, text:"1 000 зарегистрированных пользователей", date:"Q3 2026" },
    { done:false, text:"Партнёрства с юридическими фирмами в РФ и КЗ", date:"Q4 2026" },
    { done:false, text:"10 000 пользователей · $5 000 MRR", date:"Q1 2027" },
  ];
  milestones.forEach(({done,text,date},i) => {
    const y = 1.6+i*0.52; const col = done?GREEN:PURPLE;
    s.addShape(pres.shapes.OVAL, { x:0.45, y:y+0.05, w:0.32, h:0.32, fill:{color:col,transparency:done?0:78}, line:{color:col,transparency:done?0:42,width:1} });
    s.addText(done?"✓":"→", { x:0.45, y:y+0.05, w:0.32, h:0.32, color:done?BG:col, fontSize:9, bold:true, align:"center", valign:"middle", margin:0 });
    s.addText(text, { x:1.02, y, w:7.3, h:0.38, color:done?WHITE:MUTED, fontSize:13, fontFace:"Arial", bold:done, margin:0 });
    s.addText(date, { x:8.35, y, w:1.3, h:0.38, color:col, fontSize:10, bold:true, align:"right", margin:0 });
  });
  s.addNotes("Это работающий продукт, а не колода слайдов. Всё зелёное уже живёт сегодня.");
}

// ── СЛАЙД 8: ЗАПРОС ──
{
  const s = pres.addSlide(); s.background = { color:BG };
  s.addText("ЗАПРОС", { x:0.5, y:0.28, w:9, h:0.26, color:PURPLE, fontSize:10, bold:true, charSpacing:3, align:"center", margin:0 });
  s.addText("Присоединитесь к миссии", { x:0.5, y:0.6, w:9, h:0.8, color:WHITE, fontSize:36, bold:true, align:"center", fontFace:"Arial", charSpacing:-1, margin:0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:2.3, y:1.6, w:5.4, h:1.14, fill:{color:PURPLE,transparency:86}, line:{color:PURPLE,transparency:42,width:1.5}, rectRadius:0.14 });
  s.addText("Ищем", { x:2.3, y:1.68, w:5.4, h:0.3, color:MUTED, fontSize:11, align:"center", margin:0 });
  s.addText("$150 000 Посевной раунд", { x:2.3, y:1.98, w:5.4, h:0.68, color:WHITE, fontSize:28, bold:true, align:"center", fontFace:"Arial", charSpacing:-1, margin:0 });
  s.addText("ИСПОЛЬЗОВАНИЕ СРЕДСТВ", { x:0.5, y:2.92, w:9, h:0.28, color:PURPLE, fontSize:9, bold:true, charSpacing:3, align:"center", margin:0 });
  const funds = [
    { pct:"40%", label:"Продукт и ИИ R&D",    color:PURPLE_LIGHT },
    { pct:"30%", label:"Маркетинг и рост",     color:GREEN },
    { pct:"20%", label:"Юридические партнёрства", color:AMBER },
    { pct:"10%", label:"Операционные расходы", color:BLUE },
  ];
  funds.forEach(({pct,label,color},i) => {
    const x = 0.42+i*2.32;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y:3.28, w:2.15, h:1.55, fill:{color:CARD}, line:{color:"FFFFFF",transparency:93,width:1}, rectRadius:0.12, shadow:makeCardShadow() });
    s.addText(pct,   { x, y:3.4,  w:2.15, h:0.72, color, fontSize:40, bold:true, align:"center", fontFace:"Arial", charSpacing:-2, margin:0 });
    s.addText(label, { x, y:4.14, w:2.15, h:0.55, color:MUTED, fontSize:10, align:"center", fontFace:"Arial", margin:0 });
  });
  s.addText("Видение: правовая инфраструктура для каждого гражданина СНГ", { x:0.5, y:4.95, w:9, h:0.34, color:PURPLE_LIGHT, fontSize:12.5, bold:true, italic:true, align:"center", margin:0 });
  s.addNotes("$150 тыс. выводят нас на 10 000 пользователей и $5 000 MRR за 12 месяцев.");
}

// ── СЛАЙД 9: ФИНАЛ ──
{
  const s = pres.addSlide(); s.background = { color:BG };
  s.addShape(pres.shapes.OVAL, { x:1.5, y:-1.5, w:7, h:7, fill:{color:PURPLE_DIM,transparency:88}, line:{color:PURPLE_DIM,transparency:90,width:0} });
  s.addShape(pres.shapes.OVAL, { x:3.2, y:-0.8, w:3.6, h:3.6, fill:{color:PURPLE,transparency:82}, line:{color:PURPLE,transparency:80,width:0} });
  s.addText("Yurist AI", { x:0.5, y:1.0, w:9, h:1.55, color:WHITE, fontSize:80, bold:true, align:"center", fontFace:"Arial", charSpacing:-3, margin:0 });
  s.addText("Знайте свои права.", { x:0.5, y:2.65, w:9, h:0.65, color:PURPLE_LIGHT, fontSize:28, align:"center", fontFace:"Arial", margin:0 });
  s.addShape(pres.shapes.RECTANGLE, { x:3.9, y:3.5, w:2.2, h:0.02, fill:{color:PURPLE,transparency:58}, line:{color:PURPLE,transparency:58,width:0} });
  s.addText("javohirbahtiyorov2001@gmail.com", { x:0.5, y:3.68, w:9, h:0.4, color:MUTED, fontSize:14, align:"center", fontFace:"Arial", margin:0 });
  s.addText("yurist.ai", { x:0.5, y:4.1, w:9, h:0.38, color:PURPLE, fontSize:15, bold:true, align:"center", fontFace:"Arial", margin:0 });
  s.addText("Создан в Узбекистане · Для стран СНГ", { x:0.5, y:4.78, w:9, h:0.28, color:"333345", fontSize:11, align:"center", margin:0 });
  s.addNotes("Оставьте 10 минут для вопросов. Живое демо готово.");
}

const OUT = "D:/claude code/lexcis/yurist-ai-pitch-deck-ru.pptx";
pres.writeFile({ fileName:OUT }).then(() => console.log("done:"+OUT)).catch(e=>{console.error(e);process.exit(1)});
