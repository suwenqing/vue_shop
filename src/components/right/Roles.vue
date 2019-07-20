<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <el-button type="primary">添加角色</el-button>

        <el-table :data="rolesList" stripe border>
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row class="bd_bottom" :class="i==0?'bd_top':''" v-for="(item,i) in scope.row.children" :key="item.id">
                        <el-col :span="6">
                            <el-tag>{{item.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="18">
                            <el-row :class="i==0?'':'bd_top'" v-for="(item2,i) in item.children" :key="item2.id">
                                <el-col :span="8">
                                    <el-tag type="success">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="16">
                                    <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning">
                                        {{item3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="角色操作" width="300">
            <template slot-scope="item">
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                <el-button type="warning" size="mini" icon="el-icon-setting">分配角色</el-button>
            </template>
            </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>
export default {

  data () {
    return {
        rolesList:[]
    }
  },

  methods: {
      async getRoles(){
          const res = await this.axios.get('roles')
          if(res.meta.status==200){
              this.rolesList = res.data
            //   console.log(this.rolesList)
          }
      }
  },

  created () {
      this.getRoles()
  }
}
</script>

<style lang='less' scoped>
.el-tag{
    margin:8px;
}
.bd_bottom{
    border-bottom: 1px solid #ddd
}
.bd_top{
    border-top: 1px solid #ddd;
}
.el-row{
    display: flex;
    align-items: center;
}
</style>
