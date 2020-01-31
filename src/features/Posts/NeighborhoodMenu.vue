<template>
    <div v-if="this.neighborhoodList.length > 0">
        <v-divider></v-divider>
        <v-list>
            <v-list-item-content>
                <v-list-item-title>Bydel</v-list-item-title>
            </v-list-item-content>
            <v-list-item
                v-for="(neiborhood, index) in neighborhoodList"
                :key="index"
                @click="filterNeighborhood(index)"
            >
                <v-list-item-title>{{ neiborhood }}</v-list-item-title>
            </v-list-item>
        </v-list>      
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
    name: "NeighborhoodMenu",
    computed: {
        ...mapState('Posts', ['neighborhoodList', 'selectedNeighborhood']),
    },
    methods: {
        ...mapActions('Posts', ['setSelectedNeighborhood']),
        ...mapActions('Categories', ['setSelectedCategory']),
        filterNeighborhood(index) {
            this.setSelectedCategory(null)
            const neighborhood = this.neighborhoodList[index]
            this.setSelectedNeighborhood(neighborhood)
            if(this.$router.history.current.path !== '/'){
                this.$router.push('/')
            }
        },
    }, 
}
</script>