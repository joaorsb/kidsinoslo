<template>
    <div>
        <v-card>
            <v-img 
                :src="story.imageUrlThumb"
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
                <v-card-title v-text="this.story.title"></v-card-title>
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
                <v-card-title v-text="this.story.title" ></v-card-title>
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
import { mapState, mapActions } from 'vuex'
export default {
    name: "StoryView",
    data() {
        return {
            imageUrl: "",
            hasImageUrl: false
        }
    },
    props: {
        story: {
            type: Object,
            required: true
        }
    },
    methods: {
        ...mapActions('Blog', ['setSelectedStory']),
        details() {
            this.setSelectedStory(this.story)
            this.$router.push({name: "stories-detail", params: {slug: this.selectedStory.slug }})
        },
    },
    computed: {
        ...mapState('Blog', ['selectedStory'])
    },
    watch: {
        story: {
            immediate: true,
            deep: true,
            handler: function(value) {
                if(value) {
                    if(value.imageName !== null) {
                        this.hasImageUrl = true
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