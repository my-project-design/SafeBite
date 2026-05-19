import { useState, useEffect } from 'react'
import UserLayout from '../../components/UserLayout'
import { useAuth } from '../../context/AuthContext'
import { productService, userFavouritesService, userDailyLogService, userMealLogService } from '../../services/services'

export default function UserDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ products:0, favourites:0, logs:0, meals:0 })
  const [recentFavs, setRecentFavs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      productService.getAll(),
      userFavouritesService.getAll(),
      userDailyLogService.getAll(),
      userMealLogService.getAll(),
    ]).then(([p, f, l, m]) => {
      const myFavs = f.data.filter(x => x.User_id === user?.user_id)
      const myLogs = l.data.filter(x => x.user_id === user?.user_id)
      const myMeals = m.data.filter(x => x.user_id === user?.user_id)
      setStats({ products: p.data.length, favourites: myFavs.length, logs: myLogs.length, meals: myMeals.length })
      setRecentFavs(myFavs.slice(0,4))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user])

  const statCards = [
    { icon:'🍱', label:'Total Foods',       num: stats.products,   color:'#2e8b57' },
    { icon:'❤️', label:'My Favourites',     num: stats.favourites, color:'#e74c3c' },
    { icon:'📊', label:'Daily Logs',        num: stats.logs,       color:'#3498db' },
    { icon:'🍽️', label:'Meal Logs',        num: stats.meals,      color:'#e67e22' },
  ]

  return (
    <UserLayout>
      {loading ? <div className="loader" /> : (
        <>
          {/* HERO */}
          <div style={{ background:'linear-gradient(135deg,var(--dg),var(--pg))', borderRadius:20, padding:'28px 32px', marginBottom:28, color:'#fff' }}>
            <h2 style={{ fontWeight:800, margin:0, fontSize:24 }}>
              Welcome back, {user?.first_name || 'User'}! 👋
            </h2>
            <p style={{ margin:'6px 0 0', opacity:0.85, fontSize:14 }}>
              Track your nutrition, manage your health, and make smarter food choices.
            </p>
          </div>

          {/* STAT CARDS */}
          <div className="row g-3 mb-4">
            {statCards.map((s, i) => (
              <div className="col-6 col-md-3" key={s.label}>
                <div className="u-stat-card" style={{ animationDelay:`${i*0.08}s`, animation:'riseUp 0.4s forwards', opacity:0 }}>
                  <div className="icon">{s.icon}</div>
                  <div className="num" style={{ color: s.color }}>{s.num}</div>
                  <div className="lbl">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* QUICK LINKS */}
          <h3 className="section-title">Quick Actions</h3>
          <div className="row g-3 mb-4">
            {[
              { icon:'🔍', label:'Search Food',     path:'/user/search',        color:'#2e8b57' },
              { icon:'🔥', label:'Trending Food',   path:'/user/trending',      color:'#e67e22' },
              { icon:'📋', label:'My Diet Plan',    path:'/user/dietplan',      color:'#3498db' },
              { icon:'👤', label:'Health Profile',  path:'/user/healthprofile', color:'#9b59b6' },
            ].map(q => (
              <div className="col-6 col-md-3" key={q.label}>
                <a href={q.path} style={{ textDecoration:'none' }}>
                  <div style={{ background:'#fff', borderRadius:14, padding:'20px', textAlign:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.06)', transition:'all 0.3s', cursor:'pointer', border:`2px solid transparent` }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = q.color}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                  >
                    <div style={{ fontSize:28, marginBottom:8 }}>{q.icon}</div>
                    <div style={{ fontWeight:700, fontSize:13, color: q.color }}>{q.label}</div>
                  </div>
                </a>
              </div>
            ))}
          </div>

          {/* RECENT FAVOURITES */}
          {recentFavs.length > 0 && (
            <>
              <h3 className="section-title">Recent Favourites</h3>
              <div className="row g-3">
                {recentFavs.map(f => (
                  <div className="col-6 col-md-3" key={f.favourite_id}>
                    <div className="food-card">
                      <div style={{ height:100, background:'var(--pale)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>
                        {f.image_url ? <img src={`http://localhost:5500/productlogo/${f.image_url}`} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '🍱'}
                      </div>
                      <div className="food-card-body">
                        <h5>{f.product_name}</h5>
                        <p style={{ color:'#e74c3c', fontWeight:600, fontSize:11 }}>❤️ Favourite</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </UserLayout>
  )
}
