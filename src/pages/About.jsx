import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function About() {
  const { login, adminLogin } = useAuth()
  const navigate = useNavigate()
  const [overlay, setOverlay] = useState('')
  const [tab, setTab] = useState('user')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault(); setErr('')
    const r = tab === 'admin' ? await adminLogin(email, pass) : await login(email, pass)
    if (r.success) { setOverlay(''); navigate(tab === 'admin' ? '/admin/dashboard' : '/user/dashboard') }
    else setErr(r.message)
  }

  return (
    <>
      <nav className="sb-navbar">
        <div className="container d-flex align-items-center justify-content-between">
          <Link to="/" className="sb-logo" style={{ textDecoration:'none' }}>SafeBite</Link>
          <div className="d-flex align-items-center gap-3">
            <Link to="/"        className="nav-link-item">Home</Link>
            <Link to="/about"   className="nav-link-item">About</Link>
            <Link to="/contact" className="nav-link-item">Contact</Link>
            <button className="btn-login-nav"    onClick={() => setOverlay('login')}>Login</button>
            <button className="btn-register-nav" onClick={() => navigate('/')}>Register</button>
          </div>
        </div>
      </nav>

      <div style={{ background:'linear-gradient(135deg,var(--pale),#fff,#e8f4f8)', minHeight:'100vh', padding:'4rem 0' }}>
        <div className="container">
          <div style={{ textAlign:'center', background:'linear-gradient(135deg,rgba(46,139,87,0.12),rgba(217,238,247,0.5))', borderRadius:32, padding:'4rem 3rem', border:'2px solid rgba(46,139,87,0.2)', marginBottom:'4rem' }}>
            <h1 style={{ fontSize:'3.5rem', fontWeight:800, color:'var(--td)', marginBottom:'1rem' }}>About SafeBite</h1>
            <p style={{ fontSize:'1.25rem', color:'var(--tl)' }}>Empowering healthier food choices through technology</p>
          </div>

          <div className="row g-4 mb-5">
            {[
              { icon:'🎯', title:'Our Mission', desc:'To empower every individual to make informed dietary decisions based on their unique health conditions, allergies, and nutritional goals using modern technology.' },
              { icon:'👁️', title:'Our Vision',  desc:'A world where food labels are transparent, health is prioritized, and every person can access personalized nutrition guidance at their fingertips.' },
              { icon:'💡', title:'Our Story',   desc:'SafeBite started as a final year project with a simple goal: help people understand what\'s really in their food. Built with passion by Mayuri & Sneha in 2025-2026.' },
            ].map(c => (
              <div className="col-md-4" key={c.title}>
                <div style={{ background:'#fff', borderRadius:20, padding:'2.5rem', boxShadow:'0 2px 16px rgba(46,139,87,0.1)', height:'100%', border:'1px solid rgba(46,139,87,0.1)', textAlign:'center' }}>
                  <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>{c.icon}</div>
                  <h3 style={{ color:'var(--pg)', marginBottom:'1rem', fontSize:'1.4rem' }}>{c.title}</h3>
                  <p style={{ color:'var(--tl)', lineHeight:1.8 }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background:'#fff', borderRadius:20, padding:'3rem', boxShadow:'0 2px 16px rgba(46,139,87,0.1)', marginBottom:'3rem' }}>
            <h2 style={{ color:'var(--dg)', marginBottom:'2rem', fontSize:'2rem' }}>What SafeBite Offers</h2>
            <div className="row g-3">
              {['Health profile creation with conditions & allergies','Ingredient safety analysis for packaged foods','Personalized diet plan recommendations','Daily nutrition tracking & progress monitoring','Favourite food bookmarking','BMI tracking and health insights'].map(f => (
                <div className="col-md-6" key={f}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'var(--pale)', borderRadius:10 }}>
                    <span style={{ color:'var(--pg)', fontWeight:800, fontSize:18 }}>✓</span>
                    <span style={{ fontSize:14, color:'var(--td)' }}>{f}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="row g-4">
            {[['React.js','Frontend UI'],['Node.js + Express','Backend API'],['MySQL','Database'],['Bootstrap 5','Styling']].map(([t,s]) => (
              <div className="col-6 col-md-3" key={t}>
                <div style={{ background:'var(--dg)', borderRadius:16, padding:'1.5rem', textAlign:'center', color:'#fff' }}>
                  <div style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>{t}</div>
                  <div style={{ fontSize:12, opacity:0.7 }}>{s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="sb-footer">
        <div className="container">
          <div className="footer-bottom"><p>© 2026 SafeBite — Developed by Mayuri &amp; Sneha</p></div>
        </div>
      </footer>

      {/* Login overlay */}
      <div className={`sb-overlay ${overlay === 'login' ? 'active' : ''}`} onClick={e => { if(e.target===e.currentTarget) setOverlay('') }}>
        <div className="login-box">
          <button className="close-btn" onClick={() => setOverlay('')}>×</button>
          <div className="tab-row">
            <button className={`tab-btn ${tab==='user'  ? 'active-user'  : ''}`} onClick={() => setTab('user')}>👤 User</button>
            <button className={`tab-btn ${tab==='admin' ? 'active-admin' : ''}`} onClick={() => setTab('admin')}>⚙️ Admin</button>
          </div>
          <div className="login-body">
            <h3>{tab==='admin' ? 'Admin Login' : 'Welcome Back!'}</h3>
            {err && <div className="alert-error">{err}</div>}
            <form onSubmit={handleLogin}>
              <div className="field"><label>Email</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div className="field"><label>Password</label><input type="password" required value={pass} onChange={e => setPass(e.target.value)} /></div>
              <button type="submit" className={`btn-submit ${tab==='admin' ? 'admin-color' : 'user-color'}`}>Sign In</button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
