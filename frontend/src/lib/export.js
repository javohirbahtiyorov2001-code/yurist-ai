// Client-side document export: Word (.doc) and PDF (native print).
// Works on both plain text (drafting) and rendered HTML (review tables, workflow reports).

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Convert a plain-text document into simple HTML paragraphs (preserves blank lines)
export function textToHtml(text) {
  return escapeHtml(text)
    .split(/\n{2,}/)
    .map(block => `<p>${block.replace(/\n/g, '<br/>')}</p>`)
    .join('\n')
}

// Print-friendly wrapper (white background, black text) shared by Word + PDF
function wrapDocument(title, bodyHtml) {
  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(title)}</title>
<style>
  @page { size: A4; margin: 2cm; }
  body { font-family: 'Times New Roman', Georgia, serif; color: #111; background: #fff; font-size: 12pt; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 24px; }
  h1 { font-size: 18pt; margin: 0 0 4px; }
  h2 { font-size: 15pt; margin: 18px 0 6px; }
  h3 { font-size: 13pt; margin: 14px 0 5px; }
  p { margin: 0 0 10px; }
  ul, ol { margin: 0 0 10px 22px; }
  table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 10.5pt; }
  th, td { border: 1px solid #999; padding: 7px 9px; text-align: left; vertical-align: top; }
  th { background: #f0f0f0; font-weight: bold; }
  .doc-meta { color: #666; font-size: 9pt; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 18px; }
  a { color: #1a4fb4; }
</style>
</head>
<body>
<div class="doc-meta">${escapeHtml(title)} · Yurist AI · ${new Date().toLocaleDateString()}</div>
${bodyHtml}
</body>
</html>`
}

const safeName = (t) => (t || 'document').replace(/[^\p{L}\p{N} _-]/gu, '').slice(0, 80).trim() || 'document'

// Download as a Word-openable .doc (Word / Google Docs open it and can Save As .docx)
export function downloadWord(title, bodyHtml) {
  const html = wrapDocument(title, bodyHtml)
  const blob = new Blob(['﻿', html], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${safeName(title)}.doc`; a.click()
  URL.revokeObjectURL(url)
}

// Open a print window → user chooses "Save as PDF" (native, high fidelity)
export function printPDF(title, bodyHtml) {
  const html = wrapDocument(title, bodyHtml)
  const w = window.open('', '_blank')
  if (!w) { alert('Please allow pop-ups to export PDF'); return }
  w.document.write(html)
  w.document.close()
  w.focus()
  // Give the browser a moment to render before invoking print
  setTimeout(() => { w.print() }, 350)
}
