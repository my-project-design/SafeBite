import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/services'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser  = localStorage.getItem('sb_user')
    const savedAdmin = localStorage.getItem('sb_admin')
    if (savedUser)  { setUser(JSON.parse(savedUser)); setIsAdmin(false) }
    if (savedAdmin) { setUser(JSON.parse(savedAdmin)); setIsAdmin(true) }
    setLoading(false)
  }, [])

  // User login
  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password)
      const u = res.data?.user || res.data
      if (!u) return { success: false, message: 'Invalid credentials.' }
      setUser(u)
      setIsAdmin(false)
      localStorage.setItem('sb_user', JSON.stringify(u))
      return { success: true, user: u }
    } catch (err) {
      console.log('Login error:', err.response?.data, err.message)
      return { success: false, message: err.response?.data?.message || 'Login failed.' }
    }
  }

  // Admin login
  const adminLogin = async (email, password) => {
    try {
      const res = await authService.adminLogin(email, password)
      if (res.data?.Message === true) {
        const adminUser = { email, role: 'admin', name: 'Admin' }
        setUser(adminUser)
        setIsAdmin(true)
        localStorage.setItem('sb_admin', JSON.stringify(adminUser))
        return { success: true }
      }
      return { success: false, message: 'Invalid admin credentials.' }
    } catch (err) {
      return { success: false, message: 'Admin login failed.' }
    }
  }

  // Register
  const register = async (data) => {
    try {
      await authService.register(data)
      return { success: true }
    } catch (err) {
      console.log('Register error:', err.response?.data, err.message)
      return { success: false, message: err.response?.data?.message || 'Registration failed.' }
    }
  }

  // Logout
  const logout = () => {
    setUser(null)
    setIsAdmin(false)
    localStorage.removeItem('sb_user')
    localStorage.removeItem('sb_admin')
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, adminLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }
