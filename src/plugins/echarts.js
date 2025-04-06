import { createApp } from 'vue'
import App from '../App.vue'

// 引入 echarts
import * as echarts from 'echarts'

const app = createApp(App)

// 把 echarts 添加到全局属性
app.config.globalProperties.$echarts = echarts

app.mount('#app')
