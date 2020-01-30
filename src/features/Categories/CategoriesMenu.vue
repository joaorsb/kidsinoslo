<template>
    <div>
        <v-list>
            <v-list-item @click="filterAll()">
                <v-list-item-title>Alle aktiviteter</v-list-item-title>
            </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list>
            <v-list-item-content>
                <v-list-item-title>Gratis</v-list-item-title>
            </v-list-item-content>
            <v-list-item
                v-for="(category, index) in freeCategories"
                :key="index"
                @click="filterFree(index)"
            >
                <v-list-item-title>{{ category.name }}</v-list-item-title>
            </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list>
            <v-list-item-content>
                <v-list-item-title>Betaling</v-list-item-title>
            </v-list-item-content>
            <v-list-item
                v-for="(category, index) in paidCategories"
                :key="index"
                @click="filterPaid(index)"
            >
                <v-list-item-title>{{ category.name }}</v-list-item-title>
            </v-list-item>
        </v-list>        
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
    name: "CategoriesMenu",
    computed: {
        ...mapGetters('Categories', ['paidCategories', 'freeCategories']),
        ...mapState('Categories', ['categoriesList']),
    },
    methods: {
        ...mapActions('Categories', ['setSelectedCategory']),
        filterAll() {
            this.setSelectedCategory(null)
            if(this.$router.history.current.path !== '/'){
                this.$router.push('/')
            }
        },
        filterPaid(index) {
            const category = this.paidCategories[index]
            this.setSelectedCategory(category)
            if(this.$router.history.current.path !== '/'){
                this.$router.push('/')
            }
        },
        filterFree(index) {
            const category = this.freeCategories[index]
            this.setSelectedCategory(category)
            if(this.$router.history.current.path !== '/'){
                this.$router.push('/')
            }
        },
    }, 
}
</script>