import { useState, useEffect } from 'react'
import UserLayout from '../../components/UserLayout'
import { useAuth } from '../../context/AuthContext'
import {
  productService, categoryService, nutritionService,
  userFavouritesService, productRatingService,
  healthItemService, userHealthItemService, alternativeService
} from '../../services/services'
import { IMAGE_BASE_URL } from '../../services/api'

// ─── Map health_item_name → condition key ─────────────────────────────────────
const mapItemNameToKey = (name = '') => {
  const n = name.toLowerCase()
  if (n.includes('diabetes'))                                      return 'diabetes'
  if (n.includes('blood pressure') || n.includes('hypertension')) return 'hypertension'
  if (n.includes('heart'))                                         return 'heartDisease'
  if (n.includes('cholesterol'))                                   return 'cholesterol'
  if (n.includes('obes'))                                          return 'obesity'
  if (n.includes('kidney'))                                        return 'kidney'
  if (n.includes('thyroid'))                                       return 'thyroid'
  return null
}

// ─── Health analysis using actual DB columns ──────────────────────────────────
const analyzeHealth = (nutri, conditions = []) => {
  const concerns = []
  if (!nutri) return {
    safe: true,
    concerns: [{ title: '✓ No nutrition data available', msg: 'We could not find detailed nutrition info for this product.', severity: 'low' }]
  }

  const carbs   = parseFloat(nutri.carbs    || 0)
  const fat     = parseFloat(nutri.fat      || 0)
  const cal     = parseFloat(nutri.calories || 0)
  const protein = parseFloat(nutri.protein  || 0)
  const fiber   = parseFloat(nutri.fiber    || 0)

  if (conditions.includes('diabetes') && carbs > 20)
    concerns.push({ title: '❌ High Carbs — Caution for Diabetes', msg: `Contains ${carbs}g carbs per 100g. High-carb foods can spike blood sugar levels.`, severity: 'high' })
  if (conditions.includes('hypertension') && fat > 15)
    concerns.push({ title: '⚠️ High Fat — Monitor for Blood Pressure', msg: `Contains ${fat}g fat per 100g. High-fat processed foods often contain hidden sodium.`, severity: 'medium' })
  if (conditions.includes('heartDisease') && fat > 20)
    concerns.push({ title: '❌ High Fat — Unsafe for Heart Disease', msg: `Contains ${fat}g fat per 100g. Limit saturated and trans fat for cardiovascular health.`, severity: 'high' })
  if (conditions.includes('obesity') && cal > 400)
    concerns.push({ title: '⚠️ High Calories — Caution for Obesity', msg: `Contains ${cal} kcal per 100g. High-calorie foods should be limited for weight management.`, severity: 'medium' })
  if (conditions.includes('cholesterol') && fat > 15)
    concerns.push({ title: '⚠️ High Fat — May Raise Cholesterol', msg: `Contains ${fat}g fat per 100g. High fat content may raise LDL cholesterol levels.`, severity: 'medium' })
  if (fiber > 3)
    concerns.push({ title: '✅ Good Fiber Content', msg: `Contains ${fiber}g fiber per 100g. High fiber aids digestion and blood sugar control.`, severity: 'positive' })
  if (protein > 10)
    concerns.push({ title: '✅ Good Protein Source', msg: `Contains ${protein}g protein per 100g. Protein supports muscle health and satiety.`, severity: 'positive' })
  if (concerns.length === 0)
    concerns.push({ title: '✅ Generally Safe For You', msg: "Based on your health profile, this product doesn't pose specific risks. Consume in moderation.", severity: 'low' })

  return { safe: !concerns.some(c => c.severity === 'high'), concerns }
}

// ─── Nutrition bar visual ─────────────────────────────────────────────────────
const NutrBar = ({ label, value, unit, max, color, icon }) => {
  const pct = Math.min((parseFloat(value || 0) / max) * 100, 100)
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 5 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{icon} {label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color }}>{value ?? '—'}<span style={{ fontSize:10, fontWeight:500, color:'#9ca3af', marginLeft:2 }}>{unit}</span></span>
      </div>
      <div style={{ background: '#f3f4f6', borderRadius: 99, height: 8, overflow:'hidden' }}>
        <div style={{ width:`${pct}%`, height:'100%', borderRadius:99, background:color, transition:'width 0.6s ease' }} />
      </div>
    </div>
  )
}

// ─── Star rating ──────────────────────────────────────────────────────────────
function Stars({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div style={{ display:'flex', gap:2, marginBottom:12, alignItems:'center' }}>
      {[1,2,3,4,5].map(n => (
        <button key={n} onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}
          style={{ background:'none', border:'none', fontSize:32, cursor:'pointer', padding:'0 3px', lineHeight:1,
            color: n <= (hovered || value) ? '#f39c12' : '#ddd',
            transition:'color 0.15s, transform 0.1s',
            transform: n <= (hovered || value) ? 'scale(1.15)' : 'scale(1)' }}>★</button>
      ))}
      {value > 0 && <span style={{ fontSize:13, color:'var(--tl)', marginLeft:8, fontWeight:600 }}>{value} / 5</span>}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getCategoryEmoji = (id) =>
  ({ 1:'🩺', 2:'💪', 3:'🫀', 4:'🩸', 5:'🌿', 6:'🥗', 7:'🌾' }[id] || '🍽️')

// Split a DB string (comma or newline separated) into array
const parseList = (str = '') =>
  str.split(/[\n,]/).map(s => s.trim()).filter(Boolean)

// Split instruction text into steps
const parseSteps = (str = '') =>
  str.split(/\n+/).map(s => s.replace(/^\d+[\.\)]\s*/, '').trim()).filter(Boolean)

// ─── Main component ───────────────────────────────────────────────────────────
export default function SearchFood() {
  const { user } = useAuth()
  const userId = user?.user_id || user?.id || user?.User_id

  const [products,     setProducts]     = useState([])
  const [categories,   setCategories]   = useState([])
  const [nutrition,    setNutrition]    = useState([])
  const [favourites,   setFavourites]   = useState([])
  const [alternatives, setAlternatives] = useState([])  // ← from DB
  const [search,       setSearch]       = useState('')
  const [selCat,       setSelCat]       = useState('')
  const [selected,     setSelected]     = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [rating,       setRating]       = useState(0)
  const [review,       setReview]       = useState('')
  const [ratingMsg,    setRatingMsg]    = useState('')
  const [submitting,   setSubmitting]   = useState(false)
  const [activeAltTab, setActiveAltTab] = useState(0)
  const [conditions,   setConditions]   = useState([])

  useEffect(() => {
    Promise.all([
      productService.getAll(),
      categoryService.getAll(),
      nutritionService.getAll(),
      userFavouritesService.getAll(),
      healthItemService.getAll(),
      userHealthItemService.getAll(),
      alternativeService.getAll(),        // ← fetch alternative table
    ]).then(([p, c, n, f, hi, uhi, alt]) => {
      setProducts(p.data)
      setCategories(c.data)
      setNutrition(n.data)
      setAlternatives(alt.data)
      setFavourites(f.data.filter(x => x.User_id === userId).map(x => x.product_id))

      const myItemIds = uhi.data
        .filter(x => x.User_id === userId || x.user_id === userId)
        .map(x => x.health_item_id)

      const mappedConditions = myItemIds
        .map(id => {
          const item = hi.data.find(i => i.health_item_id === id)
          return item ? mapItemNameToKey(item.health_item_name) : null
        })
        .filter(Boolean)

      setConditions(mappedConditions)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [userId])

  const filtered = products.filter(p => {
    const matchSearch = p.product_name?.toLowerCase().includes(search.toLowerCase())
    const matchCat    = !selCat || p.Category_name === selCat
    return matchSearch && matchCat
  })

  const getNutrition   = (pid) => nutrition.find(n => n.product_id === pid)
  const getAlternatives = (pid) => alternatives.filter(a => a.product_id === pid)

  const toggleFav = async (pid) => {
    if (!userId) return
    if (favourites.includes(pid)) {
      const favs = await userFavouritesService.getAll()
      const fav  = favs.data.find(f => f.User_id === userId && f.product_id === pid)
      if (fav) { await userFavouritesService.remove(fav.favourite_id); setFavourites(prev => prev.filter(x => x !== pid)) }
    } else {
      await userFavouritesService.insert({ user_id: userId, product_id: pid })
      setFavourites(prev => [...prev, pid])
    }
  }

  const openProduct = (p) => {
    setSelected(p); setRatingMsg(''); setRating(0); setReview(''); setActiveAltTab(0)
  }

  const submitRating = async () => {
    if (!rating)   { setRatingMsg('⚠️ Please select a star rating first.'); return }
    if (!userId)   { setRatingMsg('⚠️ Please log in to submit a rating.'); return }
    if (!selected) return
    setSubmitting(true); setRatingMsg('')
    try {
      await productRatingService.insert({
        rating_id: null, user_id: userId,
        product_id: selected.product_id,
        rating, review: review.trim() || '',
      })
      setRatingMsg('✅ Rating submitted successfully! Thank you.')
      setRating(0); setReview('')
    } catch (err) {
      console.error('Rating error:', err)
      setRatingMsg('❌ Error submitting rating. Please try again.')
    }
    setSubmitting(false)
  }

  const nutri    = selected ? getNutrition(selected.product_id)    : null
  const analysis = selected ? analyzeHealth(nutri, conditions)     : null
  const prodAlts = selected ? getAlternatives(selected.product_id) : []

  const card = { background:'#fff', borderRadius:16, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,0.07)', marginBottom:16 }
  const severityColor = s => ({ high:'#e74c3c', medium:'#e67e22', positive:'#10b981' }[s] || '#2e8b57')
  const severityBg    = s => ({ high:'#fff5f5', medium:'#fffbeb', positive:'#f0fdf4' }[s] || '#f0fdf4')

  return (
    <UserLayout>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }`}</style>

      {/* ── Search Header ── */}
      <div style={{ background:'linear-gradient(135deg,var(--dg),var(--pg))', borderRadius:20, padding:'32px', marginBottom:28, textAlign:'center', color:'#fff' }}>
        <h2 style={{ fontWeight:800, fontSize:28, marginBottom:8 }}>🔍 Search Food</h2>
        <p style={{ opacity:0.85, marginBottom:20 }}>Find products and check their nutritional info & safety</p>
        <div style={{ display:'flex', gap:10, maxWidth:600, margin:'0 auto' }}>
          <input
            style={{ flex:1, padding:'12px 18px', border:'none', borderRadius:10, fontFamily:'Poppins', fontSize:14, outline:'none' }}
            placeholder="Search food products..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
          <select
            style={{ padding:'12px 16px', border:'none', borderRadius:10, fontFamily:'Poppins', fontSize:14, outline:'none', background:'rgba(255,255,255,0.9)' }}
            value={selCat} onChange={e => setSelCat(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.Category_id} value={c.Category_name}>{c.Category_name}</option>)}
          </select>
        </div>
        <div style={{ marginTop:14, display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
          {['Coca-Cola','Lays','Maggi','Oreo','Pepsi'].map(s => (
            <span key={s} onClick={() => setSearch(s)}
              style={{ background:'rgba(255,255,255,0.2)', padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', color:'#fff' }}>{s}</span>
          ))}
        </div>
        {conditions.length > 0 && (
          <div style={{ marginTop:14, display:'flex', gap:6, flexWrap:'wrap', justifyContent:'center' }}>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.7)', alignSelf:'center' }}>Personalised for:</span>
            {conditions.map(c => (
              <span key={c} style={{ background:'rgba(255,255,255,0.25)', padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:600, color:'#fff' }}>{c}</span>
            ))}
          </div>
        )}
      </div>

      {loading ? <div className="loader" /> : (
        <>
          <p style={{ color:'var(--tl)', fontSize:13, marginBottom:16 }}>{filtered.length} products found</p>
          <div className="row g-3">
            {filtered.map(p => {
              const n            = getNutrition(p.product_id)
              const cardAnalysis = analyzeHealth(n, conditions)
              const altCount     = getAlternatives(p.product_id).length
              return (
                <div className="col-6 col-md-3" key={p.product_id}>
                  <div className="food-card" style={{ cursor:'pointer' }} onClick={() => openProduct(p)}>
                    <div style={{ position:'relative' }}>
                      {p.image_url
                        ? <img src={IMAGE_BASE_URL + p.image_url} alt="" style={{ width:'100%', height:140, objectFit:'cover' }} />
                        : <div style={{ height:140, background:'var(--pale)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40 }}>🍱</div>
                      }
                      <button onClick={e => { e.stopPropagation(); toggleFav(p.product_id) }}
                        style={{ position:'absolute', top:8, right:8, background:'rgba(255,255,255,0.9)', border:'none', borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {favourites.includes(p.product_id) ? '❤️' : '🤍'}
                      </button>
                      {conditions.length > 0 && (
                        <div style={{
                          position:'absolute', top:8, left:8,
                          background: cardAnalysis.safe ? 'rgba(16,185,129,0.92)' : 'rgba(239,68,68,0.92)',
                          color:'#fff', borderRadius:20, padding:'3px 9px', fontSize:10, fontWeight:700,
                        }}>
                          {cardAnalysis.safe ? '✓ Safe' : '⚠️ Caution'}
                        </div>
                      )}
                    </div>
                    <div className="food-card-body">
                      <h5>{p.product_name}</h5>
                      <p>{p.Category_name || 'Uncategorized'}</p>
                      {n ? (
                        <div style={{ marginTop:6, display:'flex', gap:6, flexWrap:'wrap' }}>
                          <span style={{ fontSize:10, fontWeight:700, background:'#fff1f2', color:'#ef4444', borderRadius:20, padding:'2px 8px' }}>🔥 {n.calories} kcal</span>
                          {n.protein != null && <span style={{ fontSize:10, fontWeight:700, background:'#eff6ff', color:'#3b82f6', borderRadius:20, padding:'2px 8px' }}>💪 {n.protein}g</span>}
                          {n.carbs   != null && <span style={{ fontSize:10, fontWeight:700, background:'#fffbeb', color:'#f59e0b', borderRadius:20, padding:'2px 8px' }}>🌾 {n.carbs}g</span>}
                        </div>
                      ) : (
                        <div style={{ marginTop:6, fontSize:10, color:'#9ca3af' }}>No nutrition data</div>
                      )}
                      {altCount > 0 && (
                        <div style={{ marginTop:6, fontSize:10, fontWeight:700, color:'#059669', background:'#d1fae5', borderRadius:20, padding:'2px 8px', display:'inline-block' }}>
                          🔄 {altCount} healthier alternative{altCount > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && <div className="empty-state col-12"><i className="bi bi-search" /> No products found</div>}
          </div>
        </>
      )}

      {/* ── PRODUCT DETAIL MODAL ── */}
      {selected && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}>
          <div className="modal-box" style={{ maxWidth:700, maxHeight:'90vh', overflowY:'auto', padding:28 }}>
            <button className="close-btn" onClick={() => setSelected(null)}>×</button>

            {/* Product Header */}
            <div style={{ display:'flex', gap:16, marginBottom:20 }}>
              {selected.image_url
                ? <img src={IMAGE_BASE_URL + selected.image_url} alt="" style={{ width:90, height:90, borderRadius:12, objectFit:'cover', flexShrink:0 }} />
                : <div style={{ width:90, height:90, borderRadius:12, background:'var(--pale)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, flexShrink:0 }}>🍱</div>
              }
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
                  <h4 style={{ margin:'0 0 6px', fontSize:18, color:'var(--dg)' }}>{selected.product_name}</h4>
                  {analysis && (
                    <span style={{ padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:700, whiteSpace:'nowrap',
                      background: analysis.safe ? '#e8f5e9' : '#fdecea',
                      color:      analysis.safe ? '#2e7d32' : '#c62828' }}>
                      {analysis.safe ? '✓ Safe For You' : '⚠️ Use With Caution'}
                    </span>
                  )}
                </div>
                <span className="badge-green">{selected.Category_name}</span>
                <p style={{ marginTop:8, fontSize:13, color:'var(--tl)', lineHeight:1.6 }}>{selected.description}</p>
              </div>
            </div>

            {/* ── NUTRITION FACTS ── */}
            {nutri ? (
              <div style={card}>
                <div style={{ fontWeight:700, color:'var(--dg)', marginBottom:16, fontSize:14 }}>
                  📊 Nutrition Facts
                  <span style={{ fontSize:11, fontWeight:500, color:'#9ca3af', marginLeft:8 }}>per 100g serving</span>
                </div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:18 }}>
                  {[
                    { icon:'🔥', label:'Calories', val:nutri.calories, unit:'kcal', bg:'#fff1f2', col:'#ef4444' },
                    { icon:'💪', label:'Protein',  val:nutri.protein,  unit:'g',    bg:'#eff6ff', col:'#3b82f6' },
                    { icon:'🌾', label:'Carbs',    val:nutri.carbs,    unit:'g',    bg:'#fffbeb', col:'#f59e0b' },
                    { icon:'🧈', label:'Fat',      val:nutri.fat,      unit:'g',    bg:'#f5f3ff', col:'#8b5cf6' },
                    { icon:'🌿', label:'Fiber',    val:nutri.fiber,    unit:'g',    bg:'#f0fdf4', col:'#10b981' },
                  ].map(x => x.val != null && (
                    <div key={x.label} style={{ background:x.bg, borderRadius:12, padding:'10px 14px', textAlign:'center', minWidth:70, flex:1, border:`1px solid ${x.col}20` }}>
                      <div style={{ fontSize:18, marginBottom:2 }}>{x.icon}</div>
                      <div style={{ fontSize:16, fontWeight:800, color:x.col }}>{x.val}</div>
                      <div style={{ fontSize:9, color:'#9ca3af', fontWeight:600 }}>{x.unit}</div>
                      <div style={{ fontSize:9, color:'#6b7280', fontWeight:600 }}>{x.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:'#f9fafb', borderRadius:12, padding:'14px 16px' }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#9ca3af', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:12 }}>Nutrient Breakdown</div>
                  <NutrBar icon="🔥" label="Calories" value={nutri.calories} unit="kcal" max={600}  color="#ef4444" />
                  <NutrBar icon="💪" label="Protein"  value={nutri.protein}  unit="g"    max={50}   color="#3b82f6" />
                  <NutrBar icon="🌾" label="Carbs"    value={nutri.carbs}    unit="g"    max={100}  color="#f59e0b" />
                  <NutrBar icon="🧈" label="Fat"      value={nutri.fat}      unit="g"    max={50}   color="#8b5cf6" />
                  <NutrBar icon="🌿" label="Fiber"    value={nutri.fiber}    unit="g"    max={15}   color="#10b981" />
                </div>
              </div>
            ) : (
              <div style={{ ...card, textAlign:'center', color:'#9ca3af', fontSize:13 }}>📭 No nutrition data available for this product.</div>
            )}

            {/* ── HEALTH IMPACT ── */}
            {analysis && (
              <div style={{ ...card, background: analysis.safe ? '#f0faf0' : '#fff5f5', border:`1px solid ${analysis.safe ? '#c8e6c9' : '#ffcdd2'}` }}>
                <div style={{ fontWeight:700, fontSize:14, color: analysis.safe ? '#2e7d32' : '#c62828', marginBottom:12 }}>
                  {analysis.safe ? '✅ Health Impact Analysis' : '⚠️ Health Concerns For You'}
                </div>
                {analysis.concerns.map((c, i) => (
                  <div key={i} style={{ background:severityBg(c.severity), borderRadius:10, padding:'12px 14px', marginBottom:8, borderLeft:`4px solid ${severityColor(c.severity)}` }}>
                    <div style={{ fontWeight:700, fontSize:13, color:'var(--dg)', marginBottom:4 }}>{c.title}</div>
                    <div style={{ fontSize:12, color:'var(--tl)' }}>{c.msg}</div>
                  </div>
                ))}
                {nutri && (
                  <div style={{ marginTop:10, padding:'10px 12px', background:'rgba(255,255,255,0.7)', borderRadius:10, fontSize:11, color:'#6b7280' }}>
                    📋 Analysis based on: {nutri.calories} kcal · {nutri.protein}g protein · {nutri.carbs}g carbs · {nutri.fat}g fat · {nutri.fiber}g fiber per 100g
                  </div>
                )}
              </div>
            )}

            {/* ── DYNAMIC ALTERNATIVES & RECIPES FROM DB ── */}
            <div style={card}>
              <div style={{ fontWeight:700, color:'var(--dg)', marginBottom:4, fontSize:14 }}>🔄 Healthier Alternatives & Recipes</div>

              {prodAlts.length === 0 ? (
                <div style={{ textAlign:'center', color:'#9ca3af', fontSize:13, padding:'20px 0' }}>
                  No alternatives found for this product yet.
                </div>
              ) : (
                <>
                  <p style={{ fontSize:12, color:'var(--tl)', marginBottom:16 }}>
                    {prodAlts.length} healthier alternative{prodAlts.length > 1 ? 's' : ''} available
                  </p>

                  {/* Tab pills */}
                  {prodAlts.length > 1 && (
                    <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
                      {prodAlts.map((a, i) => (
                        <button key={a.alternative_id} onClick={() => setActiveAltTab(i)}
                          style={{
                            padding:'8px 14px', borderRadius:20, border:'2px solid',
                            fontFamily:'Poppins', fontSize:12, fontWeight:600, cursor:'pointer',
                            background:  activeAltTab === i ? 'var(--pg)' : '#fff',
                            borderColor: activeAltTab === i ? 'var(--pg)' : '#e2e8f0',
                            color:       activeAltTab === i ? '#fff' : 'var(--td)',
                            transition: 'all 0.2s',
                          }}>
                          {getCategoryEmoji(a.health_category_id)} {a.recipe_name}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Active alternative detail */}
                  {prodAlts[activeAltTab] && (() => {
                    const alt         = prodAlts[activeAltTab]
                    const ingredients = parseList(alt.ingredients  || '')
                    const steps       = parseSteps(alt.instruction || '')
                    const reasons     = parseList(alt.reason       || '')

                    return (
                      <div style={{ animation:'fadeIn 0.25s ease' }}>

                        {/* Alt header card */}
                        <div style={{
                          display:'flex', alignItems:'flex-start', gap:14,
                          background:'linear-gradient(135deg,#f0fdf4,#dcfce7)',
                          border:'1.5px solid #86efac', borderRadius:14,
                          padding:'16px 18px', marginBottom:16,
                        }}>
                          <span style={{ fontSize:40, flexShrink:0 }}>{getCategoryEmoji(alt.health_category_id)}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:800, fontSize:16, color:'#14532d', marginBottom:6 }}>{alt.recipe_name}</div>
                            {/* Reason badges from DB */}
                            {reasons.length > 0 && (
                              <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
                                {reasons.map((r, i) => (
                                  <span key={i} style={{ background:'#059669', color:'#fff', borderRadius:20, padding:'3px 10px', fontSize:10, fontWeight:700 }}>{r}</span>
                                ))}
                              </div>
                            )}
                            {/* Calorie badge from DB */}
                            {alt.calories != null && (
                              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.75)', borderRadius:20, padding:'4px 12px', fontSize:12, fontWeight:700, color:'#15803d' }}>
                                🔥 {alt.calories} kcal per serving
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Ingredients + Steps */}
                        <div className="row g-3" style={{ marginBottom:14 }}>
                          {ingredients.length > 0 && (
                            <div className="col-md-5">
                              <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:12, padding:14, height:'100%' }}>
                                <div style={{ fontWeight:700, fontSize:13, color:'#92400e', marginBottom:10 }}>🛒 Ingredients</div>
                                <ul style={{ paddingLeft:18, margin:0 }}>
                                  {ingredients.map((ing, i) => (
                                    <li key={i} style={{ fontSize:12, color:'#78350f', marginBottom:5, lineHeight:1.5 }}>{ing}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {steps.length > 0 && (
                            <div className={ingredients.length > 0 ? 'col-md-7' : 'col-12'}>
                              <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, padding:14, height:'100%' }}>
                                <div style={{ fontWeight:700, fontSize:13, color:'#1e40af', marginBottom:10 }}>👨‍🍳 How to Make</div>
                                <ol style={{ paddingLeft:18, margin:0 }}>
                                  {steps.map((step, i) => (
                                    <li key={i} style={{ fontSize:12, color:'#1e3a8a', marginBottom:6, lineHeight:1.6 }}>{step}</li>
                                  ))}
                                </ol>
                              </div>
                            </div>
                          )}

                          {/* Fallback: raw instruction if steps not parseable */}
                          {steps.length === 0 && alt.instruction && (
                            <div className="col-12">
                              <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, padding:14 }}>
                                <div style={{ fontWeight:700, fontSize:13, color:'#1e40af', marginBottom:8 }}>👨‍🍳 Instructions</div>
                                <p style={{ fontSize:12, color:'#1e3a8a', margin:0, lineHeight:1.7 }}>{alt.instruction}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Health note */}
                        {reasons.length > 0 && (
                          <div style={{ background:'#e8f5e9', borderLeft:'4px solid var(--pg)', borderRadius:'0 8px 8px 0', padding:'10px 14px', fontSize:12, color:'#14532d', fontWeight:500 }}>
                            ✅ Why it's better: {reasons.join(' · ')}
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </>
              )}
            </div>

            {/* ── RATE THIS PRODUCT ── */}
            <div style={{ ...card, marginBottom:0 }}>
              <div style={{ fontWeight:700, color:'var(--dg)', marginBottom:6, fontSize:14 }}>⭐ Rate This Product</div>
              <p style={{ fontSize:12, color:'var(--tl)', marginBottom:12 }}>Your review will appear on the Trending page</p>
              {ratingMsg && (
                <div style={{ marginBottom:12, padding:'10px 14px', borderRadius:8, fontSize:13, fontWeight:600,
                  background: ratingMsg.startsWith('✅') ? '#e8f5e9' : '#fdecea',
                  color:      ratingMsg.startsWith('✅') ? '#2e7d32' : '#c62828',
                  border:    `1px solid ${ratingMsg.startsWith('✅') ? '#c8e6c9' : '#ffcdd2'}` }}>
                  {ratingMsg}
                </div>
              )}
              <Stars value={rating} onChange={setRating} />
              <textarea className="modal-input" placeholder="Write your review here... (optional)"
                value={review} onChange={e => setReview(e.target.value)}
                rows={3} style={{ resize:'vertical', minHeight:80, fontFamily:'Poppins', fontSize:13 }} />
              <button className="btn-save" style={{ width:'100%', marginTop:10, opacity: submitting ? 0.7 : 1 }}
                onClick={submitRating} disabled={submitting}>
                {submitting ? 'Submitting…' : '⭐ Submit Rating'}
              </button>
            </div>

          </div>
        </div>
      )}
    </UserLayout>
  )
}