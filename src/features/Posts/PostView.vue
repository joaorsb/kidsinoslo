<template>
    <div>
        <v-card>
            <v-img 
                :src="imageUrl"
                eager
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="300px"
                aspect-ratio="1"
                @click="details()"
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
            <v-card-actions>
                <v-spacer></v-spacer>

                <!-- <v-btn icon>
                    <v-icon>mdi-heart</v-icon>
                </v-btn>

                <v-btn icon>
                    <v-icon>mdi-bookmark</v-icon>
                </v-btn>

                <v-btn icon>
                    <v-icon>mdi-share-variant</v-icon>
                </v-btn> -->
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
            imageUrl: ""
        }
    },
    props: {
        post: {
            type: Object,
            required: true
        }
    },
    methods: {
        ...mapActions('Posts', ['setSelectedPost']),
        getUrl() {
            const fileRef = firebase.storage().ref().child('posts/' + this.post.uid + "/" + this.post.imageName)

            fileRef.getDownloadURL().then(url => {
                this.imageUrl = url
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
                }

            })
        },
        details() {
            this.setSelectedPost(this.post)
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
                    this.imageUrl = ""
                    this.getUrl()
                }
            }
        }
    }
}
</script>