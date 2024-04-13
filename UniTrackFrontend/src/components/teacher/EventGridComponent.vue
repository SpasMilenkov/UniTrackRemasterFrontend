<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="i in 10" :key="i"
            class="flex flex-col justify-evenly min-w-[16rem] max-w-[30rem] gap-4 rounded-md min-h-[22rem] bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600">
            <img src="https://img.freepik.com/free-photo/abstract-mixed-blue-creative-art-texture-background_23-2148097543.jpg?t=st=1713021887~exp=1713025487~hmac=d14d2eaca399fd9b7e8e6a392509d3a43ea0a423ae8a1131748539e71c4b55ef&w=1380"
                alt="" class="h-20 w-full object-cover rounded-t-md">
            <div class="flex flex-col gap-1 p-2">
                <h1 class="text-surface-700 dark:text-surface-300 text-3xl">Event title</h1>
                <h2 class="text-surface-700 dark:text-surface-300 text-xl">Event topic</h2>
            </div>
            <p class="p-2 text-surface-700 dark:text-surface-300">Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Ex ducimus adipisci quod a esse illum minus laudantium eveniet.</p>
            <div class="flex gap-2 p-2 justify-between">
                <h3 class="text-surface-700 dark:text-surface-300">13/02/2002</h3>
                <h3 class="text-surface-700 dark:text-surface-300">11:00</h3>
            </div>
        </div>
    </div>
</template>
<script setup lang='ts'></script>
<style scoped></style>