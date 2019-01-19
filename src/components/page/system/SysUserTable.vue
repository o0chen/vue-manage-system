<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="hide handle-del mr10" @click="delAll">批量删除</el-button>
                <el-button type="primary" icon="add" class="handle-del mr10" @click="handleAdd">添加</el-button>
                <!--  <el-select v-model="select_role" placeholder="筛选省份" class="handle-select mr10">
                      <el-option key="1" label="广东省" value="广东省"></el-option>
                      <el-option key="2" label="湖南省" value="湖南省"></el-option>
                  </el-select>-->
                <el-select v-model="query.role" placeholder="请选择"
                           multiple
                           filterable :filter-method="test">
                    <!--@focus="initSelectData()"-->
                    <el-option v-for="item in options.roles" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>

                <el-input v-model="query.keyword" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="" icon="clear" @click="clear">清空</el-button>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable"
                      @selection-change="handleSelectionChange" @sort-change="sortChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" label="序号" width="50">
                </el-table-column>

                <!-- 动态列 -->
                <template v-for='(col) in tableColumns' ><!--slot-scope="{row,$index}"-->
                    <el-table-column
                        :sortable="col.sortable"
                        :show-overflow-tooltip="false"
                        :prop="col.dataKey"
                        :label="col.colName"
                        :key="col.dataKey"
                        :formatter="col.formatter"
                        :width="col.width">
                        <TableTd  v-if="hackReset" ref="td" :col="col" :rowData="scope.row" slot-scope="scope"></TableTd>

                    </el-table-column>
                </template>


                <el-table-column label="操作" width="180">
                    <template  slot-scope="scope">
                        <el-button v-if="!(scope.row.editable)" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button v-if="!(scope.row.editable)" size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button v-if="(scope.row.editable)" size="small" @click="saveRowEdit(scope.$index, scope.row,this)">保存</el-button>
                        <el-button v-if="(scope.row.editable)" size="small" type="danger" @click="cancelRowEdit(scope.$index, scope.row)">取消</el-button>
                    </template>

                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="total, sizes, prev, pager, next, jumper"
                    :current-page="page.cur_page"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="page.page_size"
                    :total="page.total_size"/>
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="formTitle" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="创建日期">
                    <el-date-picker placeholder="选择日期"
                                    v-model="form.createDate"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    type="datetime"
                                    style="width: 100%;">
                    </el-date-picker>

                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>

                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <!--<el-input v-model="form.sysRoleId"></el-input>-->
                    <el-select v-model="form.sysRole.id" placeholder="请选择"
                               filterable :filter-method="test"
                               style="width: 100%;">
                        <el-option v-for="item in options.roles" :key="item.value" :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>



        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {formatDate} from '../../utils/dateUtil.js'
    import {myValidater} from '../../utils/myValidater.js'
    import {commonUtils} from '../../utils/commonUtils.js'
    import TableTd from '../component/TableTd'
    // import {tableData} from '../component/tableData.js'
    import Qs from 'qs'
    import extend from 'extend'

    export default {
        name: 'sysUserTable',
        data() {
            return {
                formTitle:"",
                url: '/api/base/listSysUserByPage',
                deleteUrl: '/api/base/l_deleteSysUserById',
                optionsUrl: '/api/options/getByTypes',
                saveOrUpdateUrl: '/api/base/saveOrUpdateSysUser',
                tableColumns: [],
                tableData: [],
                tableBakData: [],
                page: {
                    cur_page: 1,
                    page_size: 10,
                    total_size: 0
                },
                multipleSelection: [],
                query: {//查询参数
                    role: '',
                    keyword: ''
                },
                del_list: [],
                is_search: false,
                editVisible: false,
                addVisible: false,
                delVisible: false,
                form: {
                    id: '',
                    // name: '',
                    createDate: '',
                    sysRole: {id: ''}//这个必须有
                },
                options: {
                    roles: []
                },
                bakOptions: {
                    roles: []
                },
                rules: {
                    mobile: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'},
                        {validator: myValidater.phoneNumber, trigger: 'blur'}
                    ]
                },
                idx: -1,
                hackReset: true
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                console.log(this.tableData);

                return this.tableData.filter((d) => {
                    /* for (let i = 0; i < this.tableData.length; i++) {
                         if (d.name === this.del_list[i].name) {

                         }
                     }
                     if (!is_del) {
                         return d;
                     }*/
                    return d;
                })
            }
        },
        mounted: function () {
            console.log("父组件mounted");


        },

        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.page.page_size = val;
                this.getData();

            },
            // 分页导航
            handleCurrentChange(val) {
                this.page.cur_page = val;
                this.getData();
            },
            // 获取数据
            getData: function () {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                // if (process.env.NODE_ENV === 'development') {
                //     this.url = '/ms/table/list';
                // };

                let queryParams = {};
                queryParams.page = this.page.cur_page - 1;
                queryParams.size = this.page.page_size;
                if(this.query.role instanceof Array)
                {
                    queryParams['sysRole.id_in'] = (this.query.role).join(",");//转字符串，多个值（数组）;后台没处理。。。。需要设置表单提交;别强转数字，会变为0
                }
                Object.assign(queryParams, this.query);
                queryParams.delFlag = 0;
                console.log(JSON.stringify(queryParams));
                console.log(Qs.stringify(queryParams));
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                this.$axios.post(this.url, Qs.stringify(queryParams), config).then((res) => {
                    console.log(res.data)
                    this.tableData = res.data.content;
                   // this.tableBakData=this.deepClone(this.tableData);
                    extend(true,this.tableBakData,this.tableData);//深度克隆
                    // alert(this.tableBakData===this.tableBakData);
                    this.page.total_size = res.data.totalElements;
                    this.page.cur_page = res.data.number + 1;
                });

                this.$axios.post(this.optionsUrl, this.options).then((res) => {
                    console.log(res);
                    this.options = res.data;
                    this.bakOptions = {...this.options};//浅复制
                    //这样才能保证传过去的select_data不为空
                    this.tableColumns = [
                        {
                            sortable: 'custom',
                            is_datetime: true,
                            colName: "创建日期",
                            dataKey: "createDate"/*,
                            width: "205px"*/
                            // dateType: "datetime",
                            // formatter:"yyyy-MM-dd HH:mm:ss"
                        },
                        {sortable: false, is_input: true, autocompleteItems:[
                                { "value": "(小杨生煎)西郊百联餐厅", "address": "长宁区仙霞西路88号百联2楼" },
                                { "value": "阳阳麻辣烫", "address": "天山西路389号" },
                                { "value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13" }
                            ],colName: "姓名", dataKey: "name"/*, width: "120px"*/},
                        {sortable: false, is_input: true, colName: "手机号", dataKey: "mobile",validator:"mobile"},
                        /*{"sortable": false,is_select:true,select_data:this.options.roles,"colName": "角色id", "dataKey": "sysRole.id"},*/
                        {
                            sortable: false,
                            is_select: true,
                            select_data: this.bakOptions.roles,//不希望父组件的筛选影响到子组件
                            colName: "角色",
                            dataKey: 'sysRole.id'
                        }
                    ];

                });
            },
            search() {
                this.is_search = true;
                //查询中
                this.getData();
            },
            clear() {
                for (let key in this.query) {
                    if(this.query[key] instanceof Array){
                        this.query[key]=[];
                    }else {
                        this.query[key] = "";
                    }
                }
            },
            formatter(row, column) {
                return formatDate(row.createDate, 'yyyy-MM-dd hh:mm:ss');
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleAdd(){

                let addJson={}
                for(let i in this.tableColumns){
                    addJson=commonUtils.cutStringKeyToJsonKey(this.tableColumns[i].dataKey,addJson)
                }
                //方式一 ：表格编辑
               /* addJson.editable=true;//表格编辑
                this.tableData.push(addJson);*/

                //方式二
                Object.assign(this.form, addJson);
                this.editVisible=true;


            },
            handleEdit(index, row) {
                this.idx = index;
                //方式一 ：表格编辑
                this.tableData[index].editable=true;//表格编辑
                console.log(JSON.stringify(this.tableData[index]));
                console.log(JSON.stringify(this.tableBakData[index]));
                // var temp=this.tableData[index];//表格编辑数据发生变化才重新渲染。。。。这个坑
                this.hackReset = false;
                this.$nextTick(() => {
                    this.hackReset = true;
                });
                //按钮替换


              /*  //方式二 ：弹窗编辑
                const item = this.tableData[index];
                // alert(Qs.stringify(item))
                Object.assign(this.form, item);
                this.form.createDate = formatDate(item.createDate, 'yyyy-MM-dd hh:mm:ss');
                this.editVisible = true;
                console.log(this.$refs['form'])*/
            },
            handleDelete(index, row) {
                this.idx = index;
                this.form.id = row.id,
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                console.log(this.$refs['form'])
                let optext="修改第" +(this.idx + 1) +"行成功";
                if(!this.form.id){
                    optext="添加成功"
                }
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        console.log(this.form);
                        this.$axios.post(this.saveOrUpdateUrl, this.form).then((res) => {
                            console.log(res.data)
                            this.$message.success(optext);
                            //修改行数据
                            extend(this.tableData[this.idx], res.data);
                        });
                        // this.editVisible = false;
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            saveRowEdit(index, row,obj) {
                let rowColNum = this.tableColumns.length;
                let i = 0;
                let passed=true;
                // console.log(rowColNum);
                // console.log(this.$refs['td']);
                while (i < rowColNum) {
                    let indx=index * rowColNum + i;
                    this.$refs['td'][indx].validate((valid,invalidFields) => {
                        if (valid) {

                        }else {
                            passed=false;
                            console.log(invalidFields);
                            for (let key in invalidFields ) {
                                this.$message.error(invalidFields[key][0].message);
                            }
                            return false;
                        }
                    });
                    i++;
                }

                if(passed){
                    console.log(this.tableData[index]);
                    let optext="修改第" +(index + 1) +"行成功";
                    if(!this.tableData[index].id){
                        optext="添加成功"
                    }
                    this.$axios.post(this.saveOrUpdateUrl, this.tableData[index]).then((res) => {
                        console.log(res.data);
                        this.$message.success(optext);
                        extend(true,this.tableData[index],res.data);
                        this.tableData[index].editable = false;
                        extend(true,this.tableBakData[index],this.tableData[index]);
                        this.hackReset = false;
                        this.$nextTick(() => {
                            this.hackReset = true;
                        });
                    });
                }
                console.log("i="+i);
                console.log(rowColNum);

            },
            cancelRowEdit(index, row) {
                console.log(JSON.stringify(this.tableData[index]));
                console.log(JSON.stringify(this.tableBakData[index]));
                // this.tableData[index]=Object.assign( this.tableData[index],this.tableBakData[index]);//浅克隆
                if(!this.tableData[index].id){
                    this.tableData.splice(index,1);
                }else {
                    extend(true,this.tableData[index],this.tableBakData[index]);//深度克隆
                    //this.tableBakData=this.deepClone(this.tableBakData);
                    this.tableData[index].editable = false;
                }
                this.hackReset = false;
                this.$nextTick(() => {
                    this.hackReset = true;
                });
            },
            sortChange(column, prop, order){
                // console.log(column)
                // console.log(prop)
                // console.log(order)
                if(column.order.startsWith("asc")){
                    // this.query.sort=column.prop;
                    this.query.sort=column.column.property;
                }else  if(column.order.startsWith("desc")){
                    this.query.sort=column.column.property+",desc";
                }
                this.getData();
            },
            // 确定删除
            deleteRow() {
                this.tableData.splice(this.idx, 1);
                this.$axios.post(this.deleteUrl, Qs.stringify({id: this.form.id})).then((res) => {
                    console.log(res.data)
                    this.$message.success(res.message);
                    //this.search();
                    this.delVisible = false;
                });
                // this.delVisible = false;
            }/*,
            initSelectData(){
                if(!!this.bakOptions&&!!this.bakOptions.roles)
                {
                    this.options.roles = this.bakOptions.roles;
                }
            }*/,
            test(val) {
                console.log("@@!!@@" + JSON.stringify(this.bakOptions));
                if (val) {
                    //val存在
                    this.options.roles = this.bakOptions.roles.filter((item) => {
                        if (!!~item.label.indexOf(val) || !!~item.value.indexOf(val)) {
                            return true
                        }
                    })
                } else { //val为空时，还原数组
                    this.options.roles = this.bakOptions.roles
                }
            }

        },
        components: {
            TableTd
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

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }
</style>
