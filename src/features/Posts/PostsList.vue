<template>
    <div class="mx-auto mt-0">
        <v-skeleton-loader
            :loading="loadingPosts"
            :transition="transition"
            height="94"
            type="list-item-two-line"
          >
          <v-container class="posts" v-if="this.paginatedPosts.length > 0">
              <v-row dense>
                  <v-col
                    v-for="(post, index) in this.paginatedPosts"
                    :key="index"
                    md="6" cols="12"
                  >
                    <post-view :post='post'></post-view>
                  </v-col>
                 
              </v-row>
               <v-btn
                    center
                    color="primary"
                    @click="loadMorePosts()"
                    class="my-4 float-right"
                    v-show="this.paginatedPosts.length > 24"
                  >
                    Load more
                    <v-icon>mdi-autorenew</v-icon>
                  </v-btn>
                  <v-snackbar
                      v-model="hasSnackBar"
                      :timeout="timeout"
                      >
                      {{ snackText }}
                      <v-btn
                          color="blue"
                          text
                          @click="closeSnack"
                      >
                          Close
                      </v-btn>
                  </v-snackbar>
          </v-container>
          <v-container fluid  v-else>
            <v-row dense>
              <v-col>
                <h2 class="text-center">No posts</h2>
              </v-col>
            </v-row>
          </v-container>
        </v-skeleton-loader>
    </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'PostsList',
     data: () => ({
      transition: 'scale-transition',
      timeout: 3000,
      hasSnackBar: false,
    }),
    methods: {
        ...mapActions('Posts', ['getPaginatedPosts', 'closeSnack']),
        loadMorePosts(){
          this.hasSnackBar = true
          this.getPaginatedPosts()
        }
    },
    computed: {
      ...mapState('Posts', [
          'postsList', 
          'paginatedPosts', 'loadingPosts', 
          'snackText', 'hasSnack'
      ]),
      ...mapState('Categories', ['selectedCategory']),
    },
  }
</script>
<style scoped>
  .posts {
    padding-top: 0 !important;
  }
</style>