<template>
    <div class="mx-auto">
        <v-skeleton-loader
            :loading="this.paginatedPosts.length === 0"
            :transition="transition"
            height="94"
            type="list-item-two-line"
          >
          <v-container fluid v-if="this.paginatedPosts.length > 0">
              <v-row dense>
                  <v-col
                  v-for="(post, index) in this.paginatedPosts"
                  :key="index"
                  :cols="post.flex"
                  >
                    <post-view :post='post'></post-view>
                  </v-col>
                 
              </v-row>
               <v-btn
                    center
                    color="primary"
                    @click="loadMorePosts()"
                    class="my-4 float-right"
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
      ...mapState('Posts', ['postsList', 'paginatedPosts']),
      ...mapGetters('Posts', ['filteredPosts']),
      ...mapState('Categories', ['selectedCategory']),
    },
  }
</script>