<template>
    <div class="mx-auto">
        <v-skeleton-loader
            :loading="loadingPosts"
            :transition="transition"
            height="94"
            type="list-item-two-line"
          >
          <v-container v-if="this.paginatedPosts.length > 0">
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
                    v-show="this.paginatedPosts.length > 25"
                  >
                    Load more
                    <v-icon>mdi-autorenew</v-icon>
                  </v-btn>
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
  import { mapState, mapActions, mapGetters } from 'vuex'
  export default {
    name: 'PostsList',
     data: () => ({
      transition: 'scale-transition',
    }),
    methods: {
        ...mapActions('Posts', ['getPaginatedPosts']),
        loadMorePosts(){
          this.getPaginatedPosts()
        }
    },
    computed: {
      ...mapState('Posts', ['postsList', 'paginatedPosts', 'loadingPosts']),
      ...mapGetters('Posts', ['filteredPosts']),
      ...mapState('Categories', ['selectedCategory']),
    },
  }
</script>