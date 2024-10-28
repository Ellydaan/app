<template>
  <div class="flex justify-center items-center h-screen bg-gray-900">
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="username" class="block text-gray-700 font-bold mb-2">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
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
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Login
        </button>
        <p class="text-gray-500 mt-2">
          Don't have an account?
          <RouterLink to="/register" class="text-blue-500 underline">Register</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')

const login = async () => {
  try {
    // Simulate an API call for authentication
    const response = await simulateAuth(username.value, password.value)

    if (response.success) {
      router.push(`/dashboard/${response.userId}`)
    } else {
      alert('Login failed. Please check your credentials.')
    }
  } catch (error) {
    console.error('Login error:', error)
    alert('An error occurred during login. Please try again.')
  }
}

const simulateAuth = (
  username: string,
  password: string
): Promise<{ success: boolean; userId: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === 'user' && password === 'password') {
        resolve({ success: true, userId: '1' })
      } else {
        resolve({ success: false, userId: '' })
      }
    }, 1000) // Simulate network delay
  })
}
</script>
