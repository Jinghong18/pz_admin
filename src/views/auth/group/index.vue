<template>
    <div class="btns">
        <el-button :icon="Plus" size="small" type="primary" @click="open(null)">新增</el-button>
    </div>
    <el-table :data="tableData.list" style="width: 100%;">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="permissionName" label="菜单权限" width="500px" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" size="small" @click="open(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-info">
        <el-pagination v-model:current-page="paginationData.pageNum" :page-size="paginationData.pageSize"
            :background="false" layout="total, prev, pager, next" :total="tableData.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" size="small" />
    </div>
    <el-dialog v-model="dialogFormVisible" :before-close="beforeClose" title="添加权限" width="500">
        <el-form ref="formRef" label-width="100px" label-position="left" :model="form">
            <el-form-item prop="id" v-show="false" :rules="rules">
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
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="confirm(formRef)">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { userGetMenu, userSetMenu, menuList } from '../../../api/index.js'


const dialogFormVisible = ref(false)
const formRef = ref()
// form表单
const form = reactive({
    name: '',
    permissions: '',
    id: '',
});

const treeRef = ref()
// 权限树
const permissionsData = ref([]);
// 选中的权限
const defaultCheckedKeys = [4, 5];

// 后端要求传的参数
const paginationData = reactive({
    pageNum: 1,
    pageSize: 10
})
// 列表数据
const tableData = reactive(
    {
        list: [],
        total: 0,
    }
);

onMounted(() => {
    userGetMenu().then(({ data }) => {
        permissionsData.value = data.data;
    });
    getList();
});

// 表单校验规则
const rules = reactive({
    name: [
        { required: true, message: '请输入权限名称', trigger: 'blur' },
    ],
});

// 切换分页
const handleSizeChange = (size) => {
  paginationData.pageSize = size;
  getList();
}

const handleCurrentChange = (page) => {
  paginationData.pageNum = page;
  getList();
}

// 打开弹窗
const open = (rowData) => {
    dialogFormVisible.value = true;
    // 弹窗打开form生成是异步的，需要延迟
    nextTick(() => {
        if (rowData) {
            Object.assign(form, { id: rowData.id, name: rowData.name });
            treeRef.value.setCheckedKeys(rowData.permission);
        }
    });
}

// 关闭弹窗的回调
const beforeClose = () => {
    dialogFormVisible.value = false;
    // 重置表单
    formRef.value.resetFields();
    // tree的选择重置
    treeRef.value.setCheckedKeys(defaultCheckedKeys);
};

const confirm = async (formEl) => {
    if (!formEl) return
    // 手动触发校验
    await formEl.validate((valid, fields) => {
        if (valid) {
            // 获取到选中的checkbox的数据
            const permissions = JSON.stringify(treeRef.value.getCheckedKeys());
            userSetMenu({ name: form.name, permissions, id: form.id }).then(({ data }) => {
                console.log(data);
                beforeClose();
                getList();
            });
        } else {
            console.log('error submit!', fields)
        }
    }
    )
}

// 请求列表数据
const getList = () => {
    menuList(paginationData).then(({ data }) => {
        const { list, total } = data.data;
        tableData.list = list;
        tableData.total = total;
    });
}

</script>