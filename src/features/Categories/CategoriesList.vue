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
            <v-row justify="center">
                <v-dialog v-model="dialogEdit" fullscreen hide-overlay>
                    <v-card>
                        <v-card-title>
                            <div class="my-3">
                                <v-btn icon @click="dialogEdit = false">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                                <h3 class="d-inline">Selected: {{ selectedCategory.name }}</h3> 
                                <div class="float-right">
                                    <v-btn text icon 
                                        color="error" 
                                        @click="deleteSelectedCategory()" 
                                        align="end" >
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </div>

                            </div>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="name"
                                            label="Name"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-select
                                            :items="types"
                                            v-model="type"
                                            label="Choose Type"
                                            outlined
                                        ></v-select>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="error" @click="dialogEdit = false">Cancel</v-btn>
                            <v-btn text color="primary" @click="submit">Update</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { slugfy } from '../../helpers/slugfy'
export default {
    name: "CategoriesList",
    data() {
        return {
            dialogEdit: false,
            type: '',
            name: ''
        }
    },
    computed: {
        ...mapState('Categories', ['categoriesList', 'selectedCategory', 'types']),
        showSubmit(){
          return this.selectedCategory.name !== "" && this.selectedCategory.type !== ""
        }
    },
    methods: {
        ...mapActions('Categories', ['setSelectedCategory', 'editCategory', 'deleteCategory']),
        selectCategory(index) {
            this.dialogEdit = true
            const category = this.categoriesList[index]
            this.name = category.name
            this.type = category.type
            this.setSelectedCategory(category)
        },
        addCategory(){
            this.$router.push({name: "categories-add"})
        },
        submit(event) {
            event.preventDefault();
            const slug = slugfy(this.name)
            const payload = { 
                newName: this.name,
                newSlug: slug,
                newType: this.type
            }
            // console.log(payload)
            this.editCategory(payload)
            this.setSelectedCategory(null)
            this.dialogEdit = false
        },
        deleteSelectedCategory() {
            const allowedToDelete = confirm(`Really wants to delete ${ this.selectedCategory.name }?`)
            if(allowedToDelete) {
                this.deleteCategory()
                this.dialogEdit = false
            }
        }
    },  
}
</script>