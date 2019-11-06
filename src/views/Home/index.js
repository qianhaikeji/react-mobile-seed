import _ from 'lodash'
import React, { Component } from 'react'
import { useHistory } from "react-router-dom"
import { connect } from 'react-redux'
import './style.css'

const Widget = () => {
  const history = useHistory()

  return (
    <div className="add-album-container">
      主页1
      <div onClick={() => history.push('login')}>去登录</div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Widget)