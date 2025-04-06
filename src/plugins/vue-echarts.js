import * as echarts from 'echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import ECharts from 'vue-echarts'

// 配置需要使用的 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent
])

// 导出 ECharts 配置
export default function registerECharts(app) {
  app.component('v-chart', ECharts)  // 注册全局组件
}
