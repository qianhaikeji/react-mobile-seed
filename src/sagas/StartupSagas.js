import _ from 'lodash'
import URI from 'urijs'
import { channel } from 'redux-saga'
import { put, call, all, select, take, fork } from 'redux-saga/effects'
import moment from 'moment'
import {compareAppVersion, parseUlrParams} from 'services/util'
import AppConfig from 'config/AppConfig'
import { push, replace } from 'react-router-redux'

export function * startup (api, action) {
  console.log('startup')

  // 检查auth
  let needAuth = yield call(checkAuthToken, api)

  yield call(setHttpAuth, api)

  if (!needAuth) {
    yield put(StartupActions.setReady(true))
  }
}

export function * login (api, action) {
  const { data } = action
  try {
    const response = yield call(api.login, data.username, data.password)
    yield put(AuthActions.refreshToken(response.data))
    yield call(setHttpAuth, api)
    
    let audited = yield select((state) => state.auth.audit.status.StatusCode !== 1)
    let navParams = audited ? {pathname: 'MainScreen'} : {pathname: 'ReviewEditScreen', state: {showBackBtn: false}}
    yield put(replace(navParams))

    yield put(AuthActions.loginSuccess())
    return true
  } catch (err) {
    yield put(AuthActions.loginFailure())
    return false
  }
}

export function * logout (api) {
  console.log('logout')
  yield call(setHttpAuth, api)
  yield put(push({pathname: 'LoginScreen', state: {showBackBtn: false}}))
}

// 直接改地址栏的地址来触发微信oauth授权。把oauth的授权回调地址，填成自身的server。
// 登陆页的url存入state参数（微信oauth的参数，会原封不动地带回给server的回调地址）。server处理完oauth后，会让client重定向回此url。
function getCode () {
  let appid = AppConfig.wechatAppId
  let redirectUrl = document.location.href
  // let redirectUrl = encodeURI(AppConfig.wechatServer + '/alading-interface/weinfo/redirect.ajax')
  // encodeURIComponent 进行编码。微信的state参数有格式限制，导致当前url不能完整地回传，因此用encodeURIComponent 进行编码。
  let currentUrl = window.encodeURIComponent(window.location.href)
  console.info(window.location.href, currentUrl)

  let wechatAuthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}` +
                      `&redirect_uri=${redirectUrl}` +
                      `&response_type=code` +
                      `&scope=snsapi_userinfo` +
                      // `&state=${currentUrl}` +
                      `#wechat_redirect`
  // window.location.href = wechatAuthUrl
  window.location.replace(wechatAuthUrl)
}

function parseAuthInfoFromUrl () {
  const uri = new URI(document.location.href)
  const query = uri.query(true)
  const {code} = query

  if (process.env.NODE_ENV !== 'production') {
    return 'fakeCode'
  }

  return code
  // let openid = parseUlrParams('openId')
  // let nickname = decodeURI(parseUlrParams('nickname'))
  // if (openid) {
  //   return {openid, nickname}
  // } else {
  //   return null
  // }
}

export function * checkAuthToken (api) {
  let code = parseAuthInfoFromUrl()

  if (code) {
    // b.鉴权过程中，重定向完成后进入此分支。spa应用做oauth时，client无能力处理微信服务器发来的请求，因此需要server帮忙。
    // 进入此分支，说明server已经帮client鉴权成功，token信息带在url中，并通知客户端重定向到了<a.>步骤中最初加载的登陆页url。
    // 之所以将登陆信息放在url中，是因为重定向时，client丢失了所有信息。状态只能通过url传递。
    console.debug('从地址栏获取到code成功')
    let authInfo

    if (process.env.NODE_ENV !== 'production') {
      authInfo = {openid: 'oFmtr1DE6oe9TUztJjRPxni4D-hQ', nickname: '曹宏涛'}
    } else {
      const response = yield call(api.getWechatAuthInfo, code)
      authInfo = response.data.data
    }
    yield put(AuthActions.refreshBaseInfo(authInfo))
  } else {
    // a.网站的最初状态。没有auth信息。通过微信的oauth去server取token，相当于登录。
    console.debug('没有token，从后端获取')
    getCode()
    return true
  }

  // let token = yield select((state) => state.auth.token)
  
  // while (true) {
  //   if (!token) {
  //     yield put(AuthActions.loginFailure())
  //     break
  //   }

  //   // access token 未超时
  //   if (token.access !== null && moment().isBefore(token.expiredTime)) {
  //     break
  //   }

  //   // 没有refresh token
  //   if (token.refresh === null) {
  //     yield put(AuthActions.loginFailure())
  //     break
  //   }

  //   try {
  //     let response = yield call(api.refreshToken, token.refresh)
  //     // 刷新token成功
  //     yield put(AuthActions.refreshToken(response.data))
  //   } catch (err) {
  //     // 刷新token失败
  //     yield put(AuthActions.loginFailure())
  //   }

  //   break
  // }
}

export function * setHttpAuth (api) {
  let token = yield select((state) => state.auth.token)
  if (token) {
    api.setToken(`${token.type} ${token.access}`)
  }
}

export function * onLocationChange (api, {payload}) {
  yield call(wechatSdk.initJssdk, ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareAppMessage', 'onMenuShareTimeline'])
  let shareImage = AppConfig.defaultWxShareImgLogo
  wechatSdk.setPageShare(`英语小助教`, `英语老师的贴心助教，随时随地布置作业，家长一键添加作业，AI智能点评。`, shareImage)

  let authRouters = [
    '/parent/assign',
    '/parent/assign/collect',
    '/parent/profile',
  ]
  const pathname = payload.pathname
  if (_.includes(authRouters, pathname)) {
    const auth = yield select((state) => state.auth)
    const userId = yield select((state) => state.auth.userId)
    if (!userId) {
      console.log('家长未登录,跳转登录页面', userId, auth)
      yield put(push({pathname: '/parent/login'}))
    }
  }
}

export function * process401 (api, action) {
  console.log('开始处理401')
  let logined = yield select((state) => state.auth.logined)
  yield put(replace(logined ? '/UnauthScreen' : '/LoginScreen'))
}
