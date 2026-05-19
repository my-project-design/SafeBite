import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { login, adminLogin, register } = useAuth()
  const navigate = useNavigate()

  const [loginTab,     setLoginTab]     = useState('user')
  const [loginEmail,   setLoginEmail]   = useState('')
  const [loginPass,    setLoginPass]    = useState('')
  const [loginErr,     setLoginErr]     = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const [regData,      setRegData]      = useState({ first_name:'', last_name:'', email:'', password:'', confirm:'' })
  const [regErr,       setRegErr]       = useState('')
  const [regSuccess,   setRegSuccess]   = useState('')
  const [regLoading,   setRegLoading]   = useState(false)

  const [overlay, setOverlay] = useState('') // 'login' | 'register' | ''

  const openOverlay  = (o) => { setOverlay(o); setLoginErr(''); setRegErr(''); setRegSuccess('') }
  const closeOverlay = ()  => setOverlay('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true); setLoginErr('')
    if (loginTab === 'admin') {
      const r = await adminLogin(loginEmail, loginPass)
      setLoginLoading(false)
      if (r.success) { closeOverlay(); navigate('/admin/dashboard') }
      else setLoginErr(r.message)
    } else {
      const r = await login(loginEmail, loginPass)
      setLoginLoading(false)
      if (r.success) { closeOverlay(); navigate('/user/dashboard') }
      else setLoginErr(r.message)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (regData.password !== regData.confirm) { setRegErr('Passwords do not match.'); return }
    setRegLoading(true); setRegErr('')
    const r = await register({ first_name: regData.first_name, last_name: regData.last_name, email: regData.email, password: regData.password })
    setRegLoading(false)
    if (r.success) {
      setRegSuccess('Account created! Please login.')
      setRegData({ first_name:'', last_name:'', email:'', password:'', confirm:'' })
    } else setRegErr(r.message)
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className="sb-navbar">
        <div className="container d-flex align-items-center justify-content-between">
          <span className="sb-logo">SafeBite</span>
          <div className="d-flex align-items-center gap-3">
            <Link to="/"        className="nav-link-item d-none d-md-inline">Home</Link>
            <Link to="/about"   className="nav-link-item d-none d-md-inline">About</Link>
            <Link to="/contact" className="nav-link-item d-none d-md-inline">Contact</Link>
            <button className="btn-login-nav"    onClick={() => openOverlay('login')}>Login</button>
            <button className="btn-register-nav" onClick={() => openOverlay('register')}>Register</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <h1>Eat Smart. Live Healthy<br/>with SafeBite.</h1>
          <p>SafeBite helps you check whether packaged food items are safe based on your health conditions.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button className="btn-hero"     onClick={() => openOverlay('login')}>Get Started Free</button>
            <button className="btn-hero-out" onClick={() => openOverlay('register')}>Register Now</button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '4rem 0', background: '#fff' }}>
        <div className="container">
          <h2 style={{ textAlign:'center', fontSize:'2rem', fontWeight:700, color:'var(--dg)', marginBottom:'2.5rem' }}>Key Features</h2>
          <div className="row g-4">
            {[
              { icon:'👤', title:'Health Profile Analysis',    desc:'Create your personalized health profile with conditions and allergies.' },
              { icon:'🔍', title:'Ingredient Safety Check',    desc:'Instantly see if food ingredients are safe for your health conditions.' },
              { icon:'✅', title:'Personalized Suggestions',   desc:'Get customized food recommendations based on your dietary needs.' },
              { icon:'📋', title:'Diet Planning',              desc:'Access meal plans designed specifically for your health profile.' },
              { icon:'⭐', title:'Favorites',                  desc:'Save frequently used food items for faster access and quick decisions.' },
              { icon:'🍲', title:'Recipe Suggestions',         desc:'Healthy recipe recommendations based on your food preferences.' },
            ].map(f => (
              <div className="col-md-4" key={f.title}>
                <div className="feat-card">
                  <div className="feat-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background:'var(--dg)', padding:'3rem 0', color:'#fff' }}>
        <div className="container">
          <div className="row text-center">
            {[['5,000+','Users'],['1,200+','Food Items'],['300+','Diet Plans'],['50+','Health Conditions']].map(([n,l]) => (
              <div className="col-6 col-md-3 mb-3" key={l}>
                <div style={{ fontSize:36, fontWeight:800, color:'#90ee90' }}>{n}</div>
                <div style={{ fontSize:14, opacity:0.8 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="sb-footer">
        <div className="container">
          <div className="row mb-3">
            <div className="col-md-4 mb-3"><h5>SafeBite</h5><p>A food safety platform helping users make informed dietary choices based on their health conditions.</p></div>
            <div className="col-md-4 mb-3"><h5>Tech Stack</h5><p>React.js • Node.js • Express.js • MySQL • Bootstrap</p></div>
            <div className="col-md-4 mb-3"><h5>Project Info</h5><p>Final Year Project</p><p>Dr ThakorBhai Patel Institute</p><p>2025–2026</p></div>
          </div>
          <div className="footer-bottom"><p>© 2026 SafeBite — Developed by Mayuri &amp; Sneha</p></div>
        </div>
      </footer>

      {/* LOGIN OVERLAY */}
      <div className={`sb-overlay ${overlay === 'login' ? 'active' : ''}`} onClick={e => { if(e.target === e.currentTarget) closeOverlay() }}>
        <div className="login-box">
          <button className="close-btn" onClick={closeOverlay}>×</button>
          <div className="tab-row">
            <button className={`tab-btn ${loginTab==='user'  ? 'active-user'  : ''}`} onClick={() => setLoginTab('user')}>👤 User Login</button>
            <button className={`tab-btn ${loginTab==='admin' ? 'active-admin' : ''}`} onClick={() => setLoginTab('admin')}>⚙️ Admin Login</button>
          </div>
          <div className="login-body">
            {loginTab === 'user' ? (
              <>
                <h3>Welcome Back!</h3>
                <p className="sub">Sign in to your SafeBite account</p>
              </>
            ) : (
              <>
                <h3>Admin Control Panel</h3>
                <p className="sub">Sign in to manage SafeBite</p>
              </>
            )}
            {loginErr && <div className="alert-error">{loginErr}</div>}
            <form onSubmit={handleLogin}>
              <div className="field">
                <label>Email</label>
                <input type="email" placeholder="Enter your email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
              </div>
              <div className="field">
                <label>Password</label>
                <input type="password" placeholder="Enter your password" required value={loginPass} onChange={e => setLoginPass(e.target.value)} />
              </div>
              <button type="submit" className={`btn-submit ${loginTab==='admin' ? 'admin-color' : 'user-color'}`} disabled={loginLoading}>
                {loginLoading ? 'Signing in...' : loginTab==='admin' ? 'Sign In → Admin Dashboard' : 'Sign In → Dashboard'}
              </button>
            </form>
            <p className="switch-link">New user? <a onClick={() => openOverlay('register')}>Register</a></p>
          </div>
        </div>
      </div>

      {/* REGISTER OVERLAY */}
      <div className={`sb-overlay ${overlay === 'register' ? 'active' : ''}`} onClick={e => { if(e.target === e.currentTarget) closeOverlay() }}>
        <div className="reg-box">
          <button className="close-btn" onClick={closeOverlay}>×</button>
          <h3 className="reg-title">Create Account</h3>
          {regErr     && <div className="alert-error">{regErr}</div>}
          {regSuccess && <div className="alert-success">{regSuccess}</div>}
          <form onSubmit={handleRegister}>
            <div className="row">
              <div className="col-6">
                <div className="field"><label>First Name</label><input type="text" placeholder="First name" required value={regData.first_name} onChange={e => setRegData({...regData, first_name: e.target.value})} /></div>
              </div>
              <div className="col-6">
                <div className="field"><label>Last Name</label><input type="text" placeholder="Last name" required value={regData.last_name} onChange={e => setRegData({...regData, last_name: e.target.value})} /></div>
              </div>
            </div>
            <div className="field"><label>Email Address</label><input type="email" placeholder="Enter your email" required value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} /></div>
            <div className="field"><label>Password</label><input type="password" placeholder="Create a password" required value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} /></div>
            <div className="field"><label>Confirm Password</label><input type="password" placeholder="Re-enter your password" required value={regData.confirm} onChange={e => setRegData({...regData, confirm: e.target.value})} /></div>
            <button type="submit" className="btn-submit user-color" disabled={regLoading}>
              {regLoading ? 'Creating account...' : 'Register'}
            </button>
          </form>
          <p className="switch-link">Already have an account? <a onClick={() => openOverlay('login')}>Login</a></p>
        </div>
      </div>
    </>
  )
}
