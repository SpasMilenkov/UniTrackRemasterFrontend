<template>
  <div class="min-h-screen bg-background px-4 py-8 md:px-6 md:py-10">
    <!-- User Banner -->
    <UserBanner :user="bannerUser" />

    <!-- Main Dashboard Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <!-- Left Column -->
      <div class="space-y-8">
        <!-- AI Assistant Card -->
        <n-card class="dashboard-card backdrop-blur-sm overflow-hidden">
          <div class="flex items-center mb-4">
            <div class="rounded-full p-3 mr-4 bg-primary/10">
              <Icon name="ph:brain" class="text-2xl text-primary" />
            </div>
            <div>
              <h3 class="text-lg font-medium">AI Assistant</h3>
              <p class="text-sm text-text-secondary">
                Ask questions or get help with your tasks
              </p>
            </div>
          </div>

          <n-button
            type="primary"
            class="w-full"
            @click="navigateTo('/assistant')"
          >
            <template #icon>
              <Icon name="ph:robot" />
            </template>
            Open Assistant
          </n-button>
        </n-card>
        <!-- Inspirational Quote -->
        <n-card class="dashboard-card backdrop-blur-sm overflow-hidden">
          <template #header>
            <div class="flex items-center">
              <Icon name="ph:quotes" class="text-xl text-primary mr-2" />
              <h3 class="text-xl font-medium">Today's Inspiration</h3>
            </div>
          </template>

          <div class="relative py-3">
            <div
              class="text-3xl text-primary opacity-20 absolute -top-1 left-0 font-serif"
            >
              "
            </div>
            <p class="text-base italic mb-3 pl-5">{{ quote.text }}</p>
            <p class="text-sm text-right font-medium text-text-secondary">
              — {{ quote.author }}
            </p>
          </div>
        </n-card>
      </div>
    </div>

    <!-- Floating Particles for subtle animation -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        v-for="n in 8"
        :key="n"
        class="absolute w-1 h-1 bg-primary opacity-10 rounded-full animate-float"
        :style="{
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          '--tx': Math.random() * 200 - 100 + 'px',
          '--ty': Math.random() * 200 - 100 + 'px',
          '--scale': 0.5 + Math.random() * 1,
          animationDelay: Math.random() * 10 + 's',
          animationDuration: 20 + Math.random() * 20 + 's',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useAuthStore } from '~/stores/auth';
import {
  format,
  addDays,
  subDays,
  getMonth,
  getDate,
  getYear,
  getTime,
  startOfWeek,
} from 'date-fns';
import UserBanner from '~/components/user/UserBannerComponent.vue';

// Store access
const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();

// State management
const isLoading = ref(true);
const institutions = ref([]);
const institutionRoles = ref({});
const currentWeekStart = ref(new Date());
const quote = ref({
  text: '',
  author: '',
});

// Mock upcoming events - replace with API integration later
const upcomingEvents = ref([
  {
    id: 1,
    title: 'Team Meeting',
    date: addDays(new Date(), 1),
    color: 'blue',
  },
  {
    id: 2,
    title: 'Project Deadline',
    date: addDays(new Date(), 3),
    color: 'red',
  },
  {
    id: 3,
    title: 'Workshop',
    date: addDays(new Date(), 5),
    color: 'green',
  },
]);

// Computed properties
const bannerUser = computed(() => ({
  name: userStore.displayName,
  email: userStore.userDetails?.email || '',
  isLinked: userStore.isInstitutionLinked,
}));

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const currentMonth = computed(() => {
  return format(currentWeekStart.value, 'MMMM yyyy');
});

const calendarDays = computed(() => {
  const days = [];
  // Start from Sunday of the current week
  const startDate = startOfWeek(currentWeekStart.value);

  // Generate 7 days (1 week)
  for (let i = 0; i < 7; i++) {
    days.push(addDays(startDate, i));
  }

  return days;
});

// Page metadata
definePageMeta({
  layout: 'dashboard-layout',
});

// Methods
function getInstitutionIcon(type: string) {
  const icons = {
    PublicSchool: 'ph:student',
    PrivateSchool: 'ph:student',
    CharterSchool: 'ph:student',
    PublicUniversity: 'ph:buildings',
    PrivateUniversity: 'ph:buildings',
  };
  return icons[type] || 'ph:buildings';
}

function formatInstitutionType(type: string) {
  // Convert camelCase to space-separated words
  return type.replace(/([A-Z])/g, ' $1').trim();
}

function getUserRoleInInstitution(institutionId: string) {
  const roles = institutionRoles.value[institutionId];
  if (!roles || roles.length === 0) return 'Member';

  // Return first role for simplicity
  return roles[0];
}

function navigateToInstitution(institution: { id: string; type: string }) {
  const role = getUserRoleInInstitution(institution.id);
  let route = '/dashboard';

  if (role === 'Teacher') {
    route = '/teaching';
  } else if (role === 'Admin') {
    route = '/admin';
  } else if (role === 'Student') {
    route = '/academics';
  }

  // Store selected institution in a store or local storage
  localStorage.setItem('selectedInstitutionId', institution.id);

  navigateTo(route);
}

function navigateTo(path: string) {
  router.push(path);
}

function getDayClass(date: Date) {
  const today = new Date();
  const todayTime = getTime(
    new Date(getYear(today), getMonth(today), getDate(today))
  );
  const dateTime = getTime(
    new Date(getYear(date), getMonth(date), getDate(date))
  );

  if (dateTime === todayTime) {
    return 'bg-primary/10 text-primary font-medium';
  }

  if (getMonth(date) !== getMonth(currentWeekStart.value)) {
    return 'text-text-muted';
  }

  return '';
}

function hasEvent(date: Date) {
  return upcomingEvents.value.some((event) => {
    const eventDate = new Date(event.date);
    return (
      getDate(eventDate) === getDate(date) &&
      getMonth(eventDate) === getMonth(date) &&
      getYear(eventDate) === getYear(date)
    );
  });
}

function formatDate(date: Date | number, formatString: string) {
  return format(date, formatString);
}

function prevWeek() {
  currentWeekStart.value = subDays(currentWeekStart.value, 7);
}

function nextWeek() {
  currentWeekStart.value = addDays(currentWeekStart.value, 7);
}

// Fetch a random quote from a free API

async function fetchRandomQuote() {
  try {
    const data = await $fetch('/api/quote'); // Call your server API

    if (data?.text && data?.author) {
      quote.value = {
        text: data.text,
        author: data.author,
      };
    }
  } catch (error) {
    console.error('Error fetching quote from local API:', error);
    // Optional fallback here (should rarely be used since server handles fallback too)
    quote.value = {
      text: 'Stay hungry, stay foolish.',
      author: 'Steve Jobs',
    };
  }
}

// Lifecycle hooks
onMounted(async () => {
  isLoading.value = true;

  // Load user details if authenticated
  if (authStore.isAuthenticated) {
    await userStore.fetchUserDetails(authStore.user.id);
  }

  // Fetch a random quote
  await fetchRandomQuote();

  isLoading.value = false;
});
</script>

<style scoped>
.dashboard-card {
  border: 1px solid rgba(var(--color-primary-rgb, 74, 222, 128), 0.15);
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.nav-card {
  cursor: pointer;
}

.nav-card:hover {
  transform: translateY(-3px);
  border-color: rgba(var(--color-primary-rgb), 0.3);
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.1),
    0 0 2px rgba(var(--color-primary-rgb), 0.3);
}

.institution-card:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.day-cell:hover {
  background-color: rgba(var(--color-primary-rgb), 0.05);
}

.day-name {
  font-weight: 500;
  padding-bottom: 8px;
}

@keyframes float {
  0% {
    transform: translate(0, 0) scale(var(--scale));
    opacity: 0;
  }
  25% {
    opacity: 0.1;
  }
  75% {
    opacity: 0.1;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) scale(var(--scale));
    opacity: 0;
  }
}

.animate-float {
  animation: float var(--duration, 15s) ease-in-out infinite alternate;
}
</style>
