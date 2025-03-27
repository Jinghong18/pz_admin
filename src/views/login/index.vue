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
        <el-form ref="loginFormRef" :model="loginForm" style="max-width: 600px;" class="demo-ruleForm" :rules="rules">
          <el-form-item prop="userName">
            <el-input v-model="loginForm.userName" placeholder="手机号" prefix-icon="UserFilled"></el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input v-model="loginForm.passWord" placeholder="密码" type="password" prefix-icon="Lock"></el-input>
          </el-form-item>
          <el-form-item v-if="formType" prop="validCode">
            <el-input v-model="loginForm.validCode" placeholder="验证码" prefix-icon="Lock">
              <template #append>
                <span @click="countDownChange">{{ countDown.validText }}</span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :style="{ 'width': '100%' }" @click="handleSubmit(loginFormRef)">{{ formType ?
              '注册账号' :
              '登录'
            }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
  </template>
  
  <script setup>
  import { ElMessage } from 'element-plus';
  import { ref, reactive, toRaw } from 'vue';
  import { getCode, userAuthentication, login, menuPermissions } from '../../api/index';
  import { useMenuStore } from '../../stores/index';
  import router from '../../router/index';
  
  // 获取 Pinia 状态管理
  const menuStore = useMenuStore();
  
  const imgUrl = new URL('@/../public/login-head.png', import.meta.url).href;
  
  
  // 表单数据
  const loginForm = reactive({
    userName: '',
    passWord: '',
    validCode: ''
  });
  
  // 发送短信
  const countDown = reactive({
    validText: '获取验证码',
    time: 60,
  });
  
  // 切换表单 {0: '登录', 1: '注册'}
  const formType = ref(0);
  
  // 点击切换登录和注册
  function handleChange() {
    formType.value = 1 - formType.value;
  }
  
  // 表单校验规则
  const validateUser = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入手机号'));
    } else {
      const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
      if (!phoneReg.test(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback(undefined);
      }
    }
  };
  
  // 密码校验规则
  const validatePassWord = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入密码'));
    } else {
      const passWordReg = /^[a-zA-Z0-9_-]{4,16}$/;
      if (!passWordReg.test(value)) {
        callback(new Error('密码长度为4-16位，且必须包含字母、数字、下划线或减号'));
      } else {
        callback(undefined);
      }
    }
  };
  
  // 表单验证规则
  const rules = reactive({
    userName: [{ validator: validateUser, trigger: 'blur' }],
    passWord: [{ validator: validatePassWord, trigger: 'blur' }],
    validCode: [
      { required: true, message: '请输入验证码', trigger: 'blur' },
      { min: 4, max: 4, message: '验证码长度为4位', trigger: 'blur' }
    ]
  });
  
  let flag = false; // 用于防止重复发送验证码请求
  
  function countDownChange() {
    if (flag) return;
  
    const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
      return ElMessage({ message: '请检查手机号是否正确', type: 'warning' });
    }
  
    countDown.time = 60;
    countDown.validText = `剩余${countDown.time}s`;
    flag = true;
  
    const interval = setInterval(() => {
      if (countDown.time > 0) {
        countDown.time--;
        countDown.validText = `剩余${countDown.time}s`;
      } else {
        clearInterval(interval);
        countDown.validText = '获取验证码';
        flag = false;
      }
    }, 1000);
  
    getCode({ tel: loginForm.userName }).then(({ data }) => {
      if (data.code === 10000) {
        ElMessage.success('发送成功');
      }
    });
  }
  
  const loginFormRef = ref();
  
  
  // 登录提交
  const handleSubmit = async (formEl) => {
    if (!formEl) return;
  
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log(loginForm, 'submit!');
        if (formType.value) {
          userAuthentication(loginForm).then(({ data }) => {
            if (data.code === 10000) {
              ElMessage.success('注册成功，请登录');
              formType.value = 0;
            }
          });
        } else {
          login(loginForm).then(({ data }) => {
            if (data.code === 10000) {
              ElMessage.success('登录成功');
              localStorage.setItem('pz_token', data.data.token);
              localStorage.setItem('pz_userInfo', JSON.stringify(data.data.userInfo));
  
              // 请求权限菜单
              menuPermissions().then(({ data }) => {
                menuStore.dynamicMenu(data.data);
                console.log(menuStore.state.routerList, 'routerList_1');
                toRaw(menuStore.state.routerList).forEach((item) => {
                  if (item.redirect) {
                    router.addRoute({
                      path: item.path,
                      redirect: item.redirect
                    });
                  } else {
                    router.addRoute('main', item);
                  }
                });
                console.log(router.getRoutes(), 'router_1');
                router.push('/');
              });
            } else {
              ElMessage.error('登录失败，请检查手机号或密码');
            }
          });
        }
      } else {
        console.log('error submit!', fields);
      }
    });
  };
  
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