export const myValidater = {
    /**
     * IP地址校验
     */
    ipAddress (rule, value, callback) {
        if (value && !(/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/).test(value)) {
            callback(new Error('IP地址不符合规范'))
        } else {
            callback()
        }
    },

    /**
     * 手机号码校验
     */
    phoneNumber (rule, value, callback) {
        if (value && (!(/^[1][34578]\d{9}$/).test(value) || !(/^[1-9]\d*$/).test(value) || value.length !== 11)) {
            callback(new Error('手机号码不符合规范'))
        } else {
            callback()
        }
    },

    /**
     * 电话号码校验
     */
    telephoneNumber (rule, value, callback) {
        if (value && (!(/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/).test(value))) {
            callback(new Error('电话号码不符合规范'))
        } else {
            callback()
        }
    },

    /**
     * 邮箱校验
     */
    emailValue (rule, value, callback) {
        if (value && (!(/^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/).test(value))) {
            callback(new Error('邮箱格式不符合规范'))
        } else {
            callback()
        }
    },

    /**
     * 身份证号码校验
     */
    idCard (rule, value, callback) {
        if (value && (!(/\d{17}[\d|x]|\d{15}/).test(value) || (value.length !== 15 && value.length !== 18))) {
            callback(new Error('身份证号码不符合规范'))
        } else {
            callback()
        }
    },

    /**
     * 正整数校验
     */
    integerP (rule, value, callback) {
        if (value && !(/^[1-9]\d*$/).test(value)) {
            callback(new Error('只能填写正整数'))
        } else {
            callback()
        }
    },

    /**
     * 负整数校验
     */
    integerN (rule, value, callback) {
        if (value && !(/^-[1-9]\d*$/).test(value)) {
            callback(new Error('只能填写负整数'))
        } else {
            callback()
        }
    },

    /**
     * 英文字符校验
     */
    enText (rule, value, callback) {
        let a = '',
            arr = value.split(" ")
        for (let i = 0; i < arr.length; i++) { //删除行内空格
            a += arr[i];
        }
        if (value && !(/^[A-Za-z]+$/).test(a)) {
            callback(new Error('只能填写英文字符'))
        } else {
            callback()
        }
    },

    /**
     * 中文字符校验
     */
    cnText (rule, value, callback) {
        let a = '',
            arr = value.split(" ")
        for (let i = 0; i < arr.length; i++) { //删除行内空格
            a += arr[i];
        }
        if (value && (/[^\u4e00-\u9fa5]/).test(a)) {
            callback(new Error('只能填写中文字符'))
        } else {
            callback()
        }
    }
}

/*
/!*比较详细的身份证校验*!/
Vue.prototype.isIdCard = (idCard) =>{
    let regIdCard=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    if(regIdCard.test(idCard)){
        if(idCard.length === 18){
            let idCardWi = new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 );
            let idCardY = new Array( 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 );
            let idCardWiSum = 0
            for(let i=0;i<17;i++){
                idCardWiSum+=idCard.substring(i,i+1)*idCardWi[i];
            }
            let idCardMod=idCardWiSum%11
            let idCardLast=idCard.substring(17)
            if(idCardMod === 2){
                if(idCardLast === "X"||idCardLast === "x"){
                    return true;
                }else{
                    Vue.prototype.$message.warning('身份证号码错误!，请重新输入')
                    return false;
                }
            }else{
                if(idCardLast === idCardY[idCardMod]){
                    return true;
                }else{
                    Vue.prototype.$message.warning('身份证号码错误!，请重新输入')
                    return false;
                }
            }
        }
    }else{
        Vue.prototype.$message.warning('身份证格式不正确!，请重新输入')
        return false
    }
}*/

//https://blog.csdn.net/baidu_28068985/article/details/80929973
