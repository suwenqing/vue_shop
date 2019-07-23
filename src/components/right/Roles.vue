<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <el-button type="primary" @click="addRoleDialogVisible=true">添加角色</el-button>

        <el-table :data="rolesList" stripe border>
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row class="bd_bottom" :class="i==0?'bd_top':''" v-for="(item,i) in scope.row.children" :key="item.id">
                        <el-col :span="6">
                            <el-tag closable @close="removeTag(scope.row,item.id)" >{{item.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="18">
                            <el-row :class="i==0?'':'bd_top'" v-for="(item2,i) in item.children" :key="item2.id">
                                <el-col :span="8">
                                    <el-tag closable @close="removeTag(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="16">
                                    <el-tag closable @close="removeTag(scope.row,item3.id)" v-for="item3 in item2.children" :key="item3.id" type="warning">
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
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editRole(item.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="delRole(item.row.id)">删除</el-button>
                <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRight(item.row)">分配角色</el-button>
            </template>
            </el-table-column>
        </el-table>

        <!-- 添加用户界面 -->
        <el-dialog
        title="提示"
        @close="resetAddRole"
        :visible.sync="addRoleDialogVisible"
        width="50%">
            <el-form :model="addRoleForm" :rules="editRoleRules" ref="addRoleFormRef" label-width="100px" class="demo-addForm">
            <el-form-item label="角色名" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
            </el-form-item>
            </el-form-item>
          </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑用户界面 -->
        <el-dialog
        title="提示"
        :visible.sync="editRoledialogVisible"
        @close="resetEditForm"
        width="50%">
            <el-form :model="editRoleForm" :rules="editRoleRules" ref="editRoleFormRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button>取 消</el-button>
                <el-button type="primary" @click="editRoleSub()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色权限对话框 -->
        <el-dialog
        title="提示"
        @close="resetLeafKeys"
        :visible.sync="setRightDialogVisible"
        width="30%">
            <el-tree style="height:400px;overflow-y:scroll"  ref="setRightRef" :data="setRightList" :props="RightProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="chosedKeys"></el-tree>
            <span slot="footer" dialog-class="footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRightSub">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {

    data () {
        return {
            rolesList:[],
            roleId:0,
            addRoleDialogVisible:false,
            addRoleForm:{
                roleName:'',
                roleDesc:''
            },
            editRoleForm:{},
            editRoledialogVisible:false,
            editRoleRules:{
                roleName:[
                    {required: true, message: '角色名不能为空',trigger:'blur'},
                    { min:2,max:7, message: '长度在2-7个字符之间',trigger:'blur'}
                ],
                roleDesc:[
                    {required: true, message: '角色描述不能为空',trigger:'blur'},
                    { min:2,max:7, message: '长度在2-7个字符之间',trigger:'blur'}
                ]
            },
            setRightDialogVisible:false,
            setRightList:[],
            RightProps:{
                children:'children',
                label:'authName'
            },
            chosedKeys:[],
        }
  },

    methods: {
        // 获取所有角色信息
        async getRoles(){
            const res = await this.axios.get('roles')
            if(res.meta.status==200){
                this.rolesList = res.data
                //   console.log(this.rolesList)
            }
        },
        // 展示添加角色对话框
        async addRole(){
            this.$refs.addRoleFormRef.validate(async flag=>{
                if(!flag) return false
                const res = await this.axios.post('roles',{
                    roleName:this.addRoleForm.roleName,
                    roleDesc:this.addRoleForm.roleDesc
                })
                console.log(res)
                if(res.meta.status==201){
                    this.$message.success("添加角色成功")
                    this.addRoleDialogVisible = false
                    this.getRoles()
                }
            })
            // this.addRoleDialogVisible=false
        },
        // 重置添加角色表单
        resetAddRole(){
            this.$refs.addRoleFormRef.resetFields()
        },
        // 根据ID获取角色信息
        async editRole(item){
            this.editRoledialogVisible = true
            // console.log(item.id)
            const res = await this.axios.get('roles/'+item.id)
            // console.log(res)
            if(res.meta.status==200){
                this.editRoleForm = res.data
            }
        },
        // 编辑角色
        editRoleSub(){
            this.$refs.editRoleFormRef.validate(async flag=>{
                if(!flag) return false
                const res = await this.axios.put(`roles/${this.editRoleForm.roleId}`,{
                    roleName:this.editRoleForm.roleName,
                    roleDesc:this.editRoleForm.roleDesc
                })
                if(res.meta.status==200){
                    this.$message.success("编辑角色成功")
                    this.getRoles()
                }else {
                    this.$message.error("修改失败")
                }
            })
            this.editRoledialogVisible = false
        },
        // 重置编辑角色表单
        resetEditForm(){
            this.$refs.editRoleFormRef.resetFields()
        },
        // 删除角色
        delRole(id){
            this.$confirm('确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async () => {
                const res = await this.axios.delete(`roles/${id}`)
                if(res.meta.status==200){
                     this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getRoles()
                }
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
        },

        // 移除权限
        removeTag(row,rightId){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async () => {
                    const res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`)
                    // console.log(res)
                    if(res.meta.status==200){
                        row.children = res.data
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },

        // 获取所有权限数据 显示分配权限对话框
        async showSetRight(row){
            
            this.roleId = row.id
            this.setRightDialogVisible = true
            const res = await this.axios.get('rights/tree')
            if(res.meta.status==200){
                this.setRightList = res.data
            }
            // console.log(this.setRightList)
            this.getLeafKeys(row)
        },
        // 递归获取三级节点的id
        getLeafKeys(row){
            // console.log(row)
           
            row.children.forEach(item=>{
                if(!item.children){
                    this.chosedKeys.push(item.id)
                }else {
                    this.getLeafKeys(item)
                }
            })
        },
        // 关闭分配权限对话框清空数据
        resetLeafKeys(){
            this.chosedKeys = []
        },
        // 获取所有选择的权限
        async setRightSub(){
            // this.setRightDialogVisible = false
            // console.log(this.roleId)
            const allKeys = [...this.$refs.setRightRef.getCheckedKeys(),...this.$refs.setRightRef.getHalfCheckedKeys()]
            const idStr = allKeys.toString()
            // console.log(idStr)
            const res = await this.axios.post(`roles/${this.roleId}/rights`,{
                rids:idStr
            })
            if(res.meta.status==200){
                this.$message.success("角色授权成功")
                this.setRightDialogVisible = false
                this.getRoles()
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
