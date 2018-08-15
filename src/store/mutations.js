import {
	LOGIN_IN,
	OUT_LOGIN,
	SHOW_LOADING,
	HIDE_LOADING,
	ROUTER_LIST
} from './types'
import { Cookie } from '@/config/utils'
export default {

	// 记录用户信息
	[LOGIN_IN](state, payload) {
		state.loginStatus = true
		state.userInfo = payload
	},
	//退出登录
	[OUT_LOGIN](state) {
		Cookie.delete('username')
		state.loginStatus = false
		state.userInfo = null
	},

	[SHOW_LOADING](state) {
		state.showLoading = true
	},
	[HIDE_LOADING](state) {
		state.showLoading = false
	},

	[ROUTER_LIST](state, payload){
		state.routerList = payload
	}
}
