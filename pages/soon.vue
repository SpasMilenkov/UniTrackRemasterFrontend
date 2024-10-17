<template>
    <n-space align="center" justify="center"
        class="min-h-screen bg-[hsl(240,8%,5%)] bg-[url('/img/blobs.svg')] bg-no-repeat bg-cover">
        <n-card title="The page is currently under construction" class="max-w-xl p-4 g-4">
            <p class="text-xl mb-4">The content is coming your way as we are working to the best of our ability to
                deliver it
                as fast as
                possible. While you wait you can listen to this instead.</p>

            <iframe style="border-radius:12px"
                src="https://open.spotify.com/embed/playlist/37i9dQZF1DWYoYGBbGKurt?utm_source=generator" width="100%"
                height="352" frameBorder="0" allowfullscreen="true"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
        </n-card>
    </n-space>
</template>
<script setup lang='ts'></script>
<style>
.n-card>.n-card-header .n-card-header__main {
    font-size: 1.5rem;
}
</style>