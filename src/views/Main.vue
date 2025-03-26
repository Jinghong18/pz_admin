<template>
    <div class="common-layout">
      <el-container>
        <Aside />
        <el-container>
          <el-header>
            <Header />
          </el-header>
          <el-main>
            <router-view />
          </el-main>
        </el-container>
      </el-container>
    </div>
  </template>

<script setup>
import Aside from '../components/aside.vue'
import Header from '../components/navHeader.vue'
</script>

<style scoped lang="less">
.common-layout {
  height: 100%;

  .el-container {
    height: 100%;
  }
}
</style>

