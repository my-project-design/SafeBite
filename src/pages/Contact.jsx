import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Contact() {
  const { login, adminLogin } = useAuth()
  const navigate = useNavigate()
  const [overlay, setOverlay] = useState('')
  const [tab, setTab] = useState('user')
  const [email, setEmail] = useState(''); const [pass, setPass] = useState(''); const [err, setErr] = useState('')
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [sent, setSent] = useState(false)

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
            <button className="btn-login-nav" onClick={() => setOverlay('login')}>Login</button>
            <button className="btn-register-nav" onClick={() => navigate('/')}>Register</button>
          </div>
        </div>
      </nav>

      <div style={{ background:'linear-gradient(to bottom,#f0fdf4,#dbeafe)', minHeight:'100vh', padding:'4rem 0' }}>
        <div className="container">
          <h1 style={{ textAlign:'center', fontSize:'2.5rem', fontWeight:800, color:'var(--dg)', marginBottom:'0.5rem' }}>Contact Us</h1>
          <p style={{ textAlign:'center', color:'var(--tl)', marginBottom:'3rem' }}>Have a question or feedback? We'd love to hear from you.</p>

          <div className="row g-4">
            <div className="col-md-4">
              {[
                { icon:'📧', title:'Email Us',     val:'safebite@project.edu' },
                { icon:'📱', title:'Call Us',      val:'+91 98765 43210' },
                { icon:'📍', title:'Location',     val:'Dr ThakorBhai Patel Institute, Gujarat' },
              ].map(c => (
                <div key={c.title} style={{ background:'#fff', borderRadius:16, padding:'1.8rem', marginBottom:'1.2rem', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:'2px solid #d1fae5' }}>
                  <div style={{ fontSize:'2rem', marginBottom:'0.6rem' }}>{c.icon}</div>
                  <div style={{ fontWeight:700, color:'var(--dg)', marginBottom:'0.3rem' }}>{c.title}</div>
                  <div style={{ color:'var(--tl)', fontSize:14 }}>{c.val}</div>
                </div>
              ))}
            </div>

            <div className="col-md-8">
              <div style={{ background:'#fff', borderRadius:20, padding:'2.5rem', boxShadow:'0 2px 16px rgba(0,0,0,0.06)', border:'2px solid #d1fae5' }}>
                <h3 style={{ color:'var(--dg)', marginBottom:'1.5rem' }}>Send a Message</h3>
                {sent && <div className="alert-success">✅ Message sent! We'll get back to you soon.</div>}
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="modal-label">Full Name</label>
                    <input className="modal-input" placeholder="Your name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="modal-label">Email</label>
                    <input className="modal-input" type="email" placeholder="Your email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
                  </div>
                  <div className="col-12">
                    <label className="modal-label">Subject</label>
                    <input className="modal-input" placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject:e.target.value})} />
                  </div>
                  <div className="col-12">
                    <label className="modal-label">Message</label>
                    <textarea className="modal-input" rows={5} placeholder="Your message..." value={form.message} onChange={e => setForm({...form, message:e.target.value})} style={{ resize:'vertical' }} />
                  </div>
                  <div className="col-12">
                    <button className="btn-save" style={{ width:'100%', padding:'13px' }} onClick={() => { setSent(true); setForm({ name:'', email:'', subject:'', message:'' }) }}>
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="sb-footer">
        <div className="container">
          <div className="footer-bottom"><p>© 2026 SafeBite — Developed by Mayuri &amp; Sneha</p></div>
        </div>
      </footer>

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
