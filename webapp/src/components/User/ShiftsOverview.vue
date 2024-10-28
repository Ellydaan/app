<template>
  <div class="bg-gray-800 rounded-lg shadow-lg max-w-2xl mx-auto flex flex-col h-[780px]">
    <!-- Header -->
    <div class="p-6 border-b border-gray-700">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-white">Recent Shifts</h2>
        <div class="text-sm text-gray-400">Total shifts: {{ workingTimes.length }}</div>
      </div>
    </div>

    <!-- Scrollable content -->
    <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
      <div v-if="!workingTimes.length" class="text-gray-400 text-center py-8">No shifts found</div>

      <div
        v-for="shift in workingTimes"
        :key="shift.id"
        class="bg-gray-700 rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-600 transition-colors duration-200"
      >
        <!-- Duration indicator dot -->
        <div
          class="w-3 h-3 rounded-full flex-shrink-0"
          :class="getDurationIndicatorColor(getShiftDuration(shift))"
          :title="getDurationLabel(getShiftDuration(shift))"
        ></div>

        <!-- Shift details -->
        <div class="flex-grow">
          <div class="flex justify-between items-start">
            <div class="space-y-1">
              <div class="text-white font-medium">
                {{ formatDateTime(shift.start) }}
                <span class="text-gray-400 mx-2">→</span>
                {{ formatDateTime(shift.end) }}
              </div>
              <div class="text-sm text-gray-400">
                Duration: {{ formatDuration(getShiftDuration(shift)) }}
              </div>
            </div>
            <div class="text-right">
              <span
                class="text-sm px-2 py-1 rounded"
                :class="getDurationBadgeStyle(getShiftDuration(shift))"
              >
                {{ getDurationLabel(getShiftDuration(shift)) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface WorkingTime {
  id: number
  user_id: number
  start: string
  end: string
}

type WorkingTimes = Array<WorkingTime>

// Generate more mock data for scrolling demonstration
const generateMockData = (): WorkingTimes => {
  const mockData: WorkingTimes = []
  const user_id = 123

  // Generate data for the past 30 days
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  // Different shift patterns with more variety
  const shiftPatterns = [
    { startHour: 9, duration: 8 }, // Regular full shift
    { startHour: 8, duration: 10 }, // Extended shift
    { startHour: 10, duration: 6 }, // Short shift
    { startHour: 14, duration: 7 }, // Evening shift
    { startHour: 9, duration: 4 }, // Half day
    { startHour: 8, duration: 9 }, // Long day
    { startHour: 12, duration: 5 }, // Mid-day shift
    { startHour: 6, duration: 8 }, // Early morning
    { startHour: 16, duration: 6 }, // Late shift
    { startHour: 11, duration: 7.5 } // Mid-morning start
  ]

  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(currentDate.getDate() + i)

    // Skip some random days to simulate days off
    if (Math.random() > 0.8) continue

    // Randomly select a shift pattern
    const pattern = shiftPatterns[Math.floor(Math.random() * shiftPatterns.length)]

    // Add some random minutes to make times more realistic
    const randomMinutes = Math.floor(Math.random() * 15)

    // Set start time
    const start = new Date(currentDate)
    start.setHours(pattern.startHour, randomMinutes, 0, 0)

    // Set end time
    const end = new Date(start)
    end.setHours(start.getHours() + Math.floor(pattern.duration))
    end.setMinutes(start.getMinutes() + (pattern.duration % 1) * 60)

    mockData.push({
      id: i + 1,
      user_id,
      start: start.toISOString(),
      end: end.toISOString()
    })
  }

  return mockData.reverse() // Most recent first
}

// Initialize with mock data
const workingTimes = ref<WorkingTimes>(generateMockData())

// Compute shift duration in hours
const getShiftDuration = (shift: WorkingTime): number => {
  const start = new Date(shift.start)
  const end = new Date(shift.end)
  const durationMs = end.getTime() - start.getTime()
  return durationMs / (1000 * 60 * 60) // Convert to hours
}

// Format date and time
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Format duration as hours and minutes
const formatDuration = (hours: number): string => {
  const wholeHours = Math.floor(hours)
  const minutes = Math.round((hours - wholeHours) * 60)
  return `${wholeHours}h ${minutes}m`
}

// Get duration indicator color
const getDurationIndicatorColor = (hours: number) => {
  if (hours < 6) return 'bg-red-500'
  if (hours < 8) return 'bg-orange-500'
  if (hours <= 10) return 'bg-green-500'
  return 'bg-red-500' // Over 10 hours
}

// Get duration badge style
const getDurationBadgeStyle = (hours: number) => {
  if (hours < 6) return 'bg-red-500/20 text-red-300'
  if (hours < 8) return 'bg-orange-500/20 text-orange-300'
  if (hours <= 10) return 'bg-green-500/20 text-green-300'
  return 'bg-red-500/20 text-red-300'
}

// Get duration label
const getDurationLabel = (hours: number): string => {
  if (hours < 6) return 'Short Shift'
  if (hours < 8) return 'Regular Shift'
  if (hours <= 10) return 'Full Shift'
  return 'Extended Shift'
}
</script>

<style scoped>
/* Custom scrollbar styling */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #4b5563 #1f2937;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4b5563;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280;
}
</style>
