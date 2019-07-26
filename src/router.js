import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from '@/views/Home'
import UserData from '@/views/account/UserData'
import ChangePassword from '@/views/account/ChangePassword'
import Towns from '@/views/towns/Towns'
import Town from '@/views/towns/Town'


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
      name: 'TownsCreate',
      component: Town,
      beforeEnter: requireSuperadminAuth
    }
  ]
})
