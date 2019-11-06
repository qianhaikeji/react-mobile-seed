import { takeLatest, takeEvery, all, call } from 'redux-saga/effects'
import api from 'services/api'

/* ------------- Types ------------- */

/* ------------- Sagas ------------- */

/* ------------- Connect Types To Sagas ------------- */


// 所有使用saga异步调用的函数，必须处理所有异常，否则抛出异常后会导致整个saga事件机制崩溃，程序无法正常使用
function safeWrap (func) {
  if (!func) {
    return () => {}
  }

  return function * (...args) {
    // console.tron.log({safeWrap: 'safeWrap', args})
    try {
      yield call(func, ...args)
    } catch (err) {
      // console.tron.log(err)
    }
  }
}

export default function * root () {
  yield all([   
    // takeLatest('@@router/LOCATION_CHANGE', safeWrap(onLocationChange), api)
  ])
}
