import _ from 'lodash'
import React, { Component } from 'react'
import { useHistory } from "react-router-dom"
import { connect } from 'react-redux'
import {
  Box,
  Card,
  Image,
  Heading,
  Text
} from 'rebass'
import './style.scss'

const Widget = () => {
  const history = useHistory()

  return (
    <div className="add-album-container">
      主页2
      <div onClick={() => history.push('login')}>去登录</div>
      <Box width={256}>
        <Card
          sx={{
            p: 1,
            borderRadius: 2,
            boxShadow: '0 0 16px rgba(0, 0, 0, .25)',
          }}>
          <Box px={2}>
            <Heading as='h3'>
              zhusdfs
            </Heading>
            <Text fontSize={0}>
              fsfdsfsf
            </Text>
          </Box>
        </Card>
      </Box>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Widget)