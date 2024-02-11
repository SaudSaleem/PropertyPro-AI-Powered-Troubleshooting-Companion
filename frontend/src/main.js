import './assets/main.css';
import App from './App.vue';
import router from './router';
import { createApp } from 'vue';
import axios from './plugins/axios';
import { createPinia } from 'pinia';

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


const app = createApp(App)
app.config.globalProperties.$notyf = notyf;
app.config.globalProperties.$axios = axios;

app.use(createPinia())
app.use(router)

app.mount('#app');
export default app;
