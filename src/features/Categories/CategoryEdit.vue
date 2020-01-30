<template>
    <div class="mt-2">
        <h3 class="d-inline">Selected: {{selectedCategory.name }}</h3> 
        <v-form
            ref="form" class="d-inline"
            lazy-validation
            >
            <v-btn text icon color="error" @click="deleteCategory" class="float-right" >
                <v-icon>mdi-delete</v-icon>
            </v-btn>
        </v-form>
        <div>
            <v-col cols="12" md="8" ></v-col>
            <v-form
                ref="form"
                lazy-validation
                >
                <v-text-field
                    v-model="name"
                    label="Name"
                    required
                >
                </v-text-field>
                <v-select
                    :items="types"
                    v-model="type"
                    label="Choose Type"
                    outlined
                ></v-select>
                <v-btn class="mr-4 float-right" 
                    :disabled=" ! showSubmit" color="primary" @click="submit">
                    submit
                </v-btn>
            </v-form>
        </div>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { slugfy } from '../../helpers/slugfy'

export default {
    name: "CategoryEdit",
    data() {
        return {
            type: ""
        }
    },
    methods: {
        ...mapActions('Categories', ['editCategory', 'deleteCategory','setSelectedCategory']),
        submit(event) {
            event.preventDefault();
            const slug = slugfy(this.name)
            const payload = { 
                newName: this.name,
                newSlug: slug,
                newType: this.type
            }
            this.editCategory(payload)
            this.setSelectedCategory(null)
        }
    },
    computed: {
        ...mapState('Categories', ['selectedCategory', 'types']),
        showSubmit(){
          return this.selectedCategory.name !== "" && this.selectedCategory.type !== ""
        },
        name() {
            return this.selectedCategory ? this.selectedCategory.name : ""
        }
    }
}
</script>
<style>
</style>