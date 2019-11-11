import axios from 'axios'
import qs from 'qs'
import _ from 'lodash'
// import { Toast } from 'antd-mobile'

const SERVER_URL = process.env.REACT_APP_SERVER_URL
let store = null
console.log(process.env, SERVER_URL)

let authApi = axios.create({
  // timeout: 10000,
  baseURL: `${SERVER_URL}/Token`,
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
})

authApi.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})

let api = axios.create({
  // timeout: 10000,
  baseURL: `${SERVER_URL}`,
  // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  // transformRequest: [function (data, headers) {
  //   return qs.stringify(data)
  // }]
})

let notifyProcessUnauth = _.throttle(() => {
  console.log('throttle')
}, 10000, {'trailing': false})

api.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers.common['Authorization'] = `Bearer ${store.auth.token}`
  return config
})

api.interceptors.response.use(function (response) {
  if (response.config.notHandleError) {
    return response
  }
  // Do something with response data
  if (response.data.success === false) {
    // Toast.info(response.data.message, 1)
    return Promise.reject(response)
  }
  return response
}, function (error) {
  // if (error.response.status === 401) {
  //   console.log(error.response.status)
  //   notifyProcessUnauth()
  // }
  return Promise.reject(error)
})

function init (globalStore) {
  store = globalStore
}

function getUserInfo () {
  return {
    data: {
      name: 'test'
    }
  }
}

// let's return back our create method as the default.
export default {
  init,
  getUserInfo
}
