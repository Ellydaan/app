<template>
  <div class="flex h-screen bg-gray-900 text-white">
    <SideBar />

 
    <div class="flex-1 flex flex-col overflow-hidden">
      <TopBar firstname="bob" lastname="Lopez" role="User" />

     
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import SideBar from './SideBar.vue'
import TopBar from './TopBar.vue'
</script>
