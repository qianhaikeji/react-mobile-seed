import React, { Component, useEffect } from 'react'
import { connect, Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route } from "react-router-dom"

import Home from 'views/Home'
import Login from 'views/Login'

const RouterWidget = ({
  store, history, ready,
  startup
}) => {
  useEffect (() => {
    startup()
  }, [])

  const renderLoading = () => {
    // 此时css文件尚未加载，需要使用内联style
    return (
      <div>
        <div>loading</div>
      </div>
    )
  }

  const renderContent = () => {
    return (
      <Switch>
        <Route exact path="/" component={Home} ></Route>
        <Route exact path="/login" component={Login} ></Route>
      </Switch>
    )
  }

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        {!ready ? renderLoading() : renderContent()}
      </ConnectedRouter>
    </Provider>
  )
}

const mapStateToProps = ({appState}) => {
  return {
    ready: appState.ready
  }
}

const mapDispatchToProps = ({appState}) => ({
  startup: appState.startup
})

export default connect(mapStateToProps, mapDispatchToProps)(RouterWidget)
