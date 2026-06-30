import { createContext, useContext, useState, useEffect } from 'react'
import { api } from './api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('lexcis_token')
    if (token) {
      api.auth.me().then(setUser).catch(() => localStorage.removeItem('lexcis_token')).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { token, user } = await api.auth.login({ email, password })
    localStorage.setItem('lexcis_token', token)
    setUser(user)
  }

  const register = async (data) => {
    const { token, user } = await api.auth.register(data)
    localStorage.setItem('lexcis_token', token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('lexcis_token')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
