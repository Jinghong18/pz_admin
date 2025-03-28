<template>
  <el-menu active-text-color="#FFF2AF" background-color="#F7CFD8" class="aside-container      el-menu-vertical-demo"
      text-color="#493D9E" @open="handleOpen" @close="handleClose"
      :default-active="store.menuActive"
      :style="{ width: store.isCollapsed ? '64px' : '230px' }"
      :collapse="store.isCollapsed"
      :collapse-transition="false"
      >
      <p class="logo-lg">{{ store.isCollapsed ? 'DIDI' : 'DIDI陪诊' }}</p>
      <TreeMenu :menuData="menuData" :index="1" />
    </el-menu>
</template>

<script setup>
import TreeMenu from '../components/treeMenu.vue';
import { useMenuStore } from '../stores/index'

const store = useMenuStore()

const menuData = store.routerList

const handleOpen = () => { }
const handleClose = () => { }

</script>

<style scoped lang="less">
.aside-container {
  height: 100%;
  transition: width 0.15s;
  -webkit-transition: width 0.15s;
  -moz-transition: width 0.15s;
  -webkit-transition: width 0.15s;
  -o-transition: width 0.15s;

  .logo-lg {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #493D9E;
  }
}
</style>