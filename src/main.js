import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '../src/style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

router.beforeEach((to => {
  const token = localStorage.getItem('pz_token')
  // 非登录页面，没有token
  if (!token && to.path !== '/login') {
    return '/login'
  } else if (token && to.path === '/login') {
    return '/'
  } else {
    return true
  }
}))

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
const pinia = createPinia()
app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.mount('#app')