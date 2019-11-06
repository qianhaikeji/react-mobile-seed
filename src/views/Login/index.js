import _ from 'lodash'
import React, { Component } from 'react'
import { withRouter } from "react-router-dom"
import { connect } from 'react-redux'
import './style.css'

const Widget = ({
  login
}) => {
  return (
    <div className="add-album-container">
      登录
      <div onClick={() => login({
        token: 123123213,
        profile: {name: 1231}
      })}>登录</div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = ({auth}) => ({
  login: auth.login
})

export default connect(mapStateToProps, mapDispatchToProps)(Widget)

