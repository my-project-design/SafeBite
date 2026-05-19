import { useState, useEffect, useRef } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { productService, categoryService, brandService } from '../../services/services'
import { IMAGE_BASE_URL } from '../../services/api'

const EMPTY = { product_name:'', description:'', category_id:'', brand_id:'' }

export default function AdminProduct() {
  const [rows, setRows]         = useState([])
  const [filtered, setFiltered] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands]     = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [editId, setEditId]     = useState(null)
  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState('')
  const fileRef = useRef()

  const load = () => Promise.all([
    productService.getAll(), categoryService.getAll(), brandService.getAll()
  ]).then(([p, c, b]) => {
    setRows(p.data); setFiltered(p.data)
    setCategories(c.data); setBrands(b.data); setLoading(false)
  }).catch(() => setLoading(false))

  useEffect(() => { load() }, [])
  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(rows.filter(r => r.product_name?.toLowerCase().includes(q) || r.Category_name?.toLowerCase().includes(q)))
  }, [search, rows])

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setMsg(''); setModal(true) }
  const openEdit = (r) => { setForm({ product_name: r.product_name, description: r.description, category_id: r.category_id || '', brand_id: r.brand_id || '' }); setEditId(r.product_id); setMsg(''); setModal(true) }

  const handleSave = async () => {
    if (!form.product_name.trim()) return
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('product_name', form.product_name)
      fd.append('description',  form.description)
      fd.append('category_id',  form.category_id)
      fd.append('brand_id',     form.brand_id)
      fd.append('created_at',   new Date().toISOString().slice(0,19).replace('T',' '))
      if (fileRef.current?.files[0]) fd.append('logo', fileRef.current.files[0])
      if (editId) await productService.update(editId, fd)
      else        await productService.insert(fd)
      setMsg('Saved!'); load()
      setTimeout(() => { setModal(false); setMsg('') }, 800)
    } catch { setMsg('Error saving.') }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await productService.remove(id); load()
  }

  return (
    <AdminLayout title="Product Management">
      <div className="page-header">
        <h2>Products</h2>
        <div style={{ display:'flex', gap:10 }}>
          <div className="search-box">
            <i className="fa-solid fa-search" style={{ color:'var(--tl)', fontSize:13 }} />
            <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn-add" onClick={openAdd}><i className="fa-solid fa-plus" /> Add Product</button>
        </div>
      </div>

      <div className="card-wrap">
        <div className="card-head"><h3>All Products ({filtered.length})</h3></div>
        <div className="card-body">
          {loading ? <div className="loader" /> : (
            <table className="data-table">
              <thead><tr><th>#</th><th>Product</th><th>Category</th><th>Brand</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.product_id}>
                    <td style={{ color:'var(--tl)', fontSize:12 }}>{i+1}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        {r.image_url
                          ? <img src={IMAGE_BASE_URL + r.image_url} alt="" style={{ width:38, height:38, borderRadius:8, objectFit:'cover' }} />
                          : <div style={{ width:38, height:38, borderRadius:8, background:'var(--pale)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🍱</div>
                        }
                        <div>
                          <div style={{ fontWeight:600, fontSize:14 }}>{r.product_name}</div>
                          <div style={{ fontSize:11, color:'var(--tl)' }}>{r.description?.slice(0,40)}{r.description?.length > 40 ? '...' : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize:13 }}>{r.Category_name || '—'}</td>
                    <td style={{ fontSize:13 }}>{r.brand_name || '—'}</td>
                    <td>
                      <button className="btn-edit" onClick={() => openEdit(r)} style={{ marginRight:6 }}>Edit</button>
                      <button className="btn-del"  onClick={() => handleDelete(r.product_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={5}><div className="empty-state"><i className="fa-solid fa-bowl-food" />No products found</div></td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) setModal(false) }}>
          <div className="modal-box">
            <h4>{editId ? 'Edit Product' : 'Add Product'}</h4>
            {msg && <div className="alert-success">{msg}</div>}
            <label className="modal-label">Product Name *</label>
            <input className="modal-input" placeholder="Product name" value={form.product_name} onChange={e => setForm({...form, product_name: e.target.value})} />
            <label className="modal-label">Description</label>
            <input className="modal-input" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            <label className="modal-label">Category</label>
            <select className="modal-input" value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.Category_id} value={c.Category_id}>{c.Category_name}</option>)}
            </select>
            <label className="modal-label">Brand</label>
            <select className="modal-input" value={form.brand_id} onChange={e => setForm({...form, brand_id: e.target.value})}>
              <option value="">Select brand</option>
              {brands.map(b => <option key={b.Brand_id} value={b.Brand_id}>{b.Brand_name}</option>)}
            </select>
            <label className="modal-label">Product Image</label>
            <input type="file" className="modal-input" ref={fileRef} accept="image/*" />
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
