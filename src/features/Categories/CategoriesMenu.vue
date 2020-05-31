<template>
    <div>
        <v-divider></v-divider>
        <v-list class="grey-bg">
            <v-list-item  @click="showGratis = !showGratis">
                <v-list-item-title>
                    <span class="title">Gratis</span>
                    <v-icon v-show=" ! showGratis">mdi-arrow-down</v-icon>
                    <v-icon v-show="showGratis">mdi-arrow-up</v-icon>
                </v-list-item-title>
            </v-list-item>
        </v-list>
        <v-list class="grey-bg">
            <div v-show="showGratis">
                <v-list-item
                    v-for="(category, index) in freeCategories"
                    :key="index"
                    @click="filterFree(index)"
                >
                    <v-list-item-title>{{ category.name }}</v-list-item-title>
                </v-list-item>
            </div>
        </v-list>
        <v-divider></v-divider>
        <v-list class="grey-bg">
            <v-list-item  @click="showPaid = !showPaid">
                <v-list-item-title>
                    <span class="title">Betaling</span>
                    <v-icon v-show=" ! showPaid">mdi-arrow-down</v-icon>
                    <v-icon v-show="showPaid">mdi-arrow-up</v-icon>
                </v-list-item-title>
            </v-list-item>
        </v-list>
        <v-list class="grey-bg">
            <div v-show="showPaid">
                <v-list-item
                    v-for="(category, index) in paidCategories"
                    :key="index"
                    @click="filterPaid(index)"
                >
                    <v-list-item-title>{{ category.name }}</v-list-item-title>
                </v-list-item>
            </div>
        </v-list>        
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
    name: "CategoriesMenu",
    data() {
        return {
            showGratis: false,
            showPaid: false
        }
    },
    computed: {
        ...mapGetters('Categories', ['paidCategories', 'freeCategories']),
        ...mapState('Categories', ['categoriesList']),
    },
    methods: {
        ...mapActions('Categories', ['setSelectedCategory']),
        ...mapActions('Posts', [
            'setSelectedNeighborhood', 
            'getPaginatedPosts', 
            'clearPaginatedPosts',
            'setPaginationPage',
            'setSelectedPlace'
        ]),
        filterPaid(index) {
            this.setPaginationPage(1)
            this.clearPaginatedPosts()
            this.setSelectedNeighborhood(null)
            this.setSelectedPlace(null)
            const category = this.paidCategories[index]
            this.setSelectedCategory(category)
            this.getPaginatedPosts()
            if(this.$router.history.current.path !== '/'){
                this.$router.push('/')
            } else {
                window.scrollTo(0,0)
            }
        },
        filterFree(index) {
            this.setPaginationPage(1)
            this.clearPaginatedPosts()
            this.setSelectedNeighborhood(null)
            const category = this.freeCategories[index]
            this.setSelectedCategory(category)
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
<style scoped>
    .v-list { padding: 0px;}
</style>