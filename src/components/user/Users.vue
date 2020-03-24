<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>

                 <el-col :span="4">
                     <el-button type="primary" @click="addUserDialog = true">添加用户</el-button>
                 </el-col>
            </el-row>

            <el-table :data="userList" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                          <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)">
                            </el-button>
                          </el-tooltip>
                          <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                          </el-tooltip>
                          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                          </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

             <el-pagination @current-change="handleCurrentChange"
                :page-size="queryInfo.pagesize" layout="prev, pager, next, jumper" :total="totolPage">
             </el-pagination>
        </el-card>

        <!-- 添加用户对话框 -->
        <el-dialog title="添加用户" :visible.sync="addUserDialog" width="50%" @close="addDialogClosed">
            <el-form :model="userParams" :rules="addFormRules" ref="addUserForm" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userParams.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="userParams.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userParams.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="userParams.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addUserDialog = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户对话框 -->
        <el-dialog title="提示" :visible.sync="editUserDialog" width="50%">
            <el-form :model="editInfo" :rules="addFormRules" ref="editUserForm" label-width="100px">
                <el-form-item label="用户名" prop="username" disabled>
                    <el-input v-model="editInfo.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editInfo.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editInfo.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editUserDialogClosed">重 置</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data () {
            var checkEmail = (rule,value,cb) => {
                const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

                if(regEmail.test(value)){
                    return cb();
                }

                return cb(new Error("请输入合法的邮箱"));
            };
            var checkMobile = (rule,value,cb) => {
                const regMobile = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;

                if(regMobile.test(value)){
                    return cb();
                }

                return cb(new Error("请输入合法的手机号"));
            };

            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 2
                },
                totolPage: 0,
                userList: [],
                addUserDialog: false,
                editUserDialog: false,
                userParams: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                editInfo:{
                    username: '',
                    mobile: '',
                    email: ''
                },
                addFormRules:{
                    username:[
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    email:[
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                    mobile:[
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ],
                }
            }
        },

        methods: {
            async getUserList() {
                const {data: res} = await this.axios.get('users',{
                    params:this.queryInfo
                });
                if(res.meta.status !== 200) return this.$message.error(res.meta.message);
                this.userList = res.data.users;
                this.totolPage = res.data.total;
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                console.log(newPage);
                this.getUserList();
            },
            async userStateChange(userInfo) {
                const {data: res} = await this.axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
                if(res.meta.status !== 200) {
                    userInfo.mg_state = !userInfo.mg_state;
                    return this.$message.error(res.meta.message);
                }
            },
            addDialogClosed() {
                this.$refs.addUserForm.resetFields();
            },
            addUser() {
                this.$refs.addUserForm.validate(async (valid) => {
                    if(!valid) return;

                    const {data: res} = await this.axios.post('users',this.userParams);

                    if(res.meta.status != 201) return this.$message.error(res.meta.msg);

                    this.$message.success(res.meta.msg);
                    this.addUserDialog = false;
                })
            },
            async editUser(id) {
                this.editUserDialog = true;
                const {data: res} = await this.axios.get('users/'+id);

                if(res.meta.status !== 200) return this.$message.error(res.meta.message);

                this.editInfo = res.data;
            },
            editUserDialogClosed() {
                this.$refs.editUserForm.resetFields();
            },
            async editUserInfo() {
                const {data: res} = await this.axios.put('users/'+this.editInfo.id,{
                    email: this.editInfo.email,
                    mobile: this.editInfo.mobile
                })

                if(res.meta.status !== 200) return this.$message.error(res.meta.message);

                this.getUserList();
                this.editUserDialog = false;
            }
        },

        created () {957978
            this.getUserList();
        }
    }
</script>

<style lang='less' scoped>
.el-card{
    margin-top:20px;
    box-shadow: 0 1px 1px 1px rgba(0,0,0,.15) !important;
}
.el-table{
    margin-top: 20px;
}
</style>
