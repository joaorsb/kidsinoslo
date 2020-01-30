<template>
    <div class="mx-auto">
        <v-skeleton-loader
            :loading="this.postsList.length === 0"
            :transition="transition"
            height="94"
            type="list-item-two-line"
          >
          <v-container fluid v-if="this.filteredPosts.length > 0">
              <v-row dense>
                  <v-col
                  v-for="(post, index) in this.filteredPosts"
                  :key="index"
                  :cols="post.flex"
                  >
                    <post-view :post='post'></post-view>
                  </v-col>
              </v-row>
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
        ...mapActions('Posts', ['getPosts'])
    },
    computed: {
      ...mapState('Posts', ['postsList']),
      ...mapGetters('Posts', ['filteredPosts']),
      ...mapState('Categories', ['selectedCategory']),
    },
  }
</script>