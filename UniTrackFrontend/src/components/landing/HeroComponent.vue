<template>
    <div
        class=" flex items-center justify-center bg-surface-100 dark:bg-surface-950 w-full min-h-[31rem] max-md:flex-col max-md:items-center max-md:justify-center max-md:gap-4">
        <div class="flex flex-col content-between gap-10 p-24 h-full max-md:p-4 max-md:gap-10 max-md:content-center">
            <h1 class="text-surface-700 dark:text-surface-200 text-8xl max-sm:text-6xl">UniTrack</h1>
            <div class="flex items-center gap-4 pl-2 pr-2 flex-wrap justify-between">
                <Button label="Get started"></Button>
                <Button outlined label="Documentation"></Button>
            </div>
        </div>
    </div>
</template>
<script setup lang='ts'>
import Button from 'primevue/button';
</script>
<style scoped>
</style>