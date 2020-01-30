<template>
    <v-card
        class="mx-auto">
        <v-container fluid>
            <v-row dense>
                <v-col
                v-for="(post, index) in this.postsList"
                :key="index"
                :cols="post.flex"
                >
                    <post-view :post='post'></post-view>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
  // Utilities
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'PostsList',
     data: () => ({
      posts: [
          { id: 1, title: "Novo", description: 'Wohoo', src: "https://cdn.vuetifyjs.com/images/cards/house.jpg", flex: 12 },
          { id: 1, title: "Teste", description: 'Wohoo', src: "https://cdn.vuetifyjs.com/images/cards/road.jpg", flex: 6} ,
          { id: 1, title: "Outro", description: 'Wohoo', src: "https://cdn.vuetifyjs.com/images/cards/house.jpg", flex: 6 },
          { id: 1, title: "Iti malia", description: 'Wohoo', src: "https://cdn.vuetifyjs.com/images/cards/plane.jpg", flex: 12},
      ]
    }),
    methods: {
        ...mapActions('Posts', ['getPosts'])
    },
    computed: {
      ...mapState('Posts', ['postsList'])
    }
  }
</script>