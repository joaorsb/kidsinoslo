import Vue from 'vue'
import Vuex from 'vuex'
import Accounts from '@/features/Accounts/store'
import Posts from '@/features/Posts/store'
import Categories from '@/features/Categories/store'
import Messages from '@/features/Messages/store'
import Blog from '@/features/Blog/store'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    Accounts,
    Posts,
    Categories,
    Messages,
    Blog,
  }
})
