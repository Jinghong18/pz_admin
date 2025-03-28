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
import { watch } from 'vue'



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
app.use(ElementPlus)
app.use(pinia)

// 刷新后的动态路由添加
const menuStore = useMenuStore()

// 监听 store 的 state 变化
watch(
  () => menuStore.$state,  // 监听整个 store 的 state
  (state) => {
    // 每当状态发生变化时，将整个 state 持久化到本地存储。
    localStorage.setItem('pz_v3pz', JSON.stringify(state));
  },
  { deep: true }  // 深度监听，确保嵌套对象变化也能被检测
);


const localData = localStorage.getItem('pz_v3pz')
if (localData) {
  menuStore.dynamicMenu(JSON.parse(localData).routerList)

  menuStore.routerList.forEach((item) => {
    router.addRoute('main', {
      path: item.path,
      component: item.components,
      meta: item.meta || {},
      children: item.children || []
    }); // 添加路由
  });

  router.push('/');
}
app.use(router)
// console.log(router.getRoutes(), 'router_2'); // 查看当前的路由配置

app.mount('#app')