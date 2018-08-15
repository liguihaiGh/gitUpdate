<template>
  <div class="login-container">

    <el-form class="login-form" autoComplete="off" ref="loginForm" label-position="left">

      <div class="title-container">
        <h3 class="title">系统登录</h3>
      </div>

      <el-form-item prop="phoneNumber">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="phoneNumber" id="phoneNumber" type="text" v-model="phoneNumber" autoComplete="off" placeholder="电话号码" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="password" autoComplete="off" placeholder="密码" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-form-item prop="checkCode">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="checkCode" class="input-code" type="text" v-model="checkCode" autoComplete="off" placeholder="验证码" />
        <span class="checkCode">
            <img @click="refreshCheckCode" :src="checkCodeImgPath">
        </span>
      </el-form-item>

      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="loginSubmit">登录</el-button>
    </el-form>
    <div style="position:absolute;bottom:0px;left:0;width:100%;text-align:center;color:#fff;">
        <p>现在接口调的是私募官网的登录接口,所以账号也是在私募官网注册的</p>
        <p>账号：13714046129   密码：123456@qq.com</p>
    </div>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import { getPhoneCode, loginRequest, registerRequest } from '../../service'
import { baseUrl } from '@/config/utils'
import aes from '../../../static/aes'
import { mapGetters } from 'vuex'
import { stringify } from 'qs'
export default {
    name: 'login',
    data() {
        const checkPhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('电话号码不能为空'));
            }else if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(value))){
                return callback(new Error('电话号码格式不正确'));
            }else{
                callback()
            }
        };
        const checkPassWord = (rule, value, callback) => {
            if(!value){
                return callback(new Error('密码不能为空'));
            }else if(value.length < 6){
                return callback(new Error('密码长度不能小于6位'));
            }else{
                callback()
            }
        };
        const checkCodeRule = (rule, value, callback) => {
            if(!value){
                return callback(new Error('验证码不能为空'));
            }else if(value.length < 4 || value.length > 4){
                return callback(new Error('验证码不正确'));
            }else{
                callback()
            }
        }
        return {
            phoneNumber: '13714046129',
            password: '123456@qq.com',
            checkCode:'',
            passwordType: 'password',
            loading: false,
            showDialog: false,
            baseCheckCodeImgPath: baseUrl.rootPath + 'authImg?width=110&height=58&count=4',
            checkCodeImgPath: ''
        }
    },
    created:function() {
        //验证码初始化
        this.checkCodeImgPath = this.baseCheckCodeImgPath + '&timestamp=' + (+new Date())
    },
    methods: {
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
        },
        async loginSubmit() {
            if(!this.phoneNumber.trim()) {
                Message({
                    message: '手机号码不能为空',
                    type: 'error'
                })
            } else if(!this.password.trim()) {
                Message({
                    message: '密码不能为空',
                    type: 'error'
                })
            } else if(!this.checkCode.trim()) {
                Message({
                    message: '验证码不能为空',
                    type: 'error'
                })
            } else {
                let res = await(loginRequest(stringify({
                    phone: this.phoneNumber.trim(),
                    password: this.passwordEncrypt(this.password.trim()),
                    inputVerifyCode: this.checkCode.trim()
                })))
                if(res) {
                    if(res.result == '0' && res.data) {
                        this.$store.commit('LOGIN_IN', {
                            phone: res.data.phone
                        })
                        if(this.routeQuery && this.routeQuery.redirect) {
                            this.$router.push(this.routeQuery.redirect)
                        } else {
                            this.$router.push('/dashboard')
                        }
                    } else {
                        Message({
                            message: res.msg,
                            type: 'error'
                        })
                        if(res.msg.indexOf('验证码不正确') > -1) {
                            this.refreshCheckCode()
                        }
                    }
                }
            }
        },
        passwordEncrypt(value, enckey) {
            const keys = ['l','m','e','n','z'];
            const keyMixin = enckey ? enckey : (keys[0]+keys[2]+keys[2]+keys[1]+keys[2]+keys[3]+keys[4]+keys[4]+keys[0]+keys[2]+keys[2]+keys[1]+keys[2]+keys[3]+keys[4]+keys[4]);

            const srcs = aes.CryptoJS.enc.Utf8.parse(value);
            const key = aes.CryptoJS.enc.Utf8.parse(keyMixin);
            const iv  = aes.CryptoJS.enc.Utf8.parse('0102020303040506');
            const encrypted = aes.CryptoJS.AES.encrypt(srcs, key, {
                iv: iv,
                mode: aes.CryptoJS.mode.CBC
            });
            return encrypted.toString();
        },
        refreshCheckCode(){
            this.checkCodeImgPath = this.baseCheckCodeImgPath + '&timestamp=' + (+new Date())
            this.checkCode = ''
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;

    .checkCode{
        position: absolute;
        z-index: 9999;
        cursor: pointer;
        display: inline-block;
        height: 50px;
        vertical-align: middle;
        text-align: right;
        margin-left: -20px;

        img{
            height: 50px;
        }
    }
    .input-code{
        width: 340px;
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
