<template>
  <!-- Enhanced User Status Banner -->
  <div class="relative w-full bg-[#262629] rounded-xl overflow-hidden">
    <!-- Gradient background effects -->
    <div class="absolute inset-0">
      <div
        class="absolute -left-20 top-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl"
      />
      <div
        class="absolute -right-20 bottom-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"
      />
    </div>

    <div class="relative p-8">
      <div
        class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div class="flex items-center gap-6">
          <div class="bg-emerald-400/10 p-5 rounded-xl">
            <Icon
              name="ph:user-circle-bold"
              class="text-4xl text-emerald-400"
            />
          </div>
          <div>
            <h1
              class="text-3xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
            >
              {{ $t('userBanner.welcomeMessage', { name: user.name }) }}
            </h1>
            <div class="flex flex-wrap items-center gap-3">
              <span
                :class="[
                  'px-4 py-1.5 rounded-full text-sm font-medium',
                  user.isLinked
                    ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                    : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20',
                ]"
              >
                {{
                  $t(
                    user.isLinked
                      ? 'userBanner.profileLinked'
                      : 'userBanner.profileNotLinked'
                  )
                }}
              </span>
              <span class="text-gray-400 flex items-center gap-2">
                <Icon name="ph:envelope" class="text-gray-500" />
                {{ user.email }}
              </span>
            </div>
          </div>
        </div>
        <n-button
          type="primary"
          color="#4ade80"
          class="px-6 h-12 text-base font-medium hover:shadow-lg hover:shadow-emerald-400/20 transition-all duration-300"
          @click="navigateTo('/institutions')"
        >
          {{ $t('userBanner.viewInstitutions') }}
          <template #icon>
            <Icon name="ph:buildings-bold" />
          </template>
        </n-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { User } from '~/interfaces/user/user';

defineProps<{
  user: User;
}>();
</script>
<style scoped></style>
