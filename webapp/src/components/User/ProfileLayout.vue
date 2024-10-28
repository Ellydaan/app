<template>
  <div class="w-full h-full grid grid-cols-2 gap-6 mb-6">
    <div class="w-full h-full">
      <UserProfile />
      <DeleteAccount />
    </div>
    <div class="w-full h-full">
      <ShiftsOverview />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserProfile from '@/components/User/UserProfile.vue'
import DeleteAccount from '@/components/User/DeleteAccount.vue'
import ShiftsOverview from '@/components/User/ShiftsOverview.vue'
</script>
