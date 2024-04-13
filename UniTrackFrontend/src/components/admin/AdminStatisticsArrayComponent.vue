<template>
    <div class="flex w-full gap-4 flex-wrap justify-between">
        <div
            class="flex flex-col justify-center gap-8 w-full shadow-lg dark:shadow-none rounded-md min-w-[20rem] max-w-[32rem] p-4 min-h-[14rem] bg-emerald-700">
            <h1 class="text-surface-100 dark:text-surface-100 text-2xl">{{ content.schoolName }}'s members</h1>
            <div class="flex flex-col gap-2">
                <h2 class="text-surface-100  text-xl">{{ content.firstCard.firstStatistics }}</h2>
                <h2 class="text-surface-100  text-xl">{{ content.firstCard.secondaryStatistics }}</h2>
                <h2 class="text-surface-100  text-xl">{{ content.firstCard.tertiaryStatistics }}</h2>
            </div>
        </div>
        <div
            class="flex flex-col justify-center gap-8 w-full shadow-lg dark:shadow-none rounded-md min-w-[20rem] max-w-[32rem] p-4 min-h-[14rem] bg-blue-600">
            <h1 class="text-surface-100 dark:text-surface-100 text-2xl">{{ content.schoolName }}'s grades</h1>
            <div class="flex flex-col gap-2">
                <h2 class="text-surface-100  text-xl">{{ content.firstCard.firstStatistics }}</h2>
                <h2 class="text-surface-100  text-xl">{{ content.firstCard.secondaryStatistics }}</h2>
                <h2 class="text-surface-100  text-xl">{{ content.firstCard.tertiaryStatistics }}</h2>
            </div>
        </div>
        <div
            class="flex flex-col justify-center gap-8 w-full shadow-lg dark:shadow-none rounded-md min-w-[20rem] max-w-[32rem] p-4 min-h-[14rem] bg-violet-700">
            <h1 class="text-surface-100 dark:text-surface-100 text-2xl">{{ content.schoolName }}'s absence</h1>
            <div class="flex flex-col gap-2">
                <h2 class="text-surface-100 da text-xl">{{ content.firstCard.firstStatistics }}</h2>
                <h2 class="text-surface-100 da text-xl">{{ content.firstCard.secondaryStatistics }}</h2>
                <h2 class="text-surface-100 da text-xl">{{ content.firstCard.tertiaryStatistics }}</h2>
            </div>
        </div>
    </div>

</template>
<script setup lang='ts'>
import AdminStatisticsArray from '../../interfaces/AdminStatisticsArray'


// students: number
// teachers: number
// totalMarksCount: number
// marksCountLastYear: number
// marksPerDay: number
// totalAbsenceCount: number
// absenceCountLastYear: number
// absencePerDay: number

defineProps<{content: AdminStatisticsArray}>()

</script>
<style scoped></style>