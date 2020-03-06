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
                    <v-list-item-title>
                        <v-btn  text
                        @click="selectPost(index)" 
                    >
                        {{ post.title }}
                    </v-btn> 
                    </v-list-item-title>
                       
                    <v-btn  text
                        color="teal" 
                        @click="openImageDialog(index)" 
                    >
                        <span class="d-none d-sm-flex">Change image</span>
                        <v-icon>mdi-camera</v-icon>
                    </v-btn> 
                    <v-btn text  
                        color="error" 
                        @click="selectAndDeletePost(index)" 
                        align="end" >
                        <span class="d-none d-sm-flex">Delete post</span>
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </template>
            </v-list-item>
        </v-list>
        <div v-if="selectedPost">
            <v-row justify="center">
                <v-dialog v-model="dialogEdit" fullscreen hide-overlay>
                    <v-card>
                        <v-card-title>
                            <div class="my-3">
                                <v-btn icon @click="dialogEdit = false">
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
                                            <v-col cols="12" class="editor-text">
                                                <ckeditor id="description"
                                                    style="color: black"
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
                            <v-btn text color="error" @click="dialogEdit = false">Cancel</v-btn>
                            <v-btn text color="primary" @click="submit">Update</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogImage" max-width="800">
                    <v-card>
                        <!-- <v-img
                        :src="imageUrl"
                        height="400"
                        >
                        </v-img> -->
                        <v-card-title v-text="this.selectedPost.title"></v-card-title>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-form
                                        ref="form"
                                        lazy-validation
                                        enctype="multipart/form-data"
                                    >
                                        <!-- <v-file-input outlined show-size accept="image/*" 
                                            label="Photo" v-model="photo">
                                        </v-file-input> -->
                                         <image-uploader
                                            :quality="0.9"
                                            :autoRotate=true
                                            outputFormat="verbose"
                                            :preview=true
                                            :className="['fileinput', { 'fileinput--loaded' : hasImage }]"
                                            :capture="false"
                                            accept="image/*"
                                            doNotResize="['gif', 'svg']"
                                            @input="setImage"
                                        >
                                            <label for="fileInput" slot="upload-label">
                                                <figure>
                                                    <v-img
                                                        :src="imageUrl"
                                                        height="300"
                                                    >
                                                    </v-img>
                                                </figure>
                                                <span class="upload-caption">{{ hasImage ? 'Replace' : 'Upload' }}</span>
                                            </label>
                                        </image-uploader>
                                    </v-form>
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="error" @click="dialogImage = false">Cancel</v-btn>
                            <v-btn text color="primary" @click="updateImage">Update</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
            
        </div>
        <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
            >
            {{ snackText }}
            <v-btn
                color="blue"
                text
                @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { slugfy } from '@/helpers/slugfy'
export default {
    name: "PostEdit",
    data() {
        return {
            oldSlug: "",
            postTitle: "",
            dialogEdit: false,
            dialogImage: false,
            imageUrl: "",
            photo: null,
            snackbar: false,
            snackText: "",
            timeout: 3000,
            hasImage: false
        }
    },
    computed: {
        ...mapState('Posts', ['selectedPost', 'languages', 'postsList']),
        ...mapState('Categories', ['categoriesList']),
    },
    methods: {
        ...mapActions('Posts', [
            'setSelectedPost', 
            'editPost', 
            'deletePost', 
            'searchPosts',
            'updatePostImage',
            'deletePostImage',
            'clearPostsList'
        ]),
        selectPost(index) {
            const post = this.postsList[index]
            this.oldSlug = post.slug
            this.setSelectedPost(post)
            this.dialogEdit = ! this.dialogEdit
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
            this.dialogEdit = !this.dialogEdit
            this.snackbar = true
            this.snackText = "Post edited"
        },
        openImageDialog(index){
            const post = this.postsList[index]
            this.setSelectedPost(post)
            let baseImageUri = `https://firebasestorage.googleapis.com/v0/b/kids-in-oslo.appspot.com/o/posts%2F${post.uid}%2F`
            if(post.imageName) {
                this.hasImage = true
                let thumbImage = post.imageName.replace('.jpg', '%40s_400.jpg?alt=media')
                if(thumbImage == post.imageName) {
                    thumbImage = post.imageName.replace('.JPG', '%40s_400.JPG?alt=media')
                }
                this.imageUrl = `${baseImageUri}${thumbImage}`
            } else {
                this.snackbar = true
                this.snackText = "Photo is missing"
            }
            this.dialogImage = true
        },
        setImage(file) {
            if(file){
                this.hasImage = true
                this.photo = file
            }
        },
        updateImage(event) {
            event.preventDefault()
            if(this.photo) {
                this.updatePostImage(this.photo)
            }
            this.dialogImage = false
            this.snackbar = true
            this.snackText = "Photo Uploaded"
            this.photo = null
            this.hasImage = false
        },
        selectAndDeletePost(index) {
            const post = this.postsList[index]
            this.setSelectedPost(post)
            const allowedToDelete = confirm("Really wants to delete?")
            if(allowedToDelete) {
                this.deletePost()
            }
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
<style scoped>
    .editor-text {
        color: black !important;
    }
</style>