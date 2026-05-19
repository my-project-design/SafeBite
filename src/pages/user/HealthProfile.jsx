import { useState, useEffect } from 'react'
import UserLayout from '../../components/UserLayout'
import { useAuth } from '../../context/AuthContext'
import { userHealthProfileService, bmiCategoryService, healthItemService, userHealthItemService } from '../../services/services'

// ─── BMI helpers ─────────────────────────────────────────────────────────────
const bmiColor = (bmi) => {
  if (!bmi) return 'var(--tl)'
  if (bmi < 18.5) return '#3498db'
  if (bmi < 25)   return '#2e8b57'
  if (bmi < 30)   return '#e67e22'
  return '#e74c3c'
}

const bmiInfo = (bmi) => {
  if (!bmi) return { category: '—', description: '' }
  if (bmi < 18.5) return { category: 'Underweight',   description: 'You may need to gain weight. Focus on nutrient-rich foods.' }
  if (bmi < 25)   return { category: 'Normal Weight', description: 'Great! You have a healthy weight. Maintain your current lifestyle.' }
  if (bmi < 30)   return { category: 'Overweight',    description: 'Consider a balanced diet and regular exercise.' }
  return             { category: 'Obese',          description: 'Consult a healthcare professional for personalised guidance.' }
}

// ─── Reusable pill buttons ────────────────────────────────────────────────────
function PillButtons({ items, selectedList, onToggle, activeColor, emptyMsg }) {
  if (items.length === 0) return <p style={{ color: 'var(--tl)', fontSize: 13 }}>{emptyMsg}</p>
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      {items.map(item => {
        const active = selectedList.includes(item.health_item_id)
        return (
          <button
            key={item.health_item_id}
            onClick={() => onToggle(item.health_item_id)}
            style={{
              padding: '8px 16px', borderRadius: 20, border: '2px solid',
              fontFamily: 'Poppins', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              background:  active ? activeColor : '#fff',
              borderColor: active ? activeColor : '#ddd',
              color:       active ? '#fff' : 'var(--td)',
            }}>
            {active ? '✓ ' : ''}{item.health_item_name}
          </button>
        )
      })}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function HealthProfile() {
  const { user } = useAuth()
  const userId = user?.user_id || user?.id || user?.User_id

  const [profile,          setProfile]          = useState(null)
  const [bmiCats,          setBmiCats]          = useState([])
  const [healthItems,      setHealthItems]      = useState([])   // category_id 1
  const [allergyItems,     setAllergyItems]     = useState([])   // category_id 2
  const [dietaryItems,     setDietaryItems]     = useState([])   // category_id 3
  const [userItems,        setUserItems]        = useState([])   // selected condition ids
  const [userAllergyItems, setUserAllergyItems] = useState([])   // selected allergy ids
  const [userDietaryItems, setUserDietaryItems] = useState([])   // selected dietary ids
  const [loading,          setLoading]          = useState(true)
  const [saving,           setSaving]           = useState(false)
  const [msg,              setMsg]              = useState('')

  const [form, setForm] = useState({
    age: '', date_of_birth: '', gender: 'Male',
    height_cm: '', weight_kg: '', bmi: '', bmi_category_id: '',
  })

  // ── Load all data ───────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      userHealthProfileService.getAll(),
      bmiCategoryService.getAll(),
      healthItemService.getAll(),
      userHealthItemService.getAll(),
    ]).then(([p, b, hi, uhi]) => {
      const myProfile = p.data.find(x => x.user_id === userId)
      if (myProfile) {
        setProfile(myProfile)
        setForm({
          age:             myProfile.age || '',
          date_of_birth:   myProfile.date_of_birth?.slice(0, 10) || '',
          gender:          myProfile.gender || 'Male',
          height_cm:       myProfile.height_cm || '',
          weight_kg:       myProfile.weight_kg || '',
          bmi:             myProfile.bmi || '',
          bmi_category_id: myProfile.bmi_category_id || '',
        })
      }

      setBmiCats(b.data)

      const allItems = hi.data
      setHealthItems(allItems.filter(x => x.health_category_id === 1))
      setAllergyItems(allItems.filter(x => x.health_category_id === 2))
      setDietaryItems(allItems.filter(x => x.health_category_id === 3))

      const mySelections = uhi.data
        .filter(x => x.User_id === userId || x.user_id === userId)
        .map(x => x.health_item_id)

      const conditionIds = allItems.filter(x => x.health_category_id === 1).map(x => x.health_item_id)
      const allergyIds   = allItems.filter(x => x.health_category_id === 2).map(x => x.health_item_id)
      const dietaryIds   = allItems.filter(x => x.health_category_id === 3).map(x => x.health_item_id)

      setUserItems(mySelections.filter(id => conditionIds.includes(id)))
      setUserAllergyItems(mySelections.filter(id => allergyIds.includes(id)))
      setUserDietaryItems(mySelections.filter(id => dietaryIds.includes(id)))

      setLoading(false)
    }).catch(() => setLoading(false))
  }, [userId])

  // ── BMI calculation ─────────────────────────────────────────────────────────
  const calcBMI = () => {
    const h = Number(form.height_cm) / 100
    const w = Number(form.weight_kg)
    if (h > 0 && w > 0) {
      const bmi = (w / (h * h)).toFixed(1)
      const cat = bmiCats.find(c => Number(bmi) >= c.Min_bmi && Number(bmi) <= c.Max_bmi)
      setForm(f => ({ ...f, bmi, bmi_category_id: cat?.Bmi_category_id || '' }))
    }
  }

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    if (!form.age || form.age < 1 || form.age > 120)                    return 'Please enter a valid age (1–120).'
    if (!form.gender)                                                    return 'Please select your gender.'
    if (!form.height_cm || form.height_cm < 50 || form.height_cm > 300) return 'Please enter a valid height (50–300 cm).'
    if (!form.weight_kg || form.weight_kg < 20 || form.weight_kg > 300) return 'Please enter a valid weight (20–300 kg).'
    return null
  }

  // ── Save profile ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const err = validate()
    if (err) { setMsg(err); return }
    setSaving(true); setMsg('')
    try {
      const data = {
        user_id: userId, age: form.age, date_of_birth: form.date_of_birth,
        gender: form.gender, height_cm: form.height_cm, weight_kg: form.weight_kg,
        bmi: form.bmi, bmi_category_id: form.bmi_category_id,
      }
      if (profile) await userHealthProfileService.update(profile.profile_id, data)
      else         await userHealthProfileService.insert(data)
      setMsg('Health profile saved successfully! ✅')
      const r = await userHealthProfileService.getAll()
      setProfile(r.data.find(x => x.user_id === userId))
    } catch {
      setMsg('Error saving profile.')
    }
    setSaving(false)
  }

  // ── Reset ───────────────────────────────────────────────────────────────────
  const handleReset = () => {
    if (!window.confirm('Reset your health profile? All saved data will be cleared.')) return
    setForm({ age: '', date_of_birth: '', gender: 'Male', height_cm: '', weight_kg: '', bmi: '', bmi_category_id: '' })
    setUserItems([]); setUserAllergyItems([]); setUserDietaryItems([])
    setMsg('')
  }

  // ── Toggle any health item ──────────────────────────────────────────────────
  const toggleHealthItem = async (itemId, setterFn, currentList) => {
    if (currentList.includes(itemId)) {
      const all = await userHealthItemService.getAll()
      const rec = all.data.find(x => (x.User_id === userId || x.user_id === userId) && x.health_item_id === itemId)
      if (rec) {
        await userHealthItemService.remove(rec.user_health_item_id)
        setterFn(prev => prev.filter(x => x !== itemId))
      }
    } else {
      await userHealthItemService.insert({ user_id: userId, health_item_id: itemId })
      setterFn(prev => [...prev, itemId])
    }
  }

  // ── Derived values ──────────────────────────────────────────────────────────
  const bmiNum  = Number(form.bmi)
  const { category: bmiCatLabel, description: bmiDesc } = bmiInfo(bmiNum)
  const catName = bmiCats.find(c => c.Bmi_category_id == form.bmi_category_id)?.Category_name || bmiCatLabel

  const card         = { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: 0 }
  const sectionTitle = { color: 'var(--dg)', marginBottom: 6, fontSize: 16, fontWeight: 700, borderLeft: '4px solid var(--pg)', paddingLeft: 12 }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <UserLayout>

      {/* Page Header */}
      <div style={{ background: 'linear-gradient(135deg,var(--dg),var(--pg))', borderRadius: 20, padding: '28px 32px', marginBottom: 28, color: '#fff' }}>
        <h2 style={{ fontWeight: 800, fontSize: 26, margin: 0 }}>👤 Health Profile</h2>
        <p style={{ opacity: 0.85, marginTop: 6, marginBottom: 0 }}>Complete your health information for personalized food recommendations</p>
      </div>

      {loading ? <div className="loader" /> : (<>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
          {[
            { icon: '✅', label: 'Profile Status',    value: profile ? 'Complete & Active' : 'Incomplete',             color: profile ? '#2e8b57' : '#e74c3c', border: '#2196F3' },
            { icon: '⚖️', label: 'BMI',               value: form.bmi ? `${form.bmi} – ${catName}` : 'Not calculated', color: bmiColor(bmiNum),               border: '#FF9800' },
            { icon: '🏥', label: 'Health Conditions', value: `${userItems.length} tracked`,                            color: 'var(--td)',                     border: '#9C27B0' },
            { icon: '⚠️', label: 'Allergies',         value: `${userAllergyItems.length} tracked`,                     color: 'var(--td)',                     border: '#F44336' },
          ].map(s => (
            <div key={s.label} style={{ ...card, borderLeft: `4px solid ${s.border}`, textAlign: 'center', padding: '20px 16px' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--td)', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="row g-4">

          {/* LEFT — Basic Information */}
          <div className="col-md-6">
            <div style={card}>
              <h4 style={sectionTitle}>📋 Basic Information</h4>
              <p style={{ fontSize: 12, color: 'var(--tl)', marginBottom: 16 }}>Fill in your personal details</p>

              {msg && (
                <div className={msg.includes('Error') || msg.includes('Please') ? 'alert-error' : 'alert-success'} style={{ marginBottom: 14 }}>
                  {msg}
                </div>
              )}

              <div className="row g-2" style={{ marginBottom: 12 }}>
                <div className="col-6">
                  <label className="modal-label">Age <span style={{ color: '#e74c3c' }}>*</span></label>
                  <input className="modal-input" type="number" placeholder="25" min="1" max="120"
                    value={form.age} onChange={e => setForm({ ...form, age: e.target.value })}
                    style={{ borderColor: form.age && (form.age < 1 || form.age > 120) ? '#e74c3c' : undefined }} />
                  {form.age && (form.age < 1 || form.age > 120) && <small style={{ color: '#e74c3c' }}>Valid range: 1–120</small>}
                </div>
                <div className="col-6">
                  <label className="modal-label">Gender <span style={{ color: '#e74c3c' }}>*</span></label>
                  <select className="modal-input" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <label className="modal-label">Date of Birth</label>
              <input className="modal-input" type="date" value={form.date_of_birth}
                onChange={e => setForm({ ...form, date_of_birth: e.target.value })} style={{ marginBottom: 12 }} />

              <div className="row g-2" style={{ marginBottom: 12 }}>
                <div className="col-6">
                  <label className="modal-label">Height (cm) <span style={{ color: '#e74c3c' }}>*</span></label>
                  <input className="modal-input" type="number" placeholder="170" min="50" max="300"
                    value={form.height_cm} onChange={e => setForm({ ...form, height_cm: e.target.value })} onBlur={calcBMI}
                    style={{ borderColor: form.height_cm && (form.height_cm < 50 || form.height_cm > 300) ? '#e74c3c' : undefined }} />
                  {form.height_cm && (form.height_cm < 50 || form.height_cm > 300) && <small style={{ color: '#e74c3c' }}>Valid: 50–300 cm</small>}
                </div>
                <div className="col-6">
                  <label className="modal-label">Weight (kg) <span style={{ color: '#e74c3c' }}>*</span></label>
                  <input className="modal-input" type="number" placeholder="65" min="20" max="300"
                    value={form.weight_kg} onChange={e => setForm({ ...form, weight_kg: e.target.value })} onBlur={calcBMI}
                    style={{ borderColor: form.weight_kg && (form.weight_kg < 20 || form.weight_kg > 300) ? '#e74c3c' : undefined }} />
                  {form.weight_kg && (form.weight_kg < 20 || form.weight_kg > 300) && <small style={{ color: '#e74c3c' }}>Valid: 20–300 kg</small>}
                </div>
              </div>

              {form.bmi && (
                <div style={{ background: 'var(--pale)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                  <div style={{ textAlign: 'center', marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tl)', marginBottom: 4 }}>YOUR BMI</div>
                    <div style={{ fontSize: 40, fontWeight: 800, color: bmiColor(bmiNum), lineHeight: 1 }}>{form.bmi}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: bmiColor(bmiNum), marginTop: 4 }}>{catName}</div>
                    <div style={{ fontSize: 12, color: 'var(--tl)', marginTop: 4 }}>{bmiDesc}</div>
                  </div>
                  <div style={{ display: 'flex', height: 32, borderRadius: 16, overflow: 'hidden', marginTop: 10 }}>
                    {[
                      { label: '<18.5', bg: '#3498db' }, { label: '18.5–24.9', bg: '#2e8b57' },
                      { label: '25–29.9', bg: '#e67e22' }, { label: '≥30', bg: '#e74c3c' },
                    ].map(s => (
                      <div key={s.label} style={{ flex: 1, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 }}>
                        {s.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button className="btn-save" style={{ flex: 1, padding: 12 }} onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : profile ? '💾 Update Profile' : '💾 Save Profile'}
                </button>
                <button onClick={handleReset} style={{ padding: '12px 18px', borderRadius: 10, border: '2px solid var(--pg)', background: '#fff', color: 'var(--pg)', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins', fontSize: 13 }}>
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT — Health Conditions + Stats */}
          <div className="col-md-6">
            <div style={{ ...card, marginBottom: 20 }}>
              <h4 style={sectionTitle}>🏥 Health Conditions</h4>
              <p style={{ fontSize: 12, color: 'var(--tl)', marginBottom: 16 }}>Select all that apply to you</p>
              <PillButtons
                items={healthItems} selectedList={userItems}
                onToggle={id => toggleHealthItem(id, setUserItems, userItems)}
                activeColor="var(--pg)" emptyMsg="No health conditions available." />
            </div>

            {profile && (
              <div style={{ ...card, background: 'var(--pale)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--dg)', marginBottom: 10 }}>📊 Your Stats</div>
                {[
                  ['Height',              `${profile.height_cm} cm`],
                  ['Weight',              `${profile.weight_kg} kg`],
                  ['BMI',                 profile.bmi],
                  ['Category',            profile.Category_name || catName || '—'],
                  ['Conditions Selected', userItems.length],
                  ['Allergies Selected',  userAllergyItems.length],
                  ['Dietary Prefs',       userDietaryItems.length],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e8f0e8', fontSize: 13 }}>
                    <span style={{ color: 'var(--tl)' }}>{l}</span>
                    <span style={{ fontWeight: 600, color: 'var(--td)' }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Food Allergies — DB category_id 2 */}
          <div className="col-12">
            <div style={card}>
              <h4 style={sectionTitle}>⚠️ Food Allergies &amp; Sensitivities</h4>
              <p style={{ fontSize: 12, color: 'var(--tl)', marginBottom: 16 }}>Select all allergies and sensitivities that apply:</p>
              <PillButtons
                items={allergyItems} selectedList={userAllergyItems}
                onToggle={id => toggleHealthItem(id, setUserAllergyItems, userAllergyItems)}
                activeColor="#e74c3c" emptyMsg='No allergy items found. Add items with Health_category_id = 2 in the database.' />
            </div>
          </div>

          {/* Dietary Restrictions — DB category_id 3 */}
          <div className="col-12">
            <div style={card}>
              <h4 style={sectionTitle}>🥗 Dietary Restrictions &amp; Preferences</h4>
              <p style={{ fontSize: 12, color: 'var(--tl)', marginBottom: 16 }}>Select all that apply to your lifestyle:</p>
              <PillButtons
                items={dietaryItems} selectedList={userDietaryItems}
                onToggle={id => toggleHealthItem(id, setUserDietaryItems, userDietaryItems)}
                activeColor="#2196F3" emptyMsg='No dietary items found. Add items with Health_category_id = 3 in the database.' />
            </div>
          </div>

          {/* Bottom Save + Reset */}
          <div className="col-12" style={{ textAlign: 'center', paddingBottom: 8 }}>
            <button className="btn-save" style={{ padding: '12px 40px', marginRight: 12 }} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : '💾 Save Profile & Get Recommendations'}
            </button>
            <button onClick={handleReset} style={{ padding: '12px 32px', borderRadius: 10, border: '2px solid var(--pg)', background: '#fff', color: 'var(--pg)', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins', fontSize: 14 }}>
              🔄 Reset
            </button>
          </div>

        </div>
      </>)}
    </UserLayout>
  )
}