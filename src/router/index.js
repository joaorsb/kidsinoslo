import Vue from 'vue'
import VueRouter from 'vue-router'
// import Register from '@/features/Accounts/Register'
import Login from '@/features/Accounts/Login'
import Logout from '@/features/Accounts/Logout'
import PostsList from '@/features/Posts/PostsList'
import StoriesList from '@/features/Blog/StoriesList'
import PostAdd from '@/features/Posts/PostAdd'
import StoryAdd from '@/features/Blog/StoryAdd'
import PostEdit from '@/features/Posts/PostEdit'
import StoryEdit from '@/features/Blog/StoryEdit'
import PostDetail from '@/features/Posts/PostDetail'
import StoryDetail from '@/features/Blog/StoryDetail'
import NeighborhoodList from '@/features/Posts/NeighborhoodList'
import CategoryAdd from '@/features/Categories/CategoryAdd'
import CategoriesList from '@/features/Categories/CategoriesList'
import MessagesList from '@/features/Messages/MessagesList'
import MessageAdd from '@/features/Messages/MessageAdd'
import AuthGuard from './auth-guard'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: PostsList
  },
  {
    path: '/blog',
    name: 'blog',
    component: StoriesList
  },
  // {
    // path: '/register',
    // name: 'register',
    // component: Register
  // },
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
    component: PostAdd,
    beforeEnter: AuthGuard
  },
  {
    path: '/posts/edit',
    name: 'posts-edit',
    component: PostEdit,
    beforeEnter: AuthGuard
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
  },
  {
    path: '/admin/messages',
    name: 'messages',
    component: MessagesList,
    beforeEnter: AuthGuard
  },
  {
    path: '/admin/neighborhoods',
    name: 'neighborhoods',
    component: NeighborhoodList,
    beforeEnter: AuthGuard
  },
  {
    path: '/messages/add',
    name: 'messages-add',
    component: MessageAdd,
  },
  {
    path: '/blog/add',
    name: 'stories-add',
    component: StoryAdd,
    beforeEnter: AuthGuard
  },
  {
    path: '/blog/edit',
    name: 'stories-edit',
    component: StoryEdit,
    beforeEnter: AuthGuard
  },
  {
    path: '/blog/:slug',
    name: 'stories-detail',
    component: StoryDetail
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(from, to, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }

  }
})

export default router
