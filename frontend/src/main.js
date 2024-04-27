import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import Modal from './components/Modal.vue'

const app = createApp(App); 
app.use(router);
app.component('Modal', Modal);
app.mount('#app');
