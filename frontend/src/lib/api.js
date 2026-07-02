const BASE = '/api'

function getToken() { return localStorage.getItem('lexcis_token') }

async function req(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    body: options.body instanceof FormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export const api = {
  auth: {
    register: (data) => req('/auth/register', { method: 'POST', body: data }),
    login: (data) => req('/auth/login', { method: 'POST', body: data }),
    me: () => req('/auth/me'),
  },
  chat: {
    list: () => req('/chat/conversations'),
    create: (title) => req('/chat/conversations', { method: 'POST', body: { title } }),
    update: (id, data) => req(`/chat/conversations/${id}`, { method: 'PATCH', body: data }),
    remove: (id) => req(`/chat/conversations/${id}`, { method: 'DELETE' }),
    messages: (id) => req(`/chat/conversations/${id}/messages`),
    sendStream: (id, content, jurisdiction, file, lang) => {
      const url = `${BASE}/chat/conversations/${id}/messages`
      if (file) {
        const fd = new FormData()
        fd.append('content', content || '')
        fd.append('jurisdiction', jurisdiction)
        if (lang) fd.append('lang', lang)
        fd.append('file', file)
        // No Content-Type header — browser sets multipart boundary automatically
        return fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${getToken()}` }, body: fd })
      }
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ content, jurisdiction, lang }),
      })
    },
  },
  contracts: {
    list: () => req('/contracts'),
    analyze: (formData) => req('/contracts/analyze', { method: 'POST', body: formData }),
    get: (id) => req(`/contracts/${id}`),
  },
  review: {
    run: (formData) => req('/review', { method: 'POST', body: formData }),
  },
  workflows: {
    list: () => req('/workflows'),
    run: (formData) => req('/workflows/run', { method: 'POST', body: formData }),
  },
  documents: {
    types: () => req('/documents/types'),
    list: () => req('/documents'),
    draft: (data) => req('/documents/draft', { method: 'POST', body: data }),
    get: (id) => req(`/documents/${id}`),
  },
}
