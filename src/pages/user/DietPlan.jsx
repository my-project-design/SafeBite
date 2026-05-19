import { useState, useEffect } from 'react'
import UserLayout from '../../components/UserLayout'
import { useAuth } from '../../context/AuthContext'
import {
  mealService, mealNutritionService, userHealthProfileService,
  userMealLogService, userHealthItemService, healthItemService,
  mealHealthRuleService,
} from '../../services/services'

const calcCalorieTarget = (bmi, conditions) => {
  let base = 2000
  if (bmi < 18.5)     base = 2500
  else if (bmi >= 30) base = 1600
  else if (bmi >= 25) base = 1800
  if (conditions.includes('diabetes')) base -= 200
  return base
}

const buildTips = (bmi, conditions) => {
  const tips = []
  if (bmi < 18.5) {
    tips.push({ icon: '🥜', text: 'Include calorie-dense foods like nuts, dried fruits, and healthy oils.' })
    tips.push({ icon: '🍽️', text: 'Eat frequent small meals throughout the day to increase calorie intake.' })
  } else if (bmi >= 25) {
    tips.push({ icon: '⚖️', text: 'Practice portion control and use smaller plates to manage serving sizes.' })
    tips.push({ icon: '🏃', text: 'Increase physical activity to at least 150 minutes per week.' })
  }
  if (conditions.includes('diabetes')) {
    tips.push({ icon: '🩸', text: 'Monitor blood sugar levels regularly and eat at consistent times each day.' })
    tips.push({ icon: '🌾', text: 'Choose low glycemic index foods like whole grains, legumes, and non-starchy vegetables.' })
  }
  if (conditions.includes('hypertension')) {
    tips.push({ icon: '🧂', text: 'Limit sodium intake to less than 2,300mg per day. Avoid processed foods.' })
    tips.push({ icon: '🍌', text: 'Include potassium-rich foods like bananas, sweet potatoes, and spinach.' })
  }
  if (conditions.includes('cholesterol')) {
    tips.push({ icon: '🫀', text: 'Reduce saturated fats and eliminate trans fats from your diet.' })
    tips.push({ icon: '🥣', text: 'Eat more soluble fiber from oats, beans, and fruits to lower cholesterol.' })
  }
  tips.push({ icon: '💧', text: 'Drink at least 8-10 glasses of water daily to stay hydrated.' })
  tips.push({ icon: '😴', text: 'Get 7-9 hours of quality sleep each night for optimal health.' })
  tips.push({ icon: '🧘', text: 'Practice mindful eating — chew slowly and avoid distractions during meals.' })
  return tips
}

const MEAL_CONFIG = {
  breakfast: { icon: '🌅', label: 'Breakfast', color: '#f59e0b', dark: '#92400e', soft: '#fffbeb', border: '#fde68a' },
  lunch:     { icon: '☀️', label: 'Lunch',     color: '#10b981', dark: '#065f46', soft: '#ecfdf5', border: '#6ee7b7' },
  dinner:    { icon: '🌙', label: 'Dinner',    color: '#6366f1', dark: '#312e81', soft: '#eef2ff', border: '#a5b4fc' },
  snack:     { icon: '🍎', label: 'Snack',     color: '#ec4899', dark: '#831843', soft: '#fdf2f8', border: '#f9a8d4' },
  dessert:   { icon: '🍮', label: 'Dessert',   color: '#f97316', dark: '#7c2d12', soft: '#fff7ed', border: '#fdba74' },
}
const getCfg = (t = '') =>
  MEAL_CONFIG[t.toLowerCase()] || { icon: '🍽️', label: t, color: '#64748b', dark: '#1e293b', soft: '#f8fafc', border: '#e2e8f0' }

const mapItemNameToKey = (name = '') => {
  const n = name.toLowerCase()
  if (n.includes('diabetes'))                                      return 'diabetes'
  if (n.includes('blood pressure') || n.includes('hypertension')) return 'hypertension'
  if (n.includes('heart'))                                         return 'heartDisease'
  if (n.includes('cholesterol'))                                   return 'cholesterol'
  if (n.includes('obes'))                                          return 'obesity'
  return null
}

const bmiLabel = b => !b ? '—' : b < 18.5 ? 'Underweight' : b < 25 ? 'Normal' : b < 30 ? 'Overweight' : 'Obese'
const bmiColor = b => !b ? '#94a3b8' : b < 18.5 ? '#3b82f6' : b < 25 ? '#10b981' : b < 30 ? '#f59e0b' : '#ef4444'

const NutrPill = ({ icon, val, label, color, bg }) => (
  val != null ? (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: bg, border: `1px solid ${color}30`,
      borderRadius: 99, padding: '4px 11px',
      fontSize: 11, fontWeight: 600,
    }}>
      <span>{icon}</span>
      <span style={{ fontWeight: 800, color }}>{val}g</span>
      <span style={{ color: '#94a3b8' }}>{label}</span>
    </div>
  ) : null
)

export default function DietPlan() {
  const { user } = useAuth()
  const userId = user?.user_id || user?.id || user?.User_id

  const [meals,           setMeals]           = useState([])
  const [nutrition,       setNutrition]       = useState([])
  const [profile,         setProfile]         = useState(null)
  const [mealLogs,        setMealLogs]        = useState([])
  const [conditions,      setConditions]      = useState([])
  const [condNames,       setCondNames]       = useState([])
  const [allergyCount,    setAllergyCount]    = useState(0)
  const [loading,         setLoading]         = useState(true)
  const [logModal,        setLogModal]        = useState(false)
  const [selMeal,         setSelMeal]         = useState(null)
  const [logForm,         setLogForm]         = useState({ meal_type: 'breakfast', quantity: 1, log_date: new Date().toISOString().slice(0,10) })
  const [msg,             setMsg]             = useState('')
  const [filter,          setFilter]          = useState('all')
  const [activeTab,       setActiveTab]       = useState('plan')
  const [showBlocked,     setShowBlocked]     = useState(false)
  const [healthRules,     setHealthRules]     = useState([])
  const [myHealthItemIds, setMyHealthItemIds] = useState([])

  useEffect(() => {
    Promise.all([
      mealService.getAll(), mealNutritionService.getAll(),
      userHealthProfileService.getAll(), userMealLogService.getAll(),
      userHealthItemService.getAll(), healthItemService.getAll(),
      mealHealthRuleService.getAll(),
    ]).then(([m, n, p, l, uhi, hi, rules]) => {
      setMeals(m.data); setNutrition(n.data); setHealthRules(rules.data)
      const myProfile = p.data.find(x => x.user_id === userId)
      setProfile(myProfile)
      setMealLogs(l.data.filter(x => x.user_id === userId || x.User_id === userId))
      const ids = uhi.data.filter(x => x.User_id === userId || x.user_id === userId).map(x => x.health_item_id)
      setMyHealthItemIds(ids)
      const myItems = ids.map(id => hi.data.find(i => i.health_item_id === id)).filter(Boolean)
      const conds = myItems.filter(i => i.health_category_id === 1)
      setConditions(conds.map(i => mapItemNameToKey(i.health_item_name)).filter(Boolean))
      setCondNames(conds.map(i => i.health_item_name))
      setAllergyCount(myItems.filter(i => i.health_category_id === 2).length)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [userId])

  const getNutrition  = mid => nutrition.find(n => n.meal_id === mid)
  const getMealSafety = mealId => {
    const rules = healthRules.filter(r => r.meal_id === mealId && myHealthItemIds.includes(r.health_item_id))
    if (!rules.length) return 'neutral'
    if (rules.some(r => (r.rule_type||'').toLowerCase() === 'block')) return 'blocked'
    if (rules.some(r => (r.rule_type||'').toLowerCase() === 'allow')) return 'allowed'
    return 'neutral'
  }

  // ── Filtering logic ────────────────────────────────────────────────────────
  const uniqueMealTypes = ['all', ...new Set(meals.map(m => (m.Meal_type||'').toLowerCase()).filter(Boolean))]

  // Filter meals by selected meal type chip
  const typeFiltered = filter === 'all'
    ? meals
    : meals.filter(m => (m.Meal_type||'').toLowerCase() === filter)

  const hasHP        = myHealthItemIds.length > 0
  const safeMeals    = typeFiltered.filter(m => getMealSafety(m.Meal_id) !== 'blocked')
  const blockedMeals = typeFiltered.filter(m => getMealSafety(m.Meal_id) === 'blocked')

  // If user has a health profile, only show safe meals; otherwise show all type-filtered meals
  const displayedMeals = hasHP ? safeMeals : typeFiltered

  // Config for the active filter chip (used in section label)
  const activeFilterCfg = filter === 'all'
    ? { icon: '🍽️', label: 'All Meals', color: '#475569', soft: '#f8fafc', border: '#e2e8f0' }
    : getCfg(filter)

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleFilterClick = (type) => {
    setFilter(type)
    setShowBlocked(false) // collapse blocked section when switching filters
  }

  const openLog = meal => {
    setSelMeal(meal); setLogModal(true); setMsg('')
    setLogForm(f => ({...f, meal_type: (meal.Meal_type||'breakfast').toLowerCase()}))
  }

  const handleLog = async () => {
    if (!userId || !selMeal) return
    try {
      await userMealLogService.insert({
        user_id: userId, meal_id: selMeal.Meal_id,
        log_date: logForm.log_date, meal_type: logForm.meal_type,
        quantity: logForm.quantity, created_at: new Date().toISOString().slice(0,19).replace('T',' ')
      })
      setMsg('Meal logged! ✅')
      const r = await userMealLogService.getAll()
      setMealLogs(r.data.filter(x => x.user_id === userId || x.User_id === userId))
      setTimeout(() => setLogModal(false), 1000)
    } catch { setMsg('Error logging meal.') }
  }

  const bmi       = parseFloat(profile?.bmi || 0)
  const calTarget = profile ? calcCalorieTarget(bmi, conditions) : 2000
  const protein   = Math.round(calTarget * 0.30 / 4)
  const carbs     = Math.round(calTarget * 0.45 / 4)
  const fats      = Math.round(calTarget * 0.25 / 9)
  const tips      = buildTips(bmi, conditions)
  const todayCals = mealLogs
    .filter(l => l.log_date?.slice(0,10) === logForm.log_date)
    .reduce((s, l) => {
      const n = nutrition.find(n => n.meal_id === l.meal_id)
      return s + (n ? parseFloat(n.calories) * (l.quantity||1) : 0)
    }, 0)

  // ── Meal Card ──────────────────────────────────────────────────────────────
  const MealCard = ({ m, safety }) => {
    const n        = getNutrition(m.Meal_id)
    const cfg      = getCfg(m.Meal_type)
    const isLogged = mealLogs.some(l => l.meal_id === m.Meal_id && l.log_date?.slice(0,10) === logForm.log_date)
    const logCount = mealLogs.filter(l => l.meal_id === m.Meal_id).length
    const blocked  = safety === 'blocked'
    const allowed  = safety === 'allowed'

    return (
      <div className="col-md-6 col-lg-4">
        <div
          style={{
            borderRadius: 22, overflow: 'hidden', height: '100%',
            display: 'flex', flexDirection: 'column', background: '#fff',
            border: blocked ? '1.5px solid #fca5a5' : allowed ? '1.5px solid #86efac' : '1.5px solid #f0f4f8',
            boxShadow: blocked ? '0 4px 24px rgba(239,68,68,0.08)' : '0 4px 24px rgba(0,0,0,0.06)',
            transition: 'transform 0.22s ease, box-shadow 0.22s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-7px)'
            e.currentTarget.style.boxShadow = blocked
              ? '0 18px 40px rgba(239,68,68,0.13)'
              : '0 18px 40px rgba(0,0,0,0.11)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = blocked
              ? '0 4px 24px rgba(239,68,68,0.08)'
              : '0 4px 24px rgba(0,0,0,0.06)'
          }}
        >
          {/* Coloured top band */}
          <div style={{
            background: blocked
              ? 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)'
              : `linear-gradient(135deg, ${cfg.soft} 0%, ${cfg.border}55 100%)`,
            padding: '20px 22px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(6px)',
                border: `1px solid ${blocked ? '#fca5a5' : cfg.border}`,
                borderRadius: 99, padding: '5px 13px',
                fontSize: 12, fontWeight: 700,
                color: blocked ? '#dc2626' : cfg.dark,
              }}>
                <span style={{ fontSize: 15 }}>{blocked ? '⚠️' : cfg.icon}</span>
                {cfg.label}
              </span>
              {n && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: blocked ? '#ef4444' : cfg.color,
                  color: '#fff', borderRadius: 99,
                  padding: '5px 13px', fontSize: 12, fontWeight: 800,
                  boxShadow: `0 3px 10px ${blocked ? '#ef444455' : cfg.color + '55'}`,
                  flexShrink: 0,
                }}>
                  🔥 {n.calories} cal
                </span>
              )}
            </div>
            <div style={{ fontWeight: 800, fontSize: 17, color: blocked ? '#991b1b' : '#1e293b', lineHeight: 1.35 }}>
              {m.Meal_name}
            </div>
            {allowed && (
              <div style={{
                marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 5,
                background: '#dcfce7', border: '1px solid #86efac',
                borderRadius: 99, padding: '3px 12px',
                fontSize: 11, fontWeight: 700, color: '#15803d',
              }}>
                ✅ Recommended for you
              </div>
            )}
          </div>

          {/* Card body */}
          <div style={{ padding: '18px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {blocked && (
              <div style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                background: '#fff7ed', border: '1px solid #fcd9a3',
                borderRadius: 12, padding: '11px 14px',
              }}>
                <span style={{ fontSize: 17, flexShrink: 0, marginTop: 1 }}>⚠️</span>
                <p style={{ margin: 0, fontSize: 12, color: '#92400e', lineHeight: 1.65 }}>
                  May not suit your <strong>{condNames.join(', ')}</strong>.
                  Speak with your doctor before eating this.
                </p>
              </div>
            )}
            <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.75 }}>{m.Description}</p>
            {n && (
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                <NutrPill icon="💪" val={n.protein} label="Protein" color="#3b82f6" bg="#eff6ff" />
                <NutrPill icon="🌾" val={n.carbs}   label="Carbs"   color="#f59e0b" bg="#fffbeb" />
                <NutrPill icon="🧈" val={n.fats}    label="Fat"     color="#8b5cf6" bg="#f5f3ff" />
              </div>
            )}
            {logCount > 0 && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: 99, padding: '3px 11px',
                fontSize: 11, fontWeight: 600, color: '#15803d', width: 'fit-content',
              }}>
                📊 Logged {logCount}× total
              </div>
            )}
          </div>

          {/* Button footer */}
          <div style={{ padding: '0 22px 22px' }}>
            {blocked ? (
              <div style={{
                padding: '11px 16px', borderRadius: 14,
                border: '2px dashed #e2e8f0', background: '#f8fafc',
                textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#94a3b8',
              }}>
                🙅 Skipped for your health
              </div>
            ) : (
              <button onClick={() => openLog(m)} style={{
                width: '100%', padding: '12px',
                fontFamily: 'Poppins', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', borderRadius: 14, border: 'none',
                transition: 'all 0.2s ease',
                background: isLogged
                  ? '#dcfce7'
                  : `linear-gradient(135deg, ${cfg.color}, ${cfg.dark})`,
                color: isLogged ? '#15803d' : '#fff',
                boxShadow: isLogged ? 'none' : `0 4px 14px ${cfg.color}50`,
              }}
                onMouseEnter={e => { if (!isLogged) e.currentTarget.style.opacity = '0.9' }}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {isLogged ? '✅ Logged Today' : '＋ Log This Meal'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const SectionLabel = ({ color, border, bg, children }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
      <div style={{ flex: 1, height: 1, background: border }} />
      <span style={{
        fontSize: 12, fontWeight: 700, color,
        background: bg, border: `1px solid ${border}`,
        borderRadius: 99, padding: '5px 18px', whiteSpace: 'nowrap',
      }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: border }} />
    </div>
  )

  const card = { background: '#fff', borderRadius: 20, padding: 26, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: 22, border: '1px solid #f0f4f8' }

  return (
    <UserLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dp-appear { animation: fadeSlideIn 0.3s ease both; }
      `}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#14532d,#166534,#15803d)',
        borderRadius: 24, padding: '30px 34px', marginBottom: 26, color: '#fff',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:-60, right:-40, width:220, height:220, background:'rgba(255,255,255,0.04)', borderRadius:'50%' }} />
        <div style={{ position:'absolute', bottom:-80, right:120, width:200, height:200, background:'rgba(255,255,255,0.03)', borderRadius:'50%' }} />
        <h2 style={{ fontWeight:800, fontSize:26, margin:0, position:'relative' }}>📋 Your Personalized Diet Plan</h2>
        <p style={{ opacity:0.75, marginTop:7, marginBottom:0, position:'relative', fontSize:14 }}>
          Meal recommendations tailored to your health profile
        </p>
      </div>

      {!profile && !loading && (
        <div style={{ background:'#fffbeb', border:'1.5px solid #fde68a', borderRadius:16, padding:'14px 20px', marginBottom:22, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:22 }}>⚠️</span>
          <div style={{ fontSize:13 }}>
            <strong style={{ color:'#92400e' }}>Complete your health profile</strong>
            <span style={{ color:'#78350f' }}> for personalised recommendations. </span>
            <a href="/user/healthprofile" style={{ color:'#059669', fontWeight:700 }}>Set up now →</a>
          </div>
        </div>
      )}

      {loading ? <div className="loader" /> : (<>

        {/* Profile Summary */}
        {profile && (
          <div style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius:20, padding:22, marginBottom:22, border:'1.5px solid #bbf7d0' }}>
            <div style={{ fontWeight:700, fontSize:14, color:'#15803d', marginBottom:14 }}>👤 Health Profile Summary</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12 }}>
              {[
                { icon:'⚧️', label:'Gender & Age',      val:`${profile.gender||'—'}, ${profile.age||'—'} yrs` },
                { icon:'⚖️', label:'BMI',               val:`${profile.bmi||'—'} — ${bmiLabel(bmi)}`, color:bmiColor(bmi) },
                { icon:'🏥', label:'Health Conditions', val:condNames.length ? condNames.join(', ') : 'None' },
                { icon:'⚠️', label:'Allergies',         val:allergyCount ? `${allergyCount} allergy(ies)` : 'None' },
              ].map(s => (
                <div key={s.label} style={{ background:'rgba(255,255,255,0.82)', borderRadius:14, padding:14, textAlign:'center' }}>
                  <div style={{ fontSize:26, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:11, fontWeight:600, color:'#6b7280', marginBottom:4 }}>{s.label}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:s.color||'#15803d' }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nutrition Targets */}
        {profile && (
          <div style={card}>
            <div style={{ fontWeight:700, fontSize:14, color:'#1e293b', marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:4, height:20, background:'linear-gradient(#10b981,#059669)', borderRadius:4 }} />
              🥧 Daily Nutrition Targets
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(115px,1fr))', gap:12 }}>
              {[
                { label:'Calories', val:calTarget,     unit:'kcal',    col:'#ef4444', bg:'#fff1f2' },
                { label:'Protein',  val:`${protein}g`, unit:'30%',     col:'#3b82f6', bg:'#eff6ff' },
                { label:'Carbs',    val:`${carbs}g`,   unit:'45%',     col:'#f59e0b', bg:'#fffbeb' },
                { label:'Fats',     val:`${fats}g`,    unit:'25%',     col:'#8b5cf6', bg:'#f5f3ff' },
                { label:'Water',    val:'8+',          unit:'glasses', col:'#06b6d4', bg:'#ecfeff' },
              ].map(x => (
                <div key={x.label} style={{ background:x.bg, borderRadius:14, padding:'15px 10px', textAlign:'center', border:`1.5px solid ${x.col}20` }}>
                  <div style={{ fontSize:22, fontWeight:800, color:x.col }}>{x.val}</div>
                  <div style={{ fontSize:10, color:'#64748b', fontWeight:600, marginTop:4 }}>{x.label}</div>
                  <div style={{ fontSize:10, color:x.col, fontWeight:700, marginTop:2 }}>{x.unit}</div>
                </div>
              ))}
            </div>
            {todayCals > 0 && (
              <div style={{ marginTop:18, background:'#f8fafc', borderRadius:14, padding:'14px 18px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, fontWeight:600, marginBottom:8 }}>
                  <span style={{ color:'#64748b' }}>Today's Calories</span>
                  <span style={{ color:todayCals>calTarget?'#ef4444':'#10b981', fontWeight:800 }}>
                    {Math.round(todayCals)} / {calTarget} kcal
                  </span>
                </div>
                <div style={{ background:'#e2e8f0', borderRadius:99, height:9, overflow:'hidden' }}>
                  <div style={{
                    height:'100%', borderRadius:99, transition:'width 0.6s ease',
                    width:`${Math.min((todayCals/calTarget)*100,100)}%`,
                    background: todayCals>calTarget ? 'linear-gradient(90deg,#ef4444,#dc2626)' : 'linear-gradient(90deg,#10b981,#059669)',
                  }} />
                </div>
                {todayCals > calTarget && (
                  <div style={{ fontSize:11, color:'#ef4444', marginTop:6, fontWeight:600 }}>
                    ⚠️ {Math.round(todayCals-calTarget)} kcal over your daily goal
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display:'flex', background:'#f1f5f9', borderRadius:16, padding:5, width:'fit-content', marginBottom:26 }}>
          {[['plan','📅 Meal Plan'],['tips','💡 Health Tips']].map(([key,lbl]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding:'10px 26px', borderRadius:12, border:'none',
              fontFamily:'Poppins', fontSize:13, fontWeight:700, cursor:'pointer',
              transition:'all 0.2s',
              background: activeTab===key ? '#fff' : 'transparent',
              color:      activeTab===key ? '#1e293b' : '#94a3b8',
              boxShadow:  activeTab===key ? '0 2px 10px rgba(0,0,0,0.09)' : 'none',
            }}>{lbl}</button>
          ))}
        </div>

        {/* ── MEAL PLAN TAB ── */}
        {activeTab === 'plan' && (<>

          {/* Filter chips */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:26 }}>
            {uniqueMealTypes.map(t => {
              const cfg    = t === 'all'
                ? { icon:'🍽️', label:'All', color:'#475569', soft:'#f8fafc', border:'#e2e8f0' }
                : getCfg(t)
              const active = filter === t
              const count  = t === 'all'
                ? meals.length
                : meals.filter(m => (m.Meal_type||'').toLowerCase() === t).length
              return (
                <button key={t} onClick={() => handleFilterClick(t)} style={{
                  display:'inline-flex', alignItems:'center', gap:7,
                  padding:'9px 18px', borderRadius:99,
                  border: active ? 'none' : '1.5px solid #e2e8f0',
                  fontFamily:'Poppins', fontSize:12, fontWeight:700, cursor:'pointer',
                  transition:'all 0.2s ease',
                  background: active ? cfg.color : '#fff',
                  color:      active ? '#fff' : '#475569',
                  boxShadow:  active ? `0 4px 16px ${cfg.color}50` : '0 1px 4px rgba(0,0,0,0.05)',
                  transform:  active ? 'scale(1.05)' : 'scale(1)',
                }}>
                  <span>{cfg.icon}</span>
                  <span>{cfg.label}</span>
                  <span style={{
                    background: active ? 'rgba(255,255,255,0.28)' : '#f1f5f9',
                    borderRadius:99, padding:'1px 8px', fontSize:10, fontWeight:800,
                    color: active ? '#fff' : '#64748b',
                  }}>{count}</span>
                </button>
              )
            })}
          </div>

          {/* Active filter heading */}
          {filter !== 'all' && (
            <div className="dp-appear" style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: `linear-gradient(135deg, ${activeFilterCfg.soft}, ${activeFilterCfg.border}33)`,
              border: `1.5px solid ${activeFilterCfg.border}`,
              borderRadius: 16, padding: '14px 20px', marginBottom: 22,
            }}>
              <span style={{ fontSize: 28 }}>{activeFilterCfg.icon}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: activeFilterCfg.dark || '#1e293b' }}>
                  {activeFilterCfg.label} Diet Plans
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  Showing {displayedMeals.length} meal{displayedMeals.length !== 1 ? 's' : ''}
                  {hasHP && blockedMeals.length > 0 ? ` · ${blockedMeals.length} not recommended` : ''}
                </div>
              </div>
              {/* Clear filter */}
              <button
                onClick={() => handleFilterClick('all')}
                style={{
                  marginLeft: 'auto', background: 'rgba(255,255,255,0.7)',
                  border: `1px solid ${activeFilterCfg.border}`,
                  borderRadius: 99, padding: '5px 14px',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  color: activeFilterCfg.dark || '#475569',
                }}
              >
                ✕ Clear
              </button>
            </div>
          )}

          {/* Safe / all meals */}
          {displayedMeals.length > 0 && (
            <div className="dp-appear">
              <SectionLabel
                color={hasHP ? '#15803d' : activeFilterCfg.color || '#475569'}
                border={hasHP ? '#86efac' : activeFilterCfg.border || '#e2e8f0'}
                bg={hasHP ? '#f0fdf4' : activeFilterCfg.soft || '#f8fafc'}
              >
                {hasHP
                  ? `✅ Safe for you · ${displayedMeals.length} meal${displayedMeals.length !== 1 ? 's' : ''}`
                  : filter === 'all'
                    ? `🍽️ All Meals · ${displayedMeals.length}`
                    : `${activeFilterCfg.icon} ${activeFilterCfg.label} · ${displayedMeals.length} meal${displayedMeals.length !== 1 ? 's' : ''}`
                }
              </SectionLabel>
              <div className="row g-4">
                {displayedMeals.map(m => (
                  <MealCard key={m.Meal_id} m={m} safety={getMealSafety(m.Meal_id)} />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {displayedMeals.length === 0 && blockedMeals.length === 0 && (
            <div className="empty-state">
              <i className="bi bi-calendar-check" />
              {filter === 'all'
                ? ' No meals found'
                : ` No ${activeFilterCfg.label} meals found`
              }
            </div>
          )}

          {/* Blocked section */}
          {hasHP && blockedMeals.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <button
                onClick={() => setShowBlocked(v => !v)}
                style={{
                  display:'flex', alignItems:'center', gap:14,
                  width:'100%', background:'none', border:'none',
                  cursor:'pointer', padding:0, marginBottom: showBlocked ? 20 : 0,
                }}
              >
                <div style={{ flex:1, height:1, background:'#fca5a5' }} />
                <div style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  background:'#fff1f2', border:'1.5px solid #fca5a5',
                  borderRadius:99, padding:'8px 20px',
                  fontSize:12, fontWeight:700, color:'#dc2626',
                  flexShrink:0, transition:'opacity 0.2s',
                }}>
                  <span>🚫</span>
                  <span>
                    {filter === 'all'
                      ? `Meals to avoid · ${blockedMeals.length}`
                      : `${activeFilterCfg.label} meals to avoid · ${blockedMeals.length}`
                    }
                  </span>
                  <span style={{
                    background:'#fecaca', color:'#991b1b',
                    borderRadius:99, padding:'2px 10px', fontSize:10, fontWeight:800,
                  }}>
                    {showBlocked ? '▲ Hide' : '▼ Show'}
                  </span>
                </div>
                <div style={{ flex:1, height:1, background:'#fca5a5' }} />
              </button>

              {showBlocked && (
                <div className="dp-appear">
                  <div style={{
                    display:'flex', gap:14, alignItems:'flex-start',
                    background:'linear-gradient(135deg,#fff7ed,#ffedd5)',
                    border:'1.5px solid #fcd9a3', borderRadius:16,
                    padding:'16px 20px', marginBottom:22,
                  }}>
                    <span style={{ fontSize:24, flexShrink:0 }}>⚠️</span>
                    <div>
                      <div style={{ fontWeight:700, color:'#9a3412', fontSize:13, marginBottom:4 }}>
                        These meals may not suit your conditions
                      </div>
                      <div style={{ color:'#c2410c', fontSize:12, lineHeight:1.7 }}>
                        Based on: <strong>{condNames.join(', ')}</strong>. Consult your doctor before eating these.
                      </div>
                    </div>
                  </div>
                  <div className="row g-4">
                    {blockedMeals.map(m => <MealCard key={m.Meal_id} m={m} safety="blocked" />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </>)}

        {/* Health Tips Tab */}
        {activeTab === 'tips' && (
          <div style={card}>
            <div style={{ fontWeight:700, fontSize:14, color:'#1e293b', marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:4, height:20, background:'linear-gradient(#10b981,#059669)', borderRadius:4 }} />
              💡 Personalized Health Tips
              {conditions.length > 0 && (
                <span style={{ fontSize:12, fontWeight:500, color:'#94a3b8' }}>· for {condNames.join(', ')}</span>
              )}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {tips.map((tip,i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'flex-start', gap:14,
                  background: i%2===0 ? '#f0fdf4' : '#f8fafc',
                  border:`1px solid ${i%2===0 ? '#bbf7d0' : '#e2e8f0'}`,
                  borderRadius:14, padding:'14px 18px',
                }}>
                  <span style={{ fontSize:22, flexShrink:0 }}>{tip.icon}</span>
                  <p style={{ margin:0, fontSize:13, color:'#374151', fontWeight:500, lineHeight:1.75 }}>{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </>)}

      {/* Log Modal */}
      {logModal && (
        <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) setLogModal(false) }}>
          <div className="modal-box" style={{ maxWidth:430 }}>
            <button className="close-btn" onClick={() => setLogModal(false)}>×</button>
            <h4 style={{ marginBottom:4 }}>Log Meal</h4>
            <p style={{ fontSize:13, color:'var(--tl)', marginBottom:16 }}>{selMeal?.Meal_name}</p>

            {msg && <div className={msg.includes('Error')?'alert-error':'alert-success'} style={{ marginBottom:12 }}>{msg}</div>}

            <label className="modal-label">Date</label>
            <input className="modal-input" type="date" value={logForm.log_date} onChange={e => setLogForm({...logForm,log_date:e.target.value})} />

            <label className="modal-label">Meal Type</label>
            <select className="modal-input" value={logForm.meal_type} onChange={e => setLogForm({...logForm,meal_type:e.target.value})}>
              {uniqueMealTypes.filter(t=>t!=='all').map(t => {
                const cfg = getCfg(t)
                return <option key={t} value={t}>{cfg.icon} {cfg.label}</option>
              })}
            </select>

            <label className="modal-label">Quantity (servings)</label>
            <input className="modal-input" type="number" min="1" value={logForm.quantity} onChange={e => setLogForm({...logForm,quantity:e.target.value})} />

            {selMeal && getNutrition(selMeal.Meal_id) && (() => {
              const n = getNutrition(selMeal.Meal_id)
              const qty = parseFloat(logForm.quantity)||1
              return (
                <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:14, padding:14, marginTop:12 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'#94a3b8', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:10 }}>
                    Preview · {qty} serving{qty>1?'s':''}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                    {[
                      ['🔥', Math.round(n.calories*qty), 'kcal', '#ef4444'],
                      ['💪', Math.round(n.protein*qty),  'Prot', '#3b82f6'],
                      ['🌾', Math.round(n.carbs*qty),    'Carbs','#f59e0b'],
                      ['🧈', Math.round(n.fats*qty),     'Fat',  '#8b5cf6'],
                    ].map(([ico,v,u,c]) => (
                      <div key={u} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:10, padding:'10px 6px', textAlign:'center' }}>
                        <div style={{ fontSize:16 }}>{ico}</div>
                        <div style={{ fontWeight:800, color:c, fontSize:15 }}>{v}</div>
                        <div style={{ color:'#94a3b8', fontSize:10, fontWeight:600 }}>{u}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}

            <div className="modal-footer-btns" style={{ marginTop:18 }}>
              <button className="btn-cancel" onClick={() => setLogModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleLog}>Log Meal ✅</button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  )
}