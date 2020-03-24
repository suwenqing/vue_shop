<template>
    <div class="login_content">
        <div class="login_box">
            <div class="user-icon">
                <i class="el-icon-user-solid"></i>
            </div>
            <el-form status-icon ref="loginFormRef" :rules="loginFormRules" :model="loginForm" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-s-cooperation"    v-model="loginForm.password" type="password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {

    data () {
      return {
          loginForm:{
              username:'admin',
              password:'123456'
          },
          loginFormRules:{
                username:[
                    {required:true,message:'请输入用户名',trigger:'blur'},
                    {min:3,max:10,message:'长度在3-10个字符',trigger:'blur'}
                ],
                password:[
                    {required:true,message:'请输入密码',trigger:'blur'},
                    {min:3,max:10,message:'长度在3-10个字符',trigger:'blur'}
                ]
            }
          }

    },

    methods: {
        // 重置表单
        resetForm(){
            this.$refs.loginFormRef.resetFields();
        },
        // 登录验证
        login(){
            this.$refs.loginFormRef.validate(async valid => {
                if(!valid) return;
                const {data:result} = await this.axios.post('login',this.loginForm);
                if(result.meta.status !== 200) return this.$msg.error('登录失败');
                this.$message.success('登录成功');
                sessionStorage.setItem('token',result.data.token);
                this.$router.push('/home');
            })
        }
    },

    created () {
    }
}
</script>

<style lang='less' scoped>
.login_content{
    background-color: #2b4b6b;
    height:100%;
    .login_box{
        position: absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
        width:450px;
        height:300px;
        background-color: #fff;
        .user-icon{
            text-align: center;
            height: 80px;
            line-height: 80px;
            font-size: 100px;
            color:lightsteelblue;
        }
        .demo-ruleForm{
            position:absolute;
            bottom:0;
            width:100%;
            padding:0 20px;
            box-sizing: border-box;
        }
        .btns{
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
