import './assets/main.css';
import App from './App.vue';
import router from './router';
import { createApp } from 'vue';
import axios from './plugins/axios';
import { createPinia } from 'pinia';
import { app as firebaseApp } from './firebase';

import '@mdi/font/css/materialdesignicons.css'

//  Notyf
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
const notyf = new Notyf({
  position: {
    x: 'right',
    y: 'top',
  },
});

// Configure axios to use Firebase Functions URL in development
if (import.meta.env.DEV) {
  axios.defaults.baseURL = 'http://localhost:5001/property-pro-d0272/us-central1/api';
}

// Add global error handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  notyf.error('An unexpected error occurred. Please try again.');
});

const app = createApp(App);

// Add error handler for Vue
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err);
  console.error('Error Info:', info);
  notyf.error('An unexpected error occurred. Please try again.');
};

app.config.globalProperties.$notyf = notyf;
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$firebase = firebaseApp;

app.use(createPinia());
app.use(router);

app.mount('#app');
export default app;
