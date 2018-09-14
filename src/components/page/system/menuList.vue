<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 菜单列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row :gutter="10">
                <el-col :span="6"><div class="grid-content bg-purple">
                    <el-tree :data="treeData" :props="defaultProps" @node-click="treeClick"></el-tree>
                </div></el-col>
                <el-col :span="18">
                    <div class="grid-content bg-purple-light">
                        <el-form :model="ruleForm"  label-width="100px" class="demo-ruleForm">
                            <el-form-item label="名称" prop="namePass">
                                <el-input type="text" v-model="ruleForm.name" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="图标" prop="iconPass">
                                <el-input type="password" v-model="ruleForm.icon" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="权限标识" prop="permissionPass">
                                <el-input v-model="ruleForm.permission"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                                <el-button @click="resetForm('ruleForm')">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
            </el-row>
            <!--<div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>-->
        </div>

    </div>
</template>

<script>
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                treeData:[],
                defaultProps:{
                    label:'name',
                    children:'subs'
                },
                ruleForm:{}
            }
        },
        created() {
            this.getData();
            this.getTreeData();
        },
        computed: {

        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
                };
            },
            getTreeData(){
                this.$axios.post("/api/index/user-menus").then((res)=>{
                    this.treeData=res.data.data;
                    console.log(this.treeData)
                }).catch((res)=>{
                    alert(res.status);
                    console.log(res);
                })
            },
            treeClick(data){
                //获取当前树节点数据
                this.$axios.get("/api/index/getmenu",{
                    params:{id:data.id}
                }).then(res=>{
                    this.ruleForm=res.data.data;
                    console.log(this.ruleForm)
                }).catch(res=>{
                    alert(res.status);
                    console.log(res);
                })
            },resetForm(formName) {
                this.$refs[formName].resetFields();
            },submitForm(formName) {

            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>
