<template>
    <div class="login_container">
      <!--登录盒子-->
      <div class="login_box">
        <!--图标-->
        <div class="login_icon">
          <img src="~assets/logo.png" alt="">
        </div>
        <!--登录表单-->
        <el-form :model="loginForm" ref="loginFormRef" label-width="0" class="login_form" :rules="loginFormRules">
          <!--用户名-->
          <el-form-item prop="name">
            <el-input v-model="loginForm.name" prefix-icon="iconfont icon-user"/>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"/>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        loginForm: {
          name: 'admin',
          password: '123456'
        },
        loginFormRules: {
          name: [
            { required: true, message: '请输入登录名', trigger: 'blur' },
            {
              min: 2,
              max: 10,
              message: '登录名长度在 3 到 10 个字符',
              trigger: 'blur'
            }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {
              min: 3,
              max: 15,
              message: '密码长度在 3 到 15 个字符',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      login() {
        this.$refs.loginFormRef.validate(async valid => {
          // console.log(this.loginFormRules);
          if (!valid) {
            return;
          }
          const {data} = await this.$http.post('api/admin/login', this.loginForm);
          // console.log(data);
          if (data.code !== 200) {
            return this.$message.error('登录失败:' + data.message);
          }
          this.$message.success('登录成功');
          window.sessionStorage.setItem('name', this.loginForm.name);
          await this.$router.push('/home');
        })
      },
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields();
      }
    }
  }
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b5b6b;
    height: 100%;
  }
  .login_box {
    height: 300px;
    width: 450px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .login_icon {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
</style>
