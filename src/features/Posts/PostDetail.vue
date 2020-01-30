<template>
    <article>
        <v-card>
            <v-img
            :src="imageUrl"
            >
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
            </v-list>
        </section>
        
            
    </article>
</template>
<script>
import { storage } from 'firebase'
import { mapState, mapActions } from 'vuex'
export default {
    name: "PostDetail",
    data() {
        return {
            imageUrl: ""
        }
    },
    mounted() {
        this.getUrl()
    },
    methods: {
        ...mapActions('Posts',['setSelectedPost']),
        getUrl() {
            const fileRef = storage().ref().child('posts/' + this.selectedPost.slug + "/" + this.selectedPost.imageName)
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
        ...mapState('Categories', ['categoriesList']),
        ...mapState('Posts', ['selectedPost']),
        category() {
            return this.categoriesList.filter(category => category.uid == this.selectedPost.category)[0]
        },
    },
    beforeDestroy() {
        this.setSelectedPost(null)
    }
}
</script>