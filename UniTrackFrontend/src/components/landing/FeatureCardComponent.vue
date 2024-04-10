<template>
    <div class="flex p-4 w-1/4 min-w-[35rem] max-sm:min-w-[15rem] max-sm:w-full max-sm:flex-col bg-surface-200 dark:bg-surface-800 rounded-lg">
        <div class="flex items-center justify-center text-surface-700 dark:text-surface-200 max-sm:w-full">
            <Icon :icon="content.icon" class="text-surface-700 dark:text-surface-200 text-2xl"
                :width="content.iconWidth"></Icon>
        </div>
        <div class="flex flex-col gap-2 p-4">
            <h2 class="text-surface-950 dark:text-surface-200 text-2xl">{{content.cardTitle}}</h2>
            <p class="text-surface-900 dark:text-surface-300">{{content.cardText }}</p>
        </div>
    </div>

</template>
<script setup lang='ts'>
import FeatureCard from '../../interfaces/FeatureCard'
import { Icon } from '@iconify/vue';
defineProps<{content: FeatureCard}>()
</script>
<style scoped> 
</style>