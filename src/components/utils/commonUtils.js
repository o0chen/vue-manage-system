export const commonUtils = {
    cloneKeysOnly(obj) {
        let result = {};
        for (var key in obj) {
            if (result[key] instanceof Object) {
                result[key] = this.cloneKeysOnly(result[key]);
            } else {
                result[key] = null;
            }
        }
        return result;
    },
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
        // var proto=Object.getPrototypeOf(obj);
        // return Object.assign({},Object.create(proto),obj);
    },
    cutStringKeyToJsonKey(stringKey,result){//含有点的字符转成对象
        if(!result)result={};
        console.log(stringKey);
        console.log(result);
        let nullVal;
        if(stringKey.includes(".")){
            let firstPos=stringKey.indexOf(".");
            let preKey=stringKey.substring(0,firstPos);
            let sufKey=stringKey.substring(firstPos+1);
            result[preKey]=this.cutStringKeyToJsonKey(sufKey,result[preKey]);
            return result;
        }else {
            result[stringKey]=nullVal;
            return result;
        }
    }

}
