<template>
    <n-card class=" dark:hover:bg-[hsl(240,8%,13%)] duration-150 dark:bg-[#18181c] dark:text-white rounded min-h-32"
        :title="data.title">
        <template #header-extra>
            <Icon :name="data.icon" class="text-primary" :size="96" />
        </template>
        <p>{{ data.description }}</p>
        <template #action>
            <n-space>
                <n-button type="primary"> {{ data.primaryButtonContent }}</n-button>
                <n-button v-if="data.hasSecondary"> {{ data.secondaryButtonButtonContent }}</n-button>
            </n-space>


        </template>
    </n-card>
</template>
<script setup lang='ts'>
import type { AdminActionCard } from '~/types/adminActionCard';

defineProps({
    data: {
        type: Object as () => AdminActionCard,
        required: true
    }
})
</script>
<style scoped></style>