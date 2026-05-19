import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { mealService, mealNutritionService, mealHealthRuleService } from '../../services/services'

const EMPTY = { Meal_name:'', Meal_type:'Breakfast', Description:'', Is_active:1 }

export default function AdminDietPlan() {
  const [meals, setMeals]       = useState([])
  const [nutrition, setNutrition] = useState([])
  const [rules, setRules]       = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [editId, setEditId]     = useState(null)
  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState('')

  const load = () => Promise.all([mealService.getAll(), mealNutritionService.getAll(), mealHealthRuleService.getAll()])
    .then(([m, n, r]) => { setMeals(m.data); setNutrition(n.data); setRules(r.data); setLoading(false) })
    .catch(() => setLoading(false))

  useEffect(() => { load() }, [])

  const filtered = meals.filter(m => m.Meal_name?.toLowerCase().includes(search.toLowerCase()))

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setMsg(''); setModal(true) }
  const openEdit = (r) => { setForm({ Meal_name: r.Meal_name, Meal_type: r.Meal_type, Description: r.Description, Is_active: r.Is_active }); setEditId(r.Meal_id); setMsg(''); setModal(true) }

  const handleSave = async () => {
    if (!form.Meal_name.trim()) return
    setSaving(true)
    try {
      const now = new Date().toISOString().slice(0,19).replace('T',' ')
      if (editId) await mealService.update(editId, { ...form, Created_at: now })
      else        await mealService.insert({ ...form, Created_at: now })
      setMsg('Saved!'); load()
      setTimeout(() => { setModal(false); setMsg('') }, 800)
    } catch { setMsg('Error saving.') }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this meal?')) return
    await mealService.remove(id); load()
  }

  const mealTypes = ['Breakfast','Lunch','Dinner','Snack','Dessert']

  return (
    <AdminLayout title="Diet Plan Management">
      <div className="page-header">
        <h2>Diet Plans</h2>
        <div style={{ display:'flex', gap:10 }}>
          <div className="search-box">
            <i className="fa-solid fa-search" style={{ color:'var(--tl)', fontSize:13 }} />
            <input placeholder="Search meals..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn-add" onClick={openAdd}><i className="fa-solid fa-plus" /> Add Meal</button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label:'Total Meals', num: meals.length,     icon:'🍽️' },
          { label:'Nutrition Records', num: nutrition.length, icon:'📊' },
          { label:'Health Rules', num: rules.length,    icon:'📋' },
        ].map((s, i) => (
          <div className="col-4" key={s.label}>
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
        <div className="card-head"><h3>All Meals ({filtered.length})</h3></div>
        <div className="card-body">
          {loading ? <div className="loader" /> : (
            <table className="data-table">
              <thead><tr><th>#</th><th>Meal Name</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.Meal_id}>
                    <td style={{ color:'var(--tl)', fontSize:12 }}>{i+1}</td>
                    <td>
                      <div style={{ fontWeight:600, fontSize:14 }}>{r.Meal_name}</div>
                      <div style={{ fontSize:11, color:'var(--tl)' }}>{r.Description?.slice(0,50)}</div>
                    </td>
                    <td>
                      <span className="badge-orange">{r.Meal_type}</span>
                    </td>
                    <td><span className={r.Is_active ? 'badge-active' : 'badge-inactive'}>{r.Is_active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <button className="btn-edit" onClick={() => openEdit(r)} style={{ marginRight:6 }}>Edit</button>
                      <button className="btn-del"  onClick={() => handleDelete(r.Meal_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={5}><div className="empty-state"><i className="fa-solid fa-notes-medical" />No meals found</div></td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) setModal(false) }}>
          <div className="modal-box">
            <h4>{editId ? 'Edit Meal' : 'Add Meal'}</h4>
            {msg && <div className="alert-success">{msg}</div>}
            <label className="modal-label">Meal Name *</label>
            <input className="modal-input" placeholder="Enter meal name" value={form.Meal_name} onChange={e => setForm({...form, Meal_name: e.target.value})} />
            <label className="modal-label">Meal Type</label>
            <select className="modal-input" value={form.Meal_type} onChange={e => setForm({...form, Meal_type: e.target.value})}>
              {mealTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <label className="modal-label">Description</label>
            <input className="modal-input" placeholder="Description" value={form.Description} onChange={e => setForm({...form, Description: e.target.value})} />
            <label className="modal-label">Status</label>
            <select className="modal-input" value={form.Is_active} onChange={e => setForm({...form, Is_active: Number(e.target.value)})}>
              <option value={1}>Active</option><option value={0}>Inactive</option>
            </select>
            <div className="modal-footer-btns">
              <button className="btn-cancel" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
