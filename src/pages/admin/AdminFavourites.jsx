import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { userFavouritesService } from '../../services/services'
import { IMAGE_BASE_URL } from '../../services/api'

export default function AdminFavourites() {
  const [rows, setRows]         = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)

  const load = () => userFavouritesService.getAll()
    .then(r => { setRows(r.data); setFiltered(r.data); setLoading(false) })
    .catch(() => setLoading(false))

  useEffect(() => { load() }, [])
  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(rows.filter(r =>
      `${r.First_name} ${r.Last_Name} ${r.product_name}`.toLowerCase().includes(q)
    ))
  }, [search, rows])

  const handleDelete = async (id) => {
    if (!confirm('Remove this favourite?')) return
    await userFavouritesService.remove(id); load()
  }

  return (
    <AdminLayout title="Monitoring Favourites">
      <div className="page-header">
        <h2>User Favourites</h2>
        <div className="search-box">
          <i className="fa-solid fa-search" style={{ color:'var(--tl)', fontSize:13 }} />
          <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="stat-card">
            <div className="accent-bar" style={{ background:'#e74c3c' }} />
            <div className="sc-label">Total Favourites</div>
            <div className="sc-num">{rows.length}</div>
            <div className="sc-icon">❤️</div>
          </div>
        </div>
      </div>

      <div className="card-wrap">
        <div className="card-head"><h3>All Favourites ({filtered.length})</h3></div>
        <div className="card-body">
          {loading ? <div className="loader" /> : (
            <table className="data-table">
              <thead><tr><th>#</th><th>User</th><th>Product</th><th>Added On</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.favourite_id}>
                    <td style={{ color:'var(--tl)', fontSize:12 }}>{i+1}</td>
                    <td>
                      <div style={{ fontWeight:600, fontSize:14 }}>{r.First_name} {r.Last_Name}</div>
                      <div style={{ fontSize:11, color:'var(--tl)' }}>{r.Email}</div>
                    </td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        {r.image_url
                          ? <img src={IMAGE_BASE_URL + r.image_url} alt="" style={{ width:32, height:32, borderRadius:6, objectFit:'cover' }} />
                          : <div style={{ width:32, height:32, borderRadius:6, background:'var(--pale)', display:'flex', alignItems:'center', justifyContent:'center' }}>🍱</div>
                        }
                        <span style={{ fontWeight:500, fontSize:13 }}>{r.product_name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize:12, color:'var(--tl)' }}>{r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}</td>
                    <td>
                      <button className="btn-del" onClick={() => handleDelete(r.favourite_id)}>Remove</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={5}><div className="empty-state"><i className="fa-solid fa-heart" />No favourites found</div></td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
