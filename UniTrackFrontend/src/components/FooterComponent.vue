<template>
    <footer
        class="flex items-center justify-between flex-wrap pl-16 pr-16 pt-8 pb-8 bg-surface-100 dark:bg-surface-800 w-full min-h-32 gap-8">
        <h3 class="text-surface-950 dark:text-surface-200 text-3xl">UniTrack</h3>
        <div class="flex flex-col dark:text-surface-200 text-lg gap-2">
            <div class="text-2xl">Social Media</div>
            <a v-for="(link, i) in socialMedia" :href="link.link" :key="i"> {{ link.content }}</a>
        </div>
        <div class="flex flex-col dark:text-surface-200 text-lg gap-2">
            <div class="text-2xl">Social Media</div>
            <a v-for="(link, i) in socialMedia" :href="link.link" :key="i"> {{ link.content }}</a>
        </div>
        <div class="flex flex-col dark:text-surface-200 text-lg gap-2">
            <div class="text-2xl">Social Media</div>
            <a v-for="(link, i) in socialMedia" :href="link.link" :key="i"> {{ link.content }}</a>
        </div>
        <p class="flex flex-col dark:text-surface-200 text-lg gap-2">
        <div id="copyright" align="center">&copy; 2024 - 2024 UniTrack</div>
        </p>
    </footer>
</template>
<script setup lang='ts'>

const socialMedia = [
    {
        link: "#",
        content: "Facebook"
    },
    {
        link: "#",
        content: "LinkedIn"
    },
    {
        link: "#",
        content: "Github"
    }
]

</script>
<style scoped></style>