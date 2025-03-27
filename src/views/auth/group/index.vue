<template>
    <div class="btns">
        <el-button :icon="Plus" size="small" type="primary" @click="dialogFormVisible = true">新增</el-button>
    </div>
    <el-dialog v-model="dialogFormVisible" :before-close="beforeClose" title="添加权限" width="500">
        <el-form ref="formRef" label-width="100px" label-position="left" :model="form">
            <el-form-item prop="id" v-show="false">
                <el-input v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请填写权限名称"></el-input>
            </el-form-item>
            <el-form-item label="权限" prop="permissions">
                <el-tree ref="treeRef" :data="permissionsData" style="max-width: 600px;" node-key="id" show-checkbox
                    :default-checked-keys="defaultCheckedKeys" :default-expanded-keys="[2]">
                </el-tree>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script setup>
import { Plus } from '@element-plus/icons-vue';
import { ref, reactive, onMounted } from 'vue';
import { userGetMenu } from '../../../api/index';

const dialogFormVisible = ref(false);

const formRef = ref(null);
// form表单
const form = reactive({
    name: '',
    permissions: '',
    id: '',
});

const treeRef = ref(null);
// 权限树
const permissionsData = ref([]);
// 默认选中的权限
const defaultCheckedKeys = [4, 5];

onMounted(() => {
  userGetMenu().then(({ data }) => {
    permissionsData.value = data.data;
    console.log(data);
  });
});

// 关闭弹窗前的操作
const beforeClose = () => { }
</script>