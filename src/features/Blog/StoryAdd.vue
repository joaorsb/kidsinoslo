<template>
    <v-form
        ref="form"
        lazy-validation
        enctype="multipart/form-data"
    >
        <v-text-field
        v-model="story.title"
        label="Title"
        required
        ></v-text-field>

        <v-text-field
        v-model="story.subtitle"
        label="Subtitle"
        required
        ></v-text-field>

        
        <v-row>
            <v-col cols="12" class="editor-text">
                <ckeditor id="body"
                    class=""
                    name="body"
                    type="classic"
                    tag="textarea"
                    v-model="story.body">
                </ckeditor>
            </v-col>
        </v-row>
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
        </image-uploader>

        <v-btn class="mr-4 float-right" :disabled=" ! showSubmit"  color="primary" @click="submit">submit</v-btn>

    </v-form>
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { slugfy } from '@/helpers/slugfy'

export default {
    name: "StoryAdd",
    data() {
        return {
            category: '',
            photo: null,
            hasImage: false
        }
    },
    methods: {
        ...mapActions('Blog', ['createStory']),
        setImage(file) {
            if(file){
                this.hasImage = true
                this.photo = file
            }
        },
        submit(event){
            event.preventDefault()
            this.story.author = this.loggedUser.name
            this.story.slug = slugfy(this.story.title)
            if(this.photo){
                this.photo.info.name.replace('.JPG', '.jpg')
                this.story.imageName = this.photo.info.name.replace(' ', '_')
                this.story.image = this.photo
            }
            this.createStory(this.story)
            this.$router.push('/blog')
            this.hasImage = false
        }
    },
    computed: {
        ...mapState('Blog', ['story']),
        ...mapGetters('Accounts', ['loggedUser']),
        showSubmit(){
            return this.story.title !== undefined && this.story.body !== ''
        }
    }
    
}
</script>
<style scoped>
    .editor-text {
        color: black !important;
    }
</style>