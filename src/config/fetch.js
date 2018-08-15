import { baseUrl } from '@/config/utils';
import { Message } from 'element-ui';
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
axios.defaults.baseURL = baseUrl.rootPath;

//http request 拦截器
axios.interceptors.request.use(
    config => {
        //console.log(config);
        if(config.showLoading) {
            thisVue.$store.commit('SHOW_LOADING')
        }
        return config;
    },
    error => {
        return Promise.reject(false);
    }
);


//http response 拦截器
axios.interceptors.response.use(
    response => {
        if(response.config.showLoading) {
            thisVue.$store.commit('HIDE_LOADING')
        }
        if (response.data && response.data.result == '2' ) {
            Message({
                message: '登录状态失效，请重新登录！',
                type: 'error'
            })
            thisVue.$store.commit('OUT_LOGIN')
            thisVue.$router.push({
                path: "/login"
            })
            return Promise.reject(false);
        }
        else {
            return response;
        }

    },
    error => {
        console.log(error)
        if(error.config.showLoading) {
            thisVue.$store.commit('HIDE_LOADING')
        }
        if(error.message === 'Network Error') {
            Message({
                message: '网络连接错误，请检查网络连接！',
                type: 'error'
            })
        } else if(error.code && error.code ==="ECONNABORTED") {
            Message({
                message: '网络连接超时，请稍后重试！',
                type: 'error'
            })
        } else {
            Message({
                message: '服务器异常，请稍后重试！',
                type: 'error'
            })
        }
        return Promise.reject(false)
    }
)

function commonFetch(method, url, data = {}, options={}) {
    return new Promise((resolve, reject) => {
        axios[method](url, data, options)
            .then(response => {
                resolve(response.data);
            }, error => {
                reject(error)
            })
            .catch(err => {
                reject(err)
            })
    }).catch(err => {
        return false;
    })
}

export default {
    get(url, data = {}, options) {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                    params: data
                }, options)
                .then(response => {
                    resolve(response.data);
                })
                .catch(err => {
                    reject(err)
                })
        }).catch(err => {
            console.log(err)
        })
    },
    post(url, data, options) {
        return commonFetch('post', url, data, options)
    },
    // 删除
    delete(url, data, options) {
        return commonFetch('delete', url, data, options)
    },
    // 更新某个字段
    put(url, data, options) {
        return commonFetch('put', url, data, options)
    },
    // 更新完整的内容
    patch(url, data, options) {
        return commonFetch('put', url, data, options)
    }
}
