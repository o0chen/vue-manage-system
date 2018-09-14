export function formatDate(obj, fmt) {
    var date;
    if (typeof obj === 'string' || typeof obj === 'number') {
        date = new Date(obj);
    } else date = obj;

    const padLeftZero = (str) => {
        return ('00'+str).substr(str.length);
    }

    if(/(y+)/.test(fmt)){
        fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length));
    }

    let o = {
        'M+':date.getMonth() + 1,
        'd+':date.getDate(),
        'h+':date.getHours(),
        'm+':date.getMinutes(),
        's+':date.getSeconds()
    };

    for(let k in o){
        if(new RegExp(`(${k})`).test(fmt)){
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1,(RegExp.$1.length===1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};
