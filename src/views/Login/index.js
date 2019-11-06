import _ from 'lodash'
import React, { Component } from 'react'
import { withRouter } from "react-router-dom"
import { connect } from 'react-redux'
import './style.css'

const Widget = () => {
  return (
    <div className="add-album-container">
      登录
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
  }
}

export default withRouter(connect(mapStateToProps)(Widget))