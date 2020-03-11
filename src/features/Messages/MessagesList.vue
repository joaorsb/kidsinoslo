<template>
    <div>
        <div>
            <h2 class="d-inline">New Messages: {{ unreadMessages.length}}</h2> 
        </div>
        <v-divider></v-divider>

        <v-list v-if="unreadMessages.length > 0">
            <v-list-item
                v-for="(message, index) in unreadMessages"
                :key="index"
            >
                <template>
                    <v-list-item-title>
                        <v-btn  text
                        @click="selectMessage(index)" 
                    >
                        {{ message.title }} - {{ message.createdAt | luxon:format('dd-MM-yyyy', { serverFormat: 'sql' }) }}
                    </v-btn> 
                    </v-list-item-title>
                    <v-btn text  
                        color="error" 
                        @click="deleteUnreadMessage(index)" 
                        align="end" >
                        <span class="d-none d-sm-flex">Delete Message</span>
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
            </template>
            </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <div>
            <h2 class="d-inline">Old Messages: {{ readMessages.length}}</h2> 
        </div>
        <v-divider></v-divider>

        <v-list  v-if="readMessages.length > 0">
            <v-list-item
                v-for="(message, index) in readMessages"
                :key="index"
            >
                <template>
                    <v-list-item-title>
                        <v-btn  text
                        @click="selectMessage(index)" 
                    >
                        {{ message.title }}
                    </v-btn> 
                    </v-list-item-title>
                    <v-btn text  
                        color="error" 
                        @click="deleteReadMessage(index)" 
                        align="end" >
                        <span class="d-none d-sm-flex">Delete Message</span>
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
            </template>
            </v-list-item>
        </v-list>
        <div v-if="this.selectedMessage">
            <v-row justify="center">
                <v-dialog v-model="dialogEdit" max-width="400">
                    <v-card class="mx-auto">
                        <v-card-title>
                            <div class="my-3">
                                <h3 class="d-inline">{{ selectedMessage.title }}</h3> 
                            </div>
                        </v-card-title>
                        <v-card-subtitle>
                            {{ selectedMessage.name}} - {{selectedMessage.email}}
                        </v-card-subtitle>
                        <v-card-text>
                           {{ selectedMessage.body }}
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="error" @click="dialogEdit = false">Close</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
    name: "MessagesList",
    data() {
        return {
            dialogEdit: false
        }
    },
    beforeMount() {
        if(this.messagesList.length < 1) {
            this.getMessages()
        }
    },
    computed: {
        ...mapState('Messages', ['messagesList','selectedMessage', 'hasErrorMessage', 'errorMessage']),
        ...mapGetters('Messages', ['unreadMessages', 'readMessages'])
    },
    methods: {
        ...mapActions('Messages', ['getMessages','setSelectedMessage', 'updateMessage', 'deleteMessage']),
        selectMessage(index) {
            this.dialogEdit = true
            const message = this.unreadMessages[index]

            this.setSelectedMessage(message)
            if (message.read === false) {
                this.updateMessage(message)
            }
        },
        deleteUnreadMessage(index) {
            const message = this.unreadMessages[index]
            this.setSelectedMessage(message)
            const allowedToDelete = confirm(`Really wants to delete ${ message.title }?`)
            if(allowedToDelete) {
                this.deleteMessage(message)
            }
        },
        deleteReadMessage(index) {
            const message = this.readMessages[index]
            this.setSelectedMessage(message)
            const allowedToDelete = confirm(`Really wants to delete ${ message.title }?`)
            if(allowedToDelete) {
                this.deleteMessage(message)
            }
        }
    },  
}
</script>