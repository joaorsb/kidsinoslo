<template>
  <v-form @submit.prevent="register">
    <v-container>

      <v-row class="d-flex justify-center">
        <v-col md="6">
          <v-text-field
            v-model="user.name"
            label="Nome"
            clearable
            persistent-hint
            outlined
          ></v-text-field>
          <v-text-field
            v-model="user.email"
            label="E-mail"
            clearable
            persistent-hint
            outlined
          ></v-text-field>
            <v-text-field
                v-model="user.password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="showPassword ? 'text' : 'password'"
                name="input-10-1"
                label="Password"
                outlined
                hint="Password should be at least 8 characters long"
                counter
                @click:append="showPassword = !showPassword"
            ></v-text-field>
            <v-text-field
                v-model="confirm_password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.match]"
                :type="showPassword ? 'text' : 'password'"
                name="input-10-1"
                label="Confirm"
                outlined
                hint="Passwords should match"
                counter
                @click:append="showPassword = !showPassword"
            ></v-text-field>
            <v-btn block color="primary" type="submit"  :disabled=" ! showSubmit">
              Send
            </v-btn>
        </v-col>

      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import {mapState, mapActions, mapGetters } from 'vuex'

export default {
    components: {
      
    },
    data() {
        return {
            confirm_password: "",
            showPassword: false,
            rules: {
                required: value => !!value || 'Required',
                min: v => v.length >= 8 || 'Min 8 chars',
                match: v => v == this.user.password || 'Must be the same'
            }
        }
    },
    watch: {
     user (value)  {
        if(value.id !== "" && value.id !== undefined){
          this.$router.push('/')
        }
     },
      isLoading(value) {
        return value
      }
    },
    methods: {
      ...mapActions('Accounts', ['register'])
    },
    computed: {
      ...mapState('Accounts', ['user']),
      ...mapGetters('Accounts', ['isLoading', 'loadingLabel']),
      showSubmit(){
          return this.user.password.length > 7 && this.user.password === this.confirm_password
      }
    }
    
}
</script>

<style scoped>

</style>