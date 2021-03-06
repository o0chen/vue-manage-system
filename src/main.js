'use strict'
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import moment from 'moment';

import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";


Vue.use(ElementUI, { size: 'small' });
//axios.defaults.baseURL=process.env.API_ROOT;
axios.defaults.withCredentials=true;
Vue.prototype.$axios = axios;


//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('ms_username');
    if(!role && to.path !== '/login'){
        next('/login');
    }else if(to.meta.permission){
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    }else{
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else{
            next();
        }
    }
});

let loadi;
// 拦截器 每个接口加token
axios.interceptors.request.use(function(config) {
    loadi=ElementUI.Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });
    return config;
});
// 没有就重新登录
axios.interceptors.response.use(function(response) {
    loadi.close();
    var res=response.data;
    console.log(response);
    if(res.code==-999){
        router.replace("/login");
    }else if(res.code!=0){
        if(!!this&&!!this.$message)
            this.$message.error('错误信息：'+res.message);
    }
    return res;
}, function(error) {//我的这个是直接走的失败401 status 如果你想走成功的回调就走上边的 具体走哪个还是你们同后端商量统一就好
    loadi.close();
    if (error.response.status == 401) {
       router.replace("/login")
    }
    return Promise.reject(error) // 返回接口返回的错误信息
});



// 创建axios实例
/*const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 5000 // 请求超时时间
})*/



// request拦截器
/*axios.interceptors.request.use(config => {
    // Do something before request is sent
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})*/


//时间过滤器
Vue.filter("datetime_input", {
    read: function (value, formatString) { // model -> view 在更新 `<input>` 元素之前格式化值
        formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
        return moment(value).format(formatString);
    },
    write: function (newVal,oldVal) { // view -> model  在写回数据之前格式化值
        console.log("newVal:"+newVal);
        console.log("oldVal:"+oldVal);
        return newVal;
    }
});


Vue.filter('datetime', function (value, formatString) {
    formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
    return moment(value).format(formatString);
});

Vue.filter('date', function (value, formatString) {
    formatString = formatString || 'YYYY-MM-DD';
    return moment(value).format(formatString);
});

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');


