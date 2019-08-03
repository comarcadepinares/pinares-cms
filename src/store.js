import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let savedUser
let savedTowns
let savedActivityTypes
let savedHotels

try {
  if (localStorage) {
    savedUser = JSON.parse(localStorage.getItem('user'))
    savedTowns = JSON.parse(localStorage.getItem('towns')) || []
    savedActivityTypes = JSON.parse(localStorage.getItem('activityTypes')) || []
    savedHotels = JSON.parse(localStorage.getItem('hotels')) || []
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
    activityTypes: savedActivityTypes,
    hotels: savedHotels
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
      state.hotels = null
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
    setActivityTypes (state, activityTypes) {
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
    },
    setHotels (state, hotels) {
      state.hotels = hotels
      localStorage.setItem('hotels', JSON.stringify(state.hotels))
    },
    addHotel (state, hotel) {
      state.hotels.push(hotel)
      localStorage.setItem('hotels', JSON.stringify(state.hotels))
    },
    updateHotel (state, hotel) {
      state.hotels.filter(h => h.id === hotel.id)
      state.hotels.push(hotel)
      localStorage.setItem('hotels', JSON.stringify(state.hotels))
    },
    removeHotel (state, hotel) {
      state.hotels.filter(h => h.id === hotel.id)
      localStorage.setItem('hotels', JSON.stringify(state.hotels))
    }
  },
  getters: {
    getTown: (state) => (slug) => state.towns.find(t => t.slug === slug),
    getActivityType: (state) => (slug) => state.activityTypes.find(at => at.slug === slug),
    getHotel: (state) => (slug) => state.hotels.find(h => h.slug === slug)
  }
})
