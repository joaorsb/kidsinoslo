<template>
    <div >
        <v-btn
            fixed
            dark
            fab
            bottom
            right
            color="blue-grey darken-4"
            @click="back()"
        >
            <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <h2 class="text-center">Send us a new message!</h2>
        <v-form
            ref="form"
            lazy-validation
			enctype="multipart/form-data"
        >
            <v-container>
                <v-row class="d-flex justify-center">
                    <v-col md="6">
                        <v-text-field
                            v-model="message.title"
                            label="Title*"
                            required
                            outlined
                        >
                        </v-text-field>
                        <v-textarea
                            outlined
                            v-model="message.body"
                            label="Your message*"
                            required
                        >
                        </v-textarea>
                        <v-text-field
                            v-model="message.name"
                            label="Your name"
                            outlined
                        >
                        </v-text-field>
                        <v-text-field
                            v-model="message.email"
                            label="Your e-mail*"
                            required
                            type="email"
                            outlined
                        >
                        </v-text-field>
						<image-uploader
							:quality="0.9"
							:autoRotate="true"
							outputFormat="verbose" :preview=true :className="['fileinput', {'fileinput--loaded' : hasImage }]" :capture="false" accept="image/*" doNotResize="['gif', 'svg']" @input="setImage">
						</image-uploader>
                        <v-btn 
                            class="mr-4 float-right" 
                            :disabled=" ! showSubmit" 
                            color="primary" @click="submit"
                        >
                            Submit
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'

export default {
    name: "MessageAdd",
    data() {
        return {
			photo: null,
			hasImage: false
        }
    },
    methods: {
        ...mapActions('Messages', ['createMessage']),
		setImage(file) {
			if(file) {
				this.hasImage = true
				this.photo = file
			}
		},
        submit(event) {
            event.preventDefault();
			if(this.hasImage) {
				this.photo.info.name.replace('.JPG', '.jpg')
				this.message.hasImage = this.hasImage
				this.message.imageName = this.photo.info.name.replace(' ', '_')
				this.message.image = this.photo
			}
            this.createMessage(this.message)
            this.$router.push('/admin/messages')
        },
        back() {
            this.$router.back()
        }
    },
    computed: {
        ...mapState('Messages', ['message']),
        showSubmit(){
          return this.message.title !== "" && this.message.email !== ""
      }
    }
}
</script>
<style>
</style>
