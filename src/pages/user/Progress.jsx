import { useState, useEffect } from 'react'
import UserLayout from '../../components/UserLayout'
import { useAuth } from '../../context/AuthContext'
import { userDailyLogService, userMealLogService } from '../../services/services'

const EMPTY_LOG = { log_date:'', weight:'', bmi:'', water_glasses:'', calories_consumed:'', protein_consumed:'', exercise_minutes:'', notes:'' }

export default function Progress() {
  const { user } = useAuth()
  const [logs, setLogs]       = useState([])
  const [mealLogs, setMealLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState({ ...EMPTY_LOG, log_date: new Date().toISOString().slice(0,10) })
  const [editId, setEditId]   = useState(null)
  const [saving, setSaving]   = useState(false)
  const [msg, setMsg]         = useState('')

  const load = () => Promise.all([userDailyLogService.getAll(), userMealLogService.getAll()])
    .then(([l, m]) => {
      setLogs(l.data.filter(x => x.user_id === user?.user_id).sort((a,b) => new Date(b.log_date) - new Date(a.log_date)))
      setMealLogs(m.data.filter(x => x.user_id === user?.user_id))
      setLoading(false)
    }).catch(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openAdd  = () => { setForm({ ...EMPTY_LOG, log_date: new Date().toISOString().slice(0,10) }); setEditId(null); setMsg(''); setModal(true) }
  const openEdit = (r) => { setForm({ log_date: r.log_date?.slice(0,10), weight: r.weight, bmi: r.bmi, water_glasses: r.water_glasses, calories_consumed: r.calories_consumed, protein_consumed: r.protein_consumed, exercise_minutes: r.exercise_minutes, notes: r.notes || '' }); setEditId(r.daily_log_id); setMsg(''); setModal(true) }

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = { user_id: user.user_id, ...form }
      if (editId) await userDailyLogService.update(editId, data)
      else        await userDailyLogService.insert(data)
      setMsg('Log saved! ✅'); load()
      setTimeout(() => { setModal(false); setMsg('') }, 800)
    } catch { setMsg('Error saving.') }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this log?')) return
    await userDailyLogService.remove(id); load()
  }

  const latest = logs[0]
  const statCards = [
    { icon:'⚖️',  label:'Latest Weight',   val: latest ? `${latest.weight} kg`  : '—', color:'#3498db' },
    { icon:'📊',  label:'Latest BMI',       val: latest ? latest.bmi             : '—', color:'#2e8b57' },
    { icon:'🏃',  label:'Exercise (last)',  val: latest ? `${latest.exercise_minutes} min` : '—', color:'#e67e22' },
    { icon:'🍽️', label:'Meals Logged',     val: mealLogs.length,                        color:'#9b59b6' },
  ]

  return (
    <UserLayout>
      <div style={{ background:'linear-gradient(135deg,#1a2e1a,#2e8b57)', borderRadius:20, padding:'28px 32px', marginBottom:28, color:'#fff', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h2 style={{ fontWeight:800, fontSize:26, margin:0 }}>📈 My Progress</h2>
          <p style={{ opacity:0.85, marginTop:6, marginBottom:0 }}>Track your daily health logs</p>
        </div>
        <button className="btn-add" onClick={openAdd} style={{ background:'rgba(255,255,255,0.2)', border:'2px solid rgba(255,255,255,0.5)', color:'#fff' }}>
          <i className="fa-solid fa-plus" /> Add Log
        </button>
      </div>

      <div className="row g-3 mb-4">
        {statCards.map((s, i) => (
          <div className="col-6 col-md-3" key={s.label}>
            <div className="u-stat-card" style={{ animation:'riseUp 0.4s forwards', animationDelay:`${i*0.06}s`, opacity:0 }}>
              <div className="icon">{s.icon}</div>
              <div className="num" style={{ color: s.color }}>{s.val}</div>
              <div className="lbl">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-wrap">
        <div className="card-head"><h3>Daily Logs ({logs.length})</h3></div>
        <div className="card-body">
          {loading ? <div className="loader" /> : logs.length === 0 ? (
            <div className="empty-state"><i className="bi bi-graph-up-arrow" /><p>No logs yet. Start tracking!</p>
              <button className="btn-save" onClick={openAdd} style={{ marginTop:12 }}>+ Add First Log</button>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Date</th><th>Weight</th><th>BMI</th><th>Calories</th><th>Exercise</th><th>Water</th><th>Actions</th></tr></thead>
              <tbody>
                {logs.map(r => (
                  <tr key={r.daily_log_id}>
                    <td style={{ fontWeight:600, fontSize:13 }}>{r.log_date?.slice(0,10)}</td>
                    <td>{r.weight} kg</td>
                    <td><span style={{ fontWeight:700, color:'var(--pg)' }}>{r.bmi}</span></td>
                    <td>{r.calories_consumed} kcal</td>
                    <td>{r.exercise_minutes} min</td>
                    <td>{r.water_glasses} 🥛</td>
                    <td>
                      <button className="btn-edit" onClick={() => openEdit(r)} style={{ marginRight:6 }}>Edit</button>
                      <button className="btn-del"  onClick={() => handleDelete(r.daily_log_id)}>Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) setModal(false) }}>
          <div className="modal-box">
            <h4>{editId ? 'Edit Log' : 'Add Daily Log'}</h4>
            {msg && <div className="alert-success">{msg}</div>}
            <div className="row g-2">
              {[
                ['log_date','Date','date'],['weight','Weight (kg)','number'],['bmi','BMI','number'],
                ['water_glasses','Water Glasses','number'],['calories_consumed','Calories','number'],
                ['protein_consumed','Protein (g)','number'],['exercise_minutes','Exercise (min)','number'],
              ].map(([k,l,t]) => (
                <div className="col-6" key={k}>
                  <label className="modal-label">{l}</label>
                  <input className="modal-input" type={t} value={form[k]} onChange={e => setForm({...form, [k]: e.target.value})} />
                </div>
              ))}
              <div className="col-12">
                <label className="modal-label">Notes</label>
                <input className="modal-input" placeholder="Optional notes..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>
            </div>
            <div className="modal-footer-btns">
              <button className="btn-cancel" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Log'}</button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  )
}
