<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {

  data () {
    return {
    }
  },

  methods: {
      logout(){
          sessionStorage.removeItem('token')
          this.$router.push('/login')
          this.$message.success('退出成功')
      }
  },

  created () {
  }
}
</script>

<style lang='less' scoped>

</style>
