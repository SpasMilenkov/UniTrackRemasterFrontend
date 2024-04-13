<template>
    <div class="flex flex-col p-8 w-full dark:bg-surface-950 min-h-[100vh] gap-8">
        <div class="flex flex-col w-full gap-4">
            <h1
                class="text-3xl text-surface-700 dark:text-surface-200 border-b-2 border-b-surface-400 dark:border-b-surface-300">
                Overview</h1>
            <AdminStatisticsArrayComponent :content="statistics" />
        </div>
        <div class="flex flex-col w-full gap-4">

            <h1
                class="text-3xl text-surface-700 dark:text-surface-200 border-b-2 border-b-surface-400 dark:border-b-surface-300">
                Applications</h1>
            <UserGrid></UserGrid>
        </div>



    </div>
</template>
<script setup lang='ts'>
import {ref, Ref} from 'vue'
import UserGrid from '../../components/admin/UserGridComponent.vue'
import AdminStatisticsArrayComponent from '../../components/admin/AdminStatisticsArrayComponent.vue'
import AdminStatisticsArray from '../../interfaces/AdminStatisticsArray';


const statistics: Ref<AdminStatisticsArray> = ref({
    schoolName: "MG PZ",
    firstCard: {
        firstStatistics: "Students: 400",
        secondaryStatistics: "Teachers: 30",
        tertiaryStatistics: "parents: 800"
    },
    secondCard:{
        firstStatistics: "Students: 400",
        secondaryStatistics: "Teachers: 30",
        tertiaryStatistics: "parents: 800"
    },
    thirdCard: {
        firstStatistics: "Students: 400",
        secondaryStatistics: "Teachers: 30",
        tertiaryStatistics: "parents: 800"
    }
})
</script>
<style scoped></style>