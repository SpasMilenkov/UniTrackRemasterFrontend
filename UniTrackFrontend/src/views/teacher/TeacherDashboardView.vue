<template>
    <div class="flex flex-col p-8 w-full dark:bg-surface-950 min-h-[100vh] gap-4">
        <div class="flex justify-between gap-8 items-center flex-wrap">
            <ProfileCard></ProfileCard>
            <EventCard></EventCard>
        </div>
        <MarkGrid></MarkGrid>
    </div>

</template>
<script setup lang='ts'>
import MarkGrid from '../../components/teacher/StudentGridComponent.vue';
import ProfileCard from '../../components/ProfileCardComponent.vue';
import EventCard from '../../components/teacher/EventCardComponent.vue'
</script>
<style scoped></style>