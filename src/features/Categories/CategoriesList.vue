<template>
    <div>
        <div>
            <h2 class="d-inline">Categories</h2> 
            <v-btn small color="primary" class="float-right" @click="addCategory">Add Category</v-btn>
        </div>
        <v-divider></v-divider>

        <v-list>
            <v-list-item
                v-for="(category, index) in categoriesList"
                :key="index"
                @click="selectCategory(index)"
            >
                <v-list-item-title>{{ category.name }}</v-list-item-title>
            </v-list-item>
        </v-list>
        <div v-if="this.selectedCategory">
            <v-divider></v-divider>
            <category-edit></category-edit>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
    name: "CategoriesList",
    computed: {
        ...mapState('Categories', ['categoriesList', 'selectedCategory']),
    },
    methods: {
        ...mapActions('Categories', ['setSelectedCategory']),
        selectCategory(index) {
            const category = this.categoriesList[index]
            this.setSelectedCategory(category)
        },
        addCategory(){
            this.$router.push({name: "categories-add"})
        }
    },  
}
</script>