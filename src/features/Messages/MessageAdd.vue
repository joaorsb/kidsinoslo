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
        }
    },
    methods: {
        ...mapActions('Messages', ['createMessage']),
        submit(event) {
            event.preventDefault();
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