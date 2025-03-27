<template>
    <panel-head :route="route"/>
    <el-table :data="tableData.list" style="width: 100%;">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />

        <el-table-column prop="permissions_id" label="所属组别">
            <template #default="scope">
                {{ permissionName(scope.row.permissions_id) }}
            </template>
        </el-table-column>

        <el-table-column prop="mobile" label="手机号" />

        <el-table-column prop="active" label="状态">
            <template #default="scope">
                <el-tag :type="scope.row.active ? 'success' : 'danger'">{{ scope.row.active ? '正常' : '失效'
                    }}</el-tag>
            </template>
        </el-table-column>

        <el-table-column label="创建时间">
            <template #default="scope">
                <div class="flex-box">
                    <el-icon>
                        <Clock />
                    </el-icon>
                    <span style="margin-left: 10px;">{{ scope.row.create_time }}</span>
                </div>
            </template>
        </el-table-column>

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
        <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" disabled></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="菜单权限" prop="permissions_id">
                <el-select v-model="form.permissions_id" placeholder="请选择菜单权限" style="width: 240px">
                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
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
import { ref, reactive, onMounted } from 'vue';
import { authAdmin, menuSelectList, updateUser } from '../../../api/index'
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';

const route = useRoute()
// 列表数据
const tableData = reactive(
    {
        list: [],
        total: 0,
    }
);
// 获取数据需要的参数
const paginationData = reactive({
    pageNum: 1,
    pageSize: 10
})
// 请求列表
const getList = () => {
    authAdmin(paginationData).then(({ data }) => {
        console.log(data, 'authAdmin')
        const { list, total } = data.data
        list.forEach((item) => {
            item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
        })
        tableData.list = list
        tableData.total = total
    })
}

// 所属组别要调接口匹配
const options = ref([])
// 根据权限id匹配权限名称
const permissionName = (id) => {
    const permission = options.value.find(item => item.id === id)
    return permission ? permission.name : '超级管理员'
}

onMounted(() => {
    getList()
    menuSelectList().then(({ data }) => {
        options.value = data.data
    })
})

// 切换分页
const handleSizeChange = (size) => {
    paginationData.pageSize = size;
    getList()
}

const handleCurrentChange = (page) => {
    paginationData.pageNum = page;
    getList()
}

// 编辑弹窗
const formRef = ref()
const form = reactive(
  {
    name: '',
    permissions_id: '',
    mobile: '',
  }
)
const dialogFormVisible = ref(false)
// 打开弹窗
const open = (RowData) => {
  dialogFormVisible.value = true
  Object.assign(form, { name: RowData.name, permissions_id: RowData.permissions_id, mobile: RowData.mobile })
}
// 关闭前的回调
const beforeClose = () => {
  dialogFormVisible.value = false
}
// 校验规则
const rules = reactive({
  name: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
  ],
  permissions_id: [
    { required: true, message: '请选择菜单权限', trigger: 'blur' },
  ],
})

// 表单提交
const confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const { name, permissions_id } = form
      updateUser({ name, permissions_id }).then(({ data }) => {
        if (data.code === 10000) {
          dialogFormVisible.value = false
          getList()
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="less" scoped>
.flex-box {
    display: flex;
    align-items: center;
}
</style>