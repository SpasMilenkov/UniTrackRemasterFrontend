<template>
    <div class="flex flex-col p-8 w-full dark:bg-surface-950 min-h-[100vh] gap-4">
        <h1
            class="text-surface-700 dark:text-surface-300 text-4xl border-b-2 border-b-surface-700 dark:border-b-surface-300">
            Welcome, teacher
        </h1>
        <div class="flex justify-between gap-8 items-center flex-wrap">
            <ProfileCard></ProfileCard>
            <EventCard></EventCard>
        </div>
        <h1
            class="text-surface-700 dark:text-surface-300 text-4xl border-b-2 border-b-surface-700 dark:border-b-surface-300">
            Your students
        </h1>
        <MarkGrid></MarkGrid>
        <h1
            class="text-surface-700 dark:text-surface-300 text-4xl border-b-2 border-b-surface-700 dark:border-b-surface-300">
            Your events
        </h1>
        <EventGrid></EventGrid>
    </div>

</template>
<script setup lang='ts'>
import MarkGrid from '../../components/teacher/StudentGridComponent.vue';
import ProfileCard from '../../components/ProfileCardComponent.vue';
import EventCard from '../../components/teacher/EventCardComponent.vue'
import EventGrid from '../../components/teacher/EventGridComponent.vue'
</script>
<style scoped></style>