import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
// import getters from './getters'

import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)
const state = {
	loginStatus: false, // 登录状态,
	showLoading: false, // 默认不显示loading框
	userInfo: null,
	routerList:''
}

export default new Vuex.Store({
	modules: {
      app,
      errorLog,
      permission,
      tagsView,
      user
    },
	state,
	getters,
	actions,
	mutations
})
