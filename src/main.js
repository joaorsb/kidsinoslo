import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
// import { initializeApp, auth, firestore, storage } from 'firebase'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import * as env from '../env.local'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import VueCkeditor from 'vue-ckeditor5'

Vue.config.productionTip = false
const files = require.context('./', true, /\.vue$/i)
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

const firebaseConfig = {
  apiKey: env.apiKey,
  authDomain: env.authDomain,
  databaseURL: env.databaseURL,
  projectId: env.projectId,
  storageBucket: env.storageBucket,
  messagingSenderId: env.messagingSenderId,
  appId: env.appId
}
const options = {
  editors: {
      classic: ClassicEditor,
  },
  name: 'ckeditor'
}

Vue.use(VueCkeditor.plugin, options);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created() {
    firebase.initializeApp(firebaseConfig)
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
          const loggedUser = {
            id: user.uid,
            email: user.email,
            password: '',
          }
          this.$store.dispatch('Accounts/setUser', loggedUser)
          this.$store.dispatch('Accounts/setToken', user.refreshToken)
        }
    })
  }
}).$mount('#app')
export const db = firebase.firestore()
export const fbStorage = firebase.storage()
