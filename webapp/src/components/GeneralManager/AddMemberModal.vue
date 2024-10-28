<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  teamId: {
    type: Number,
    required: true,
  },
  teamName: {
    type: String,
    required: true,
  }
});

const emit = defineEmits(['close', 'addMember']);

// Form data
const formData = ref({
  username: '',
  email: '',
  role: 'member' // Default role
});

// Form validation
const errors = ref({
  username: '',
  email: '',
});

// Available roles for dropdown
const roles = [
  { id: 'user', name: 'Team Member' },
  { id: 'manager', name: 'Team Manager' },
  { id: 'admin', name: 'General Manager' },
  { id: 'super_admin', name: 'Admin' }
];

const validateForm = () => {
  let isValid = true;
  errors.value = {
    username: '',
    email: '',
  };

  if (!formData.value.username.trim()) {
    errors.value.username = 'Username is required';
    isValid = false;
  }

  if (!formData.value.email.trim()) {
    errors.value.email = 'Email is required';
    isValid = false;
  } else if (!formData.value.email.includes('@')) {
    errors.value.email = 'Please enter a valid email';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = () => {
  if (validateForm()) {
    emit('addMember', {
      teamId: props.teamId,
      ...formData.value
    });
    formData.value = { username: '', email: '', role: 'member' }; // Reset form
    emit('close');
  }
};

const closeModal = () => {
  formData.value = { username: '', email: '', role: 'member' }; // Reset form
  errors.value = { username: '', email: '' }; // Reset errors
  emit('close');
};
</script>

<template>
  <!-- Modal Backdrop -->
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <!-- Modal Content -->
    <div class="bg-gray-800 rounded-lg w-full max-w-md mx-4 shadow-xl" 
         @click.stop>
      <!-- Modal Header -->
      <div class="p-6 border-b border-gray-700">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-white">Add Team Member</h2>
          <button @click="closeModal" 
                  class="text-gray-400 hover:text-gray-300 transition-colors">
            <span class="sr-only">Close</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="mt-2 text-gray-400">Adding member to {{ teamName }}</p>
      </div>

      <!-- Modal Body -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Username Field -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-300 mb-1">
            Username
          </label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter username"
          />
          <p v-if="errors.username" class="mt-1 text-sm text-red-400">
            {{ errors.username }}
          </p>
        </div>

        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter email address"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-400">
            {{ errors.email }}
          </p>
        </div>

        <!-- Role Selection -->
        <div>
          <label for="role" class="block text-sm font-medium text-gray-300 mb-1">
            Role
          </label>
          <select
            id="role"
            v-model="formData.role"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 pt-4">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            Add Member
          </button>
        </div>
      </form>
    </div>
  </div>
</template>