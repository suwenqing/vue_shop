<template>
    <div class="login_content">
        <div class="login_box">
            <div class="user-icon">
                <i class="el-icon-user-solid"></i>
            </div>
            <el-form status-icon :model="loginForm" class="demo-ruleForm">
                <el-form-item>
                    <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input prefix-icon="el-icon-s-cooperation"    v-model="loginForm.password" type="password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary">登录</el-button>
                    <el-button type="info">重置</el-button>
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
              username:'',
              password:''
          }
      }
    },

    methods: {},

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
