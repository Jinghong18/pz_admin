import { defineStore } from 'pinia'

const localData = localStorage.getItem('pz_v3pz');
const parsedData = localData ? JSON.parse(localData) : {}; 

export const useMenuStore = defineStore('menuStore', {
  state: () => ({
    isCollapsed: parsedData.state.isCollapsed || false,  
    selectMenu: parsedData.state.selectMenu || [],    
    routerList: parsedData.state.routerList || []         
  }), 
  actions: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
    },
    addSelectMenu(menu) {
      // 判断是否已经存在
      if (this.selectMenu.findIndex(item => item.path === menu.path) === -1) {
        this.selectMenu.push(menu)
      }
    },
    closeSeldetMenu(menu) {
      const index = this.selectMenu.findIndex(item => item.path === menu.path)
      this.selectMenu.splice(index, 1)
    },
    dynamicMenu(menu) {
      // console.log(menu)
      // 通过glob导入文件
      const modules = import.meta.glob('../views/**/**/*.vue');
      // console.log(modules)

      function routerSet(router) {
        // 判断有没有子菜单，拼接路由数据
        router.forEach((route) => {
          if (!route.children) {
            const url = `../views${route.meta.path}/index.vue`;
            // 拿到获取的 vue 组件
            route.component = modules[url];
          } else {
            routerSet(route.children);
          }
        });
      }
      routerSet(menu);
      this.routerList = menu;
    }
  }
})