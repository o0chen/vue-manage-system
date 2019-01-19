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
                    <el-tree :data="treeData" @node-click="treeClick" node-key="id" :default-expanded-keys='defId' :default-checked-keys='defId'
                             :props="defaultProps"
                             draggable
                             @node-drop="handleDrop">
                    </el-tree>

                </div></el-col>

                <el-col :span="18">
                    <div class="grid-content bg-purple-light">
                        <el-form :model="ruleForm" ref="ruleForm"  label-width="100px" class="demo-ruleForm">
                            <el-form-item label="菜单名称" prop="name">
                                <el-input type="text" v-model="ruleForm.name" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="菜单图标" prop="icon">
                                <el-input type="text" v-model="ruleForm.icon" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="菜单类型" prop="type">
                                <el-select type="text" v-model="ruleForm.type">
                                    <el-option value="MENU" label="菜单"></el-option>
                                    <el-option value="PERMISSION" label="权限"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="权限标识" prop="permission">
                                <el-input type="text" v-model="ruleForm.permission"></el-input>
                            </el-form-item>
                            <el-form-item label="跳转路径" prop="url">
                                <el-input type="text" v-model="ruleForm.url"></el-input>
                            </el-form-item>
                            <el-form-item label="菜单显示" prop="isShow">
                                <el-select v-model="ruleForm.isShow" placeholder="请选择">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm()" >提交</el-button>
                                <el-button @click="resetForm('ruleForm')">重置</el-button>
                                <el-button type="danger" @click="deleteMenu()">删除</el-button>
                                <el-button type="success" @click="addMenuDialog()" >添加</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
            </el-row>
            <!--<div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>-->
            <el-dialog title="添加菜单" :visible.sync="chiRuleFormVisible" :before-close="resetMenu" >
                <el-form :model="chiRuleForm" ref="chiRuleForm" class="demo-ruleForm" label-width="120px">
                    <el-form-item label="父级名称" prop="parentName">
                        <el-input v-model="chiRuleForm.parentName" readonly="true" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单名称" prop="name">
                        <el-input type="text" v-model="chiRuleForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单图标" prop="icon">
                        <el-input type="text" v-model="chiRuleForm.icon" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单类型" prop="type">
                        <el-select type="text" v-model="chiRuleForm.type">
                            <el-option value="MENU" label="菜单"></el-option>
                            <el-option value="PERMISSION" label="权限"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="权限标识" prop="permission">
                        <el-input type="text" v-model="chiRuleForm.permission"></el-input>
                    </el-form-item>
                    <el-form-item label="跳转路径" prop="url">
                        <el-input type="text" v-model="chiRuleForm.url"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单显示" prop="isShow">
                        <el-select v-model="chiRuleForm.isShow" placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetMenu()">取 消</el-button>
                    <el-button type="primary" @click="addMenu()">确 定</el-button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'basetable',
        thisdata:null,
        data() {
            return {
                defId:['1'],
                tableData: [],
                treeData:[],
                defaultProps:{
                    label:'name',
                    children:'subs'
                },
                thisTreeData:null,
                fullscreenLoading: false,
                ruleForm:{
                },
                chiRuleForm:{
                    parentName:""
                },
                chiRuleFormVisible:false,
                formLabelWidth: '120px',
                options:[{
                    value: 0,
                    label: '否'
                }, {
                    value: 1,
                    label: '是'
                }]
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
                this.$axios.post("/api/index/menulist").then((res)=>{
                    this.treeData=res.data;
                    console.log(this.treeData)
                }).catch((res)=>{
                    alert(res.status);
                    console.log(res);
                })
            },
            treeClick(data){
                this.thisTreeData=data;
                //获取当前树节点数据
                this.$axios.get("/api/index/getmenu",{
                    params:{id:data.id}
                }).then(res=>{
                    this.ruleForm=res.data;
                    this.thisdata=JSON.parse(JSON.stringify(this.ruleForm));
                }).catch(res=>{
                    alert(res.status);
                    console.log(res);
                })
            },resetForm(formName) {//重置
                /*this.$nextTick(() => {
                    console.log(this.$refs[formName].resetFields());
                    this.$refs[formName].resetFields();
                });*/
                //console.log(thisdata);
                this.ruleForm=JSON.parse(JSON.stringify(this.thisdata));
               // this.treeClick({'id':this.ruleForm.id});


            },submitForm(formName) {
                //保存
                this.$axios.post("/api/index/savemenu",this.ruleForm
                ).then(res=>{
                    console.log(res);
                    this.$message({
                        message: res.message,
                        type: res.success
                    });
                    //树形菜单名称更新
                    this.thisTreeData.name=this.ruleForm.name;
                    this.thisTreeData.title=this.ruleForm.name;
                    //getTreeData();
                }).catch(res=>{
                    // alert(res.status);
                    // this.$message.error('出错了');
                    console.log(res);
                })
            }, addMenuDialog (){
                //打开添加菜单对话框
                this.chiRuleFormVisible=true;
                this.chiRuleForm.parentName= this.ruleForm.name;
                this.chiRuleForm.parentId= this.ruleForm.id;
            },addMenu(){
                //获取当前树节点数据
                this.$axios.post("/api/index/savemenu",this.chiRuleForm
                ).then(res=>{
                    console.log(res);
                    this.$message({
                        message: res.message,
                        type: res.success
                    });
                    //添加菜单
                    this.chiRuleFormVisible=false;
                }).catch(res=>{
                    // this.$message.error('出错了');
                    console.log(res);
                })
            },resetMenu(){
                //取消添加
                this.chiRuleFormVisible = false;
                this.$refs.chiRuleForm.resetFields();
            },handleDrop(before,after,inner, ev) {
                //before 当前拖拽节点   after最后进入节点   inner位置
                this.$axios.post("/api/index/dragmenu",{draggingNode:before.data.id, dropNode:after.data.id, type:inner}).
                then(
                    res=>{
                        console.log(res);
                    }
                ).catch(
                    res=>{
                        console.log(res);
                    }
                )


            },deleteMenu(){
                //删除树形节点
                this.$message({
                    message: '暂时不支持删除功能',
                    type: 'warning'
                });
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
