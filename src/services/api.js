import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5500/api',
  headers: { 'Content-Type': 'application/json' },
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('sb_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sb_token')
      localStorage.removeItem('sb_user')
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)

export default API
export const IMAGE_BASE_URL = 'http://localhost:5500/productlogo/'
export const BRAND_IMAGE_URL = 'http://localhost:5500/brandlogo/'
