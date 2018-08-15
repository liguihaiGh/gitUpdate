//存放接口文件
import Axios from '@/config/fetch'
// 登录
export const loginRequest = (data, options) => Axios.post('/official/userLogin.do', data , options)
// 注册
export const registerRequest = (data, options) => Axios.post('/official/userRegister.do', data , options)
// 注销
export const logout = (data, options) => Axios.post('/official/logout.do', data , options)
// 检查用户登录状态
export const checkLoginStatus = (data, options) => Axios.get('/official/checkLogin.do', data, options)
// 获取手机验证码
export const getPhoneCode = (data, options) => Axios.post('/official/sendVerificationCode.do', data, options)

export const bannerRequest = (data, options) => Axios.post('/official/getBannerList.do', data, options)

export const baseRequest = (data, options) => Axios.post('/official/selectCrmCompanyInfo.do', data, options)

export const productRequest = (data, options) => Axios.post('/official/selectNewsByLimitNumber.do', data, options)

export const publishRequest = (data, options) => Axios.post('/official/selectNewsList.do', data, options)

export const detailRequest = (data, options) => Axios.post('/official/selectNewsInfo.do', data, options)

export const productListRequest = (data, options) => Axios.post('/official/productList.do', data, options)

export const choicenessProductRequest = (data, options) => Axios.post('/official/choicenessProductList.do', data, options)

export const productDetailRequest = (data, options) => Axios.post('/official/productDetailOverView.do', data, options)

export const productNoticeRequest = (data, options) => Axios.post('/official/selectCrmProductNoticeList.do', data, options)

export const netValueListRequest = (data, options) => Axios.post('/official/selectCrmProductNetValueList.do', data, options)

export const productIntroductionRequest = (data, options) => Axios.post('/official/subscriptionNotes.do', data, options)

export const chanpinyuyueRequest = (data, options) => Axios.post('/official/appointProduct.do', data, options)

export const gongsijieshaoRequest = (data, options) => Axios.post('/official/selectOneNewsInfo.do', data, options)

export const navRequest = (data, options) => Axios.post('/official/getNavigate.do', data, options)
