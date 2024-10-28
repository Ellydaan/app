<template>
  <aside class="flex flex-col h-screen w-64 bg-gray-800 p-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-sulu-400 flex flex-row">
        <Landmark class="w-6 h-6 mr-2 translate-y-[2px]" />
        Gotham City
      </h1>
    </div>
    <nav class="flex-grow">
      <ul class="space-y-2">
        <!-- Renders one item for each link in the navLinks array. -->
        <li v-for="link in navLinks" :key="link.to">
          <RouterLink
            :to="link.to"
            class="block py-2 px-4 rounded-full text-gray-300 transition-colors duration-200 hover:bg-gray-700"
            :class="{
              'bg-gray-700': $route.path.startsWith(link.to),
              'text-white font-semibold': $route.path === link.to
            }"
          >
            {{ link.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>
    <!-- The logout button. -->
    <div class="mt-auto">
      <button
        @click="logout"
        class="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Landmark } from 'lucide-vue-next';


const router = useRouter()

/*
 * Defines the navigation links for the sidebar.
 */
const navLinks = ref([
  { to: '/dashboard/1', label: 'User Dashboard' },
  { to: '/profile', label: 'User Profile' },
  { to: '/teams', label: 'Teams Overview' },
])

/**
 * Logs the user out and redirects to the login page.
 */
function logout() {
  console.log('Logging out...')
  router.push('/login')
}
</script>
