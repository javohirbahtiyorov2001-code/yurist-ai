import Anthropic from '@anthropic-ai/sdk'
import pool from '../db/pool.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LANG_NAME = { uz: "o'zbek (lotin)", ru: 'русский', en: 'English' }

// ── Workflow templates ─────────────────────────────────────────────
// Each workflow is an agentic sequence of steps. Each step's output is threaded
// into the context of the next step — mirroring Legora's step-by-step reasoning.
export const WORKFLOWS = [
  {
    key: 'unpaid_salary',
    title: 'Ish haqini undirish',
    subtitle: 'Recover unpaid salary',
    icon: '🧾',
    description: "Ish beruvchi ish haqini to'lamayapti? Huquqlaringizni aniqlaymiz, rasmiy da'vo xatini tayyorlaymiz va keyingi qadamlarni ko'rsatamiz.",
    inputs: [
      { key: 'situation', label: 'Vaziyatingizni tasvirlab bering', type: 'textarea', placeholder: "Masalan: 3 oydan beri ish haqi to'lanmayapti, summa taxminan 9 mln so'm...", required: true },
    ],
    acceptsFiles: false,
    steps: [
      { name: 'Huquqlaringiz', tool: 'research', instruction: "Foydalanuvchi vaziyatini tahlil qiling va O'zbekiston mehnat qonunchiligiga ko'ra uning huquqlarini aniq tushuntiring. Faqat berilgan qonun moddalarini keltiring." },
      { name: "Da'vo xati", tool: 'draft', instruction: "Ish beruvchiga qaratilgan rasmiy da'vo (talabnoma) xatini tayyorlang. To'liq, tayyor foydalanish mumkin bo'lgan hujjat: sarlavha, taraflar, talab, muddat, ogohlantirish va imzo joyi bilan." },
      { name: 'Keyingi qadamlar', tool: 'checklist', instruction: "Foydalanuvchi bugun qila oladigan aniq amaliy qadamlar ro'yxatini (checklist) tuzing: qayerga murojaat qilish, qanday hujjatlar kerak, mehnat inspeksiyasi va sudga murojaat tartibi." },
    ],
  },
  {
    key: 'contract_redflags',
    title: 'Shartnoma xavflari hisoboti',
    subtitle: 'Contract red-flag report',
    icon: '📄',
    description: "Shartnomangizni yuklang — biz xavfli bandlarni, yetishmayotgan shartlarni va qonunga muvofiqligini tahlil qilib, hisobot beramiz.",
    inputs: [
      { key: 'notes', label: "Qo'shimcha izoh (ixtiyoriy)", type: 'textarea', placeholder: 'Nimaga e\'tibor berishimizni xohlaysiz?', required: false },
    ],
    acceptsFiles: true,
    steps: [
      { name: 'Xavfli bandlar', tool: 'analyze', instruction: "Yuklangan shartnomani tahlil qiling. Har bir xavfli yoki bir tomonlama bandni aniqlang: band nomi, muammo, xavf darajasi (yuqori/o'rta/past)." },
      { name: 'Yetishmayotgan shartlar', tool: 'analyze', instruction: "Shartnomada bo'lishi kerak, lekin yo'q bo'lgan muhim shartlarni sanab bering va nima uchun kerakligini tushuntiring." },
      { name: 'Tavsiyalar', tool: 'draft', instruction: "Aniqlangan xavflar asosida foydalanuvchiga aniq tavsiyalar bering: qaysi bandlarni o'zgartirish yoki qo'shish kerak." },
    ],
  },
  {
    key: 'consumer_complaint',
    title: "Iste'molchi shikoyati",
    subtitle: 'Consumer complaint',
    icon: '🛒',
    description: "Sifatsiz tovar yoki xizmat? Huquqlaringizni aniqlaymiz va sotuvchiga hamda tegishli organga shikoyat xatini tayyorlaymiz.",
    inputs: [
      { key: 'situation', label: 'Nima sodir bo\'ldi?', type: 'textarea', placeholder: 'Masalan: 2 kun oldin telefon sotib oldim, ishlamayapti, do\'kon qaytarishni rad etdi...', required: true },
    ],
    acceptsFiles: true,
    steps: [
      { name: 'Huquqlaringiz', tool: 'research', instruction: "Iste'molchi huquqlari to'g'risidagi O'zbekiston qonunchiligiga ko'ra foydalanuvchi huquqlarini tushuntiring." },
      { name: 'Shikoyat xati', tool: 'draft', instruction: "Sotuvchiga qaratilgan rasmiy shikoyat (pretenziya) xatini tayyorlang: talab, muddat, huquqiy asos bilan." },
      { name: 'Keyingi qadamlar', tool: 'checklist', instruction: "Agar sotuvchi rad etsa, Raqobatni rivojlantirish va iste'molchilar huquqlarini himoya qilish qo'mitasiga hamda sudga murojaat qilish tartibini ko'rsating." },
    ],
  },
  {
    key: 'termination_review',
    title: 'Ishdan bo\'shatishni tekshirish',
    subtitle: 'Wrongful termination review',
    icon: '⚖️',
    description: "Sizni noqonuniy ishdan bo'shatishdi deb o'ylayapsizmi? Vaziyatni baholaymiz va e'tiroz xatini tayyorlaymiz.",
    inputs: [
      { key: 'situation', label: 'Qanday ishdan bo\'shatildingiz?', type: 'textarea', placeholder: 'Masalan: ogohlantirishsiz, sababsiz ishdan bo\'shatishdi...', required: true },
    ],
    acceptsFiles: true,
    steps: [
      { name: 'Baholash', tool: 'research', instruction: "Ishdan bo'shatish O'zbekiston mehnat qonunchiligiga muvofiqmi yoki yo'qmi — baholang va sabablarini tushuntiring." },
      { name: 'E\'tiroz xati', tool: 'draft', instruction: "Ish beruvchiga qaratilgan, ishga qayta tiklashni yoki kompensatsiyani talab qiluvchi rasmiy e'tiroz xatini tayyorlang." },
      { name: 'Keyingi qadamlar', tool: 'checklist', instruction: "Mehnat nizolarini hal qilish tartibi: mehnat inspeksiyasi va sudga murojaat qadamlarini ko'rsating." },
    ],
  },
]

async function searchLaw(query) {
  const keywords = (query || '').toLowerCase().split(/\s+/).filter(w => w.length > 3).slice(0, 12)
  if (!keywords.length) return []
  const conditions = keywords.map((_, i) => `(content ILIKE $${i + 1} OR content_uz ILIKE $${i + 1} OR content_ru ILIKE $${i + 1} OR title ILIKE $${i + 1})`).join(' OR ')
  const params = keywords.map(k => `%${k}%`)
  const { rows } = await pool.query(
    `SELECT code_name, article_number, title, COALESCE(content_uz, content) AS content, source_url FROM law_articles
     WHERE jurisdiction = 'UZ' AND (${conditions}) LIMIT 5`, params
  )
  return rows
}

// Run a workflow: execute steps sequentially, threading each output into the next
export async function runWorkflow(workflowKey, inputs = {}, fileTexts = [], lang = 'uz') {
  const wf = WORKFLOWS.find(w => w.key === workflowKey)
  if (!wf) throw new Error('Unknown workflow')

  const langName = LANG_NAME[lang] || LANG_NAME.uz
  const inputBlock = Object.entries(inputs).map(([k, v]) => `${k}: ${v}`).join('\n')
  const fileBlock = fileTexts.length
    ? '\n\nYUKLANGAN HUJJATLAR:\n' + fileTexts.map((t, i) => `--- Hujjat ${i + 1} ---\n${t.slice(0, 10000)}`).join('\n\n')
    : ''

  // Retrieve relevant law once, share across steps
  const articles = await searchLaw(`${inputBlock} ${fileTexts.join(' ')}`)
  const lawContext = articles.length
    ? 'TEGISHLI QONUN MODDALARI (faqat shularni raqami bilan keltiring):\n\n' + articles.map(a =>
        `[${a.code_name}, ${a.article_number}-modda${a.title ? ` — ${a.title}` : ''}]\n${a.content}`).join('\n\n')
    : 'Hech qanday aniq qonun moddasi topilmadi — moddalar raqamini o\'ylab topmang.'

  const citations = articles.map(a => ({ code: a.code_name, article: a.article_number, title: a.title, sourceUrl: a.source_url }))

  const results = []
  let threaded = ''

  for (const step of wf.steps) {
    const system = `You are Yurist AI, a legal assistant for Uzbekistan. Respond ENTIRELY in ${langName}. Only cite article numbers that appear in the provided law articles — never invent them. Be practical, clear, and warm.

${lawContext}`

    const userPrompt = `WORKFLOW: ${wf.title}
STEP: ${step.name}
TASK: ${step.instruction}

USER INPUT:
${inputBlock}${fileBlock}
${threaded ? `\nPREVIOUS STEP RESULTS (build on these, don't repeat):\n${threaded}` : ''}

Produce ONLY this step's output in ${langName}. Use markdown formatting.`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system,
      messages: [{ role: 'user', content: userPrompt }],
    })
    const output = response.content[0].text
    results.push({ name: step.name, tool: step.tool, output })
    threaded += `\n\n[${step.name}]:\n${output.slice(0, 1500)}`
  }

  return { workflow: { key: wf.key, title: wf.title, subtitle: wf.subtitle }, steps: results, citations }
}
