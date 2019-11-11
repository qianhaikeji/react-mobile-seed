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
  // let needAuth = yield call(checkAuthToken, api)

  // yield call(setHttpAuth, api)

  // if (!needAuth) {
  //   yield put(StartupActions.setReady(true))
  // }
}

export function * process401 (api, action) {
  console.log('开始处理401')
  let logined = yield select((state) => state.auth.logined)
  yield put(replace(logined ? '/UnauthScreen' : '/LoginScreen'))
}
