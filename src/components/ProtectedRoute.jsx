import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <div className="loader" style={{ marginTop: 120 }} />
  if (!user) return <Navigate to="/" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/user/dashboard" replace />
  if (!adminOnly && isAdmin) return <Navigate to="/admin/dashboard" replace />
  return children
}
