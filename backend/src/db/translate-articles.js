import pool from './pool.js'
import dotenv from 'dotenv'
dotenv.config()

// Uzbek + Russian translations of the seeded law articles, keyed by code_name + article_number
const T = [
  {
    code: 'Civil Code', art: '354',
    uz: "Shartnoma — bu ikki yoki undan ortiq shaxslarning fuqarolik huquq va majburiyatlarini o'rnatish, o'zgartirish yoki bekor qilish to'g'risidagi kelishuvidir. Shartnomalarga ikki va ko'p tomonlama bitimlar to'g'risidagi qoidalar qo'llaniladi. Shartnomalarga majburiyatlar to'g'risidagi umumiy qoidalar qo'llaniladi.",
    ru: "Договор — это соглашение двух или нескольких лиц об установлении, изменении или прекращении гражданских прав и обязанностей. К договорам применяются правила о двух- и многосторонних сделках. К договорам применяются общие положения об обязательствах.",
  },
  {
    code: 'Civil Code', art: '355',
    uz: "Fuqarolar va yuridik shaxslar shartnoma tuzishda erkindir. Shartnoma tuzishga majburlashga yo'l qo'yilmaydi, qonunda yoki ixtiyoriy ravishda olingan majburiyatda nazarda tutilgan hollar bundan mustasno. Taraflar qonunda nazarda tutilgan yoki tutilmagan shartnomani tuzishlari mumkin. Shartnoma shartlari taraflar ixtiyori bilan belgilanadi.",
    ru: "Граждане и юридические лица свободны в заключении договора. Принуждение к заключению договора не допускается, за исключением случаев, предусмотренных законом или добровольно принятым обязательством. Условия договора определяются по усмотрению сторон.",
  },
  {
    code: 'Labor Code', art: '80',
    uz: "Mehnat shartnomasi — bu xodim va ish beruvchi o'rtasidagi kelishuv bo'lib, unga ko'ra xodim ichki mehnat tartibiga bo'ysunган holda ma'lum mutaxassislik, malaka yoki lavozim bo'yicha ishni bajarish majburiyatini oladi, ish beruvchi esa xodimga ish haqi to'lash va mehnat qonunchiligida nazarda tutilgan mehnat sharoitlarini ta'minlash majburiyatini oladi.",
    ru: "Трудовой договор — это соглашение между работником и работодателем, по которому работник обязуется выполнять работу по определённой специальности, квалификации или должности с подчинением внутреннему трудовому распорядку, а работодатель обязуется выплачивать заработную плату и обеспечивать условия труда, предусмотренные трудовым законодательством.",
  },
  {
    code: 'Labor Code', art: '100',
    uz: "Oddiy ish vaqti haftasiga 40 soatdan oshmasligi kerak. 18 yoshga to'lmagan xodimlar, zararli ishlarda band bo'lgan xodimlar va qonunda belgilangan boshqa toifadagi xodimlar uchun qisqartirilgan ish vaqti belgilanadi. Ish beruvchi har bir xodim tomonidan haqiqatda ishlangan vaqtni hisobga olishi shart.",
    ru: "Нормальная продолжительность рабочего времени не может превышать 40 часов в неделю. Для работников моложе 18 лет, работников, занятых на вредных работах, и других категорий работников устанавливается сокращённое рабочее время. Работодатель обязан вести учёт фактически отработанного каждым работником времени.",
  },
  {
    code: 'Tax Code', art: '204',
    uz: "Qo'shilgan qiymat solig'i bo'yicha soliq solish ob'ekti — O'zbekiston Respublikasi hududida tovarlarni (ishlarni, xizmatlarni) realizatsiya qilish aylanmasi, shuningdek O'zbekiston Respublikasi hududiga tovarlarni import qilishdir.",
    ru: "Объектом обложения налогом на добавленную стоимость является оборот по реализации товаров (работ, услуг) на территории Республики Узбекистан, а также импорт товаров на территорию Республики Узбекистан.",
  },
  {
    code: 'Civil Code', art: '113',
    uz: "Mas'uliyati cheklangan jamiyat — bu bir yoki bir necha shaxs tomonidan tashkil etilgan xo'jalik jamiyati bo'lib, uning ustav kapitali ta'sis hujjatlarida belgilangan miqdordagi ulushlarga bo'linadi. Jamiyat ishtirokchilari uning majburiyatlari bo'yicha javob bermaydilar va o'z hissalari qiymati doirasida zarar ko'rish xavfini o'z zimmalariga oladilar.",
    ru: "Общество с ограниченной ответственностью — это хозяйственное общество, учреждённое одним или несколькими лицами, уставный капитал которого разделён на доли определённых учредительными документами размеров. Участники общества не отвечают по его обязательствам и несут риск убытков в пределах стоимости внесённых ими вкладов.",
  },
  {
    code: 'Civil Code', art: '386',
    uz: "Neustoyka (jarima, penya) — qonun yoki shartnoma bilan belgilangan pul summasi bo'lib, qarzdor majburiyatni bajarmagan yoki lozim darajada bajarmagan, xususan bajarishni kechiktirgan taqdirda kreditorga to'lashi shart. Neustoyka to'lashni talab qilishda kreditor unga zarar yetkazilganini isbotlashi shart emas.",
    ru: "Неустойка (штраф, пеня) — определённая законом или договором денежная сумма, которую должник обязан уплатить кредитору в случае неисполнения или ненадлежащего исполнения обязательства, в частности при просрочке исполнения. При требовании уплаты неустойки кредитор не обязан доказывать причинение ему убытков.",
  },
  {
    code: 'Civil Code', art: '450',
    uz: "Shartnomani o'zgartirish va bekor qilish taraflar kelishuvi bilan mumkin. Bir tarafning talabi bilan shartnoma faqat sud qarori bilan, boshqa taraf shartnomani jiddiy buzgan taqdirda o'zgartirilishi yoki bekor qilinishi mumkin. Bir tarafning shartnomani buzishi natijasida boshqa taraf shartnoma tuzishda umid qilgan narsadan mahrum bo'lsa, bu jiddiy buzish hisoblanadi.",
    ru: "Изменение и расторжение договора возможны по соглашению сторон. По требованию одной из сторон договор может быть изменён или расторгнут по решению суда только при существенном нарушении договора другой стороной. Существенным признаётся нарушение, которое влечёт для другой стороны такой ущерб, что она в значительной степени лишается того, на что была вправе рассчитывать при заключении договора.",
  },
  {
    code: 'Law on Protection of Consumer Rights', art: '14',
    uz: "Iste'molchi tovar (ish, xizmat) odatdagi foydalanish, saqlash, tashish va utilizatsiya sharoitlarida uning hayoti va sog'lig'i, atrof-muhit uchun xavfsiz bo'lishi, shuningdek uning mol-mulkiga zarar yetkazmasligi huquqiga ega. Tovarlar (ishlar, xizmatlar) xavfsizligini ta'minlaydigan talablar majburiy bo'lib, qonun bilan belgilanadi.",
    ru: "Потребитель имеет право на то, чтобы товар (работа, услуга) при обычных условиях его использования, хранения, транспортировки и утилизации был безопасен для его жизни и здоровья, окружающей среды, а также не причинял вреда его имуществу. Требования, обеспечивающие безопасность товаров (работ, услуг), являются обязательными и устанавливаются законом.",
  },
]

await pool.query('ALTER TABLE law_articles ADD COLUMN IF NOT EXISTS content_uz TEXT')
await pool.query('ALTER TABLE law_articles ADD COLUMN IF NOT EXISTS content_ru TEXT')

let n = 0
for (const t of T) {
  const r = await pool.query(
    "UPDATE law_articles SET content_uz = $1, content_ru = $2 WHERE code_name = $3 AND article_number = $4 AND jurisdiction = 'UZ'",
    [t.uz, t.ru, t.code, t.art]
  )
  n += r.rowCount
}

console.log(`✅ Translated ${n} articles (UZ + RU)`)
await pool.end()
