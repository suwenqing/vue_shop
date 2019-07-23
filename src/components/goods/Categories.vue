<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        <tree-table border stripe
        style="margin-top:15px"
        :selection-type="false"
        :expand-type="false"
        :show-row-hover="false"
        :data="cateList"
        :columns="columns">

            <template slot="isok" scope="scope">
                <i :style="scope.row.cat_deleted?'color:red':'color:lightgreen'" :class="scope.row.cat_deleted?'el-icon-error':'el-icon-success'"></i>
            </template>

            <template slot="order" scope="scope">
                <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
                <el-tag type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
                <el-tag type="warning" v-else>三级</el-tag>
            </template>

            <template slot="opt" scope="scope">
                <el-button size="mini" type="primary" class="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" class="el-icon-delete">删除</el-button>
            </template>
        </tree-table>

        <!-- 分页 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryData.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>

        <!-- 添加商品分类对话框 -->
        <el-dialog
        title="添加分类"
        @close="resetCateForm"
        :visible.sync="addCateDialogVisible"
        width="50%">
            <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateRule" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader 
                    clearable
                    v-model="selectOptArr" :options="parentCate"  :props="cascaderProps"
                    @change="cascaderChange">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCateSub">确 定</el-button>
            </span>
        </el-dialog>
       
    </el-card>
  </div>
</template>

<script>
export default {

  data () {
    return {
        queryData:{
            type:3,
            pagenum:1,
            pagesize:10
        },
        addCateDialogVisible:false,
        cateList:[],
        total:0,
        columns:[
            {label:'分类名称',prop:'cat_name'},
            {label: '是否有效',type: 'template',template: 'isok'},
            {label: '排序',type: 'template',template: 'order'},
            {label: '操作',type: 'template',template: 'opt',minWidth:'300px'},
        ],
        addCateForm:{
            cat_name:'',
            cat_pid:0,
            cat_level:0
        },
        addCateRule:{
            cat_name:[
                { required: true, message: '请输入分类名称', trigger: 'blur' },
                { min: 2, max: 20, message: '长度在 2 到 7 个字符', trigger: 'blur' }
            ]
        },
        parentCate:[],
        selectOptArr:[],
        cascaderProps:{
            value:'cat_id',
            label:'cat_name',
            expandTrigger:'hover',
            checkStrictly:true
        }
    }
  },

  methods: {
    // 获取所有商品分类
    async getGoodsCate(){
        const res = await this.axios.get('categories',{
            params:this.queryData
        })
        if(res.meta.status==200){
            // this.$message.success(res.meta.msg)
            this.cateList = res.data.result
            this.total = res.data.total
            // console.log(this.cateList,this.total)
        }
    },
    // 处理每页显示条数
    handleSizeChange(size){
        this.queryData.pagesize = size
        this.getGoodsCate()
    },
    // 处理显示哪一页
    handleCurrentChange(num){
        this.queryData.pagenum = num
        this.getGoodsCate()
    },
    // 重置验证表单
    resetCateForm(){
        this.$refs.addCateFormRef.resetFields()
        this.selectOptArr = []
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
    },
    // 获取分类数据 打开添加分类对话框
    async showAddCateDialog(){
        this.addCateDialogVisible=true
        const res = await this.axios.get('categories',{
            params:{
                type:2
            }
        })
        if(res.meta.status==200){
            this.parentCate = res.data
        }
        // console.log(this.parentCate)
    },

    // 分类数据发生变化时，触发该函数
    cascaderChange(){
        // console.log(this.selectOptArr)
        if(this.selectOptArr.length>0){
            this.addCateForm.cat_pid = this.selectOptArr[this.selectOptArr.length-1]
            this.addCateForm.cat_level = this.selectOptArr.length
        }else {
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0
        }
    },
    
    addCateSub(){
        this.$refs.addCateFormRef.validate(async flag=>{
            if(!flag) return false
            const res = await this.axios.post('categories',this.addCateForm)
            if(res.meta.status==201){
                this.$message.success("添加分类成功")
                this.addCateDialogVisible = false
                this.getGoodsCate()
            }
        })
    }
  },

  created () {
      this.getGoodsCate()
  }
}
</script>

<style lang='less' scoped>

</style>
