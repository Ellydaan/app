<template>
  <div class="flex justify-center items-center h-screen bg-gray-900">
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4">Register</h2>
      <form @submit.prevent="register">
        <div class="mb-4">
          <label for="name" class="block text-gray-700 font-bold mb-2">Name</label>
          <input
            type="text"
            id="name"
            v-model="name"
            class="border border-gray-300 rounded-lg px-4 py-2 w-full"
            required
          />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="border border-gray-300 rounded-lg px-4 py-2 w-full"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-700 font-bold mb-2">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="border border-gray-300 rounded-lg px-4 py-2 w-full"
            required
          />
        </div>
        <div class="mb-4">
          <label for="confirmPassword" class="block text-gray-700 font-bold mb-2"
            >Confirm Password</label
          >
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            class="border border-gray-300 rounded-lg px-4 py-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Register
        </button>
        <p class="text-gray-500 mt-2">
          Already have an account ?
          <RouterLink to="/login" class="text-blue-500 underline"> Login</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const register = () => {
  console.log(name.value, email.value, password.value, confirmPassword.value)
}
</script>
