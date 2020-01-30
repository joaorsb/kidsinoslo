<template>
  <v-app>
    <v-app-bar app elevate-on-scroll>
        <v-app-bar-nav-icon @click.native.stop="navBarMenu = ! navBarMenu" 
          class="hidden-sm-and-up">
        </v-app-bar-nav-icon>
        <v-toolbar-title class="headline text-uppercase">
          <span> Kids in Oslo </span>
          <span class="font-weight-light"></span>
        </v-toolbar-title>
        <div class="flex-grow-1"></div>
        <v-toolbar-items class="hidden-xs-only">
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

      <v-navigation-drawer
          v-model="navBarMenu"
          absolute
          temporary
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Options</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list dense>

            <v-list-item
              link
              v-for="item in menuItems" v-bind:key="item.title"
              :to=item.url
            >
              <v-list-item-icon>
                <v-icon>{{item.icon}}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{item.title}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-list v-if="this.loggedUser && this.loggedUser.role.includes('user')">
                  <v-list-item-content>
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
      <v-container >
          <v-row class="d-flex">
            <v-col  class="hidden-xs-only " md="3" >
              <categories-menu></categories-menu>
              <v-divider></v-divider>
              <v-list v-if="this.loggedUser && this.isAdmin">
                  <v-list-item-content>
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
    }),
    methods: {
      ...mapActions('Accounts', ['clearAuthError', 'setToken']),
      ...mapActions('Categories', ['getCategories']),
      ...mapActions('Posts', ['getPosts'])
    },
    mounted() {
      if(this.categoriesList.length === 0) {
        this.getCategories()
      }
      if(this.postsList.length === 0) {
        this.getPosts()
      }
    }, 
    computed: {
      ...mapGetters('Accounts', ['loggedUser', 'authError', 'isAdmin']),
      ...mapState('Categories', ['categoriesList']),
      ...mapState('Posts', ['postsList']),
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
            { title: "Add Post", url: '/posts/add'},
          ]
        }
        return menuAdmin
      },
      userIsAuthenticated() {
        return this.loggedUser.id !== undefined
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
    },
  };
</script>
<style >
.ck-editor__editable_inline {
  min-height: 200px;
}
</style>
