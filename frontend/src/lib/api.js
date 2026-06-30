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
    messages: (id) => req(`/chat/conversations/${id}/messages`),
    sendStream: (id, content, jurisdiction) =>
      fetch(`${BASE}/chat/conversations/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ content, jurisdiction }),
      }),
  },
  contracts: {
    list: () => req('/contracts'),
    analyze: (formData) => req('/contracts/analyze', { method: 'POST', body: formData }),
    get: (id) => req(`/contracts/${id}`),
  },
  documents: {
    types: () => req('/documents/types'),
    list: () => req('/documents'),
    draft: (data) => req('/documents/draft', { method: 'POST', body: data }),
    get: (id) => req(`/documents/${id}`),
  },
}
