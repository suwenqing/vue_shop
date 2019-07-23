<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <el-alert
        :closable="false"
        title="注意！只可为三级分类添加参数！"
        type="warning"
        show-icon>
        </el-alert>
        请选择分类
        <el-cascader
        v-model="seleteOptArr"
        :options="cascaderList"
        :props="cascaderProps"
        @change="cascaderChange">
        </el-cascader>

        <el-tabs v-model="activeName" @tab-click="tabsHandleClick">
        <!-- 添加动态参数 -->
        <el-tab-pane label="动态参数" name="many" >
            <el-button size="mini" type="primary" @click="addParamsDialogVisible=true" :disabled="isBtnDisable">添加参数</el-button>
            <el-table :data="manyTableList" style="width: 100%" border>
                <el-table-column type="expand"> </el-table-column>
                <el-table-column type="index"> </el-table-column>
                <el-table-column label="参数名称"  prop="attr_name"> </el-table-column>
                <el-table-column label="操作"> 
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="editParams(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger"  @click="deleteParams(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <!-- 添加静态属性 -->
        <el-tab-pane label="静态属性" name="only">
            <el-button size="mini" type="primary" @click="addParamsDialogVisible=true" :disabled="isBtnDisable">添加属性</el-button>
            <el-table :data="onlyTableList" style="width: 100%" border>
                <el-table-column type="expand"> </el-table-column>
                <el-table-column type="index"> </el-table-column>
                <el-table-column label="参数名称"  prop="attr_name"> </el-table-column>
                <el-table-column label="操作"> 
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary"  @click="editParams(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="deleteParams(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        </el-tabs>
    </el-card>

    <!-- 添加参数属性对话框 -->
    <el-dialog
    @close="resetAddParamsForm"
    :title="activeName=='many'?'添加动态参数':'添加静态属性'"
    :visible.sync="addParamsDialogVisible"
    width="50%">
    <el-form ref="addParamsFormRef" :model="addParamsForm" :rules="addParamsFormRules" label-width="80px">
    <el-form-item :label="activeName=='many'?'添加参数':'添加属性'" prop="attr_name">
        <el-input v-model="addParamsForm.attr_name"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsSub">确 定</el-button>
    </span>
    </el-dialog>

    <!-- 修改参数属性对话框 -->
    <el-dialog
    @close="resetEditParamsForm"
    :title="activeName=='many'?'修改动态参数':'修改静态属性'"
    :visible.sync="editParamsDialogVisible"
    width="50%">
    <el-form ref="editParamsFormRef" :model="editParamsForm" :rules="addParamsFormRules" label-width="80px">
    <el-form-item :label="activeName=='many'?'修改参数':'修改属性'" prop="attr_name">
        <el-input v-model="editParamsForm.attr_name"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsSub">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
export default {

    data () {
        return {
            cascaderList:[],
            seleteOptArr:[1,3,6],
            cascaderProps:{
                expandTrigger: 'hover',
                label:'cat_name',
                value:'cat_id'
            },
            activeName:'many',
            onlyTableList:[],
            manyTableList:[],
            addParamsDialogVisible:false,
            addParamsForm:{
                attr_name:''
            },
            addParamsFormRules:{
                attr_name:[
                    { required: true, message: '请输入参数或属性', trigger: 'blur' }
                ]
            },
            editParamsDialogVisible:false,
            editParamsForm:{
                attr_name:''
            },
        }
    },

    methods: {
        // 获取所有分类数据
        async getCascaderList(){
            const res = await this.axios.get('categories')
            if(res.meta.status==200){
                this.cascaderList = res.data
            }
        },

        async getParams(){
            if(this.seleteOptArr.length!=3){
                this.seleteOptArr = []
                return
            }
            const res = await this.axios.get(`categories/${this.cateId}/attributes`,{
                params:{
                    sel:this.activeName
                }
            })
            if(res.meta.status==200){
                if(this.activeName=='many'){
                    this.manyTableList = res.data
                }else {
                    this.onlyTableList = res.data
                }
                // console.log(this.manyTableList)
                // console.log(this.onlyTableList)
            }
        },
        // 分类选择改变的时候触发
        cascaderChange(){
            this.getParams()
        },
        
        // 点击切换标签栏
        tabsHandleClick(){
            // console.log(this.activeName)
            this.getParams()
        },

        // 重置表单
        resetAddParamsForm(){
            this.$refs.addParamsFormRef.resetFields()
            this.addParamsForm.attr_name = ''

        },

        resetEditParamsForm(){
            this.$refs.editParamsFormRef.resetFields()
            this.editParamsForm.attr_name = ''
        },

        // 添加分类
        addParamsSub(){
            this.$refs.addParamsFormRef.validate(async flag=>{
                if(!flag) return false
                const res = await this.axios.post(`categories/${this.cateId}/attributes`,{
                    attr_name:this.addParamsForm.attr_name,
                    attr_sel:this.activeName
                })
                if(res.meta.status==201){
                    this.addParamsDialogVisible = false
                    this.$message.success(res.meta.msg)
                    this.getParams()
                }else {
                    this.$message.error("获取参数失败")
                }
            })
        },

        // 展示修改对话框并展示数据
        async editParams(row){
            this.editParamsDialogVisible = true
            // console.log(row)
            // this.editParamsForm.attr_name = row.attr_name
            const res = await this.axios.get(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                params:{
                    attr_sel:this.activeName
                }
            })
            if(res.meta.status==200){
                this.editParamsForm = res.data
            }
        },

        // 提交修改分类
        editParamsSub(){
            this.$refs.editParamsFormRef.validate(async flag=>{
                if(!flag) return false
                const res = await this.axios.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,{
                    attr_name:this.editParamsForm.attr_name,
                    attr_sel:this.activeName
                })
                if(res.meta.status==200){
                    this.$message.success(res.meta.msg)
                    this.getParams()
                    this.editParamsDialogVisible = false
                }
            })
        },

        // 删除参数
        deleteParams(row){
            console.log(row)
             this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async () => {
                const res = await this.axios.delete(`categories/${this.cateId}/attributes/${row.attr_id}`)
                if(res.meta.status==200){
                    this.$message.success(res.meta.msg)
                    this.getParams()
                }
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
        }

    },

    created () {
        this.getCascaderList()
        this.getParams()
    },
    computed:{
        isBtnDisable(){
            if(this.seleteOptArr.length===3) {
                return false
            }
            return true
        },
        cateId(){
            if(this.seleteOptArr.length===3) {
                return this.seleteOptArr[2]
            }
            return null
        }
    }
}
</script>

<style lang='less' scoped>
.el-cascader{
    margin-top: 15px;
}
</style>
