<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片表单 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"  class="input-with-select" v-model="queryData.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>

        <el-col :span="5">
          <el-button type="primary" @click="addDialogVisible=true">添加</el-button>
        </el-col>
      </el-row>

      <!-- 用户信息列表 -->
      <el-table :data="usersList" border stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>

        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="item">
            <el-switch @change="editSwitch(item.row)" v-model="item.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>

        <!-- 操作部分 -->
        <el-table-column label="操作" min-width="180">
          <template slot-scope="item">
            <!-- 编辑用户 -->
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="editUser(item.row.id)"></el-button>
            <!-- 删除用户 -->
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="deleteUser(item.row.id)"></el-button>
            <!-- 分配用户 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button size="mini" icon="el-icon-setting" type="warning"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.pagenum"
        :page-sizes="pageArray"
        :page-size="queryData.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>

      <!-- 添加用户弹出框 -->
      <el-dialog
        title="提示"
        :visible.sync="addDialogVisible"
        width="50%" @close="resetAddForm">
          <el-form :model="addForm" :rules="addRule" ref="addFormRef" label-width="70px" class="demo-addForm">
            <el-form-item label="用户" prop="username">
            <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑用户弹出框 -->
      <el-dialog
        @close="resetEditForm"
        title="编辑用户"
        :visible.sync="editDialogVisible"
        width="50%">
        <el-form :model="editForm" :rules="editRule" ref="editFormRef" label-width="70px" class="demo-editForm">
          <el-form-item label="用户">
          <el-input v-model="editForm.username" disabled=""></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserSub">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 邮箱验证
    const checkEmail = (r,v,cb)=>{
      const reg =/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      if(reg.test(v)){
        return cb()
      } 
      cb(new Error('邮箱格式错误'))
    }

    //手机验证
    const checkMobile = (r,v,cb)=>{
      const reg =/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if(reg.test(v)){
        return cb()
      } 
      cb(new Error('手机格式错误'))
    }

    return {
      queryData: {
        pagenum: 1,
        pagesize: 2,
        query: ""
      },
      totalPage: 0,
      usersList: [],
      pageArray:[2, 5, 8, 10],
      pageArrayPre:[2, 5, 8, 10],
      addDialogVisible:false,
      editDialogVisible:false,
      addForm:{
        username:'test',
        password:'123456',
        email:'123@qq.com',
        mobile:'15602922323'
      },
      addRule:{
        username:[
          { required: true, message: '用户名不能为空',trigger:'blur'},
          { min:2,max:7, message: '长度在2-7个字符之间',trigger:'blur'}
        ],
        password:[
          { required: true, message: '密码不能为空',trigger:'blur'},
          { min:2,max:7, message: '长度在2-7个字符之间',trigger:'blur'}
        ],
        email:[
          { required: true, message: '邮箱不能为空',trigger:'blur'},
          { validator:checkEmail,trigger:'blur'}
        ],
        mobile:[
          { required: true, message: '手机不能为空',trigger:'blur'},
          { validator:checkMobile,trigger:'blur'}
        ]
      },
      editForm:{
        username:'',
        email:'',
        mobile:''
      },
      editRule:{
        email:[
          { required: true, message: '邮箱不能为空',trigger:'blur'},
          { validator:checkEmail,trigger:'blur'}
        ],
        mobile:[
          { required: true, message: '手机不能为空',trigger:'blur'},
          { validator:checkMobile,trigger:'blur'}
        ]
      }
    };
  },

  methods: {
    // 获取用户列表
    async getUserList() {
      const res = await this.axios.get("users", {
        params: this.queryData
      });

      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      // console.log(res)
      this.usersList = res.data.users;
      this.totalPage = res.data.total;
    },
    // 修改用户状态
    async editSwitch(item){
      const res = await this.axios.put(`users/${item.id}/state/${item.mg_state}`)
      // console.log(res)
      if(res.meta.status!==200) return this.$message.error("修改用户状态失败")
      this.$message.success("修改用户状态成功")
    },
    // 分页改变每页数据条数
    handleSizeChange(val){
      // console.log(val)
      this.queryData.pagesize = val
      localStorage.setItem('pagesize',this.queryData.pagesize)
      this.getUserList()
    },
    // 分页改变当前页码
    handleCurrentChange(val){
      // console.log(val)
      this.queryData.pagenum = val
      this.getUserList()
    },
    // 重置添加用户表单
    resetAddForm(){
      this.$refs.addFormRef.resetFields()
    },
    // 验证成功则添加用户
    addUser(){
      this.$refs.addFormRef.validate(async flag=>{
        if(!flag) return

        const res = await this.axios.post('users',this.addForm)
        if(res.meta.status==201){
          this.$message.success(res.meta.msg)
          this.addDialogVisible = false
          this.getUserList()
        }
      })
    },
    // 编辑用户信息
    async editUser(id){
      const res = await this.axios.get(`users/${id}`)
      if(res.meta.status==200){
        this.editForm = res.data
      }
      this.editDialogVisible = true
    },
    // 重置编辑用户表单
    resetEditForm(){
      this.$refs.editFormRef.resetFields()
    },
    // 验证成功则修改用户信息
    editUserSub(){
      this.$refs.editFormRef.validate(async flag=>{
        if(!flag) return
        const res = await this.axios.put('users/'+this.editForm.id,{
          email:this.editForm.email,
          mobile:this.editForm.mobile
        })
        if(res.meta.status==200){
          this.$message.success("修改信息成功")
          this.editDialogVisible = false
          this.getUserList()
        }
      })
    },
    
    // 删除单个用户
    deleteUser(id){
      this.$confirm('确认删除用户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.axios.delete('users/'+id)
          if(res.meta.status==200){
              this.$message({
              type: 'success',
              message: '删除成功!'
              });
              this.getUserList()
          }else{
            this.$message({
              type: 'error',
              message: '删除失败'
              });
          }
         
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
  mounted(){
    this.pageArray = this.pageArrayPre
  },

  created() {
    if(localStorage.getItem('pagesize')){
      this.queryData.pagesize = parseInt(localStorage.getItem('pagesize'))
      const index = this.pageArray.findIndex(item=>{
        return item==this.queryData.pagesize
      })
      this.pageArray.unshift(this.pageArray.splice(index,1)[0])
      console.log(this.pageArray)
    }
    // 页面刷新得到所有用户信息
    this.getUserList();
  }
};
</script>

<style lang='less'>
.box-card {
  margin: 15px 0;
  .el-table {
    margin-top: 20px;
  }
  .el-pagination{
    margin-top: 10px;
  }
}
</style>
