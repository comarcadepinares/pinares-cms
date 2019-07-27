'use strict'

import axios from 'axios'
import router from '@/router'
import store from '@/store'

const config = {
  baseURL: 'http://localhost:8000',
  timeout: 10000,
  headers: {}
}

const AUTH_FAILED_CODES = [1001, 1002]

export default {
  request (method, endpoint, params = null, token = null) {
    if (token) {
      config.headers['Authorization'] = token
    }

    const instance = axios.create(config)

    return new Promise((resolve, reject) => {
      instance[method.toLowerCase()](endpoint, params)
        .then((response) => {
          resolve(response.data.data)
        })
        .catch((error) => {
          // Token expired
          if (!error.response) {
            reject(error.message)
          } else {
            console.log(error.response.data.error)
            if (AUTH_FAILED_CODES.includes(error.response.data.error.code)) {
              this.handleAuthFailed()
              resolve()
            } else {
              if (error.response.data.error.data && error.response.data.error.data.error) { reject(error.response.data.error.data.error) } else { reject(error.response.data.error.message) }
            }
          }
        })
    })
  },

  handleAuthFailed () {
    // save the next route
    store.commit('setNextRoute', router.currentRoute.fullPath)

    // send user to login
    store.commit('logout')
    router.push('/')
    $('#login').modal('show')
  }
}
