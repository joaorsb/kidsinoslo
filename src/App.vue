<template>
  <v-app>
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
      <v-card v-show="navBarMenu" height="500" width="100%" class="mx-auto">
        <v-navigation-drawer
            v-model="navBarMenu"
            width="80%"
            absolute
            temporary
          >
            <v-divider></v-divider>
            
            <v-list dense>
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
            <v-list>
              <v-list-item @click="filterAll()">
                  <v-list-item-title>Alle aktiviteter</v-list-item-title>
              </v-list-item>
            </v-list>
            <categories-menu></categories-menu>
            <neighborhood-menu></neighborhood-menu>
            <v-list v-if="this.loggedUser && this.loggedUser.role.includes('admin')">
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
        </v-navigation-drawer>
      </v-card>
      <v-container >

          <v-row class="d-flex">
            <v-col cols="12">
              <carousel-view 
                v-if="this.paginatedPosts.length > 0 && this.$router.history.current.path === '/'">
              </carousel-view>
            </v-col>
            <v-col  class="hidden-sm-and-down" md="3" >
              <v-list>
                  <v-list-item @click="filterAll()">
                      <v-list-item-title>Alle aktiviteter</v-list-item-title>
                  </v-list-item>
              </v-list>
              <v-divider></v-divider>
              <categories-menu></categories-menu>
              <neighborhood-menu></neighborhood-menu>
              <v-divider></v-divider>
              <v-list v-if="this.loggedUser && this.isAdmin">
                  <v-list-item-content class="mx-2">
                      <v-list-item-title>Admin actions</v-list-item-title>
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
        'setLanguage'
      ]),
      filterAll() {
            this.setPaginationPage(1)
            this.clearPaginatedPosts()
            this.setSelectedCategory(null)
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
        }
    },
    created() {
      if(this.categoriesList.length === 0) {
        this.getCategories()
      }
      if(this.paginatedPosts.length === 0) {
        this.getPaginatedPosts()
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
      ...mapState('Posts', ['postsList', 'paginatedPosts', 'languages', 'selectedLanguage']),
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
      loggedUser (value)  {
        if(value.id !== "" && value.id !== undefined && this.$router.history.current.path !== '/'){
          this.$router.push('/')
        }
      },
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
<style >
.ck-editor__editable_inline {
  min-height: 200px;
}
</style>
