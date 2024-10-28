<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container class="pa-4">
      <v-form ref="form" v-model="valid" lazy-validation>
        
  
        <v-row>
         
          <v-col cols="12">
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="Email"
              required
            ></v-text-field>
          </v-col>
        </v-row>
  
        <v-row>
        
          <v-col cols="12">
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              label="Password"
              type="password"
              required
            ></v-text-field>
          </v-col>
        </v-row>
  
         <div class="box">
        <v-btn  :disabled="!valid" @click="submit">
         login
        </v-btn>
        <v-btn   >
          Register
        </v-btn>
        </div>
      
      </v-form>
    </v-container>
  </template>
  
  <script>
    import axios from 'axios'
    
  export default {
  

   
    data() {
      return {
        valid: false,
        firstname: '',
        lastname: '',
        email: '',
        password: '',
       
        emailRules: [
        v => !!v || 'Email is required',
        v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email must be valid',
        ],
        passwordRules: [
        v => !!v || 'Password is required',
  v => v.length >= 6 || 'Password must be at least 6 characters',
  v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
  v => /[0-9]/.test(v) || 'Password must contain at least one number',
  v => /[!@#$%^&*]/.test(v) || 'Password must contain at least one special character',
        ],
      };
    },
    methods: {

        async submit() {
    try {
        const response = await axios.post('http://localhost:4000/api/login', {
            email: this.email,
            password: this.password,
        });

        const token = response.data.jwt;
        console.log("Token:", token);

        this.$store.commit('setToken', token);

      

        alert('User Login successfully');
    } catch (error) {
        console.error(error);
        alert('Login failed. Please check your credentials and try again.');
    }
}
    },
  };
  </script>
  
  <style scoped>
  .v-container {
    max-width: 600px;
    margin: auto;
  }
  
  .v-btn {
    margin-top: 20px;
    background-color: #9de338;
    color: black;
    
   
  }

  .box{
    display: flex;
    flex-direction: row;
    gap: 20px;
  }
  </style>
  