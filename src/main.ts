import { createApp } from 'vue'
import App from './App.vue'
import './assets/index.css'
import router from './router'

// createApp(App).mount('#app')

//Todo
createApp(App).use(router).mount('#app');
