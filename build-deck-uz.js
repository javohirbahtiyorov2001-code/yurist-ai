const pptxgen = require("pptxgenjs");

const BG = "080810"; const CARD = "0E0E1C"; const PURPLE = "A855F7";
const PURPLE_LIGHT = "C084FC"; const PURPLE_DIM = "7C3AED";
const WHITE = "FFFFFF"; const MUTED = "888899";
const GREEN = "34D399"; const AMBER = "FBBF24"; const BLUE = "60A5FA";

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "Yurist AI — Investor Taqdimoti";
pres.author = "Yurist AI";

const makeShadow = () => ({ type:"outer", blur:20, offset:4, angle:90, color:"000000", opacity:0.4 });
const makeCardShadow = () => ({ type:"outer", blur:10, offset:2, angle:90, color:"000000", opacity:0.3 });

// ── SLAYD 1: MUQOVA ──
{
  const s = pres.addSlide(); s.background = { color:BG };
  s.addShape(pres.shapes.OVAL, { x:1.5, y:-1.2, w:7, h:7, fill:{color:PURPLE_DIM,transparency:88}, line:{color:PURPLE_DIM,transparency:90,width:0} });
  s.addShape(pres.shapes.OVAL, { x:3.2, y:-0.6, w:3.6, h:3.6, fill:{color:PURPLE,transparency:82}, line:{color:PURPLE,transparency:80,width:0} });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:2.8, y:0.9, w:4.4, h:0.34, fill:{color:PURPLE,transparency:86}, line:{color:PURPLE,transparency:55,width:1}, rectRadius:0.1 });
  s.addText("SUN'IY INTELLEKT ASOSIDA HUQUQIY YORDAMCHI", { x:2.8, y:0.9, w:4.4, h:0.34, color:PURPLE_LIGHT, fontSize:7.5, bold:true, align:"center", valign:"middle", charSpacing:1, margin:0 });
  s.addText("Yurist AI", { x:0.5, y:1.38, w:9, h:1.5, color:WHITE, fontSize:88, bold:true, align:"center", fontFace:"Arial", charSpacing:-3, margin:0 });
  s.addText("Huquqingizni biling.", { x:0.5, y:3.0, w:9, h:0.6, color:PURPLE_LIGHT, fontSize:26, align:"center", fontFace:"Arial", margin:0 });
  s.addText("30 soniyada.", { x:0.5, y:3.58, w:9, h:0.44, color:MUTED, fontSize:18, align:"center", fontFace:"Arial", margin:0 });
  [["O'zbek tili",0],["Rus tili",1],["Ingliz tili",2]].forEach(([chip,i]) => {
    const x = 2.9+i*1.45;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y:4.62, w:1.3, h:0.3, fill:{color:"141428"}, line:{color:PURPLE,transparency:55,width:1}, rectRadius:0.08 });
    s.addText(chip, { x, y:4.62, w:1.3, h:0.3, color:MUTED, fontSize:9.5, align:"center", valign:"middle", margin:0 });
  });
  s.addNotes("Ishonch bilan boshlang. Bu ishlaydigan mahsulot, kontseptsiya emas.");
}

// ── SLAYD 2: MUAMMO ──
{
  const s = pres.addSlide(); s.background = { color:BG };
  s.addText("MUAMMO", { x:0.5, y:0.28, w:9, h:0.26, color:PURPLE, fontSize:10, bold:true, charSpacing:3, align:"center", margin:0 });
  s.addText("MDHda huquqiy yordam mavjud emas", { x:0.5, y:0.6, w:9, h:0.8, color:WHITE, fontSize:34, bold:true, align:"center", fontFace:"Arial", charSpacing:-1, margin:0 });
  const pains = [
    { icon:"💼", title:"Maosh berilmadi",  desc:"Yurist maslahati $200+. Ko'pchilik ishchilar shunchaki taslim bo'ladi.", color:PURPLE },
    { icon:"🏠", title:"Ijara muammosi",   desc:"Haftalar davomida noaniqlik. Ijarachilar o'z huquqlarini bilmaydi.", color:GREEN },
    { icon:"🛒", title:"Sifatsiz mahsulot", desc:"Qayerdan boshlashni bilish qiyin. Iste'molchi huquqlari bor — hech kim bilmaydi.", color:AMBER },
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
  s.addText("MDH fuqarolarining atigi 8% yuristga murojaat qilgan — millionlar jim azob chekadi.", { x:1.2, y:4.42, w:7.6, h:0.78, color:PURPLE_LIGHT, fontSize:13.5, align:"center", valign:"middle", fontFace:"Arial", margin:0 });
  s.addNotes("Muammo bilimda emas — odamlar huquqlari buzilayotganini biladi. Muammo — fursatda.");
}

// ── SLAYD 3: YECHIM ──
{
  const s = pres.addSlide(); s.background = { color:BG };
  s.addText("YECHIM", { x:0.5, y:0.28, w:9, h:0.26, color:PURPLE, fontSize:10, bold:true, charSpacing:3, align:"center", margin:0 });
  s.addText("Yurist AI: soniyalarda huquqiy aniqlik", { x:0.5, y:0.6, w:9, h:0.8, color:WHITE, fontSize:34, bold:true, align:"center", fontFace:"Arial", charSpacing:-1, margin:0 });
  s.addText("Sun'iy intellekt asosidagi platforma — huquqlaringizni tushuntiradi, shartnomalarni\ntekshiradi va hujjatlarni tuzadi. Bir zumda, o'z tilingizda.", { x:1, y:1.5, w:8, h:0.7, color:MUTED, fontSize:13, align:"center", fontFace:"Arial", margin:0 });
  const features = [
    { icon:"🧠", title:"AI tahlili",          desc:"Vaziyatingizni oddiy so'zlar bilan tushuntiring. MDH qonunlariga havolalar bilan tezkor huquqiy tahlil oling." },
    { icon:"📄", title:"Shartnoma tekshiruvi", desc:"PDF shartnomani yuklang. AI xavfli bandlar va adolatsiz shartlarni bir zumda aniqlaydi." },
    { icon:"💬", title:"Yurist bilan chat",    desc:"24/7 huquqiy yordamchi. Savollar bering, hujjat shablonlarini oling, da'vo xatlari tuzing." },
  ];
  features.forEach(({icon,title,desc},i) => {
    const x = 0.38+i*3.12;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y:2.38, w:2.98, h:2.85, fill:{color:CARD}, line:{color:PURPLE,transparency:78,width:1}, rectRadius:0.14, shadow:makeCardShadow() });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:x+0.22, y:2.58, w:0.58, h:0.58, fill:{color:PURPLE,transparency:80}, line:{color:PURPLE,transparency:62,width:1}, rectRadius:0.1 });
    s.addText(icon, { x:x+0.22, y:2.58, w:0.58, h:0.58, fontSize:20, align:"center", valign:"middle", margin:0 });
    s.addText(title, { x:x+0.2, y:3.28, w:2.6, h:0.4, color:WHITE, fontSize:13, bold:true, fontFace:"Arial", margin:0 });
    s.addText(desc, { x:x+0.2, y:3.72, w:2.6, h:1.14, color:MUTED, fontSize:11.5, fontFace:"Arial", margin:0 });
  });
  s.addText("3 BAROBAR TEZROQ  ·  100 BAROBAR ARZONROQ  ·  24/7 MAVJUD", { x:0.5, y:5.28, w:9, h:0.28, color:PURPLE_LIGHT, fontSize:11.5, bold:true, align:"center", charSpacing:0.5, margin:0 });
  s.addNotes("Bu shunchaki chatbot emas. To'liq huquqiy stek: tahlil, shartnomalar, hujjatlar.");
}

// ── SLAYD 4: QANDAY ISHLAYDI ──
{
  const s = pres.addSlide(); s.background = { color:BG };
  s.addText("QANDAY ISHLAYDI", { x:0.5, y:0.28, w:9, h:0.26, color:PURPLE, fontSize:10, bold:true, charSpacing:3, align:"center", margin:0 });
  s.addText("Oddiy. Tez. Aniq.", { x:0.5, y:0.6, w:9, h:0.8, color:WHITE, fontSize:38, bold:true, align:"center", fontFace:"Arial", charSpacing:-1, margin:0 });
  const steps = [
    { num:"01", title:"Vaziyatingizni tasvirlab bering", desc:"O'zbek, rus yoki ingliz tilida huquqiy muammoingizni yozing yoki ayting. Yuridik atamalar shart emas — o'z so'zlaringizda." },
    { num:"02", title:"AI MDH qonunlarini bir zumda tahlil qiladi", desc:"Model minglab huquqiy maqolalar, sud pretsedentlari va iste'molchi himoyasi normalarini real vaqtda ko'rib chiqadi." },
    { num:"03", title:"Huquqlaringiz va keyingi qadamlarni oling", desc:"Huquqlaringizning aniq tushuntirishi, amaliy keyingi qadamlar, qonun maqolalariga havolalar va hujjat shablonlari." },
  ];
  steps.forEach(({num,title,desc},i) => {
    const y = 1.65+i*1.26;
    s.addShape(pres.shapes.OVAL, { x:0.48, y:y+0.02, w:0.72, h:0.72, fill:{color:PURPLE,transparency:76}, line:{color:PURPLE,transparency:38,width:1.5} });
    s.addText(num, { x:0.48, y:y+0.02, w:0.72, h:0.72, color:PURPLE_LIGHT, fontSize:15, bold:true, align:"center", valign:"middle", margin:0 });
    if(i<2) s.addShape(pres.shapes.RECTANGLE, { x:0.81, y:y+0.76, w:0.06, h:0.52, fill:{color:PURPLE,transparency:72}, line:{color:PURPLE,transparency:72,width:0} });
    s.addText(title, { x:1.5, y:y+0.06, w:8, h:0.4, color:WHITE, fontSize:17, bold:true, fontFace:"Arial", margin:0 });
    s.addText(desc,  { x:1.5, y:y+0.48, w:8, h:0.6, color:MUTED, fontSize:12, fontFace:"Arial", margin:0 });
  });
  s.addNotes("Savoldan javobgacha o'rtacha vaqt: 10 soniyadan kam. Qonun bilimi shart emas.");
}

// ── SLAYD 5: BOZOR ──
{
  const s = pres.addSlide(); s.background = { color:BG };
  s.addText("BOZOR IMKONIYATI", { x:0.5, y:0.28, w:9, h:0.26, color:PURPLE, fontSize:10, bold:true, charSpacing:3, align:"center", margin:0 });
  s.addText("Ulkan xizmat ko'rsatilmagan bozor", { x:0.5, y:0.6, w:9, h:0.8, color:WHITE, fontSize:34, bold:true, align:"center", fontFace:"Arial", charSpacing:-1, margin:0 });
  const stats = [
    { value:"300M+", label:"MDH aholisi",           sub:"Umumiy manzillanuvchi auditoriya", color:PURPLE_LIGHT },
    { value:"$2B+",  label:"Yuridik xizmatlar bozori", sub:"MDHda yillik yuridik xarajatlar",  color:GREEN },
    { value:"<5%",   label:"Raqamli kirib borish",   sub:"Legaltech qabul qilish darajasi",    color:AMBER },
    { value:"74%",   label:"Smartfon foydalanuvchilari", sub:"Va yildan-yilga o'sib bormoqda", color:BLUE },
  ];
  stats.forEach(({value,label,sub,color},i) => {
    const x = 0.38+(i%2)*4.7; const y = 1.65+Math.floor(i/2)*1.75;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w:4.35, h:1.55, fill:{color:CARD}, line:{color:"FFFFFF",transparency:93,width:1}, rectRadius:0.14, shadow:makeCardShadow() });
    s.addText(value, { x:x+0.28, y:y+0.14, w:3.6, h:0.7, color, fontSize:46, bold:true, fontFace:"Arial", charSpacing:-2, margin:0 });
    s.addText(label, { x:x+0.28, y:y+0.82, w:3.6, h:0.32, color:WHITE, fontSize:13, bold:true, fontFace:"Arial", margin:0 });
    s.addText(sub,   { x:x+0.28, y:y+1.15, w:3.6, h:0.28, color:MUTED, fontSize:11, fontFace:"Arial", margin:0 });
  });
  s.addNotes("300 million kishi doimiy ravishda huquqiy muammolarga duch keladi, deyarli hech qanday raqamli yechim yo'q.");
}

// ── SLAYD 6: BIZNES MODELI ──
{
  const s = pres.addSlide(); s.background = { color:BG };
  s.addText("BIZNES MODELI", { x:0.5, y:0.28, w:9, h:0.26, color:PURPLE, fontSize:10, bold:true, charSpacing:3, align:"center", margin:0 });
  s.addText("Sodda, kengaytiriladigan narxlash", { x:0.5, y:0.6, w:9, h:0.8, color:WHITE, fontSize:34, bold:true, align:"center", fontFace:"Arial", charSpacing:-1, margin:0 });
  const tiers = [
    { name:"BEPUL",   price:"$0",  period:"doimo",      feats:["Oyiga 3 savol","Asosiy tahlil","O'zbek va Rus tili"], popular:false, color:MUTED,       accent:"1A1A28" },
    { name:"PRO",     price:"$5",  period:"oyiga",       feats:["Cheksiz savollar","Shartnoma tekshiruvi","Hujjat tuzish","Barcha 3 til"], popular:true, color:PURPLE_LIGHT, accent:"1A0E35" },
    { name:"KOMPANIYA",price:"$20", period:"oyiga",      feats:["Prodan hammasini","5 jamoa akkaunt","Ustunlik ko'magi","API kirish"], popular:false, color:GREEN, accent:"0C1F18" },
  ];
  tiers.forEach(({name,price,period,feats,popular,color,accent},i) => {
    const x = 0.42+i*3.12;
    if(popular){ s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:x+0.45, y:1.52, w:2.0, h:0.3, fill:{color:PURPLE}, line:{color:PURPLE,transparency:0,width:0}, rectRadius:0.08 }); s.addText("ENG MASHHUR", { x:x+0.45, y:1.52, w:2.0, h:0.3, color:WHITE, fontSize:8, bold:true, align:"center", valign:"middle", charSpacing:1, margin:0 }); }
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y:1.68, w:2.95, h:3.55, fill:{color:accent}, line:{color:popular?PURPLE:"FFFFFF",transparency:popular?20:93,width:popular?1.5:1}, rectRadius:0.14, shadow:popular?{type:"outer",blur:30,offset:3,angle:90,color:"000000",opacity:0.5}:makeCardShadow() });
    s.addText(name,  { x:x+0.2, y:1.82, w:2.58, h:0.4, color, fontSize:12, bold:true, fontFace:"Arial", margin:0 });
    s.addText(price, { x:x+0.2, y:2.26, w:1.8,  h:0.78, color:WHITE, fontSize:48, bold:true, fontFace:"Arial", charSpacing:-2, margin:0 });
    s.addText(period,{ x:x+0.2, y:3.06, w:2.58, h:0.28, color:MUTED, fontSize:11, fontFace:"Arial", margin:0 });
    feats.forEach((f,j) => s.addText("✓  "+f, { x:x+0.2, y:3.44+j*0.34, w:2.58, h:0.3, color:popular?"D8B4FE":MUTED, fontSize:11, fontFace:"Arial", margin:0 }));
  });
  s.addText("Freemium modeli → viral organik o'sish → Pro konversiya maqsadi: 8%", { x:0.5, y:5.3, w:9, h:0.26, color:MUTED, fontSize:11, align:"center", margin:0 });
  s.addNotes("Bepul reja viral zanjirlar yaratadi — foydalanuvchilar javoblarni ulashadi, do'stlar ro'yxatdan o'tadi.");
}

// ── SLAYD 7: TRAKTOR ──
{
  const s = pres.addSlide(); s.background = { color:BG };
  s.addText("TRAKSION", { x:0.5, y:0.28, w:9, h:0.26, color:PURPLE, fontSize:10, bold:true, charSpacing:3, align:"center", margin:0 });
  s.addText("Qurildi. Ishga tushirildi. O'smoqda.", { x:0.5, y:0.6, w:9, h:0.8, color:WHITE, fontSize:34, bold:true, align:"center", fontFace:"Arial", charSpacing:-1, margin:0 });
  const milestones = [
    { done:true,  text:"To'liq platforma ishga tushirildi — React, Node.js, PostgreSQL", date:"Q1 2026" },
    { done:true,  text:"Ko'p tilli AI huquqiy dvigatel (O'zbek · Rus · Ingliz)", date:"Q1 2026" },
    { done:true,  text:"Shartnoma tekshiruvi va hujjat tuzish funksiyalari",  date:"Q2 2026" },
    { done:true,  text:"Premium qorongu'i interfeys — investorlar uchun tayyor", date:"Q2 2026" },
    { done:false, text:"1 000 ro'yxatdan o'tgan foydalanuvchi",  date:"Q3 2026" },
    { done:false, text:"O'zbekiston va Qozog'istonda huquqiy sherikliklar", date:"Q4 2026" },
    { done:false, text:"10 000 foydalanuvchi · $5 000 oylik daromad", date:"Q1 2027" },
  ];
  milestones.forEach(({done,text,date},i) => {
    const y = 1.6+i*0.52; const col = done?GREEN:PURPLE;
    s.addShape(pres.shapes.OVAL, { x:0.45, y:y+0.05, w:0.32, h:0.32, fill:{color:col,transparency:done?0:78}, line:{color:col,transparency:done?0:42,width:1} });
    s.addText(done?"✓":"→", { x:0.45, y:y+0.05, w:0.32, h:0.32, color:done?BG:col, fontSize:9, bold:true, align:"center", valign:"middle", margin:0 });
    s.addText(text, { x:1.02, y, w:7.3, h:0.38, color:done?WHITE:MUTED, fontSize:13, fontFace:"Arial", bold:done, margin:0 });
    s.addText(date, { x:8.35, y, w:1.3, h:0.38, color:col, fontSize:10, bold:true, align:"right", margin:0 });
  });
  s.addNotes("Bu ishlaydigan mahsulot — slaydlar to'plami emas. Yashil belgilanganlar bugun jonli.");
}

// ── SLAYD 8: SO'ROV ──
{
  const s = pres.addSlide(); s.background = { color:BG };
  s.addText("SO'ROV", { x:0.5, y:0.28, w:9, h:0.26, color:PURPLE, fontSize:10, bold:true, charSpacing:3, align:"center", margin:0 });
  s.addText("Missiyaga qo'shiling", { x:0.5, y:0.6, w:9, h:0.8, color:WHITE, fontSize:36, bold:true, align:"center", fontFace:"Arial", charSpacing:-1, margin:0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:2.3, y:1.6, w:5.4, h:1.14, fill:{color:PURPLE,transparency:86}, line:{color:PURPLE,transparency:42,width:1.5}, rectRadius:0.14 });
  s.addText("Qidiramiz", { x:2.3, y:1.68, w:5.4, h:0.3, color:MUTED, fontSize:11, align:"center", margin:0 });
  s.addText("$150 000 Urug' raundi", { x:2.3, y:1.98, w:5.4, h:0.68, color:WHITE, fontSize:28, bold:true, align:"center", fontFace:"Arial", charSpacing:-1, margin:0 });
  s.addText("MABLAG'LARDAN FOYDALANISH", { x:0.5, y:2.92, w:9, h:0.28, color:PURPLE, fontSize:9, bold:true, charSpacing:3, align:"center", margin:0 });
  const funds = [
    { pct:"40%", label:"Mahsulot va AI R&D",       color:PURPLE_LIGHT },
    { pct:"30%", label:"Marketing va o'sish",       color:GREEN },
    { pct:"20%", label:"Huquqiy sherikliklar",      color:AMBER },
    { pct:"10%", label:"Operatsion xarajatlar",     color:BLUE },
  ];
  funds.forEach(({pct,label,color},i) => {
    const x = 0.42+i*2.32;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y:3.28, w:2.15, h:1.55, fill:{color:CARD}, line:{color:"FFFFFF",transparency:93,width:1}, rectRadius:0.12, shadow:makeCardShadow() });
    s.addText(pct,   { x, y:3.4,  w:2.15, h:0.72, color, fontSize:40, bold:true, align:"center", fontFace:"Arial", charSpacing:-2, margin:0 });
    s.addText(label, { x, y:4.14, w:2.15, h:0.55, color:MUTED, fontSize:10, align:"center", fontFace:"Arial", margin:0 });
  });
  s.addText("Ko'rinish: MDHning har bir fuqarosi uchun huquqiy infratuzilma qatlami", { x:0.5, y:4.95, w:9, h:0.34, color:PURPLE_LIGHT, fontSize:12, bold:true, italic:true, align:"center", margin:0 });
  s.addNotes("$150 ming 12 oyda 10 000 foydalanuvchi va $5 000 oylik daromadga olib keladi.");
}

// ── SLAYD 9: XULOSA ──
{
  const s = pres.addSlide(); s.background = { color:BG };
  s.addShape(pres.shapes.OVAL, { x:1.5, y:-1.5, w:7, h:7, fill:{color:PURPLE_DIM,transparency:88}, line:{color:PURPLE_DIM,transparency:90,width:0} });
  s.addShape(pres.shapes.OVAL, { x:3.2, y:-0.8, w:3.6, h:3.6, fill:{color:PURPLE,transparency:82}, line:{color:PURPLE,transparency:80,width:0} });
  s.addText("Yurist AI", { x:0.5, y:1.0, w:9, h:1.55, color:WHITE, fontSize:80, bold:true, align:"center", fontFace:"Arial", charSpacing:-3, margin:0 });
  s.addText("Huquqingizni biling.", { x:0.5, y:2.65, w:9, h:0.65, color:PURPLE_LIGHT, fontSize:28, align:"center", fontFace:"Arial", margin:0 });
  s.addShape(pres.shapes.RECTANGLE, { x:3.9, y:3.5, w:2.2, h:0.02, fill:{color:PURPLE,transparency:58}, line:{color:PURPLE,transparency:58,width:0} });
  s.addText("javohirbahtiyorov2001@gmail.com", { x:0.5, y:3.68, w:9, h:0.4, color:MUTED, fontSize:14, align:"center", fontFace:"Arial", margin:0 });
  s.addText("yurist.ai", { x:0.5, y:4.1, w:9, h:0.38, color:PURPLE, fontSize:15, bold:true, align:"center", fontFace:"Arial", margin:0 });
  s.addText("O'zbekistonda qurilgan · MDH uchun", { x:0.5, y:4.78, w:9, h:0.28, color:"333345", fontSize:11, align:"center", margin:0 });
  s.addNotes("Savollar uchun 10 daqiqa qoldiring. Jonli demo tayyor.");
}

const OUT = "D:/claude code/lexcis/yurist-ai-pitch-deck-uz.pptx";
pres.writeFile({ fileName:OUT }).then(() => console.log("done:"+OUT)).catch(e=>{console.error(e);process.exit(1)});
