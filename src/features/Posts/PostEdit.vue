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
                @click="selectPost(index)"
            >
                <v-list-item-title>{{ post.title }}</v-list-item-title>
            </v-list-item>
        </v-list>
        <div v-if="selectedPost">
            <v-divider></v-divider>
            <div class="my-3">
                <h3 class="d-inline">Selected: {{selectedPost.title }}</h3> 
                <v-form
                    ref="form" class="d-inline"
                    lazy-validation
                    >
                    <v-btn text icon 
                        color="error" 
                        @click="deletePost()" 
                        class="float-right" >
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </v-form>
            </div>
            <v-form
                ref="form"
                lazy-validation
                enctype="multipart/form-data"
            >
                <v-text-field
                v-model="selectedPost.title"
                label="Title"
                required
                ></v-text-field>

                <v-text-field
                v-model="selectedPost.flex"
                label="Image Columns"
                required
                ></v-text-field>

                <v-text-field
                v-model="selectedPost.address"
                label="Address"
                required
                ></v-text-field>

                <v-text-field
                v-model="selectedPost.neighborhood"
                label="Neighborhood"
                required
                ></v-text-field>
                
                <v-select
                    :items="categoriesList"
                    item-text="name"
                    item-value="uid"
                    v-model="selectedPost.category"
                    label="Choose Category"
                    outlined
                    ></v-select>
                
                <v-select
                    :items="languages"
                    item-text="name"
                    item-value="value"
                    v-model="selectedPost.language"
                    label="Choose Language"
                    outlined
                ></v-select>
                
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
                <v-btn class="mr-4 float-right" color="primary" @click="submit">Update</v-btn>
            </v-form>
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
        }
    },
    computed: {
        ...mapState('Posts', ['postsList', 'selectedPost', 'languages']),
        ...mapState('Categories', ['categoriesList']),
    },
    methods: {
        ...mapActions('Posts', ['setSelectedPost', 'editPost', 'deletePost', 'searchPosts']),
        selectPost(index) {
            const post = this.postsList[index]
            this.oldSlug = post.slug
            this.setSelectedPost(post)
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
        }
    },
    watch: {
        postTitle(value){
            if(value.length > 3) {
                this.searchPosts(value)
            }
        }
    }  
}
</script>