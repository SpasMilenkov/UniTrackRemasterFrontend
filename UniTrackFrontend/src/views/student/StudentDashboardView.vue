<template>
    <div class="flex flex-col p-8 w-full dark:bg-surface-950 min-h-[100vh] gap-4">
        <h1
            class="text-3xl text-surface-700 dark:text-surface-200 border-b-2 border-b-surface-400 dark:border-b-surface-300">
            Overview</h1>
        <div class="flex justify-between flex-wrap gap-4 w-full pt-4 pb-4">
            <OverViewCard v-for="(card, i) in overview" :card-content="card" :key="i"></OverViewCard>
        </div>
        <h1
            class="text-3xl text-surface-700 dark:text-surface-200 border-b-2 border-b-surface-400 dark:border-b-surface-300">
            Marks</h1>
        <MarkGrid></MarkGrid>
        <h1
            class="text-3xl text-surface-700 dark:text-surface-200 border-b-2 border-b-surface-400 dark:border-b-surface-300">
            Marks Timeline</h1>
        <Timeline :events="timeline"></Timeline>
    </div>
</template>
<script setup lang='ts'>
import MarkGrid from '../../components/student/MarkGridComponent.vue'
import OverViewCard from '../../components/student/OverviewCardComponent.vue'
import Timeline from '../../components/student/TimelineComponent.vue'
import OverviewCard from '../../interfaces/OverViewCard';
import { MarkTimeline } from '../../interfaces/Timeline';
const overview: OverviewCard[] = [
    {
        value: 3.44,
        color: 'bg-emerald-500',
        cardTitle: 'Your performance',
        cardDataMain: 'Average performance:',
        cardDataSecondary: 'Best at: ',
        cardDataTertiary: 'Worst at: ',
        knobMinValue: 2,
        knobMaxValue: 6,
        knobStrokeColor: '',
        knobEmptyColor: '#065f46'
    },
    {
        value: 5.43,
        color: 'bg-rose-600',
        cardTitle: 'Class performance:',
        cardDataMain: 'Average class performance:',
        cardDataSecondary: 'Best at:',
        cardDataTertiary: 'Worst at:',
        knobMinValue: 2,
        knobMaxValue: 6,
        knobStrokeColor: '#34d399',
        knobEmptyColor: '#065f46'
    },
    {
        value: 20,
        color: 'bg-amber-600',
        cardTitle: 'Absence',
        cardDataMain: 'Excused:',
        cardDataSecondary: 'Unexcused:',
        cardDataTertiary: 'Average absence per subject:',
        knobMinValue: 0,
        knobMaxValue: 100,
        knobStrokeColor: '#34d399',
        knobEmptyColor: '#065f46'
    },

]
const timeline: MarkTimeline[] = [
    {
        title: 'Subject goes here',
        subtitle: new Date,
        content: 'You failed because you did not study',
        markValue: 3.44
    },
    {
        title: 'Subject goes here 2',
        subtitle: new Date,
        content: 'You failed because you did not study',
        markValue: 4.55
    },
    {
        title: 'Subject goes here 3',
        subtitle: new Date,
        content: 'You failed because you did not study',
        markValue: 5.32
    },
]
</script>
<style scoped></style>