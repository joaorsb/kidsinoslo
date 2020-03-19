<template>
    <div>
        <div>
            <h2 class="d-inline">Neighborhoods</h2> 
        </div>
        <v-divider></v-divider>

        <v-list>
            <v-list-item
                v-for="(neighborhood, index) in neighborhoodList"
                :key="index"
            >
                <template>
                    <v-list-item-title>
                        <v-btn  text
                    >
                        {{ neighborhood }}
                    </v-btn> 
                    </v-list-item-title>
                     
                    <v-btn text  
                        color="error" 
                        @click="selectAndDeleteNeighborhood(index)" 
                        align="end" >
                        <span class="d-none d-sm-flex">Delete Neighborhood</span>
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </template>
            </v-list-item>
        </v-list>
        
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
    name: "NiehgborhoodList",
    data() {
        return {
        }
    },
    computed: {
        ...mapState('Posts', ['neighborhoodList', ])
    },
    methods: {
        ...mapActions('Posts', ['deleteNeighborhood']),
        selectAndDeleteNeighborhood(index) {
            const neigh = this.neighborhoodList[index]
            const allowedToDelete = confirm(`Really wants to delete ${ neigh }?`)
            if(allowedToDelete) {
                this.deleteNeighborhood(neigh)
            }
        }
    },  
}
</script>