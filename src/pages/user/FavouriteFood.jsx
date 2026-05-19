import { useState, useEffect } from 'react'
import UserLayout from '../../components/UserLayout'
import { useAuth } from '../../context/AuthContext'
import { userFavouritesService } from '../../services/services'
import { IMAGE_BASE_URL } from '../../services/api'

export default function FavouriteFood() {
  const { user } = useAuth()
  const [favs, setFavs]     = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    userFavouritesService.getAll().then(r => {
      setFavs(r.data.filter(x => x.User_id === user?.user_id))
      setLoading(false)
    }).catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const remove = async (id) => {
    await userFavouritesService.remove(id); load()
  }

  const clearAll = async () => {
    if (!confirm('Remove all favourites?')) return
    await Promise.all(favs.map(f => userFavouritesService.remove(f.favourite_id)))
    load()
  }

  return (
    <UserLayout>
      <div style={{ background:'linear-gradient(135deg,#c0392b,#e74c3c)', borderRadius:20, padding:'28px 32px', marginBottom:28, color:'#fff', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h2 style={{ fontWeight:800, fontSize:26, margin:0 }}>❤️ My Favourites</h2>
          <p style={{ opacity:0.85, marginTop:6, marginBottom:0 }}>Your saved food items</p>
        </div>
        {favs.length > 0 && (
          <button onClick={clearAll} style={{ background:'rgba(255,255,255,0.2)', border:'2px solid rgba(255,255,255,0.5)', color:'#fff', borderRadius:10, padding:'8px 18px', fontFamily:'Poppins', fontSize:13, fontWeight:700, cursor:'pointer' }}>
            Clear All
          </button>
        )}
      </div>

      <div className="row g-3 mb-4">
        {[
          { icon:'❤️', label:'Total Favourites', num: favs.length, color:'#e74c3c' },
        ].map(s => (
          <div className="col-md-3" key={s.label}>
            <div className="u-stat-card">
              <div className="icon">{s.icon}</div>
              <div className="num" style={{ color: s.color }}>{s.num}</div>
              <div className="lbl">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {loading ? <div className="loader" /> : favs.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-heart" />
          <h4 style={{ marginTop:12, color:'var(--td)' }}>No favourites yet</h4>
          <p>Search for food and click the heart icon to save favourites.</p>
          <a href="/user/search" className="btn-save" style={{ textDecoration:'none', display:'inline-block', marginTop:12, padding:'10px 24px' }}>
            🔍 Search Food
          </a>
        </div>
      ) : (
        <div className="row g-3">
          {favs.map(f => (
            <div className="col-6 col-md-4 col-lg-3" key={f.favourite_id}>
              <div className="food-card">
                {f.image_url
                  ? <img src={IMAGE_BASE_URL + f.image_url} alt="" style={{ width:'100%', height:140, objectFit:'cover' }} />
                  : <div style={{ height:140, background:'var(--pale)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>🍱</div>
                }
                <div className="food-card-body">
                  <h5>{f.product_name}</h5>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
                    <span style={{ fontSize:11, color:'var(--tl)' }}>
                      {f.created_at ? new Date(f.created_at).toLocaleDateString() : ''}
                    </span>
                    <button onClick={() => remove(f.favourite_id)}
                      style={{ background:'#fdecea', color:'#e74c3c', border:'none', borderRadius:6, padding:'4px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </UserLayout>
  )
}
