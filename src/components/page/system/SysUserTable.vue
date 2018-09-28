<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
              <!--  <el-select v-model="select_role" placeholder="筛选省份" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>-->
                <el-select v-model="select.role" placeholder="请选择" filterable :filter-method="test">
                    <el-option v-for="item in options.roles" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>

                <el-input v-model="select.word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" label="序号" width="50" >
                </el-table-column>
                <el-table-column prop="createDate" label="创建日期" sortable width="150"  :formatter="formatter">
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="120">
                </el-table-column>
                <el-table-column  label="角色" >
                   <!-- {{scope.row.sysRole.roleName}}-->
                    <template slot-scope="scope">
                  <!--      <el-popover trigger="hover" placement="top">-->
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.sysRole.roleName }}</el-tag>
                            </div>
                   <!--     </el-popover>-->
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="创建日期">
                    <el-date-picker disabled type="date" placeholder="选择日期" v-model="form.createDate" value-format="yyyy-MM-dd"  style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-input v-model="form.sysRoleId"></el-input>
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
    import Qs from 'qs'

    export default {
        name: 'sysUsertable',
        data() {
            return {
                // url: '/api/user/test1',
                url: '/api/base/listSysUserByPage',
                optionsUrl: '/api/options/getByTypes',
                tableData: [],
                page:{
                    cur_page: 1,
                    page_size: 10,
                    total_size:0
                },
                multipleSelection: [],
                select:{//查询参数
                    role: '',
                    word: ''
                },
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    name: '',
                    createDate: '',
                    address: ''
                },
                options:{
                    roles:[]
                },
                idx: -1
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                console.log(this.tableData);
                return this.tableData.filter((d) => {
                    let is_del = false;
                    // for (let i = 0; i < this.del_list.length; i++) {
                    //     if (d.name === this.del_list[i].name) {
                    //         is_del = true;
                    //         break;
                    //     }
                    // }
                    if (!is_del) {
                            return d;
                    }
                })
            }
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.page.page_size=val;
                this.getData();

            },
            // 分页导航
            handleCurrentChange(val) {
                this.page.cur_page = val;
                this.getData();
            },
            // 获取数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                // if (process.env.NODE_ENV === 'development') {
                //     this.url = '/ms/table/list';
                // };
                console.log(this.page.cur_page)
                console.log(this.page.page_size)
                this.$axios.post(this.url, Qs.stringify({
                    page: this.page.cur_page-1,
                    size: this.page.page_size
                })).then((res) => {
                    console.log(res.data)
                    this.tableData = res.data.content;
                    this.page.total_size=res.data.totalElements;
                    this.page.cur_page=res.data.number+1;
                });

                this.$axios.post(this.optionsUrl,this.options).then((res) => {
                    console.log(res);
                    this.options = res.data;
                });
            },
            search() {
                this.is_search = true;
                //查询中

            },
            formatter(row, column) {
                return formatDate(row.createDate,'yyyy-MM-dd hh:mm:ss');
                // return row.createDate
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    createDate: item.createDate,
                    address: item.address
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
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
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            },
            test(val){
                if (val) { //val存在
                    this.options = this.backUpArr.filter((item) => {
                        if (!!~item.label.indexOf(val) || !!~item.value.indexOf(val)) {
                            return true
                        }
                    })
                } else { //val为空时，还原数组
                    this.options = this.backUpArr
                }
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
