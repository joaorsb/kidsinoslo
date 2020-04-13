<template>
    <div>
        <v-btn
            fixed
            dark
            fab
            bottom
            right
            color="blue-grey darken-4"
            @click="back()"
        >
            <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <article v-if="this.selectedPost">
            <!-- <v-container>
                <v-row>
                    <v-col align-self="end">
                        <v-btn text @click="back()" class="float-right"><v-icon>mdi-arrow-left</v-icon>Back</v-btn>
                    </v-col>
                </v-row>
            </v-container> -->
            <v-card>
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
                <v-card-text v-text="outdoorText"></v-card-text>
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
            <div v-if="this.selectedPost && hasMap">
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
    </div>

</template>
<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
export default {
    name: "PostDetail",
    data() {
        return {
            imageUrl: "",
            position: {
                lat: 0,
                lng: 0
            },
            hasMap: false
        }
    },
    beforeMount() {
        if(this.selectedPost === null){
            this.getPostBySlug(this.$route.params.slug)
        } else {
            this.getPostGeolocation()
        }
    },
    mounted() {
    },
    methods: {
        ...mapActions('Posts',['setSelectedPost', 'getPostBySlug', 'editPost']),
        back() {
            this.$router.back()
        },
        async getPostGeolocation() {
            try{
                const { data } = await axios.post(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${this.selectedPost.address}+Oslo&key=AIzaSyADaD5ZdjzHBTyNT4s5CkOe1B8KAk5pthw`
                )
                if(data.error_message) {
                    console.log(data.error_message)
                } else {
                    this.hasMap = true
                    this.position.lat = data.results[0].geometry.location.lat
                    this.position.lng = data.results[0].geometry.location.lng
                    if( ! this.selectedPost.lat) {
                        this.selectedPost.lat = this.position.lat
                        this.selectedPost.lng = this.position.lng
                        this.editPost(this.selectedPost)
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    },
    computed: {
        ...mapState('Categories', ['categoriesList']),
        ...mapState('Posts', ['selectedPost']),
        category() {
            return this.categoriesList.filter(category => category.uid == this.selectedPost.category)[0]
        },
        outdoorText() {
            return this.selectedPost.outdoor ? "Outdoor" : "Indoor"
        }
    },
    beforeDestroy() {
        this.setSelectedPost(null)
    },
    watch: {
        selectedPost(value) {
            if(value){
                this.getPostGeolocation()
                // console.log(this.selectedPost.lat)
                // this.position.lat = this.selectedPost.lat
                // this.position.lng = this.selectedPost.lng
            }
        }
    }
}
</script>