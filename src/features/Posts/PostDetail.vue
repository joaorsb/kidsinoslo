<template>
    <article v-if="this.selectedPost">
        <v-card>
             <v-btn
              absolute
              dark
              fab
              top
              right
              color="blue-grey darken-4"
              @click="back()"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-img
            :src="selectedPost.imageUrl"
            >
                <template v-slot:placeholder>
                    <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                    >
                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-row>
                </template>
            </v-img>
            <v-card-title v-text="this.selectedPost.title"></v-card-title>
            <v-card-text v-text="category.name"></v-card-text>
        </v-card>
        <v-divider class="py-5"></v-divider>     
        <section>
            <div v-html="this.selectedPost.description"></div>
            <v-list>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title v-text="this.selectedPost.address"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title v-text="this.selectedPost.neighborhood"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="this.selectedPost.siteUrl">
                    <v-list-item-content>
                        <v-list-item-title>
                            <a target="_blank" :href="this.selectedPost.siteUrl">Klikk her for mer info</a>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </section>
        <div v-if="this.selectedPost">
            <GmapMap :center="this.position" 
                :zoom="17" class="mt-3"
                style="width: 100%; height: 400px" 
                v-if="this.selectedPost.lat"
            >
                <GmapMarker :position="this.position" :clickable="true" :draggable="true" ></GmapMarker>
            </GmapMap>
            <div class="comments mt-4">
                <vue-disqus shortname="kids-in-oslo" :identifier="this.selectedPost.uid" ></vue-disqus>
            </div>
        </div>
    </article>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
    name: "PostDetail",
    data() {
        return {
            imageUrl: "",
            position: {
                lat: 0,
                lng: 0
            }
        }
    },
    beforeMount() {
        if(this.selectedPost === null){
            this.getPostBySlug(this.$route.params.slug)
        } else {
            this.position.lat = this.selectedPost.lat
            this.position.lng = this.selectedPost.lng
        }
    },
    mounted() {
    },
    methods: {
        ...mapActions('Posts',['setSelectedPost', 'getPostBySlug', 'getPostGeolocation']),
        back() {
            this.$router.back()
        }
    },
    computed: {
        ...mapState('Categories', ['categoriesList']),
        ...mapState('Posts', ['selectedPost']),
        category() {
            return this.categoriesList.filter(category => category.uid == this.selectedPost.category)[0]
        }
    },
    beforeDestroy() {
        this.setSelectedPost(null)
    },
    watch: {
        selectedPost(value) {
            if(value){
                this.getPostGeolocation()
                this.position.lat = this.selectedPost.lat
                this.position.lng = this.selectedPost.lng
            }
        }
    }
}
</script>