import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Public
import Home    from './pages/Home'
import About   from './pages/About'
import Contact from './pages/Contact'

// Admin
import AdminDashboard  from './pages/admin/AdminDashboard'
import ManageUsers     from './pages/admin/ManageUsers'
import AdminCategory   from './pages/admin/AdminCategory'
import AdminProduct    from './pages/admin/AdminProduct'
import AdminTrending   from './pages/admin/AdminTrending'
import AdminDietPlan   from './pages/admin/AdminDietPlan'
import AdminFavourites from './pages/admin/AdminFavourites'

// User
import UserDashboard   from './pages/user/UserDashboard'
import SearchFood      from './pages/user/SearchFood'
import TrendingFood    from './pages/user/TrendingFood'
import FavouriteFood   from './pages/user/FavouriteFood'
import DietPlan        from './pages/user/DietPlan'
import Progress        from './pages/user/Progress'
import HealthProfile   from './pages/user/HealthProfile'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"        element={<Home />} />
          <Route path="/about"   element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin */}
          <Route path="/admin/dashboard"  element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users"      element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />
          <Route path="/admin/category"   element={<ProtectedRoute adminOnly><AdminCategory /></ProtectedRoute>} />
          <Route path="/admin/product"    element={<ProtectedRoute adminOnly><AdminProduct /></ProtectedRoute>} />
          <Route path="/admin/trending"   element={<ProtectedRoute adminOnly><AdminTrending /></ProtectedRoute>} />
          <Route path="/admin/dietplan"   element={<ProtectedRoute adminOnly><AdminDietPlan /></ProtectedRoute>} />
          <Route path="/admin/favourites" element={<ProtectedRoute adminOnly><AdminFavourites /></ProtectedRoute>} />

          {/* User */}
          <Route path="/user/dashboard"     element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/user/search"        element={<ProtectedRoute><SearchFood /></ProtectedRoute>} />
          <Route path="/user/trending"      element={<ProtectedRoute><TrendingFood /></ProtectedRoute>} />
          <Route path="/user/favourites"    element={<ProtectedRoute><FavouriteFood /></ProtectedRoute>} />
          <Route path="/user/dietplan"      element={<ProtectedRoute><DietPlan /></ProtectedRoute>} />
          <Route path="/user/progress"      element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          <Route path="/user/healthprofile" element={<ProtectedRoute><HealthProfile /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
