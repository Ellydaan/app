<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container class="pa-4">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row>
         
          <v-col cols="12" md="6">
            <v-text-field
              v-model="firstname"
              :rules="firstnameRules"
              label="First Name"
              required
            ></v-text-field>
          </v-col>
  
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="lastname"
              :rules="lastnameRules"
              label="Last Name"
              required
            ></v-text-field>
          </v-col>
        </v-row>
  
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
          Register
        </v-btn>
        <v-btn   >
          Login
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

        // ce sont les regles de filtrage de l'input pour sécurise la partie front la bibliothèque vutify permet de faire ça 
       
        firstnameRules: [
        v => !!v || 'First name is required',
  v => v.length >= 2 || 'First name must be at least 2 characters',
  v => /^[A-Za-zÀ-ÿ]+$/.test(v) || 'First name must only contain letters',
        ],
        lastnameRules: [
          v => !!v || 'Last name is required',
          v => v.length >= 2 || 'Last name must be at least 2 characters',
        ],
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
        try{
          const response = await axios.post('http://localhost:4000/api/register', {
            user: {
              username: this.firstname,
              email: this.email,
              password: this.password,
              role: 'admin',
            },
            alert: 'User registered successfully'
          });
          console.log(response.data);
        } catch (error) {
          console.error(error); 
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
  