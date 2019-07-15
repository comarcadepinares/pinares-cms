import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from '@/views/Home'
import UserData from '@/views/UserData'
import ChangePassword from '@/views/ChangePassword'

Vue.use(Router)

function requireAuth (to, from, next) {
  if (store.state.user && store.state.token) {
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
    }
  ]
})
