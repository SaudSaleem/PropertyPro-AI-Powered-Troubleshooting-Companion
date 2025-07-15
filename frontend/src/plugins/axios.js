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
// console.log('VUE_APP_API_URL', import.meta.env.VITE_ROOT_API)
const instance = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://property-pro-d0272.web.app/api/'
    : 'http://localhost:5001/property-pro-d0272/us-central1/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false
})
console.log('import.meta.env.PROD', import.meta.env.PROD, import.meta.env.PROD 
  ? 'http://localhost:5001/property-pro-d0272/us-central1/api/'
  : 'http://localhost:5001/property-pro-d0272/us-central1/api/')
console.log('VUE_APP_API_URL', import.meta.env.VITE_ROOT_API, "baseURL", instance)
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
    if (response.config && response.config.url === '/auth/login') {
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
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Error:', error.response.data)
      console.error('Response Status:', error.response.status)
      console.error('Response Headers:', error.response.headers)
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request Error:', error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message)
    }
    
    // Only show error notification if it's not a CORS error
    if (error.response?.data?.error) {
      notyf.error(error.response.data.error)
    } else if (error.message.includes('CORS')) {
      notyf.error('Network error: Please check your connection')
    }
    
    if (error.response?.status == 401) {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token')
        app.config.globalProperties.$router.push('/login')
      }
    }
    return Promise.reject(error)
  }
)

export default instance
