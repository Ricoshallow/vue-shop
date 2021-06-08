<template>
    <div class="login_container">
      <div class="login_box">
        <!-- 头像区域 -->
        <div class="avatar_box">
          <img src="../assets/lee.jpg" alt="">
        </div>
        <!-- 表单区域 -->
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormrules" label-width="0px" class="login_form">
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item class="login_btns">
            <el-button @click="login_validate" type="primary">登录</el-button>
            <el-button @click="reset" type="info">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      //登录表单的数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456"
      },
      //表单验证规则对象
      loginFormrules: {
        username: [ { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 8, message: '用户名输入错误', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '密码错误请重新输入', trigger: 'blur' }]
      }
    }
  },
  methods: {
    //表单重置函数
    reset(){
      this.$refs.loginFormRef.resetFields();
    },
    //表单预验证和登录函数
    login_validate(){
      this.$refs.loginFormRef.validate(async valid=>{
        if (!valid){
          return
        }
        //发起登录请求
        // const result = await this.$http.post('login',this.loginForm)
        const { data: res } = await this.$http.post('login',this.loginForm)
        // console.log(res);
        if (res.meta.status !== 200){
          return this.$message.error('登录失败')
        }
        this.$message.success('登录成功')
        //1.将登陆成功后的token保存到客户端的sessionStorage中
        // 1.1项目中除了登陆之外的其他API接口，必须在登录之后才能访问
        // 1.2token只应该在当前网站打开期间生效，所以将token保存在sessionstorage中
        window.sessionStorage.setItem("token",res.data.token)
        // 2.通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push('/home')
      })
    }
  }
}
</script>
<!--scope表示只在本组件中生效-->
<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);

    .avatar_box {
      width: 120px;
      height: 120px;
      margin: -50px auto;
      border-radius: 50%;
      overflow: hidden;
 
      img {
        width: 100%;
        height: 100%;
      }

    }

    .login_form {
      position: absolute;
      width: 80%;
      left: 50%;
      top: 35%;
      margin-left: -180px;
        .login_btns {
          display: flex;
          justify-content: flex-end;
          
        }
    }


  }
  
  

</style>
