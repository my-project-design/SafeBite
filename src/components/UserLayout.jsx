import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from "../context/AuthContext";

const navItems = [
  { icon:'bi-speedometer2',  label:'Dashboard',      path:'/user/dashboard'     },
  { icon:'bi-search',        label:'Search Food',    path:'/user/search'        },
  { icon:'bi-graph-up',      label:'Trending',       path:'/user/trending'      },
  { icon:'bi-heart-fill',    label:'Favorites',      path:'/user/favourites'    },
  { icon:'bi-calendar-check',label:'Diet Plan',      path:'/user/dietplan'      },
  { icon:'bi-graph-up-arrow',label:'Progress',       path:'/user/progress'      },
  { icon:'bi-person-circle', label:'Health Profile', path:'/user/healthprofile' },
]

export default function UserLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div style={{ minHeight:'100vh', background:'var(--pale)' }}>
      {/* NAVBAR */}
      <nav className="user-navbar">
        <div className="sb-logo" style={{ cursor:'pointer' }} onClick={() => navigate('/user/dashboard')}>🥗 SafeBite</div>
        <div className="user-nav-links">
          {navItems.map(item => (
            <button
              key={item.path}
              className={`user-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <i className={`bi ${item.icon}`} />
              <span className="d-none d-lg-inline">{item.label}</span>
            </button>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:13, fontWeight:600, color:'var(--td)' }}>
            Hi, {user?.first_name || 'User'} 👋
          </span>
          <button onClick={handleLogout} style={{ background:'var(--pale)', border:'2px solid var(--pg)', color:'var(--pg)', borderRadius:8, padding:'6px 14px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'Poppins' }}>
            <i className="bi bi-box-arrow-right" /> Logout
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="user-content">{children}</div>
    </div>
  )
}
