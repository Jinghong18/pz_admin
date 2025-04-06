// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '../src/style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import panelHead from '../src/components/panelHeader.vue'
import { useMenuStore } from './stores/index'
import './plugins/echarts.js'  // 引入自定义 ECharts 配置
import registerECharts from './plugins/vue-echarts.js'  // 引入 vue-echarts 配置

// 路由守卫逻辑
router.beforeEach((to => {
  const token = localStorage.getItem('pz_token')
  if (!token && to.path !== '/login') {
    return '/login'
  } else if (token && to.path === '/login') {
    return '/'
  } else {
    return true
  }
}))

const app = createApp(App)

// 全局注册 ElementPlus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('panel-head', panelHead)

const pinia = createPinia()
app.use(ElementPlus)
app.use(pinia)

// 注册 vue-echarts 配置
registerECharts(app)

const menuStore = useMenuStore()
menuStore.$subscribe((mutation, state) => {
  localStorage.setItem('pz_v3pz', JSON.stringify(state))
})

const localData = localStorage.getItem('pz_v3pz')
if (localData) {
  menuStore.dynamicMenu(JSON.parse(localData).routerList)

  menuStore.routerList.forEach((item) => {
    router.addRoute('main', item) // 添加路由
  })
  router.push('/')
}

app.use(router)

app.mount('#app')
