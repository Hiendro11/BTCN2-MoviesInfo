// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const stored = localStorage.getItem('auth')
      return stored ? JSON.parse(stored) : { user: null, token: null }
    } catch {
      return { user: null, token: null }
    }
  })

  const login = ({ user, token }) => {
    const data = { user, token }
    setAuth(data)
    try {
      localStorage.setItem('auth', JSON.stringify(data))
      if (token) {
        localStorage.setItem('accessToken', token)
      }
    } catch {
      // ignore
    }
  }

  const logout = () => {
    setAuth({ user: null, token: null })
    try {
      localStorage.removeItem('auth')
      localStorage.removeItem('accessToken')
    } catch {
      // ignore
    }
  }

  const isLoggedIn = !!auth.user

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
