<template>
    <div>
        <v-card>
            <v-img
            :src="imageUrl"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="300px"
            >
                <v-card-title v-text="post.title"></v-card-title>
            </v-img>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn icon>
                    <v-icon>mdi-heart</v-icon>
                </v-btn>

                <v-btn icon>
                    <v-icon>mdi-bookmark</v-icon>
                </v-btn>

                <v-btn icon>
                    <v-icon>mdi-share-variant</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
import { storage } from 'firebase'
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
    mounted() {
        this.getUrl()
    },
    methods: {
        getUrl() {
            const fileRef = storage().ref().child('posts/' + this.post.slug + "/" + this.post.imageName)
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
        }
    },
    computed: {
        
    }
}
</script>