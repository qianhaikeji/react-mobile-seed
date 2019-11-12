import _ from 'lodash'
import React, { Component } from 'react'
import { useHistory } from "react-router-dom"
import { connect } from 'react-redux'
import {
  Flex,
  Box,
  Card,
  Image,
  Heading,
  Button,
  Text
} from 'rebass'
import { Page } from 'components'
import { css, jsx } from '@emotion/core'


const Widget = () => {
  const history = useHistory()

  return (
    <Page>
      <Text fontSize={4}>123</Text>
      <Button variant='primary' onClick={() => history.push('login')}>Primary</Button>
    </Page>
  )
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Widget)