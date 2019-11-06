import React from 'react'
import { init } from '@rematch/core'
import createRematchPersist from '@rematch/persist'
import createLoadingPlugin from '@rematch/loading'
import { asyncLocalStorage } from "redux-persist/storages"
import { applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware, connectRouter } from 'connected-react-router'
import { createHashHistory } from 'history'
import rootSaga from 'sagas'
import models from './models'

export { connect } from 'react-redux'

export const history = createHashHistory()

// 将store提供给全局hook使用
export const StoreContext = React.createContext()

const initPlugin = () => {
  const plugins = []

  const persistPlugin = createRematchPersist({
    whitelist: ['auth'],
    // throttle: 1000,
    storage: asyncLocalStorage,
    version: 1
  })

  plugins.push(persistPlugin)
  const loading = createLoadingPlugin({})
  plugins.push(loading)
  return plugins
}

let sagaMiddleware
let sagasManager

const initMiddleware = () => {
  const middleware = []

  const loggerMiddleware = createLogger({
    level: 'info',
    collapsed: true
  })


  sagaMiddleware = createSagaMiddleware({})
  const historyMiddleware = routerMiddleware(history)

  if (process.env.NODE_ENV !== 'test') {
    middleware.push(loggerMiddleware)
  }

  middleware.push(sagaMiddleware)
  middleware.push(historyMiddleware)
  return middleware
}

const middleware = initMiddleware()
const enhancers = []
enhancers.push(applyMiddleware(...middleware))

export const reloadSaga = (newYieldedSagas) => {
  sagasManager.cancel()
  sagasManager.done.then(() => {
    sagasManager = sagaMiddleware.run(newYieldedSagas)
  })
}

export const store = init({
  models,
  redux: {
    reducers:{
      router: connectRouter(history),
    },
    enhancers: enhancers
  },
  plugins: initPlugin()
})

sagasManager = sagaMiddleware.run(rootSaga)