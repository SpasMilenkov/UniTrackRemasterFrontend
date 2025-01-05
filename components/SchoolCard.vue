<!-- SchoolCard.vue -->
<template>
  <n-card
    class="transition-all duration-300 ease-in-out max-w-3xl mx-auto hover:bg-[hsl(240,11%,12%)]"
  >
    <template #cover>
      <div class="flex items-center justify-center">
        <img
          :src="school.image"
          :alt="school.name"
          class="w-24 h-52 object-cover"
        />
      </div>
    </template>
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-xl font-bold text-[#63e2b7]">{{ school.name }}</h3>
        <n-tag type="success" round>
          {{ school.motto }}
        </n-tag>
      </div>
    </template>
    <div class="mt-4">
      <p class="text-gray-200 text-md">{{ school.shortDescription }}</p>
    </div>
    <template #footer>
      <div class="flex justify-between items-center mt-4">
        <n-button type="primary" ghost> Learn More </n-button>
      </div>
    </template>
  </n-card>
</template>

<script setup lang="ts">
defineProps({
  school: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped></style>
