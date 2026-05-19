import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { authService } from '../../services/services'

export default function ManageUsers() {
  const [users,    setUsers]    = useState([])
  const [filtered, setFiltered] = useState([])
  const [search,   setSearch]   = useState('')
  const [loading,  setLoading]  = useState(true)

  const load = () => {
    authService.getAllUsers().then(r => {
      // API returns { success: true, data: [...] }
      const list = r.data?.data || r.data || []
      setUsers(list)
      setFiltered(list)
      setLoading(false)
    }).catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(users.filter(u =>
      `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(q)
    ))
  }, [search, users])

  return (
    <AdminLayout title="Manage Users">
      <div className="page-header">
        <h2>Manage Users</h2>
        <div className="search-box">
          <i className="fa-solid fa-search" style={{ color:'var(--tl)', fontSize:13 }} />
          <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card-wrap">
        <div className="card-head">
          <h3>All Users <span style={{ background:'var(--pale)', color:'var(--pg)', fontWeight:700, padding:'2px 10px', borderRadius:20, fontSize:12, marginLeft:8 }}>{filtered.length}</span></h3>
        </div>
        <div className="card-body">
          {loading ? <div className="loader" /> : (
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Name</th><th>Email</th><th>Status</th></tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.user_id || i}>
                    <td style={{ color:'var(--tl)', fontSize:12 }}>{i+1}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--pg)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:14, flexShrink:0 }}>
                          {(u.first_name||'U')[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight:600, fontSize:14 }}>{u.first_name} {u.last_name}</span>
                      </div>
                    </td>
                    <td style={{ color:'var(--tl)', fontSize:13 }}>{u.email}</td>
                    <td><span className="badge-active">Active</span></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4}>
                    <div className="empty-state"><i className="fa-solid fa-users" />No users found</div>
                  </td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}