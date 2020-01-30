<template>
    <v-col  >
        <h2>Add a new category</h2>
        <v-form
            ref="form"
            lazy-validation
            >
            <v-text-field
            v-model="category.name"
            label="Name"
            required
            >
            </v-text-field>
            <v-select
            :items="types"
            v-model="category.type"
            label="Choose Type"
            outlined
            ></v-select>
            <v-btn class="mr-4 float-right" :disabled=" ! showSubmit" color="primary" @click="submit">submit</v-btn>

        </v-form>
    </v-col>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { slugfy } from '../../helpers/slugfy'

export default {
    name: "CategoryAdd",
    data() {
        return {
        }
    },
    methods: {
        ...mapActions('Categories', ['createCategory']),
        submit(event) {
            event.preventDefault();
            this.category.slug = slugfy(this.category.name)
            this.createCategory(this.category)
            this.$router.push('/admin/categories')
        }
    },
    computed: {
        ...mapState('Categories', ['category', 'types']),
        showSubmit(){
          return this.category.name !== "" && this.category.type !== ""
      }
    }
}
</script>
<style>
</style>