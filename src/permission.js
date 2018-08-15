import router from './router'
import Vue from 'vue'
import Vuex from 'vuex'
import { mapGetters } from 'vuex'
import store from './store'
import { checkLoginStatus } from './service'
import { stringify } from 'qs'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from 'axios'
const _import = require('./router/_import_' + process.env.NODE_ENV)//获取组件的方法
import Layout from '@/views/layout/Layout' //Layout 是架构组件，不在后台返回，在文件里单独引入

Vue.use(Vuex)
NProgress.configure({ showSpinner: false })

//ready router
var getRouter //用来获取后台拿到的路由
router.beforeEach((to, from, next) => {
    NProgress.start()
    if(to.path === '/login') {
        next()
        return
    }
    if(store.getters.loginStatus) {
        //接口返回的路由数据要在登录的时候去把路由接口返回的数据存入store中，不然无法在登录之后正常获取数据
        if (!getRouter) {//不加这个判断，路由会陷入死循环
            if (!getObjArr('router')) {
                axios.get('https://www.easy-mock.com/mock/5a5da330d9b48c260cb42ca8/example/antrouter').then(res => {
                    getRouter = res.data.data.router//后台拿到路由
                    store.commit('ROUTER_LIST',getRouter)
                    saveObjArr('router', getRouter) //存储路由到localStorage
                    routerGo(to, next)//执行路由跳转方法
                })
            } else {//从localStorage拿到了路由
                store.commit('ROUTER_LIST',getObjArr('router'))
                getRouter = getObjArr('router')//拿到路由
                routerGo(to, next)
            }
        }
        else {
            next()
        }
    } else {
        (async function(){
            let res = await(checkLoginStatus(stringify({})))
            if(res && res.data && res.data.isLogin == '1') {
                store.commit('LOGIN_IN' , {
                    phone: res.data.phone
                })
                //下面3句代码作用：因为vue是单页面，路由数据存在store中在页面刷新的时候会清空store中的数据,所以要在
                //刷新页面的时候在localStorage里面去拿一次路由数据
                store.commit('ROUTER_LIST',getObjArr('router'))
                getRouter = getObjArr('router')//拿到路由
                routerGo(to, next)
            } else {
                store.commit('OUT_LOGIN')
                //未登录，强制跳转回登录页面
                if(to.fullPath==='/login'){
                    next();
                }else{
                    next('/login')
                }
            }
        })()
    }
})

router.afterEach((to, from, next) => {
    NProgress.done()
})

function routerGo(to, next) {
    getRouter = filterAsyncRouter(getRouter) //过滤路由
    router.addRoutes(getRouter) //动态添加路由
    global.antRouter = getRouter //将路由数据传递给全局变量，做侧边栏菜单渲染工作
    next({ ...to, replace: true })
}

function saveObjArr(name, data) { //localStorage 存储数组对象的方法
    localStorage.setItem(name, JSON.stringify(data))
}

function getObjArr(name) { //localStorage 获取数组对象的方法
    return JSON.parse(window.localStorage.getItem(name));
}

function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
    const accessedRouters = asyncRouterMap.filter(route => {
        if (route.component) {
            if (route.component === 'Layout') {//Layout组件特殊处理
                route.component = Layout
            } else {
                route.component = _import(route.component)
            }
        }
        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }
        return true
    })
    return accessedRouters
}
