<template>
    <div>
        <v-divider></v-divider>
        <v-list class="grey-bg">
            <v-list-item  @click="showMenu = !showMenu">
                <v-list-item-title>
                    <span class="title">Strøk/Bydel</span>
                    <v-icon v-show=" ! showMenu">mdi-arrow-down</v-icon>
                    <v-icon v-show="showMenu">mdi-arrow-up</v-icon>
                </v-list-item-title>
            </v-list-item>
        </v-list>
        <v-list class="grey-bg">
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
            'setPaginationPage',
            'setSelectedPlace'
        ]),
        ...mapActions('Categories', ['setSelectedCategory']),
        filterNeighborhood(index) {
            this.setPaginationPage(1)
            this.clearPaginatedPosts()
            this.setSelectedCategory(null)
            this.setSelectedPlace(null)
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