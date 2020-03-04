<template>
    <div>
        <v-card>
            <v-img 
                :src="post.imageUrlThumb"
                eager
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="150px"
                aspect-ratio="1"
                @click="details()"
                v-if="hasImageUrl"
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
                <v-card-title v-text="this.post.title"></v-card-title>
            </v-img>
            <!-- #EF9A9A -->
            <v-sheet
                v-else
                color="#E1BEE7"
                height="150px"
                @click="details()"
            >
                <v-row
                    class="fill-height"
                    align="center"
                    justify="center"
                >
                <v-card-title v-text="this.post.title" color="black"></v-card-title>
                </v-row>
            </v-sheet>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    text
                    
                    @click="details()"
                >
                    Vis mer <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
import * as firebase from 'firebase/app'
import 'firebase/storage'
import { mapState, mapActions } from 'vuex'
export default {
    name: "PostView",
    data() {
        return {
            imageUrl: "",
            hasImageUrl: true
        }
    },
    props: {
        post: {
            type: Object,
            required: true
        }
    },
    methods: {
        ...mapActions('Posts', ['setSelectedPost', 'getPostGeolocation']),
        getUrl() {
            let thumbImage = this.post.imageName.replace('.jpg', '@s_400.jpg')
            if(thumbImage == this.post.imageName) {
                thumbImage = this.post.imageName.replace('.JPG', '@s_400.JPG')
            }
            const fileRef = firebase.storage().ref().child(`posts/${this.post.uid}/${thumbImage}`)

            fileRef.getDownloadURL().then(url => {
                this.imageUrl = url
                this.post.imageUrlThumb = url
            })
            .catch(error => {
                switch (error.code) {
                    case 'storage/object-not-found':
                    break;

                    case 'storage/unauthorized':
                    break;

                    case 'storage/canceled':
                    break;

                    case 'storage/unknown':
                    break;
                    default:
                        this.post.imageUrl = ""
                        this.hasImageUrl = false
                        break;
                }

            })
        },
        details() {
            this.setSelectedPost(this.post)
            if(!this.post.lat || ! this.post.lng) {
                this.getPostGeolocation()
            }
            this.$router.push({name: "post-detail", params: {slug: this.selectedPost.slug }})
        },
    },
    computed: {
        ...mapState('Posts', ['selectedPost'])
    },
    watch: {
        post: {
            immediate: true,
            deep: true,
            handler: function(value) {
                if(value) {
                    if(value.imageName !== null) {
                        if(value.imageUrlThumb === '')
                            this.getUrl()
                            // this.hasImageUrl = false
                    } else {
                        this.imageUrl = ""
                        this.hasImageUrl = false
                    }
                }
            }
        }
    }
}
</script>