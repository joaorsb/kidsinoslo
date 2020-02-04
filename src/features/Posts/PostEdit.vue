<template>
    <div>
        <div>
            <v-text-field
                    label="Start typing to search"
                    v-model="postTitle"
                    filled
            ></v-text-field>
            <h2 class="d-inline" v-show="postsList.length > 0">Posts - click to edit</h2> 
            <v-btn small color="primary" class="float-right" @click="addPost()">
                Add new Post
            </v-btn>
        </div>
        <v-divider></v-divider>

        <v-list>
            <v-list-item
                v-for="(post, index) in postsList"
                :key="index"
            >
                <template>
                    <v-list-item-title @click="selectPost(index)">
                        {{ post.title }}
                    </v-list-item-title>
                    <v-list-item-icon>
                        <v-btn text icon 
                            color="error" 
                            @click="deletePost()" 
                            align="end" >
                            <v-icon>mdi-delete</v-icon>

                        </v-btn>
                    </v-list-item-icon>
                </template>
            </v-list-item>
        </v-list>
        <div v-if="selectedPost">
            <v-row justify="center">
                <v-dialog v-model="dialog" fullscreen hide-overlay>
                    <v-card>
                        <v-card-title>
                            <div class="my-3">
                                <v-btn icon @click="dialog = false">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                                <h3 class="d-inline">Selected: {{selectedPost.title }}</h3> 
                                <v-btn text icon 
                                    color="error" 
                                    @click="deletePost()" 
                                    align="end" >
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>

                            </div>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="selectedPost.title"
                                            label="Title"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field
                                            v-model="selectedPost.flex"
                                            label="Image Columns"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field
                                            v-model="selectedPost.address"
                                            label="Address"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                         <v-text-field
                                            v-model="selectedPost.neighborhood"
                                            label="Neighborhood"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-select
                                            :items="categoriesList"
                                            item-text="name"
                                            item-value="uid"
                                            v-model="selectedPost.category"
                                            label="Choose Category"
                                            outlined
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-select
                                            :items="languages"
                                            item-text="name"
                                            item-value="value"
                                            v-model="selectedPost.language"
                                            label="Choose Language"
                                            outlined
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row>
                                            <v-col cols="3">
                                                <label for="body"
                                                class="">
                                                    Description:
                                                </label>
                                            </v-col>
                                            <v-col cols="12">
                                                <ckeditor id="description"
                                                    class=""
                                                    name="description"
                                                    type="classic"
                                                    tag="textarea"
                                                    v-model="selectedPost.description">
                                                </ckeditor>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="danger" @click="dialog = false">Cancel</v-btn>
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
    name: "PostEdit",
    data() {
        return {
            oldSlug: "",
            postTitle: "",
            dialog: false
        }
    },
    computed: {
        ...mapState('Posts', ['postsList', 'selectedPost', 'languages']),
        ...mapState('Categories', ['categoriesList']),
    },
    methods: {
        ...mapActions('Posts', [
            'setSelectedPost', 
            'editPost', 
            'deletePost', 
            'searchPosts',
            'clearPostsList',
        ]),
        selectPost(index) {
            const post = this.postsList[index]
            this.oldSlug = post.slug
            this.setSelectedPost(post)
            this.dialog = ! this.dialog
        },
        addPost(){
            this.$router.push({name: "posts-add"})
        },
        submit(event){
            event.preventDefault()
            this.selectedPost.slug = slugfy(this.selectedPost.title)
            this.selectedPost.oldSlug = this.oldSlug
            this.editPost(this.selectedPost)
            this.setSelectedPost(null)
            this.dialog = !this.dialog
        }
    },
    watch: {
        postTitle(value){
            if(value.length > 3) {
                this.searchPosts(value)
            }
        }
    },
    beforeDestroy() {
        this.clearPostsList()
    }
}
</script>