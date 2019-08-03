import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from '@/views/Home'
import UserData from '@/views/account/UserData'
import ChangePassword from '@/views/account/ChangePassword'
import Towns from '@/views/towns/Towns'
import Town from '@/views/towns/Town'
import ActivityTypes from '@/views/activityTypes/ActivityTypes'
import ActivityType from '@/views/activityTypes/ActivityType'
import Hotels from '@/views/hotels/Hotels'
import Hotel from '@/views/hotels/Hotel'
import Restaurants from '@/views/restaurants/Restaurants'
import Restaurant from '@/views/restaurants/Restaurant'

Vue.use(Router)

function requireAuth (to, from, next) {
  if (store.state.user && store.state.token) {
    next()
  } else {
    next('/')
  }
}

function requireSuperadminAuth (to, from, next) {
  if (store.state.user && store.state.token && store.state.user.role === 'SuperAdmin') {
    next()
  } else {
    next('/')
  }
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/account/user',
      name: 'UserData',
      component: UserData,
      beforeEnter: requireAuth
    },
    {
      path: '/account/password',
      name: 'ChangePassword',
      component: ChangePassword,
      beforeEnter: requireAuth
    },
    {
      path: '/towns',
      name: 'Towns',
      component: Towns,
      beforeEnter: requireSuperadminAuth
    },
    {
      path: '/towns/create',
      name: 'TownCreate',
      component: Town,
      beforeEnter: requireSuperadminAuth
    },
    {
      path: '/towns/:slug',
      name: 'TownEdit',
      component: Town,
      beforeEnter: requireSuperadminAuth
    },
    {
      path: '/activity-types',
      name: 'ActivityTypes',
      component: ActivityTypes,
      beforeEnter: requireSuperadminAuth
    },
    {
      path: '/activity-types/create',
      name: 'ActivityTypeCreate',
      component: ActivityType,
      beforeEnter: requireSuperadminAuth
    },
    {
      path: '/activity-types/:slug',
      name: 'ActivityTypeEdit',
      component: ActivityType,
      beforeEnter: requireSuperadminAuth
    },
    {
      path: '/hotels',
      name: 'Hotels',
      component: Hotels,
      beforeEnter: requireAuth
    },
    {
      path: '/hotel/create',
      name: 'HotelCreate',
      component: Hotel,
      beforeEnter: requireAuth
    },
    {
      path: '/hotel/:slug',
      name: 'HotelEdit',
      component: Hotel,
      beforeEnter: requireAuth
    },
    {
      path: '/restaurants',
      name: 'Restaurants',
      component: Restaurants,
      beforeEnter: requireAuth
    },
    {
      path: '/restaurant/create',
      name: 'Restaurant',
      component: Restaurant,
      beforeEnter: requireAuth
    },
    {
      path: '/restaurant/:slug',
      name: 'RestaurantEdit',
      component: Restaurant,
      beforeEnter: requireAuth
    }
  ]
})
