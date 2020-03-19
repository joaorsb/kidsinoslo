<template>
    <div class="mx-auto">
        <v-skeleton-loader
            :loading="loadingStories"
            :transition="transition"
            height="94"
            type="list-item-two-line"
          >
          <v-container v-if="this.storiesList.length > 0">
              <v-row dense>
                  <v-col
                    v-for="(story, index) in this.storiesList"
                    :key="index"
                    md="6" cols="12"
                  >
                    <story-view :story='story'></story-view>
                  </v-col>
                 
              </v-row>
               <v-btn
                    center
                    color="primary"
                    @click="loadMoreStories()"
                    class="my-4 float-right"
                    v-show="this.storiesList.length > 24"
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
                <h2 class="text-center">No stories to tell...</h2>
              </v-col>
            </v-row>
          </v-container>
        </v-skeleton-loader>
    </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'StoriesList',
     data: () => ({
      transition: 'scale-transition',
      timeout: 3000,
      hasSnackBar: false,
    }),
    beforeMount() {
      if (this.storiesList.length < 1) {
        this.getStories()
      }
    },
    methods: {
        ...mapActions('Blog', ['getStories', 'closeSnack']),
        ...mapActions('Posts', ['closeSnack']),
        loadMoreStories(){
          this.hasSnackBar = true
          this.getStories()
        }
    },
    computed: {
      ...mapState('Posts', ['snackText', 'hasSnack']),
      ...mapState('Blog', ['storiesList', 'loadingStories'])
    },
  }
</script>