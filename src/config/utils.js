/**
 * localstorage 增删查
 */
/* 存储localStorage */
export const setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}
/* 获取localStorage */
export const getStore = (name) => {
    if (!name) return;
    return window.localStorage.getItem(name);
}
/* 删除localStorage */
export const removeStore = (name) => {
    if (!name) return;
    window.localStorage.removeItem(name);
}

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
    let target;
    // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
    if (attr === 'scrollTop') {
        target = element.scrollTop;
    } else if (element.currentStyle) {
        target = element.currentStyle[attr];
    } else {
        target = document.defaultView.getComputedStyle(element, null)[attr];
    }
    //在获取 opactiy 时需要获取小数 parseFloat
    return NumberMode == 'float' ? parseFloat(target) : parseInt(target);
}


/**
 * cookie 增删改查
 */
export const Cookie = {

    set(name, value, days) {
        var d = new Date;
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
        window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();

    },

    get(name) {
        var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;

    },

    delete(name) {
        this.set(name, '', -1);
    }
}

export const getRect = (el) => {
    if (el instanceof window.SVGElement) {
        let rect = el.getBoundingClientRect()
        return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        }
    } else {
        return {
            top: el.offsetTop,
            left: el.offsetLeft,
            width: el.offsetWidth,
            height: el.offsetHeight
        }
    }
}

const isArray = (o) => {
    return Object.prototype.toString.call(o)=='[object Array]';
};


export const formatCurrency = (num) => {
    num = (num + '').replace(/\$|\,/g,'');
    if(isNaN(num))
        num = "0";
    let sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*100+0.50000000001);
    let cents = num%100;
    num = Math.floor(num/100).toString();
    if(cents<10)
    cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
    num = num.substring(0,num.length-(4*i+3))+','+
    num.substring(num.length-(4*i+3));
    return (((sign)?'':'-') + num + '.' + cents);
}

export const isEmptyObj = (obj) => {
    if(Object.prototype.toString.call(obj) !== '[object Object]') {
        return true
    } else if (!Object.keys(obj).length) {
        return true
    } else {
        return false
    }

}


//日期格式：2018-10-10 18:15:10 这个是时间戳
export const timestampToTime = (timestamp, split='-') => {
    let date = timestamp
    if((timestamp+'').indexOf('-') > -1 ) {
        date = (timestamp+'').replace(/-/g, '/')
    }
    date = new Date(timestamp);
    const Y = date.getFullYear() + split;
    const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + split;
    const D = date.getDate() + ' ';
    const h = date.getHours() + ':';
    const m = date.getMinutes() + ':';
    const s = date.getSeconds();
    return Y+M+D+h+m+s;
}

export const baseUrl = process.env.NODE_ENV === 'production' ? {
        imgPathPrefix: '/official/viewPicture.do?file=',
        rootPath: '/'
    } : {
        // imgPathPrefix: 'http://10.220.10.88:8080/official/viewPicture.do?file=',
        // rootPath: 'http://10.220.10.88:8080/'
        imgPathPrefix: 'http://10.220.10.88:8080/official/viewPicture.do?file=',
        rootPath: 'http://10.220.10.88:8080/'
    }

//日期格式：20181010 这个是日期数
export const timestampToDate = (timestamp) => {
    return timestamp.replace(/(\d{4})(\d{2})/, '$1/$2/')
}

//截取小数点后两位 1.25  不四舍五入
export const formatTofixed = (getVal) => {
    if(getVal != 0){
        let getNum = Math.floor(getVal*100)/100
        let changeStr = getNum.toString()
        let smallRound = changeStr.split('.');
        if(smallRound.length == 1){
            return changeStr+'.00'
        }else{
            return changeStr
        }
    }else{
        return getVal+'.00'
    }
}

export const isPlaceholderSupport = () => {
    return 'placeholder' in document.createElement('input')
}

export const isIE9AndLower = () => {

    const ua = navigator.userAgent.toLowerCase();
    const isIE = ua.indexOf("msie")>-1;
    if(isIE){
        const version = parseInt(ua.match(/msie ([\d.]+)/)[1])
        if(version < 10 ){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}
