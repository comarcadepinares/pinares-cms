import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function getUser () {
  try {
    if (localStorage) {
      return JSON.parse(localStorage.getItem('user'))
    }
  } catch (error) {
    localStorage.clear()
  }
}

export default new Vuex.Store({
  state: {
    user: getUser(),
    token: localStorage.getItem('token'),
    nextRoute: '/logged'
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    setToken (state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    logout (state) {
      state.user = null
      state.token = null
      localStorage.clear()
    },
    setNextRoute (state, nextRoute) {
      state.nextRoute = nextRoute
    }
  },
  actions: {

  }
})
