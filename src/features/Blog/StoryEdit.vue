<template>
    <div>
        <div>
            <v-text-field
                    label="Start typing to search"
                    v-model="storyTitle"
                    filled
            ></v-text-field>
            <h2 class="d-inline" v-show="storiesList.length > 0">Stories - click to edit</h2> 
            <v-btn small color="primary" class="float-right" @click="addStory()">
                Add new Story
            </v-btn>
        </div>
        <v-divider></v-divider>
        <v-list>
            <v-list-item
                v-for="(story, index) in storiesList"
                :key="index"
            >
                <template>
                    <v-list-item-title>
                        <v-btn  text
                        @click="selectStory(index)" 
                    >
                        {{ story.title }}
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
                        @click="selectAndDeleteStory(index)" 
                        align="end" >
                        <span class="d-none d-sm-flex">Delete story</span>
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </template>
            </v-list-item>
        </v-list>
        <div v-if="selectedStory">
            <v-row justify="center">
                <v-dialog v-model="dialogEdit" fullscreen hide-overlay>
                    <v-card>
                        <v-card-title>
                            <div class="my-3">
                                <v-btn icon @click="dialogEdit = false">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                                <h3 class="d-inline">Selected: {{selectedStory.title }}</h3> 
                                <v-btn text icon 
                                    color="error" 
                                    @click="selectAndDeleteStory()" 
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
                                            v-model="selectedStory.title"
                                            label="Title"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field
                                            v-model="selectedStory.subtitle"
                                            label="Subtitle"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row>
                                            <v-col cols="3">
                                                <label for="body"
                                                class="">
                                                    Body:
                                                </label>
                                            </v-col>
                                            <v-col cols="12" class="editor-text">
                                                <ckeditor id="description"
                                                    style="color: black"
                                                    name="description"
                                                    type="classic"
                                                    tag="textarea"
                                                    v-model="selectedStory.body">
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
                        <v-card-title v-text="this.selectedStory.title"></v-card-title>
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
    name: "StoryEdit",
    data() {
        return {
            oldSlug: "",
            storyTitle: "",
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
        ...mapState('Blog', ['selectedStory', 'storiesList']),
    },
    methods: {
        ...mapActions('Blog', [
            'setSelectedStory', 
            'editStory', 
            'deleteStory', 
            'searchStories',
            'updateStoryImage',
            'deleteStoryImage',
            'clearStoriesList'
        ]),
        selectStory(index) {
            const story = this.storiesList[index]
            this.oldSlug = story.slug
            this.setSelectedStory(story)
            this.dialogEdit = ! this.dialogEdit
        },
        addStory(){
            this.$router.push({name: "stories-add"})
        },
        submit(event){
            event.preventDefault()
            this.selectedStory.slug = slugfy(this.selectedStory.title)
            this.selectedStory.oldSlug = this.oldSlug
            this.editStory(this.selectedStory)
            this.setSelectedStory(null)
            this.dialogEdit = !this.dialogEdit
            this.snackbar = true
            this.snackText = "Story edited"
        },
        openImageDialog(index){
            const story = this.storiesList[index]
            this.setSelectedStory(story)
            let baseImageUri = `https://firebasestorage.googleapis.com/v0/b/kids-in-oslo.appspot.com/o/stories%2F${story.uid}%2F`
            if(story.imageName) {
                this.hasImage = true
                let thumbImage = story.imageName.replace('.jpg', '%40s_400.jpg?alt=media')
                if(thumbImage == story.imageName) {
                    thumbImage = story.imageName.replace('.JPG', '%40s_400.JPG?alt=media')
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
                const newName = this.photo.info.name.replace(' ', '_')
                this.photo.info.name = newName
                this.updateStoryImage(this.photo)
            }
            this.dialogImage = false
            this.snackbar = true
            this.snackText = "Photo Uploaded"
            this.photo = null
            this.hasImage = false
        },
        selectAndDeleteStory(index) {
            const story = this.storiesList[index]
            this.setSelectedStory(story)
            const allowedToDelete = confirm(`Really wants to delete ${story.title} ?`)
            if(allowedToDelete) {
                this.deleteStory()
            }
        }
    },
    watch: {
        storyTitle(value){
            if(value.length > 3) {
                this.searchStories(value)
            }
        }
    },
    beforeDestroy() {
        this.clearStoriesList()
    }
}
</script>
<style scoped>
    .editor-text {
        color: black !important;
    }
</style>