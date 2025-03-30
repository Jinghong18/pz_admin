<template>
    <panel-head :route="route" />
    <el-row :gutter="10" style="margin-top: 10px;">
        <el-col :span="12">
            <el-card>
                <div class="el-dropdown-link flex-box">
                    <el-avatar :src="userInfo.avatar" style="width: 100px; height: 100px; margin-right: 10px" />
                    <p class="username">{{ userInfo.name }}</p>
                </div>
                <template #footer>
                    <p class="text">当前权限：{{ permissionName(userForm.permissions_id) }}</p>
                    <p class="text">登录的ip: 127.0.0.1</p>
                </template>
            </el-card>
        </el-col>
        <el-col :span="12">
            <el-card>
                <el-row>
                    <el-col :span="12" class="flex-box">
                        <el-image src="../../../public/dzf.png" style="background-color: red;" />
                        <div>
                            <p class="text2">{{ result['待支付'] }}</p>
                            <p class="text1">待支付</p>
                        </div>
                    </el-col>
                    <el-col :span="12" class="flex-box">
                        <el-image src="../../../public/dfw.png" style="background-color: purple;" />
                        <div>
                            <p class="text2">{{ result['待服务'] }}</p>
                            <p class="text1">待服务</p>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" class="flex-box">
                        <el-image src="../../../public/ywc.png" style="background-color: blue;" />
                        <div>
                            <p class="text2">{{ result['已完成'] }}</p>
                            <p class="text1">已完成</p>
                        </div>
                    </el-col>
                    <el-col :span="12" class="flex-box">
                        <el-image src="../../../public/yqx.png" style="background-color: green;" />
                        <div>
                            <p class="text2">{{ result['已取消'] }}</p>
                            <p class="text1">已取消</p>
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row>

    <el-card style="margin-top: 10px; max-height: 300px;">todo</el-card>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { authAdmin, menuSelectList, adminOrder } from '../../api/index'
const route = useRoute()

const userInfoString = localStorage.getItem("pz_userInfo");
const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

const userForm = reactive(
    {
        name: '',
        permissions_id: '',
        mobile: '',
    }
)
const orderData = reactive(
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
        // console.log(data, 'authAdmin')
        const { list } = data.data
        userForm.permissions_id = list[0].permissions_id
    })
    adminOrder(paginationData).then(({ data }) => {
        const { list, total } = data.data
        orderData.list = list
        orderData.total = total
        countOrderStates(orderData.list)
    })
}
// 所属组别要调接口匹配
const options = ref([])
// 根据权限id匹配权限名称
const permissionName = (id) => {
    const permission = options.value.find(item => item.id === id)
    return permission ? permission.name : '超级管理员'
}

// 订单统计
const result = reactive({
    '待支付': 0,
    '待服务': 0,
    '已完成': 0,
    '已取消': 0
})

function countOrderStates(orders) {
    // Reset the result before updating
    result['待支付'] = 0;
    result['待服务'] = 0;
    result['已完成'] = 0;
    result['已取消'] = 0;

    orders.forEach(order => {
        if (result.hasOwnProperty(order.trade_state)) {
            result[order.trade_state] += 1;
        }
    });
    console.log(result, '订单统计')
}


onMounted(() => {
    getList()
    menuSelectList().then(({ data }) => {
        options.value = data.data
    })
})
</script>

<style scoped lang="less">
.flex-box {
    display: flex;
    align-items: center;
    height: 100%;
}

.text1 {
    margin-left: 10px;
}

.text2 {
    margin-left: 10px;
    font-size: 16px;
    font-weight: bold;
}

.username {
    font-weight: bold;
    font-size: 20px;
}

.el-row {
    margin: 30px 50px;
}

.el-card {
    height: 100%;
}

.text {
    font-size: 14px;
    color: #9AA6B2;
    margin-top: 10px;
}

.el-image {
    width: 50px;
    height: 50px;
}
</style>