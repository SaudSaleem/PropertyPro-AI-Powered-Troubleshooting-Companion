import axios from 'axios'
import app from '@/main.js'
import config from '../config/config.json'

import { Notyf } from 'notyf'
const notyf = new Notyf({
  position: {
    x: 'right',
    y: 'top'
  }
})
console.log('VUE_APP_API_URL', import.meta.env.VITE_ROOT_API)
const instance = axios.create({
  baseURL: import.meta.env.VITE_ROOT_API+'/api/'
})

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    if (response.config && response.config.url === '/login') {
      const token = response.data.token
      if (token) {
        localStorage.setItem('token', token)
      }
      const { name, email, role } = response.data.user
      localStorage.setItem('name', name)
      localStorage.setItem('email', email)
      localStorage.setItem('role', role)
    }
    return response.data
  },
  (error) => {
    notyf.error(error.response.data.error)
    if (error.response.status == 401) {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token')
        app.config.globalProperties.$router.push('/login')
      }
    }
    return Promise.reject(error)
  }
)

export default instance
