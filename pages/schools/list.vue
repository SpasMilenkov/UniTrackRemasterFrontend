<template>
    <n-space vertical :size="12" class="min-h-screen md:px-6 px-2 py-4">
        <n-infinite-scroll :distance="10" @load="handleLoad">
            <n-card v-for="(school, i) in schools" :key="i" class="item" :title="school.name">
                <template #header-extra>{{ school.motto }}</template>
                <n-space vertical>
                    <img :src="school.image" alt="school image" class="rounded w-80 h-auto object-">
                    <p>{{ school.shortDescription }}</p>
                </n-space>
            </n-card>
            <n-space class="w-full" justify="center">
                <n-spin v-if="loading" size="large" />
            </n-space>
        </n-infinite-scroll>
    </n-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const schoolStore = useSchoolStore()

const schools = ref<School[]>([])
const loading = ref(false)

const handleLoad = async () => {
    loading.value = true
    const newSchools = await schoolStore.fetchSchools()
    schools.value = [...schools.value, ...newSchools]
    loading.value = false
}

onMounted(async () => {
    handleLoad()
})
</script>

<style scoped>
.item {
    margin-bottom: 1rem;
}

.item:last-child {
    margin-bottom: 0;
}
</style>
