import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/css/root.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/css/dark.css'
import './assets/css/fontawsome.min.css'
import {router} from "./router/index.js";
const app=createApp(App)

app.use(ElementPlus)
app.use(router)
app.mount('#app')
