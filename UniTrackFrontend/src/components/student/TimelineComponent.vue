<template>
    <div class="w-full max-w-[50rem]">
        <Timeline :value="events" align="alternate" class="customized-timeline">
            <template #marker="slotProps">
                <span
                    class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
                    :style="{ backgroundColor: slotProps.item.color }">
                    <i :class="slotProps.item.icon"></i>
                </span>
            </template>
            <template #content="slotProps" class="w-20rem">
                <Card class="mt-3">
                    <template #title>
                        {{ slotProps.item.title }}
                    </template>
                    <template #subtitle>
                        {{ useConvertDateObject(slotProps.item.subtitle) }}
                    </template>
                    <template #content>
                        <Tag :value="slotProps.item.markValue"
                            :severity="useCalculateSeverity(slotProps.item.markValue)" rounded class=" text-3xl"></Tag>
                        <p>{{ slotProps.item.content }}</p>
                    </template>
                </Card>
            </template>
        </Timeline>
    </div>

</template>
<script setup lang='ts'>
import Timeline from 'primevue/timeline';
import Card from 'primevue/card';
import { MarkTimeline } from '../../interfaces/Timeline'
import Tag from 'primevue/tag';
import { useCalculateSeverity } from '../../composables/calculateSeverity'
import { useConvertDateObject } from '../../composables/convertDate'

defineProps<{ events: MarkTimeline[] }>()

</script>
<style scoped></style>