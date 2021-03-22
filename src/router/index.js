import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import User from './modules/user'
import Team from './modules/team'
import Project from './modules/project'
import Department from './modules/department'
import auth from '@/utils/js/Auth'
import Development from './modules/development'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    children: [
      User,
      Team,
      Project,
      Department,
      Development
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/pages/SingIn.vue')
  },
  {
    path: '/Logout',
    name: 'Logout',
    component: () => import('@/views/Login/pages/Logout.vue')
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/Login/pages/ForgotPassword.vue')
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/Login/pages/ResetPassword.vue')
  }
]

const publicRoute = [
  'Login',
  'ForgotPassword',
  'ResetPassword'
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router
.beforeEach((to, from, next) => {
  const routeName = to.name
  if (publicRoute.some(pr => pr === routeName)) {
    next()
  } else {
    const data = auth.getAuthDecode()
    if (data && ((data.exp - 1800) * 1000) <= new Date().getTime()) {
      router.replace({ name: 'Login' })
    } else if (data === null) {
      router.replace({ name: 'Login' })
    }
  }
  next()
})
export default router
