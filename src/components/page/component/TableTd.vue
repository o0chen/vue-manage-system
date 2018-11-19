<template slot-scope="scope">
    <el-form ref="td" :model="rowData" :rules="rules"><!--能编辑的列才显示 -->
        <el-form-item label="" :prop="col.validator" class="my-el-form-item"><!-- -->
            <el-autocomplete v-if="rowData.editable&&col.is_autocomplete && !col.dataKey.includes('.') "
                             class="inline-input width-full"
                             v-model="rowData[col.dataKey]"
                             :fetch-suggestions="inputQuerySearch"
                             :trigger-on-focus="true"
                             placeholder="请输入内容"
            ></el-autocomplete>
            <!--<el-input v-if="col.is_datetime && !col.dataKey.includes('.')" v-model="rowData[col.dataKey]" filter=""></el-input>-->
            <el-date-picker v-else-if="rowData.editable&&col.is_datetime && !col.dataKey.includes('.')"
                            placeholder="选择日期和时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            v-model="rowData[col.dataKey]"
                            style="width: 100%;">
            </el-date-picker>
            <el-date-picker v-else-if="rowData.editable&&col.is_date && !col.dataKey.includes('.')"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                            type="date"
                            v-model="rowData[col.dataKey]"
                            style="width: 100%;">
            </el-date-picker>
            <el-input v-else-if="rowData.editable&&col.is_input && !col.dataKey.includes('.')"
                      v-model="rowData[(col.dataKey)]"
                      clearable
                      class="width-full"
            ><!--@change="(col.validator)"  clearable-->
            </el-input>

            <el-select v-else-if="rowData.editable&&col.is_select && !col.dataKey.includes('.')" @focus="initSelectData()"
                       v-model="rowData[col.dataKey]"
                       placeholder="请选择"
                       class="width-full"
                       filterable :filter-method="selectSearch">
                <el-option v-for="item in col.select_data" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>

            <el-select v-else-if="rowData.editable&&col.is_select && col.multiple && !col.dataKey.includes('.')" @focus="initSelectData()"
                       v-model="rowData[col.dataKey]"
                       multiple
                       placeholder="请选择"
                       class="width-full"
                       filterable :filter-method="selectSearch">
                <el-option v-for="item in col.select_data" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>


            <!--暂时只处理两层的-->
            <el-autocomplete v-else-if="rowData.editable&&col.is_autocomplete && col.dataKey.includes('.') "
                             class="inline-input width-full"
                             v-model="rowData[col.dataKey.split('.')[0]][col.dataKey.split('.')[1]]"
                             :fetch-suggestions="inputQuerySearch"
                             :trigger-on-focus="true"
                             placeholder="请输入内容"
            ></el-autocomplete>
            <el-date-picker v-else-if="rowData.editable&&col.is_datetime && col.dataKey.includes('.')"
                            placeholder="选择日期和时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            v-model="rowData[col.dataKey.split('.')[0]][col.dataKey.split('.')[1]]"
                            style="width: 100%;">
            </el-date-picker>
            <el-date-picker v-else-if="rowData.editable&&col.is_date && col.dataKey.includes('.')"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                            type="date"
                            v-model="rowData[col.dataKey.split('.')[0]][col.dataKey.split('.')[1]]"
                            style="width: 100%;">
            </el-date-picker>
            <el-input v-else-if="rowData.editable&&col.is_input && col.dataKey.includes('.')"
                      v-model="rowData[col.dataKey.split('.')[0]][col.dataKey.split('.')[1]]"
                      clearable
                      class="width-full"
            ><!--@change="(col.validator)"  clearable-->
            </el-input>

            <el-select v-else-if="rowData.editable&&col.is_select && col.dataKey.includes('.')"
                       @focus="initSelectData()"
                       v-model="rowData[col.dataKey.split('.')[0]][col.dataKey.split('.')[1]]"
                       placeholder="请选择"
                       class="width-full"
                       filterable :filter-method="selectSearch">
                <el-option v-for="item in col.select_data" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>

            <el-select v-else-if="rowData.editable&&col.is_select && col.multiple && col.dataKey.includes('.')"
                       @focus="initSelectData()"
                       v-model="rowData[col.dataKey.split('.')[0]][col.dataKey.split('.')[1]]"
                       multiple
                       placeholder="请选择"
                       class="width-full"
                       filterable :filter-method="selectSearch">
                <el-option v-for="item in col.select_data" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>


            <!-- 不需要编辑的数据列 -->
            <label v-else="!rowData.editable||col.is_label" class="width-full">{{fo(this.rowData,this.col) }}</label>

            <!--<label v-if="rowData.status === 1" class="indisable">{{col.dataKey +'(已禁用)' || '&#45;&#45;'}}</label>
            <label v-if="!rowData.isEdit && rowData.status === 0">{{col.dataKey || '&#45;&#45;'}}</label>-->


        </el-form-item>
    </el-form>
</template>


<script>
    import {formatDate} from '../../utils/dateUtil.js'
    import {myValidater} from '../../utils/myValidater.js'

    export default {
        name: 'TableTd',
        data() {
            return {
                inputQueryItems: [],
                bakOptions: null,
                rules: {
                    mobile: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'},
                        {validator: myValidater.phoneNumber, trigger: 'blur'}
                    ]
                }
                /*    rowData:{},
                    col: {
                      /!*  sortable: false,
                        is_input: false,
                        is_select: false,
                        is_date: false,
                        is_datetime: false,
                        is_autocomplete: false,
                        colName: null,
                        dataKey: null,
                        width: null,
                        text:null,
                        value:null,
                        formatter:null,*!/
                    }*/
            }
        },
        created() {

        },
        computed: {
            data() {

            }
        },
        beforeCreate: function () {

            // console.group('------beforeCreate创建前状态------');
            // console.log("%c%s", "color:red" , "el     : " + this.$el); //undefined
            // console.log("%c%s", "color:red","data   : " + this.$data); //undefined
            // console.log("%c%s", "color:red","message: " + this.message)
        },
        created: function () {
            // console.group('------created创建完毕状态------');
            // console.log("%c%s", "color:red","el     : " + this.$el); //undefined
            // console.log("%c%s", "color:red","data   : " + this.$data); //已被初始化
            // console.log("%c%s", "color:red","message: " + this.message); //已被初始化
        },
        beforeMount: function () {
            // console.group('------beforeMount挂载前状态------');
            // console.log("%c%s", "color:red","el     : " + (this.$el)); //已被初始化
            // console.log(this.$el);
            // console.log("%c%s", "color:red","data   : " + this.$data); //已被初始化
            // console.log("%c%s", "color:red","message: " + this.message); //已被初始化
            //格式化

        },
        mounted: function () {
            // console.group('------mounted 挂载结束状态------');
            // console.log("%c%s", "color:red","el     : " + this.$el); //已被初始化
            // console.log(this.$el);
            // console.log("%c%s", "color:red","data   : " + this.$data); //已被初始化
            // console.log("%c%s", "color:red","message: " + this.message); //已被初始化
            // console.log(this.col.formatter);
            /* console.log(this.rowData[this.col.dataKey])
             if (this.col.is_datetime && this.col.formatter) {
                 this.rowData[this.col.dataKey] = formatDate(this.rowData[this.col.dataKey], this.col.formatter);
             }*/
            if (!this.bakOptions && !!this.col.select_data) {
                this.bakOptions = this.col.select_data;
            }
            if(this.col.is_autocomplete){
                this.inputQueryItems = this.col.autocompleteItems;
            }

        },
        beforeUpdate: function () {
            // console.log("子组件mounted");
            // console.log(this.col.select_data);
            // console.log(this.bakOptions);

            //格式化
            /* console.log(this.rowData[this.col.dataKey])
             if (this.col.is_datetime && this.col.formatter) {
                 this.rowData[this.col.dataKey] = formatDate(this.rowData[this.col.dataKey], this.col.formatter);
             }*/
            // console.group('beforeUpdate 更新前状态===============》');
            // console.log("%c%s", "color:red","el     : " + this.$el);
            // console.log(this.$el);
            // console.log("%c%s", "color:red","data   : " + this.$data);
            // console.log("%c%s", "color:red","message: " + this.message);
        },
        updated: function (el) {
            // console.group('updated 更新完成状态===============》');
            // console.log("%c%s", "color:red","el     : " + this.$el);
            // console.log(this.$el,"11");
            // console.log("%c%s", "color:red","data   : " + this.$data);
            // console.log("%c%s", "color:red","message: " + this.message);
            // let el = this.$el
            /* let tips=this.$el
             let content = tips.getElementsByClassName("el-form-item__error");
             console.log(content);
             if(tips.length>0)
             {
                 console.log(tips[0]);
                 this.$notify.error({
                     title: '错误',
                     message: tips[0].innerText
                 });
             }
 */
        },
        beforeDestroy: function () {
            // console.group('beforeDestroy 销毁前状态===============》');
            // console.log("%c%s", "color:red","el     : " + this.$el);
            // console.log(this.$el);
            // console.log("%c%s", "color:red","data   : " + this.$data);
            // console.log("%c%s", "color:red","message: " + this.message);

        },
        destroyed: function () {
            // console.group('destroyed 销毁完成状态===============》');
            // console.log("%c%s", "color:red","el     : " + this.$el);
            // console.log(this.$el);
            // console.log("%c%s", "color:red","data   : " + this.$data);
            // console.log("%c%s", "color:red","message: " + this.message)


        },

        methods: {
            validate (cb){
               this.$refs['td'].validate(cb);
            },
            selectSearch(val) {
                if (!this.bakOptions) return;
                if (!!val) { //val存在
                    this.col.select_data = this.bakOptions.filter((item) => {
                        if (!!~item.label.indexOf(val) || !!~item.value.indexOf(val)) {
                            return true
                        }
                    })
                    val = null;
                } else {
                    this.col.select_data = this.bakOptions;
                }
            },
            initSelectData() {
                console.log("@@!!@@" + JSON.stringify(this.bakOptions));
                if (!!this.bakOptions) {
                    this.col.select_data = this.bakOptions;
                } else {
                    console.log("this.bakOptions 为空");
                }
            },
            inputQuerySearch(queryString, cb) {
                var res = this.inputQueryItems;
                var results = queryString ? res.filter(this.createFilter(queryString)) : res;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (item) => {
                    return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },fo(rowData,col){
                let key=eval("rowData."+col.dataKey);
                if(!!col.select_data && col.select_data.length>0){
                    for(let i=0;i< col.select_data.length;i++){
                        let item=col.select_data[i];
                        if(item.value==key){
                            if(col.is_date){//系统默认返回时间，需要截取
                                return item.label.substring(0,10);
                            }
                            return item.label;
                        }
                    }
                }
                if(col.is_date){//系统默认返回时间，需要截取
                    return key.substring(0,10);
                }
                return key;
            }
        },
        props: ["col", "rowData","autocompleteItems"]
    }

</script>

<style>
    .my-el-form-item {
        margin-bottom: 0px !important;
    }

    /*.el-table .el-form-item__error{
        position:absolute;
        top:36px;
        left: 0;
    }*/
    .el-table .cell {
        overflow: -webkit-paged-x !important;
    }

    .width-full{
        width: 100%;
    }
</style>
