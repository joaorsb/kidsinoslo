<template>
    <v-form
        ref="form"
        lazy-validation
        enctype="multipart/form-data"
    >
        <v-text-field
        v-model="post.title"
        label="Title"
        required
        ></v-text-field>

        <v-text-field
        v-model="post.flex"
        label="Image Columns"
        required
        ></v-text-field>

        <v-text-field
        v-model="post.address"
        label="Address"
        required
        ></v-text-field>

        <v-text-field
        v-model="post.neighborhood"
        label="Neighborhood"
        required
        ></v-text-field>
        
        <v-select
            :items="categoriesList"
            item-text="name"
            item-value="uid"
            v-model="category"
            label="Choose Category"
            outlined
            ></v-select>
        
        <v-select
            :items="languages"
            item-text="name"
            item-value="value"
            v-model="post.language"
            label="Choose Language"
            outlined
        ></v-select>
        
        <v-row>
            <v-col cols="12" class="editor-text">
                <ckeditor id="description"
                    class=""
                    name="description"
                    type="classic"
                    tag="textarea"
                    v-model="post.description">
                </ckeditor>
            </v-col>
        </v-row>
        <v-file-input outlined show-size accept="image/*" label="Photo" v-model="photo"></v-file-input>


        <v-btn class="mr-4 float-right" :disabled=" ! showSubmit"  color="primary" @click="submit">submit</v-btn>

    </v-form>
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { slugfy } from '@/helpers/slugfy'

export default {
    name: "PostAdd",
    data() {
        return {
            category: '',
            photo: null
        }
    },
    methods: {
        ...mapActions('Posts', ['createPost', 'addNewPostToPaginatedList']),
        submit(event){
            event.preventDefault()
            this.post.owner = this.loggedUser.id
            this.post.author = this.loggedUser.name
            this.post.slug = slugfy(this.post.title)
            this.post.category = this.category
            if(this.photo){
                this.photo.name.replace('.JPG', '.jpg')
                this.post.imageName = this.photo.name
                this.post.image = this.photo
            }
            // console.log(this.photo)
            this.createPost(this.post)
            this.$router.push('/')
        }
    },
    computed: {
        ...mapState('Posts', ['post', 'languages', 'currentUid', 'columnsFlex']),
        ...mapState('Categories', ['categoriesList']),
        ...mapGetters('Accounts', ['loggedUser']),
        showSubmit(){
            return this.post.title !== undefined && this.category !== "" && this.post.description !== ''
        }
    }
    
}
</script>
<style scoped>
    .editor-text {
        color: black !important;
    }
</style>