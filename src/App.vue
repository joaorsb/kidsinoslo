<template>
  <v-app>
    <v-navigation-drawer
      v-model="navBarMenu"
      disable-resize-watcher
      app
      :clipped="true"
    >
      <v-divider></v-divider>
      <v-list dense class="grey-bg">
        <v-list-item
          link
          v-for="(language, index) in filteredLanguages" v-bind:key="index"
          @click="setSelectedLanguague(language.value)"
        >
          <v-list-item-content>
            <v-list-item-title>{{language.name}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
          @click="contact()"
        >
          <v-list-item-content>
            <v-list-item-title>Tips Oss!</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
          v-for="item in menuItems" v-bind:key="item.title"
          :to=item.url
        >
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>

          <v-list-item-content >
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list class="grey-bg">
        <v-list-item @click="filterAll()">
            <v-list-item-title>
              <span class="subtitle-1">Alle aktiviteter</span> 
            </v-list-item-title>
        </v-list-item>
        <v-list-item @click="indoor()">
          <v-list-item-title>
            <span class="title">Inneaktiviteter</span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="outdoor()">
          <v-list-item-title>
            <span class="title">Uteaktiviteter</span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="blog()">
            <v-list-item-title>
              <span class="subtitle-1">Blog</span> 
            </v-list-item-title>
        </v-list-item>
      </v-list>
      <categories-menu></categories-menu>
      <neighborhood-menu></neighborhood-menu>
      <div v-if="this.loggedUser.role !== null">
        <v-list v-if="isAdmin">
            <v-list-item-content  class="mx-2">
                <v-list-item-title>Admin area</v-list-item-title>
            </v-list-item-content>
            <v-list-item
              link
              v-for="item in menuAdmin" v-bind:key="item.title"
              :to=item.url
            >
              <v-list-item-content>
                <v-list-item-title>{{item.title}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
        </v-list>
      </div>
    </v-navigation-drawer>
    <v-app-bar app elevate-on-scroll>
        <v-app-bar-nav-icon @click.native.stop="navBarMenu = ! navBarMenu" 
          class="hidden-md-and-up">
        </v-app-bar-nav-icon>
        <v-toolbar-title class="headline text-uppercase">
          <span  class="font-weight-medium"> Kids in Oslo </span>
          <span class="font-weight-light"></span>
        </v-toolbar-title>
        <div class="flex-grow-1"></div>
        <v-toolbar-items>
          <v-switch class="my-5"
            v-model="darkMode">
          </v-switch>
          <v-icon>mdi-moon-waxing-crescent</v-icon>
        </v-toolbar-items>
        <v-toolbar-items class="hidden-sm-and-down" >
          <v-btn v-for="(language, index) in filteredLanguages" v-bind:key="index"
            text
            small
            active-class="v-btn--active"
            @click="setSelectedLanguague(language.value)">
            <span class="mr-2">{{language.name}}</span>
          </v-btn>
        </v-toolbar-items>
        <v-toolbar-items class="hidden-sm-and-down" >
          <v-btn 
            text
            small
            color="orange accent-4"
            active-class="v-btn--active"
            @click="contact()">
            <span class="mr-2">Tips Oss!</span>
          </v-btn>
        </v-toolbar-items>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn v-for="item in menuItems" v-bind:key="item.title"
            text
            :to=item.url
            small>
            <v-icon left>{{item.icon}}</v-icon>
            <span class="mr-2">{{item.title}}</span>
          </v-btn>
        </v-toolbar-items>
    </v-app-bar>

    <v-content >
      <v-container >

          <v-row class="d-flex">
            <v-col cols="12" >
              <keep-alive>
                <carousel-view 
                  v-if="this.paginatedPosts.length > 0 && this.$router.history.current.path === '/'">
                </carousel-view>
              </keep-alive>
            </v-col>
            <v-col  class="hidden-sm-and-down" md="3" >
              <v-list class="grey-bg">
                  <v-list-item @click="filterAll()">
                    <v-list-item-title>
                      <span class="title">Alle aktiviteter</span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="indoor()">
                    <v-list-item-title>
                      <span class="title">Inneaktiviteter</span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="outdoor()">
                    <v-list-item-title>
                      <span class="title">Uteaktiviteter</span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="blog()">
                    <v-list-item-title>
                      <span class="title">Blog</span>
                    </v-list-item-title>
                  </v-list-item>
              </v-list>
              <v-divider></v-divider>

              <categories-menu></categories-menu>
              
              <neighborhood-menu></neighborhood-menu>

              <v-divider></v-divider>
              <v-list v-if="this.loggedUser && this.isAdmin" class="grey-bg">
                  <v-list-item-content class="mx-2">
                      <v-list-item-title>
                        <span class="subtitle-1 font-weight-medium">Admin actions</span>
                      </v-list-item-title>
                  </v-list-item-content>
                 <v-list-item
                    link
                    v-for="item in menuAdmin" v-bind:key="item.title"
                    :to=item.url
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{item.title}}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="9" >
              <v-alert type="error" v-if="this.authError !== null" dismissible @click="clearAuthError">
                {{ this.authError.message }}
              </v-alert>
              <router-view ></router-view>
            </v-col>
          </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex'

  export default {

    name: 'App',
    data: () => ({
      navBarMenu: false,
      darkMode: false,
    }),
    methods: {
      ...mapActions('Accounts', ['clearAuthError', 'setToken']),
      ...mapActions('Categories', ['getCategories', 'setSelectedCategory']),
      ...mapActions('Posts', [
        'getPosts', 
        'setSelectedNeighborhood', 
        'getPaginatedPosts',
        'setPaginationPage',
        'clearPaginatedPosts',
        'setLanguage',
        'getNeighborhoods',
        'setSelectedPlace'
      ]),
      filterAll() {
            this.setPaginationPage(1)
            this.clearPaginatedPosts()
            this.setSelectedCategory(null)
            this.setSelectedPlace(null)
            this.setSelectedNeighborhood(null)
            this.getPaginatedPosts()
            if(this.$router.history.current.path !== '/'){
                this.$router.push('/')
            }
        },
        setSelectedLanguague(value) {
          const language = this.languages.filter(language => language.value === value)[0]
          this.setLanguage(language.value)
          this.setPaginationPage(1)
          this.clearPaginatedPosts()
          this.setSelectedCategory(null)
          this.setSelectedPlace(null)
          this.setSelectedNeighborhood(null)
          this.getPaginatedPosts()
          if(this.$router.history.current.path !== '/'){
            this.$router.push('/')
          }
        },
        getDarkMode() {
          return JSON.parse(localStorage.getItem('darkMode'))
        },
        setDarkModeOnLocalStorage(value) {
          if (localStorage.setItem('darkMode', value)) return true
          return false
        },
        openMenu() {
          window.scrollTo(0,0)
        },
        contact() {
          this.$router.push('/messages/add')
        },
        blog() {
          this.$router.push('/blog')
        },
        outdoor() {
          this.setSelectedPlace(true)
          this.setPaginationPage(1)
          this.clearPaginatedPosts()
          this.setSelectedCategory(null)
          this.setSelectedNeighborhood(null)
          this.getPaginatedPosts()
          if(this.$router.history.current.path !== '/'){
            this.$router.push('/')
          }
        },
        indoor() {
          this.setSelectedPlace(false)
          this.setPaginationPage(1)
          this.clearPaginatedPosts()
          this.setSelectedCategory(null)
          this.setSelectedNeighborhood(null)
          this.getPaginatedPosts()
          if(this.$router.history.current.path !== '/'){
            this.$router.push('/')
          }
        }
    },
    created() {
      if (this.categoriesList.length === 0) {
        this.getCategories()
      }
      if (this.paginatedPosts.length === 0) {
        this.getPaginatedPosts()
      }
      if (this.neighborhoodList.length === 0) {
        this.getNeighborhoods()
      }
    },
    beforeMount() {
      const localDarkMode = this.getDarkMode()
      if(localDarkMode === true) {
        this.darkMode = true
      }
    }, 
    computed: {
      ...mapGetters('Accounts', ['loggedUser', 'authError', 'isAdmin']),
      ...mapState('Categories', ['categoriesList']),
      ...mapState('Posts', [
        'postsList', 
        'paginatedPosts', 
        'languages', 
        'selectedLanguage',
        'neighborhoodList'
      ]),
      menuItems() {
        let menuItems = [
          // { icon: "mdi-account", title: "Register", url: '/register'},
          // { icon: "mdi-login", title: "Login", url: '/login'},
         
        ]

        if(this.userIsAuthenticated){
          menuItems = [
            { icon: "mdi-logout", title: "", url: '/logout'},
          ]
        }
        return menuItems
      },
      menuAdmin() {
        let menuAdmin = []
        if(this.userIsAuthenticated){
          menuAdmin = [
            { title: "Categories", url: '/admin/categories'},
            { title: "Posts", url: '/posts/edit'},
            { title: "Add Post", url: '/posts/add'},
            { title: "Messages", url: '/admin/messages'},
            { title: "Neighborhoods", url: '/admin/neighborhoods'},
            { title: "Blog", url: '/blog/edit'},
            { title: "Add Story", url: '/blog/add'},
          ]
        }
        return menuAdmin
      },
      userIsAuthenticated() {
        return this.loggedUser.id !== undefined
      },
      filteredLanguages() {
        return this.languages.filter(language => language.value !== this.selectedLanguage)
      }
    },
    watch: {
      // loggedUser (value)  {
      //   if(value){
      //     console.log(value)
      //   }
      // },
      '$route' () {
        if(this.authError){
          this.clearAuthError()
        }
      },
      darkMode (value) {
        if(value === true) {
          this.$vuetify.theme.dark = true
          this.setDarkModeOnLocalStorage(true)
        } else {
          this.$vuetify.theme.dark = false
          this.setDarkModeOnLocalStorage(false)
        }
      }
    },
  };
</script>
<style>
.ck-editor__editable_inline {
  min-height: 200px;
}
.theme--light.v-sheet.grey-bg {
 background-color: #f5f5f5 !important;
}
</style>
