<template>
  <n-space
    vertical
    align="center"
    :size="12"
    class="min-h-screen md:px-6 px-2 py-4"
  >
    <n-space vertical justify="center" class="py-8">
      <h1 class="md:text-8xl text-4xl py-8">
        School <span class="text-[#63e2b7]">Index</span>
      </h1>
      <n-input-group class="w-full justify-center">
        <n-input
          class="max-w-80"
          size="large"
          round
          placeholder="Enter school name"
        />
        <n-button type="primary" size="large" class="rounded-r-3xl">
          <Icon name="material-symbols:search" size="24" />
        </n-button>
      </n-input-group>
    </n-space>

    <n-infinite-scroll :distance="10" @load="handleLoad">
      <SchoolCard
        v-for="(school, i) in schools"
        :key="i"
        class="mt-4 last:mt-0"
        :school="school"
      />
      <n-space class="w-full py-4" justify="center">
        <n-spin v-if="loading" size="large" />
      </n-space>
    </n-infinite-scroll>
  </n-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

//Stores
const schoolStore = useSchoolStore();

//Variables
const schools = ref<School[]>([]);
const loading = ref(false);

//Methods
const handleLoad = async () => {
  loading.value = true;
  const newSchools = await schoolStore.fetchSchools();
  schools.value = [...schools.value, ...newSchools];
  loading.value = false;
};

//Lifecycle
onMounted(async () => {
  handleLoad();
});
</script>

<style scoped></style>
