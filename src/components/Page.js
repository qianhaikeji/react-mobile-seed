
import React from 'react'
import {
  Flex,
  Box,
  Card,
  Image,
  Heading,
  Text
} from 'rebass'
import { css } from '@emotion/core'


export default ({
  children,
  ...props
}) => (
  <Box sx={{
    bg: 'page',
    height: '100vh'
  }} props>
    {children}
  </Box>
)