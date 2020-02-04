<template>
    <div v-if="posts.length > 0">
        <v-carousel
            cycle
            height="400"
            hide-delimiter-background
            show-arrows-on-hover
        >
            <v-carousel-item
            v-for="(post, i) in posts"
            :key="i"
            :src="post.imageUrl"
            reverse-transition="fade-transition"
            transition="fade-transition"
            @click="selectPost(i)"
            >
                <v-row
                class="fill-height"
                align="center"
                justify="center"
                >
                    <div class="display-3" >
                        <span class="info-title" v-text="post.title"></span>
                    </div>
                </v-row>
            </v-carousel-item>
        </v-carousel>
    </div>
</template>
<script>
import { storage } from 'firebase'
import { mapState, mapActions } from 'vuex'
export default {
    name: "CarouselView",
    data () {
      return {
        posts: []
      }
    },
    methods: {
        ...mapActions('Posts', ['setSelectedPost']),
        selectPost(index) {
            this.setSelectedPost(this.posts[index])
            this.$router.push({name: "post-detail", params: {slug: this.selectedPost.slug }})
        },
        getRandom() {
            let numbers = []
            for(let i = 0; i < 3; i++){
                const number = [Math.round((Math.random() * 10) + 1)]
                if( ! numbers.includes(number) && this.paginatedPosts.length > number) {
                    numbers.push(number)
                    let randomPost = this.paginatedPosts[number]
                    this.getUrl(randomPost)
                }
            }


        },
        getUrl(randPost) {
            const fileRef =  storage().ref().child('posts/' + randPost.uid + "/" + randPost.imageName)
            fileRef.getDownloadURL().then(url => {
                randPost.imageUrl = url
                this.posts.push(randPost)
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
        ...mapState('Posts', ['paginatedPosts', 'selectedPost', 'selectedNeighborhood']),
        ...mapState('Categories', ['selectedCategory'])
    },
    watch: {
        paginatedPosts: {
            immediate: true,
            deep: true,
            handler: function(value) {
                if(value.length > 6 && this.posts.length === 0) {
                    this.getRandom()
                }
            }
        }
    }
}
</script>
<style scoped>
    .info-title {
        color: white
    }
</style>