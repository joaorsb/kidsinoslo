<template>
    <div v-if="randomPosts.size > 0">
        <v-carousel
            cycle
            height="400"
            show-arrows-on-hover
        >
            <v-carousel-item
            v-for="(post, i) in randomPosts"
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
                    <div class="display-2 font-weight-thin hidden-sm-and-down" >
                        <span class="info-title" v-text="post.title"></span>
                    </div>
                </v-row>
            </v-carousel-item>
        </v-carousel>
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
    name: "CarouselView",
    methods: {
        ...mapActions('Posts', ['setSelectedPost', 'getPostGeolocation']),
        selectPost(index) {
            const postsList = [...this.randomPosts]
            const post = postsList[index]
            this.setSelectedPost(post)
            if(! post.lat || ! post.lng) {
                this.getPostGeolocation()
            }
            this.$router.push({name: "post-detail", params: {slug: post.slug }}).catch(() => {})
        }
    },
    computed: {
        ...mapState('Posts', ['paginatedPosts', 'selectedPost']),
        ...mapState('Categories', ['selectedCategory']),
        ...mapGetters('Posts', ['randomPosts'])
    }
}
</script>
<style scoped>
    .info-title {
        color: white
    }
</style>