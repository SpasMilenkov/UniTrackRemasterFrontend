<template>

    <div class="flex flex-col gap-4 p-8 w-full max-w-[40rem]  bg-surface-300 dark:bg-surface-800 rounded-md h-[18rem]">
        <h1 class="text-surface-700 dark:text-surface-100 text-3xl pl-2">Events</h1>
        <div class="flex gap-4 items-center justify-center">
            <img src="/images/star.png" alt="profile-picture"
                class="rounded-full w-44 gap-4 bg-surface-400 dark:bg-surface-900">
            <div class="flex flex-col gap-8 w-full h-full justify-center">
                <h1 class="text-surface-700 dark:text-surface-100 text-2xl">No planned events soon</h1>
                <Button label="Create"></Button>
            </div>
        </div>
    </div>

</template>
<script setup lang='ts'>
import Button from 'primevue/button';
</script>
<style scoped></style>