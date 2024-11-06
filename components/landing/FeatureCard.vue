<template>
    <n-card
        class="feature-card bg-[#18181c]/80 backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300 hover:shadow-xl pt-4 border border-gray-700/50"
        :class="feature.activeClass">
        <template #cover>
            <div class="relative pt-8 pb-4">
                <!-- Background circle -->
                <div
                    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-emerald-400/5 rounded-full" />
                <!-- Icon -->
                <div class="relative flex justify-center">
                    <Icon :name="feature.icon"
                        class="text-emerald-400 transform transition-all duration-500 hover:scale-110" size="48" />
                </div>
            </div>
        </template>

        <template #header>
            <div class="relative">
                <!-- Title -->
                <div class="text-xl font-semibold text-center mb-2 text-gray-100">
                    {{ feature.title }}
                </div>
                <!-- Badge -->
                <div v-if="feature.badge" class="absolute -top-12 right-0">
                    <span class="px-3 py-1 text-sm rounded-full bg-emerald-400/10 text-emerald-400">
                        {{ feature.badge }}
                    </span>
                </div>
            </div>
        </template>

        <!-- Description -->
        <div class="text-gray-400 text-center mb-4">{{ feature.description }}</div>

        <!-- Feature List -->
        <div class="space-y-2">
            <div v-for="subFeature in feature.subFeatures" :key="subFeature"
                class="flex items-center text-sm text-gray-400">
                <Icon name="ph:check-circle-fill" class="text-emerald-400 mr-2" size="16" />
                {{ subFeature }}
            </div>
        </div>
    </n-card>
</template>

<script setup lang="ts">
import type { FeatureProps } from '@/types/feature-card.props'

defineProps<{
    feature: FeatureProps
}>()
</script>

<style scoped>
:deep(.n-card) {
    background-color: #262629 !important;
    border: 1px solid transparent;
    transition: all 0.3s ease;
}

:deep(.n-card:hover) {
    border-color: rgba(74, 222, 128, 0.5);
    box-shadow: 0 0 30px rgba(74, 222, 128, 0.1);
    transform: translateY(-5px);
}
</style>