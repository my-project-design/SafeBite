import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from "../context/AuthContext";

const navItems = [
  { group:'Main',       items:[{ icon:'fa-gauge-high',    label:'Dashboard',          path:'/admin/dashboard'  }] },
  { group:'Management', items:[
    { icon:'fa-users',      label:'Manage Users',       path:'/admin/users'      },
    { icon:'fa-tag',        label:'Category',           path:'/admin/category'   },
    { icon:'fa-bowl-food',  label:'Product',            path:'/admin/product'    },
    { icon:'fa-fire',       label:'Trending Food',      path:'/admin/trending'   },
  ]},
  { group:'Content', items:[
    { icon:'fa-notes-medical', label:'Diet Plan',       path:'/admin/dietplan'   },
    { icon:'fa-heart',         label:'Favourites',      path:'/admin/favourites' },
  ]},
]

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [clock, setClock] = useState('')

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString())
    tick(); const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside id="sidebar">
        <div className="sb-top">
          <div className="brand">
            <div className="brand-icon">🥗</div>
            <h1>Safe<em>Bite</em></h1>
          </div>
          <div className="admin-chip"><div className="pulse-dot" />Super Admin</div>
        </div>

        <nav className="sb-nav">
          {navItems.map(g => (
            <div className="nav-group" key={g.group}>
              <div className="nav-group-label">{g.group}</div>
              {g.items.map(item => (
                <button
                  key={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <i className={`fa-solid ${item.icon}`} />
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sb-bottom">
          <div className="av">A</div>
          <div className="info">
            <span>Admin</span>
            <small>{user?.email}</small>
          </div>
          <button className="logout-btn" title="Logout" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket" />
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div id="main">
        <header className="topbar">
          <div className="topbar-left"><h2>{title}</h2></div>
          <div className="topbar-right">
            <div className="tb-clock">{clock}</div>
            <div style={{ fontSize:18, color:'var(--tl)', cursor:'pointer' }}>🔔</div>
          </div>
        </header>
        <div className="page-content">{children}</div>
      </div>
    </div>
  )
}
