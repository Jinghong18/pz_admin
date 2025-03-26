import { th } from 'element-plus/es/locales.mjs'
import { defineStore } from 'pinia'

export const useStore = defineStore('storeId', {
  state: () => ({
    isCollapse: false,
    selectMenu: []
  }),
  actions: {
    toggleCollapse() {
      this.isCollapse =!this.isCollapse
    },
    addSelectMenu(menu) {
      // 判断是否已经存在
      if(this.selectMenu.findIndex(item => item.path === menu.path) === -1) {
        this.selectMenu.push(menu)
      }
    },
    closeSeldetMenu(menu) {
      const index = this.selectMenu.findIndex(item => item.path === menu.path)
      this.selectMenu.splice(index, 1)
    }
  }
})