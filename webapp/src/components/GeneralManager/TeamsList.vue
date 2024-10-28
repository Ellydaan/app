<script setup lang="ts">
import { ref } from 'vue';
import {useRouter} from 'vue-router'
import AddMemberModal from '@/components/GeneralManager/AddMemberModal.vue';
import { Eye } from 'lucide-vue-next';

const router = useRouter()

// Mock data for development
const teams = ref([
  {
    id: 1,
    manager_id: 21,
    name: "Engineering Team",
    members: [
      { id: 1, username: "sarah.dev", email: "sarah@example.com" },
      { id: 2, username: "mike.code", email: "mike@example.com" },
      { id: 3, username: "anna.tech", email: "anna@example.com" }
    ]
  },
  {
    id: 2,
    manager_id: 22,
    name: "Design Team",
    members: [
      { id: 4, username: "alex.design", email: "alex@example.com" },
      { id: 5, username: "lisa.ui", email: "lisa@example.com" }
    ]
  },
  {
    id: 3,
    manager_id: 23,
    name: "Marketing Team",
    members: []
  },
  {
    id: 4,
    manager_id: 24,
    name: "Product Team",
    members: [
      { id: 6, username: "john.product", email: "john@example.com" },
      { id: 7, username: "emma.pm", email: "emma@example.com" },
      { id: 8, username: "david.analyst", email: "david@example.com" }
    ]
  }
]);

// Modal state management
const isAddMemberModalOpen = ref(false);
const selectedTeam = ref(null);

const openAddMemberModal = (team: any) => {
  selectedTeam.value = team;
  isAddMemberModalOpen.value = true;
};

const handleAddMember = (memberData: any) => {
  const team = teams.value.find(t => t.id === memberData.teamId);
  if (team) {
    team.members.push({
      id: Math.floor(Math.random() * 1000),
      username: memberData.username,
      email: memberData.email
    });
  }
};

const handleRemoveMember = (teamId: number, memberId: number) => {
  const team = teams.value.find(t => t.id === teamId);
  if (team) {
    team.members = team.members.filter(member => member.id !== memberId);
  }
};

const navigateToMemberDashboard = (memberId: number) => {
  router.push(`/dashboard/${memberId}`);
};
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Teams Overview</h1>
        <button class="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition-all duration-300 
                     transform hover:scale-105 active:scale-95">
          Add Team
        </button>
      </div>

      <!-- Teams Grid with Stagger Animation -->
      <TransitionGroup 
        name="team-list"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div v-for="(team, index) in teams" 
             :key="team.id"
             :style="{ animationDelay: `${index * 100}ms` }"
             class="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 
                    transform hover:-translate-y-1 team-list-item">
          <!-- Team Header -->
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">{{ team.name }}</h2>
            <div class="flex gap-2">
              <button class="text-blue-400 hover:text-blue-300 px-3 py-1 rounded-md transition-all duration-300
                           hover:scale-110">
                Edit
              </button>
              <button class="text-red-400 hover:text-red-300 px-3 py-1 rounded-md transition-all duration-300
                           hover:scale-110">
                Delete
              </button>
            </div>
          </div>

          <!-- Team Stats with Counter Animation -->
          <div class="flex gap-4 mb-4 text-gray-400">
            <div>
              <span class="font-medium">{{ team.members.length }}</span> members
            </div>
            <div>
              <span class="font-medium">ID:</span> {{ team.id }}
            </div>
          </div>

          <!-- Team Members List -->
          <TransitionGroup 
            name="member-list"
            tag="div"
            class="space-y-3"
          >
            <div v-if="team.members.length === 0" 
                 :key="'empty-' + team.id" 
                 class="text-gray-500 italic">
              No members yet
            </div>
            <div v-for="member in team.members" 
                 :key="member.id"
                 class="flex justify-between items-center bg-gray-700 p-3 rounded-md
                        transform transition-all duration-300 hover:-translate-x-1 member-list-item">
              <div class="flex-grow">
                <div class="font-medium">{{ member.username }}</div>
                <div class="text-sm text-gray-400">{{ member.email }}</div>
              </div>
              <div class="flex items-center gap-3">
                <!-- View Member Button -->
                <button @click="navigateToMemberDashboard(member.id)"
                        class="text-gray-400 hover:text-blue-400 transition-all duration-300
                               transform hover:scale-110">
                  <Eye :size='18' />
                </button>
                <!-- Remove Member Button -->
                <button @click="handleRemoveMember(team.id, member.id)"
                        class="text-gray-400 hover:text-red-400 transition-all duration-300
                               transform hover:rotate-90">
                  <span class="sr-only">Remove member</span>
                  ×
                </button>
              </div>
            </div>
          </TransitionGroup>

          <!-- Add Member Button -->
          <button @click="openAddMemberModal(team)"
                  class="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 rounded-md
                         transition-all duration-300 transform hover:scale-105 active:scale-95">
            Add Member
          </button>
        </div>
      </TransitionGroup>
    </div>

    <!-- Add Member Modal with Animation -->
    <Transition name="modal">
      <AddMemberModal
        v-if="isAddMemberModalOpen"
        :is-open="isAddMemberModalOpen"
        :team-id="selectedTeam?.id"
        :team-name="selectedTeam?.name"
        @close="isAddMemberModalOpen = false"
        @add-member="handleAddMember"
      />
    </Transition>
  </div>
</template>

<style scoped>
/* Team list animations */
.team-list-item {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Member list animations */
.member-list-enter-active,
.member-list-leave-active {
  transition: all 0.5s ease;
}

.member-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.member-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>