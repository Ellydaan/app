<template>
  <div class="bg-gray-800 p-6 rounded-lg shadow-lg mx-auto w-full mb-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-white">Your Profile</h2>
      <button
        @click="toggleEdit"
        class="px-4 py-2 text-sm rounded-md transition duration-300"
        :class="isEditing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-500 hover:bg-blue-600'"
      >
        {{ isEditing ? 'Cancel' : 'Edit' }}
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-300 mb-1">
          Username
        </label>
        <input
          id="username"
          v-model="formData.username"
          type="text"
          :disabled="!isEditing"
          class="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter username"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-300 mb-1"> Email </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          :disabled="!isEditing"
          class="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter email"
        />
      </div>

      <template v-if="isEditing">
        <div>
          <label for="currentPassword" class="block text-sm font-medium text-gray-300 mb-1">
            Current Password
          </label>
          <input
            id="currentPassword"
            v-model="formData.currentPassword"
            type="password"
            class="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:border-green-500"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label for="newPassword" class="block text-sm font-medium text-gray-300 mb-1">
            New Password
          </label>
          <input
            id="newPassword"
            v-model="formData.newPassword"
            type="password"
            class="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:border-green-500"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-1">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            class="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:border-green-500"
            placeholder="Confirm new password"
          />
        </div>
      </template>

      <button
        v-if="isEditing"
        type="submit"
        :disabled="!isDirty"
        class="w-full bg-green-500 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{ 'hover:bg-green-600': isDirty }"
      >
        Save Changes
      </button>
    </form>

    <div
      v-if="message.content"
      :class="['mt-4 p-3 rounded', message.type === 'error' ? 'bg-red-500' : 'bg-green-500']"
    >
      {{ message.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// Mock initial data - in a real app, this would come from props or API
const initialData = {
  username: 'johndoe',
  email: 'john@example.com',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
}

const isEditing = ref(false)
const message = ref({ type: '', content: '' })
const formData = reactive({ ...initialData })
const originalData = reactive({ ...initialData })

// Computed property to check if form has been modified
const isDirty = computed(() => {
  return (
    formData.username !== originalData.username ||
    formData.email !== originalData.email ||
    formData.currentPassword ||
    formData.newPassword ||
    formData.confirmPassword
  )
})

const toggleEdit = () => {
  if (isEditing.value) {
    // Reset form data when canceling edit
    Object.assign(formData, originalData)
    message.value = { type: '', content: '' }
  }
  isEditing.value = !isEditing.value
}

const handleSubmit = () => {
  if (formData.newPassword !== formData.confirmPassword) {
    message.value = { type: 'error', content: 'New passwords do not match.' }
    return
  }

  // Here you would typically make an API call
  console.log('Saving changes:', formData)

  // Update original data with new values
  Object.assign(originalData, {
    username: formData.username,
    email: formData.email
  })

  // Reset password fields
  formData.currentPassword = ''
  formData.newPassword = ''
  formData.confirmPassword = ''

  message.value = { type: 'success', content: 'Profile updated successfully!' }
  isEditing.value = false
  setTimeout(() => {
    message.value = { type: '', content: '' }
  }, 4000)
}
</script>
