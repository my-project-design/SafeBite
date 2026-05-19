import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { categoryService } from '../../services/services'

const EMPTY = { Category_name:'', Is_active:1 }

export default function AdminCategory() {
  const [rows, setRows]     = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal]   = useState(false)
  const [form, setForm]     = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState('')

  const load = () => categoryService.getAll().then(r => { setRows(r.data); setFiltered(r.data); setLoading(false) }).catch(() => setLoading(false))
  useEffect(() => { load() }, [])
  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(rows.filter(r => r.Category_name?.toLowerCase().includes(q)))
  }, [search, rows])

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setMsg(''); setModal(true) }
  const openEdit = (r) => { setForm({ Category_name: r.Category_name, Is_active: r.Is_active }); setEditId(r.Category_id); setMsg(''); setModal(true) }

  const handleSave = async () => {
    if (!form.Category_name.trim()) return
    setSaving(true)
    const now = new Date().toISOString().slice(0,19).replace('T',' ')
    try {
      if (editId) {
        await categoryService.update(editId, { ...form, Updated_on: now, Updated_by: 1 })
      } else {
        await categoryService.insert({ ...form, Created_On: now, Updated_on: now, Created_by: 1, Updated_by: 1 })
      }
      setMsg('Saved successfully!'); load()
      setTimeout(() => { setModal(false); setMsg('') }, 800)
    } catch { setMsg('Error saving.') }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    await categoryService.remove(id); load()
  }

  return (
    <AdminLayout title="Category Management">
      <div className="page-header">
        <h2>Categories</h2>
        <div style={{ display:'flex', gap:10 }}>
          <div className="search-box">
            <i className="fa-solid fa-search" style={{ color:'var(--tl)', fontSize:13 }} />
            <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn-add" onClick={openAdd}><i className="fa-solid fa-plus" /> Add Category</button>
        </div>
      </div>

      <div className="card-wrap">
        <div className="card-head"><h3>All Categories ({filtered.length})</h3></div>
        <div className="card-body">
          {loading ? <div className="loader" /> : (
            <table className="data-table">
              <thead><tr><th>#</th><th>Category Name</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.Category_id}>
                    <td style={{ color:'var(--tl)', fontSize:12 }}>{i+1}</td>
                    <td style={{ fontWeight:600 }}>{r.Category_name}</td>
                    <td><span className={r.Is_active ? 'badge-active' : 'badge-inactive'}>{r.Is_active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <button className="btn-edit" onClick={() => openEdit(r)} style={{ marginRight:6 }}>Edit</button>
                      <button className="btn-del"  onClick={() => handleDelete(r.Category_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={4}><div className="empty-state"><i className="fa-solid fa-tag" />No categories found</div></td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) setModal(false) }}>
          <div className="modal-box">
            <h4>{editId ? 'Edit Category' : 'Add Category'}</h4>
            {msg && <div className="alert-success">{msg}</div>}
            <label className="modal-label">Category Name *</label>
            <input className="modal-input" placeholder="Enter category name" value={form.Category_name} onChange={e => setForm({...form, Category_name: e.target.value})} />
            <label className="modal-label">Status</label>
            <select className="modal-input" value={form.Is_active} onChange={e => setForm({...form, Is_active: Number(e.target.value)})}>
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
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
