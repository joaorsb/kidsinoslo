<template>
    <div>
        <v-divider></v-divider>
        <v-list>
            <v-list-item-content class="mx-2">
                <v-list-item-title>
                    <v-btn text  @click="showMenu = !showMenu">
                        Bydel
                        <v-icon v-show=" ! showMenu">mdi-arrow-down</v-icon>
                        <v-icon v-show="showMenu">mdi-arrow-up</v-icon>
                    </v-btn>
                </v-list-item-title>
            </v-list-item-content>
            <div v-show="showMenu">
                <v-list-item
                    v-for="(neiborhood, index) in sortedNeighborhood"
                    :key="index"
                    @click="filterNeighborhood(index)"
                >
                    <v-list-item-title>{{ neiborhood }}</v-list-item-title>
                </v-list-item>
            </div>
        </v-list>      
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
    name: "NeighborhoodMenu",
    data() {
        return {
            showMenu: false,
        }
    },
    computed: {
        ...mapState('Posts', ['selectedNeighborhood']),
        ...mapGetters('Posts', ['sortedNeighborhood'])
    },
    methods: {
        ...mapActions('Posts', [
            'setSelectedNeighborhood', 
            'getPaginatedPosts', 
            'clearPaginatedPosts',
            'setPaginationPage'
            ]),
        ...mapActions('Categories', ['setSelectedCategory']),
        filterNeighborhood(index) {
            this.setPaginationPage(1)
            this.clearPaginatedPosts()
            this.setSelectedCategory(null)
            const neighborhood = this.sortedNeighborhood[index]
            // console.log(neighborhood)
            this.setSelectedNeighborhood(neighborhood)
            this.getPaginatedPosts()
            if(this.$router.history.current.path !== '/'){
                this.$router.push('/')
            } else {
                window.scrollTo(0,0)
            }
        },
    }, 
}
</script>