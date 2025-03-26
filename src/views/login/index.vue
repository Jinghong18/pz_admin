<template>
    <el-row class="login-container" justify="center" :align="'middle'">
        <el-card style="max-width: 480px;">
            <template #header>
                <div class="card-header">
                    <img :src="imgUrl" alt="">
                </div>
            </template>
            <div class="jump-link">
                <el-link type="primary" @click="handleChange">{{ formType ? '返回登录' : '注册账号' }}</el-link>
            </div>
            <el-form :model="loginForm" :rules="rules">
                <el-form-item prop="userName">
                    <el-input v-model="loginForm.userName" placeholder="手机号" prefix-icon="UserFilled"></el-input>
                </el-form-item>
                <el-form-item prop="passWord">
                    <el-input v-model="loginForm.passWord" placeholder="密码" type="password"
                        prefix-icon="Lock"></el-input>
                </el-form-item>
                <el-form-item v-if="formType" prop="validCode">
                    <el-input v-model="loginForm.validCode" placeholder="验证码" prefix-icon="Lock">
                        <template #append>
                            <span @click="countDownChange">{{ countDown.validText }}</span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :style="{ 'width': '100%' }" @click="handleSubmit">{{
                        formType ?
                            '注册账号' :
                            '登录'
                    }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </el-row>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { getCode } from '../../api/index'

const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href
const formType = ref(0)

const loginForm = reactive({
    userName: '',
    passWord: '',
    validCode: ''
})

const countDown = reactive({
    validText: '获取验证码',
    count: 60
})

function handleChange() {
    formType.value = formType.value === 0 ? 1 : 0
}

let flag = false
function countDownChange() {
    if (flag) {
        return
    }
    // 手机号验证
    const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
        return ElMessage({ message: '请检查手机号是否正确', type: 'warning' });
    }
    // 倒计时
    const time = setInterval(() => {
        if (countDown.count <= 0) {
            countDown.count = 60
            countDown.validText = '获取验证码'
            flag = false
            clearInterval(time)
        } else {
            countDown.count--
            countDown.validText = `剩余${countDown.count}秒`
        }
    }, 1000)
    flag = true
    getCode({ tel: loginForm.userName }).then(({ data }) => {
        if (data.code === 10000) {
            ElMessage.success('发送成功');
        }
    });
}

// 表单验证规则
function validateUser(rule, value, callback) {
    if (!value) {
        callback(new Error('请输入手机号'))
    } else {
        const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
        phoneReg.test(value) ? callback() : callback(new Error('请输入正确的手机号'))
    }
}
function validatePass(rule, value, callback) {
    if (!value) {
        callback(new Error('请输入密码'))
    } else {
        const passWordReg = /^[a-zA-Z0-9_-]{4,16}$/;
        passWordReg.test(value) ? callback() : callback(new Error('请输入4-16位密码，包含字母、数字、下划线、减号'))
    }
}
const rules = reactive({
    userName: [{ validator: validateUser, trigger: 'blur' }],
    passWord: [{ validator: validatePass, trigger: 'blur' }],
})

// 表单提交
function handleSubmit() { }
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
    padding: 0;
}

.login-container {
    height: 100%;

    .card-header {
        background-color: #899fe1;

        img {
            width: 430px;
        }
    }

    .jump-link {
        text-align: right;
        margin-bottom: 10px;
    }
}
</style>