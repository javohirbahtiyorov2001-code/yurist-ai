import { useState, useEffect } from 'react'
import { api } from '../lib/api.js'
import { FileEdit, Download, ChevronRight } from 'lucide-react'

const FIELDS = {
  nda: [
    { key: 'party1', label: 'Disclosing party (name)', placeholder: 'Acme LLC' },
    { key: 'party2', label: 'Receiving party (name)', placeholder: 'Partner Company' },
    { key: 'purpose', label: 'Purpose of disclosure', placeholder: 'Evaluation of potential business partnership' },
    { key: 'duration', label: 'Duration (e.g. 2 years)', placeholder: '2 years' },
    { key: 'jurisdiction', label: 'Governing law', placeholder: 'Uzbekistan' },
  ],
  employment: [
    { key: 'employer', label: 'Employer name', placeholder: 'Acme LLC' },
    { key: 'employee', label: 'Employee full name', placeholder: 'John Smith' },
    { key: 'position', label: 'Job title', placeholder: 'Software Engineer' },
    { key: 'salary', label: 'Monthly salary', placeholder: '5,000,000 UZS' },
    { key: 'startDate', label: 'Start date', placeholder: '2026-07-01' },
    { key: 'workingHours', label: 'Working hours/week', placeholder: '40 hours' },
  ],
  partnership: [
    { key: 'partner1', label: 'Partner 1 name', placeholder: 'Acme LLC' },
    { key: 'partner2', label: 'Partner 2 name', placeholder: 'Beta Corp' },
    { key: 'businessPurpose', label: 'Business purpose', placeholder: 'Joint software development' },
    { key: 'profitSplit', label: 'Profit split', placeholder: '50/50' },
    { key: 'duration', label: 'Duration', placeholder: '3 years' },
  ],
  service: [
    { key: 'provider', label: 'Service provider', placeholder: 'Acme LLC' },
    { key: 'client', label: 'Client name', placeholder: 'Client Corp' },
    { key: 'services', label: 'Services description', placeholder: 'Web development and maintenance' },
    { key: 'payment', label: 'Payment amount & schedule', placeholder: '$5,000/month' },
    { key: 'duration', label: 'Contract duration', placeholder: '12 months' },
  ],
  loan: [
    { key: 'lender', label: 'Lender name', placeholder: 'Acme LLC' },
    { key: 'borrower', label: 'Borrower name', placeholder: 'John Smith' },
    { key: 'amount', label: 'Loan amount', placeholder: '10,000,000 UZS' },
    { key: 'interestRate', label: 'Interest rate', placeholder: '18% per annum' },
    { key: 'repaymentSchedule', label: 'Repayment schedule', placeholder: '12 monthly installments' },
  ],
  lease: [
    { key: 'landlord', label: 'Landlord name', placeholder: 'Property Owner LLC' },
    { key: 'tenant', label: 'Tenant name', placeholder: 'Acme LLC' },
    { key: 'premises', label: 'Premises description', placeholder: 'Office, 120 sqm, 3rd floor, Tashkent' },
    { key: 'rent', label: 'Monthly rent', placeholder: '5,000,000 UZS' },
    { key: 'duration', label: 'Lease duration', placeholder: '2 years' },
  ],
}

export default function Documents() {
  const [docTypes, setDocTypes] = useState([])
  const [docs, setDocs] = useState([])
  const [type, setType] = useState('')
  const [params, setParams] = useState({})
  const [jurisdiction, setJurisdiction] = useState('UZ')
  const [language, setLanguage] = useState('English')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.documents.types().then(setDocTypes).catch(() => {})
    api.documents.list().then(setDocs).catch(() => {})
  }, [])

  const setField = (key, val) => setParams(p => ({ ...p, [key]: val }))

  const draft = async () => {
    setLoading(true); setError(''); setResult(null)
    try {
      const data = await api.documents.draft({ type, parameters: { ...params, language }, jurisdiction })
      setResult(data)
      api.documents.list().then(setDocs).catch(() => {})
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const download = () => {
    if (!result) return
    const blob = new Blob([result.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `${result.title}.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  const fields = type ? FIELDS[type] || [] : []
  const canDraft = type && fields.every(f => params[f.key]?.trim())

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: 240, borderRight: '1px solid var(--border)', background: 'var(--bg2)', overflow: 'auto', flexShrink: 0 }}>
        <div style={{ padding: '16px 16px 8px', fontSize: 13, fontWeight: 500 }}>Generated documents</div>
        {docs.length === 0
          ? <div style={{ padding: '8px 16px', fontSize: 12, color: 'var(--text3)' }}>No documents yet</div>
          : docs.map(d => (
            <button key={d.id} onClick={() => api.documents.get(d.id).then(doc => setResult({ title: doc.title, content: doc.content }))}
              style={{ width: '100%', padding: '10px 16px', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>{d.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'capitalize' }}>{d.document_type}</div>
            </button>
          ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'auto', padding: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Document Drafting</h1>
        <p style={{ color: 'var(--text2)', marginBottom: 24 }}>Generate legally valid CIS documents in minutes.</p>

        {!result && (
          <div className="card" style={{ maxWidth: 640 }}>
            <div style={{ marginBottom: 20 }}>
              <label className="label">Document type</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
                {docTypes.map(dt => (
                  <button key={dt.key} onClick={() => { setType(dt.key); setParams({}) }}
                    style={{ padding: '10px 14px', borderRadius: 8, fontSize: 13, textAlign: 'left',
                      background: type === dt.key ? 'var(--accent-bg)' : 'var(--bg3)',
                      border: `1px solid ${type === dt.key ? 'var(--accent)' : 'var(--border)'}`,
                      color: type === dt.key ? 'var(--accent2)' : 'var(--text2)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {dt.label}
                    {type === dt.key && <ChevronRight size={12} />}
                  </button>
                ))}
              </div>
            </div>

            {type && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                {fields.map(f => (
                  <div key={f.key}>
                    <label className="label">{f.label}</label>
                    <input className="input" placeholder={f.placeholder} value={params[f.key] || ''} onChange={e => setField(f.key, e.target.value)} />
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label className="label">Jurisdiction</label>
                    <select className="input" value={jurisdiction} onChange={e => setJurisdiction(e.target.value)}>
                      <option value="UZ">Uzbekistan</option>
                      <option value="KZ">Kazakhstan</option>
                      <option value="AZ">Azerbaijan</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Language</label>
                    <select className="input" value={language} onChange={e => setLanguage(e.target.value)}>
                      <option>English</option>
                      <option>Russian</option>
                      <option>Uzbek</option>
                    </select>
                  </div>
                </div>
                <button className="btn btn-primary" onClick={draft} disabled={!canDraft || loading} style={{ marginTop: 4 }}>
                  {loading ? 'Drafting...' : <><FileEdit size={14} /> Draft document</>}
                </button>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text2)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📝</div>
            <div style={{ fontWeight: 500, marginBottom: 6 }}>Drafting your document...</div>
            <div style={{ fontSize: 13 }}>Applying {jurisdiction} law requirements and jurisdiction-specific clauses</div>
          </div>
        )}

        {error && <div style={{ color: 'var(--red)', padding: '12px 16px', background: 'var(--red-bg)', borderRadius: 8, marginBottom: 16 }}>{error}</div>}

        {result && !loading && (
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setResult(null)}>← New document</button>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{result.title}</span>
              <button className="btn btn-ghost btn-sm" onClick={download}><Download size={13} /> Download</button>
            </div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 28, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'var(--text)' }}>
              {result.content}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
