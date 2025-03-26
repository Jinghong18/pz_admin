<template>
  <template v-for="(item, index) in props.menuData" :key="index">
    <!-- 没有子菜单 -->
    <el-menu-item v-if="!item.children || item.children.length === 0" 
      :index="`${props.index}-${item.meta.id}`"
      :key="`${props.index}-${item.meta.id}`" 
      @click="handleClick(item, `${props.index}-${item.meta.id}`)">
      <!--动态组件-->
      <el-icon size="20">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <template #title>{{ item.meta.name }}</template>
    </el-menu-item>
    <!-- 有子菜单 -->
    <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
      <template #title>
        <el-icon size="20">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.name }}</span>
      </template>
      <!-- 递归渲染子菜单 -->
      <tree-menu :menuData="item.children" :index="`${props.index}-${item.meta.id}`"></tree-menu>
    </el-sub-menu>
  </template>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useStore} from '../stores/index'

const store = useStore()

const router = useRouter();

const props = defineProps(['menuData', 'index'])

function handleClick(item, active) {
  router.push(item.meta.path);
  store.addSelectMenu(item.meta)
}
</script>
