<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

     <el-card class="box-card">
       <el-table :data="rightsList" stripe border>
         <el-table-column type="index"></el-table-column>
         <el-table-column label="名称" prop="authName"></el-table-column>
         <el-table-column label="路径" prop="path"></el-table-column>
         <el-table-column label="权限" prop="level"></el-table-column>
         <el-table-column label="ID" prop="id"></el-table-column>
         <el-table-column label="PID" prop="pid"></el-table-column>
       </el-table>
     </el-card>
  </div>
</template>

<script>
export default {

  data () {
    return {
      rightsList:[]
    }
  },

  methods: {
    async getRights(){
      const res = await this.axios.get('rights/list')
      if(res.meta.status==200){
        console.log(res.data)
        this.rightsList = res.data
      }
    }
  },

  created () {
    this.getRights()
  }
}
</script>

<style lang='less' scoped>

</style>
