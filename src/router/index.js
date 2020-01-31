import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from '@/features/Accounts/Register'
import Login from '@/features/Accounts/Login'
import Logout from '@/features/Accounts/Logout'
import PostsList from '@/features/Posts/PostsList'
import PostAdd from '@/features/Posts/PostAdd'
import PostEdit from '@/features/Posts/PostEdit'
import PostDetail from '@/features/Posts/PostDetail'
import CategoryAdd from '@/features/Categories/CategoryAdd'
import CategoriesList from '@/features/Categories/CategoriesList'
import AuthGuard from './auth-guard'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: PostsList
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/logout',
    name: 'logout',
    component: Logout
  },
  {
    path: '/posts',
    name: 'posts',
    component: PostsList
  },
  {
    path: '/posts/add',
    name: 'posts-add',
    component: PostAdd
  },
  {
    path: '/posts/edit',
    name: 'posts-edit',
    component: PostEdit
  },
  {
    path: '/posts/:slug',
    name: 'post-detail',
    component: PostDetail
  },
  {
    path: '/admin/categories',
    name: 'categories',
    component: CategoriesList,
    beforeEnter: AuthGuard
  },
  {
    path: '/admin/categories/add',
    name: 'categories-add',
    component: CategoryAdd,
    beforeEnter: AuthGuard
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
