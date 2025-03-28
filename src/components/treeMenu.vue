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
import { useMenuStore} from '../stores/index'
import { watch } from 'vue';

const store = useMenuStore()

const router = useRouter();

const props = defineProps(['menuData', 'index'])

function handleClick(item, active) {
  router.push(item.meta.path);
  store.updateMenuActive(active)
  store.addSelectMenu(item.meta)
}

// 监听 store 的 state 变化
watch(
  () => store.$state,  // 监听整个 store 的 state
  (state) => {
    // 每当状态发生变化时，将整个 state 持久化到本地存储。
    localStorage.setItem('activeData', JSON.stringify(state));
  },
  { deep: true }  // 深度监听，确保嵌套对象变化也能被检测
);
</script>
