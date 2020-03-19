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
        <article v-if="this.selectedStory">
            <v-card>
                <v-card-title v-text="this.selectedStory.title"></v-card-title>
                <v-card-subtitle v-text="this.selectedStory.subtitle"></v-card-subtitle>
                <v-card-text>
                    <section>
                        <v-img
                        :src="selectedStory.imageUrl"
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
                        <p class="mt-3">{{this.selectedStory.author}} - <span >{{ storyDate }}</span></p>
                        <div v-html="this.selectedStory.body"></div>
                    </section>
                </v-card-text>
            </v-card>
            
            <div v-if="this.selectedStory">
               
                <div class="comments mt-4">
                    <vue-disqus shortname="kids-in-oslo" :identifier="this.selectedStory.uid" ></vue-disqus>
                </div>
            </div>
        </article>
    </div>

</template>
<script>
import { mapState, mapActions } from 'vuex'
import { DateTime } from 'luxon';
export default {
    name: "StoryDetail",
    data() {
        return {
            imageUrl: "",
            
        }
    },
    beforeMount() {
        if(this.selectedStory === null){
            this.getStoryBySlug(this.$route.params.slug)
        } 
    },
    mounted() {
    },
    methods: {
        ...mapActions('Blog',['setSelectedStory','getStoryBySlug']),
        back() {
            this.$router.back()
        },
    },
    computed: {
        ...mapState('Blog', ['selectedStory']),
        storyDate() {
            return DateTime.fromSeconds(this.selectedStory.createdAt.seconds).toLocaleString();
        }
    },
    beforeDestroy() {
        this.setSelectedStory(null)
    }
}
</script>