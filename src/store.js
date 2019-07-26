import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let savedUser
let savedTowns

try {
  if (localStorage) {
    savedUser = JSON.parse(localStorage.getItem('user'))
    savedTowns = JSON.parse(localStorage.getItem('towns')) || []
  }
} catch (error) {
  localStorage.clear()
}


export default new Vuex.Store({
  state: {
    user: savedUser,
    token: localStorage.getItem('token'),
    nextRoute: '/logged',
    towns: savedTowns,
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
      state.towns = null
      localStorage.clear()
    },
    setNextRoute (state, nextRoute) {
      state.nextRoute = nextRoute
    },
    setTowns(state, towns) {
      state.towns = towns
      localStorage.setItem('towns', JSON.stringify(state.towns))
    },
    addTown(state, town) {
      state.towns.push(town)
      localStorage.setItem('towns', JSON.stringify(state.towns))
    },
  },
  actions: {

  }
})
