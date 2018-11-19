export var tableData={
    'sysUserTable':{
        'entity':'SysUser',
        'clomuns':[
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
        ]
    },
    'sysRoleTable':{
        'entity':'SysRole',
        'clomuns':[]
    }
}
