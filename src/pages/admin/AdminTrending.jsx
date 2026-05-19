import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { productService, productRatingService } from '../../services/services'
import { IMAGE_BASE_URL } from '../../services/api'

export default function AdminTrending() {
  const [products, setProducts] = useState([])
  const [ratings,  setRatings]  = useState([])
  const [search,   setSearch]   = useState('')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([productService.getAll(), productRatingService.getAll()])
      .then(([p, r]) => { setProducts(p.data); setRatings(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Count ratings per product and compute avg
  const productStats = products.map(p => {
    const pr = ratings.filter(r => r.product_id === p.product_id)
    const avg = pr.length ? (pr.reduce((s, r) => s + Number(r.rating), 0) / pr.length).toFixed(1) : '—'
    return { ...p, ratingCount: pr.length, avgRating: avg }
  }).sort((a, b) => b.ratingCount - a.ratingCount)

  const filtered = productStats.filter(p => p.product_name?.toLowerCase().includes(search.toLowerCase()))

  return (
    <AdminLayout title="Trending Food">
      <div className="page-header">
        <h2>Trending Food</h2>
        <div className="search-box">
          <i className="fa-solid fa-search" style={{ color:'var(--tl)', fontSize:13 }} />
          <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label:'Total Products', num: products.length, icon:'🍱' },
          { label:'Total Ratings',  num: ratings.length,  icon:'⭐' },
        ].map((s, i) => (
          <div className="col-6 col-md-3" key={s.label}>
            <div className="stat-card" style={{ animationDelay:`${i*0.05}s` }}>
              <div className="accent-bar" style={{ background:'var(--pg)' }} />
              <div className="sc-label">{s.label}</div>
              <div className="sc-num">{s.num}</div>
              <div className="sc-icon">{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-wrap">
        <div className="card-head"><h3>Products by Popularity</h3></div>
        <div className="card-body">
          {loading ? <div className="loader" /> : (
            <table className="data-table">
              <thead><tr><th>Rank</th><th>Product</th><th>Category</th><th>Avg Rating</th><th>Total Reviews</th></tr></thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.product_id}>
                    <td>
                      <span style={{ fontWeight:800, color: i < 3 ? '#e67e22' : 'var(--tl)', fontSize: i < 3 ? 16 : 13 }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        {p.image_url
                          ? <img src={IMAGE_BASE_URL + p.image_url} alt="" style={{ width:36, height:36, borderRadius:8, objectFit:'cover' }} />
                          : <div style={{ width:36, height:36, borderRadius:8, background:'var(--pale)', display:'flex', alignItems:'center', justifyContent:'center' }}>🍱</div>
                        }
                        <span style={{ fontWeight:600, fontSize:14 }}>{p.product_name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize:13, color:'var(--tl)' }}>{p.Category_name || '—'}</td>
                    <td>
                      <span style={{ fontWeight:700, color:'#e67e22' }}>
                        {p.avgRating !== '—' ? `⭐ ${p.avgRating}` : '—'}
                      </span>
                    </td>
                    <td>
                      <span className={p.ratingCount > 0 ? 'badge-green' : 'badge-inactive'}>
                        {p.ratingCount} reviews
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={5}><div className="empty-state"><i className="fa-solid fa-fire" />No products found</div></td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
