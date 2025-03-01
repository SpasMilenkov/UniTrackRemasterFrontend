<template>
  <div
    class="relative w-full bg-background-secondary rounded-xl overflow-hidden"
  >
    <!-- Gradient background effects -->
    <div class="absolute inset-0">
      <div
        class="absolute -left-20 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
      />
      <div
        class="absolute -right-20 bottom-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"
      />
    </div>
    <div class="relative p-8">
      <div
        class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div class="flex items-center gap-6">
          <div class="bg-primary/10 p-5 rounded-xl">
            <Icon name="ph:user-circle-bold" class="text-4xl text-primary" />
          </div>
          <div>
            <h1 class="text-3xl font-bold mb-3 text-gradient">
              {{ $t('userBanner.welcomeMessage', { name: user.name }) }}
            </h1>
            <div v-if="mounted" class="flex flex-wrap items-center gap-3">
              <span
                :class="[
                  'px-4 py-1.5 rounded-full text-sm font-medium border',
                  isLinked
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
                ]"
              >
                {{
                  $t(
                    isLinked
                      ? 'userBanner.profileLinked'
                      : 'userBanner.profileNotLinked'
                  )
                }}
              </span>
              <span class="text-text-secondary flex items-center gap-2">
                <Icon
                  name="material-symbols:mail-outline"
                  class="text-text-muted"
                />
                {{ user.email }}
              </span>
            </div>
          </div>
        </div>
        <n-button
          v-if="mounted"
          :type="isLinked ? 'primary' : 'warning'"
          :disabled="!isLinked"
          class="px-6 h-12 text-base font-medium transition-all duration-300"
          :class="{
            'hover:shadow-lg hover:shadow-primary/20': isLinked,
            'opacity-50 cursor-not-allowed': !isLinked,
          }"
          @click="handleClick"
        >
          {{
            $t(
              isLinked
                ? 'userBanner.viewInstitutions'
                : 'userBanner.noInstitutions'
            )
          }}
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
import { ref, onMounted, computed } from 'vue';

const props = defineProps<{
  user: User;
}>();

const mounted = ref(false);
const localePath = useLocalePath();

//Computed
const isLinked = computed(() => props.user.isLinked);

const handleClick = () => {
  if (isLinked.value) {
    navigateTo(localePath('/users/institutions'));
  }
};

// Set mounted after component mounts
onMounted(() => {
  mounted.value = true;
});
</script>

<style scoped></style>
