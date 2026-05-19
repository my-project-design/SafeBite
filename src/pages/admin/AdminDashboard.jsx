import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { productService, categoryService, authService, userFavouritesService } from '../../services/services'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users:0, products:0, categories:0, favourites:0 })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      authService.getAllUsers(),
      productService.getAll(),
      categoryService.getAll(),
      userFavouritesService.getAll(),
    ]).then(([u, p, c, f]) => {
      // API returns { success: true, data: [...] } so we need u.data.data
      const userList = u.data?.data || u.data || []
      const prodList = p.data?.data || p.data || []
      const catList  = c.data?.data || c.data || []
      const favList  = f.data?.data || f.data || []

      setStats({
        users:      userList.length,
        products:   prodList.length,
        categories: catList.length,
        favourites: favList.length,
      })
      setUsers(userList.slice(0, 5))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const statCards = [
    { label:'Total Users',      num: stats.users,      icon:'👥', color:'#2e8b57' },
    { label:'Total Products',   num: stats.products,   icon:'🍱', color:'#3498db' },
    { label:'Categories',       num: stats.categories, icon:'🏷️', color:'#e67e22' },
    { label:'Favourites Added', num: stats.favourites, icon:'❤️', color:'#e74c3c' },
  ]

  return (
    <AdminLayout title="Dashboard Overview">
      {loading ? <div className="loader" /> : (
        <>
          {/* WELCOME */}
          <div style={{ background:'linear-gradient(115deg,var(--sidebar),#2d5a2d)', borderRadius:16, padding:'20px 28px', marginBottom:28, color:'#fff' }}>
            <h3 style={{ fontSize:20, fontWeight:800, margin:0 }}>Welcome back, Admin! 👋</h3>
            <p style={{ margin:'4px 0 0', opacity:0.75, fontSize:14 }}>Here's what's happening on SafeBite today.</p>
          </div>

          {/* STAT CARDS */}
          <div className="row g-3 mb-4">
            {statCards.map((s, i) => (
              <div className="col-6 col-md-3" key={s.label}>
                <div className="stat-card" style={{ animationDelay:`${i*0.05}s` }}>
                  <div className="accent-bar" style={{ background: s.color }} />
                  <div className="sc-label">{s.label}</div>
                  <div className="sc-num">{s.num}</div>
                  <div className="sc-icon">{s.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* RECENT USERS */}
          <div className="card-wrap">
            <div className="card-head">
              <h3>Recent Users</h3>
              <span style={{ fontSize:12, color:'var(--tl)' }}>Latest registrations</span>
            </div>
            <div className="card-body">
              <table className="data-table">
                <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Status</th></tr></thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.user_id || i}>
                      <td style={{ color:'var(--tl)', fontSize:12 }}>{i+1}</td>
                      <td style={{ fontWeight:600 }}>{u.first_name} {u.last_name}</td>
                      <td style={{ color:'var(--tl)', fontSize:13 }}>{u.email}</td>
                      <td><span className="badge-active">Active</span></td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign:'center', color:'var(--tl)', padding:30 }}>No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}