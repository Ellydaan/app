<template>
  <div class="bg-gray-800 p-6 rounded-lg shadow-lg mx-auto mb-6">
    <div class="space-y-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <!-- Warning icon -->
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-medium text-white">Delete Account</h3>
          <p class="mt-2 text-sm text-gray-300">
            Once you delete your account, all of your data will be permanently removed. This action
            cannot be undone.
          </p>
        </div>
      </div>

      <button
        @click="showModal = true"
        class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        Delete Account
      </button>
    </div>

    <!-- Modal Backdrop -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showModal = false"
    >
      <!-- Modal Content -->
      <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" @click.stop>
        <div class="space-y-4">
          <div class="flex justify-between items-start">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 class="ml-3 text-lg font-medium text-white">Confirm Deletion</h3>
            </div>
            <button
              @click="showModal = false"
              class="text-gray-400 hover:text-gray-300 transition duration-150 ease-in-out"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="mt-3">
            <p class="text-sm text-gray-300">
              Please type your password to confirm you want to permanently delete your account. This
              action cannot be undone.
            </p>
            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              class="mt-4 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
            <p v-if="error" class="mt-2 text-sm text-red-400">{{ error }}</p>
          </div>

          <div class="mt-5 flex justify-end space-x-3">
            <button
              @click="showModal = false"
              class="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              @click="handleDelete"
              :disabled="!password"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const showModal = ref(false)
const password = ref('')
const error = ref('')

const handleDelete = async () => {
  try {
    // TODO: make an API call to verify password and delete account
    if (password.value.length < 6) {
      error.value = 'Invalid password'
      return
    }

    console.log('Deleting account...')
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

    // Handle successful deletion
    console.log('Account deleted successfully')
    showModal.value = false
    password.value = ''
    error.value = ''
    router.push('/login')

    // Here you would typically redirect to logout or home page
  } catch (err) {
    error.value = 'An error occurred while deleting your account'
  }
}
</script>
