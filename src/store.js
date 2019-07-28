import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let savedUser
let savedTowns
let savedActivityTypes

try {
  if (localStorage) {
    savedUser = JSON.parse(localStorage.getItem('user'))
    savedTowns = JSON.parse(localStorage.getItem('towns')) || []
    savedActivityTypes = JSON.parse(localStorage.getItem('activityTypes')) || []
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
    activityTypes: savedActivityTypes
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
      state.activityTypes = null
      localStorage.clear()
    },
    setNextRoute (state, nextRoute) {
      state.nextRoute = nextRoute
    },
    setTowns (state, towns) {
      state.towns = towns
      localStorage.setItem('towns', JSON.stringify(state.towns))
    },
    addTown (state, town) {
      state.towns.push(town)
      localStorage.setItem('towns', JSON.stringify(state.towns))
    },
    updateTown (state, town) {
      state.towns.filter(t => t.id === town.id)
      state.towns.push(town)
      localStorage.setItem('towns', JSON.stringify(state.towns))
    },
    removeTown (state, town) {
      state.towns.filter(t => t.id === town.id)
      localStorage.setItem('towns', JSON.stringify(state.towns))
    },
    setActivityType (state, activityTypes) {
      state.activityTypes = activityTypes
      localStorage.setItem('activityTypes', JSON.stringify(state.activityTypes))
    },
    addActivityType (state, activityType) {
      state.activityTypes.push(activityType)
      localStorage.setItem('activityTypes', JSON.stringify(state.activityTypes))
    },
    updateActivityType (state, activityType) {
      state.activityTypes.filter(at => at.id === activityType.id)
      state.activityTypes.push(activityType)
      localStorage.setItem('activityTypes', JSON.stringify(state.activityTypes))
    },
    removeActivityType (state, activityType) {
      state.activityTypes.filter(at => at.id === activityType.id)
      localStorage.setItem('activityTypes', JSON.stringify(state.activityTypes))
    }
  },
  getters: {
    getTown: (state) => (slug) => state.towns.find(t => t.slug === slug),
    getActivityType: (state) => (slug) => state.activityTypes.find(at => at.slug === slug)
  }
})
