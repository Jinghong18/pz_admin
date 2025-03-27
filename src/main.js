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
app.component('panel-head', panelHead)
const pinia = createPinia()
app.use(router)
app.use(ElementPlus)
app.use(pinia)

// 刷新后的动态路由添加
const menuStore = useMenuStore()
const localData = localStorage.getItem('pz_v3pz')
if (localData) {
  menuStore.dynamicMenu(JSON.parse(localData).state.routerList)
  menuStore.routerList.forEach((item) => {
    router.addRoute('main', item);
  });
  router.push('/');
}
console.log(router.getRoutes(), 'router_2'); // 查看当前的路由配置

app.mount('#app')