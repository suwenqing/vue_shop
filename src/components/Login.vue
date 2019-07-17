<template>
  <div class="login">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="头像" />
      </div>

      <el-form class="login_form" :model="loginForm" :rules="loginRules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username" ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="login_button">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm:{
        username:"admin",
        password:"123456"
      },
      loginRules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields()
    },
    login(){
      this.$refs.loginFormRef.validate(async flag=>{
        if(flag){
          console.log("校验成功",this)
          const {data:res} = await this.axios.post('login',this.loginForm)
          console.log(res)
          if(res.meta.status!==200){
            this.$message.error(res.meta.msg)
            
          }else {
            this.$message.success(res.meta.msg)
            sessionStorage.setItem('token',res.data.token)
            this.$router.push('/home')
          }
        }else {
          this.$message.error("表单校验失败")
        }
      })
    }
  },

  created() {}
};
</script>

<style lang='less' scoped>
.login {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: white;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      width: 130px;
      height: 130px;
      background-color: #fff;
      // border: 1px solid green;
      box-shadow: 0 0 5px green;
      padding: 10px;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #eee;
        background-image: linear-gradient(45deg, rgba(0, 0, 0, .25) 25%, transparent 0, transparent 75%, rgba(0, 0, 0, .25)0), linear-gradient(45deg, rgba(0, 0, 0, .25) 25%, transparent 0, transparent 75%, rgba(0, 0, 0, .25) 0);
        background-position: 0 0, 15px 15px;
        /* 每个background-size对应每个渐变色大小，之前30px 30px是因为两个大小一样所有简写 */
        background-size: 30px 30px;
      }
    }
    .login_form{
      position: absolute;
      bottom:0;
      width:100%;
      padding:0 20px;
      box-sizing:border-box;
      .login_button{
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
