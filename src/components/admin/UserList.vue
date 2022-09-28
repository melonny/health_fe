<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--用户列表主体部分-->
        <el-card>
            <!--搜索区域-->
            <el-row :gutter="25">
                <el-col :span="10"> 
                    <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="add">添加用户</el-button>
                </el-col>
            </el-row>
            <!--用户列表-->
            <el-table :data="userList" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="用户名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="密码" prop="password"></el-table-column>
                <el-table-column label="角色" prop="role"></el-table-column>
                <el-table-column label="状态" prop="state">
                    <!--作用域插槽-->
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.state" @change="userStateChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row)" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="deleteuser(scope.row.id)" size="mini"></el-button>
                        <el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div>
                <el-pagination 
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" 
                :current-page="queryInfo.pageNum"
                :page-sizes="[1, 2, 5, 100]" 
                :page-size="queryInfo.pageSize" 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="total">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog :title="addDialogTitle" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="saveOrUpdate">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default{
    data(){
        return{
            queryInfo:{
                query:"",
                pageNum:1, //当前页
                pageSize:5  //每页最大数
            },
            userList:[],  //用户列表
            total:0, //总记录数
            addDialogVisible:false, //对话框状态
            addDialogTitle:null,
            addForm:{
                id:'',
                username:'',
                password:'',
                email:''
            },
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    created(){
        this.getUserList();
    },
    methods:{
        async getUserList(){
            const {data:res} = await this.$http.get("/alluser",{ params: this.queryInfo});
            this.userList = res.data;
            this.total = res.numbers;
        },
        handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize;
            this.getUserList();
        },
        handleCurrentChange(newPage){
            this.queryInfo.pageNum = newPage;
            this.getUserList();
        },
        async userStateChange(userInfo){
            const {data:res} = await this.$http.put(`userStateChange?id=${userInfo.id}&state=${userInfo.state}`);
            if(res!="success"){
                // userInfo.id = !userInfo.id;
                return this.$message.error("操作失败");
            }
            this.$message.success("操作成功~");
        },
        //监听添加用户
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
        addUser(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return;
                const {data:res} = await this.$http.post("adduser",this.addForm);
                if(res!="success"){
                    return this.$message.error("操作失败");
                }
                this.$message.success("操作成功~");
                this.addDialogVisible = false;
                this.getUserList();
            });
        },
        add(){
            this.addDialogTitle="添加用户";
            this.addDialogVisible=true;
        },
        async editUser(){
            const{data:res} = await this.$http.put("edituser", this.addForm);
            if(res!="success"){
                return this.$message.error("操作失败");
            }
            this.$message.success("操作成功~");
            this.addDialogVisible=false;
            this.getUserList();
        },
        edit(userInfo){
            this.addDialogTitle="编辑用户";
            this.addDialogVisible=true;
            this.addForm.username=userInfo.username;
            this.addForm.password=userInfo.password;
            this.addForm.email=userInfo.email;
            this.addForm.id=userInfo.id;
        },
        saveOrUpdate(){
            if(this.addDialogTitle=="编辑用户"){
                this.editUser();
            }else{
                this.addUser();
            }
        },
        async deleteuser(id){
            const {data:res} = await this.$http.delete(`deleteuser?id=${id}`);
            if(res=="success"){
                this.$message.success("删除成功啦");
            }else{
                this.$message.error("阿哦，删除失败");
            }
            this.getUserList();
        }
    }
}
</script>

<style lang="less" scoped>
.el-breadcrumb{
    margin-bottom: 15px;
    font-size:17px;
}
</style>