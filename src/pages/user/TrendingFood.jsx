import { useState, useEffect } from 'react'
import UserLayout from '../../components/UserLayout'
import { useAuth } from '../../context/AuthContext'
import { productService, productRatingService, userFavouritesService } from '../../services/services'
import { IMAGE_BASE_URL } from '../../services/api'

export default function TrendingFood() {
  const { user } = useAuth()
  const [trending, setTrending]   = useState([])
  const [favourites, setFavourites] = useState([])
  const [filter, setFilter]       = useState('all')
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([productService.getAll(), productRatingService.getAll(), userFavouritesService.getAll()])
      .then(([p, r, f]) => {
        const rated = p.data.map(prod => {
          const pr  = r.data.filter(x => x.product_id === prod.product_id)
          const avg = pr.length ? (pr.reduce((s, x) => s + Number(x.rating), 0) / pr.length).toFixed(1) : 0
          return { ...prod, avgRating: Number(avg), reviewCount: pr.length }
        }).sort((a, b) => b.reviewCount - a.reviewCount || b.avgRating - a.avgRating)
        setTrending(rated)
        setFavourites(f.data.filter(x => x.User_id === user?.user_id).map(x => x.product_id))
        setLoading(false)
      }).catch(() => setLoading(false))
  }, [])

  const categories = ['all', ...new Set(trending.map(p => p.Category_name).filter(Boolean))]

  const filtered = filter === 'all' ? trending : trending.filter(p => p.Category_name === filter)

  const toggleFav = async (pid, e) => {
    e.stopPropagation()
    if (!user) return
    if (favourites.includes(pid)) {
      const favs = await userFavouritesService.getAll()
      const fav = favs.data.find(f => f.User_id === user.user_id && f.product_id === pid)
      if (fav) { await userFavouritesService.remove(fav.favourite_id); setFavourites(prev => prev.filter(x => x !== pid)) }
    } else {
      await userFavouritesService.insert({ user_id: user.user_id, product_id: pid })
      setFavourites(prev => [...prev, pid])
    }
  }

  return (
    <UserLayout>
      <div style={{ background:'linear-gradient(135deg,#1a2e1a,#2d5a2d)', borderRadius:20, padding:'32px', marginBottom:28, color:'#fff', textAlign:'center' }}>
        <h2 style={{ fontWeight:800, fontSize:28, margin:0 }}>🔥 Trending Food</h2>
        <p style={{ opacity:0.8, marginTop:8 }}>Most popular & highly rated food products</p>
        <div className="row g-3 mt-3" style={{ maxWidth:500, margin:'0 auto' }}>
          {[
            { label:'Top Rated', num: trending.filter(p => p.avgRating >= 4).length },
            { label:'Total',     num: trending.length },
          ].map(s => (
            <div className="col-6" key={s.label}>
              <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:12, padding:'14px' }}>
                <div style={{ fontSize:24, fontWeight:800, color:'#a8e6a3' }}>{s.num}</div>
                <div style={{ fontSize:12, opacity:0.8 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:24 }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ padding:'8px 18px', borderRadius:20, border:'2px solid', fontFamily:'Poppins', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.2s',
              background: filter === c ? 'var(--pg)' : '#fff',
              borderColor: filter === c ? 'var(--pg)' : '#ddd',
              color: filter === c ? '#fff' : 'var(--td)' }}>
            {c === 'all' ? 'All' : c}
          </button>
        ))}
      </div>

      {loading ? <div className="loader" /> : (
        <div className="row g-3">
          {filtered.map((p, i) => (
            <div className="col-6 col-md-4 col-lg-3" key={p.product_id}>
              <div className="food-card" style={{ position:'relative' }}>
                {i < 3 && (
                  <div style={{ position:'absolute', top:10, left:10, zIndex:2, background:'#e67e22', color:'#fff', fontWeight:800, fontSize:11, padding:'3px 10px', borderRadius:20 }}>
                    {i === 0 ? '🥇 Top' : i === 1 ? '🥈 #2' : '🥉 #3'}
                  </div>
                )}
                {p.image_url
                  ? <img src={IMAGE_BASE_URL + p.image_url} alt="" style={{ width:'100%', height:150, objectFit:'cover' }} />
                  : <div style={{ height:150, background:'var(--pale)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40 }}>🍱</div>
                }
                <button onClick={e => toggleFav(p.product_id, e)}
                  style={{ position:'absolute', top:10, right:10, background:'rgba(255,255,255,0.9)', border:'none', borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', zIndex:2 }}>
                  {favourites.includes(p.product_id) ? '❤️' : '🤍'}
                </button>
                <div className="food-card-body">
                  <h5>{p.product_name}</h5>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:6 }}>
                    <span style={{ fontSize:12, color:'var(--tl)' }}>{p.Category_name || '—'}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:'#e67e22' }}>
                      {p.avgRating > 0 ? `⭐ ${p.avgRating}` : 'No ratings'}
                    </span>
                  </div>
                  <div style={{ fontSize:11, color:'var(--tl)', marginTop:4 }}>{p.reviewCount} reviews</div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="empty-state col-12"><i className="bi bi-graph-up" />No trending items</div>}
        </div>
      )}
    </UserLayout>
  )
}
