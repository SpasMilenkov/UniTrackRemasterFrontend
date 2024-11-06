<template>
    <n-space vertical :size="12" class="min-h-screen md:px-6 px-2 py-4">
        <n-steps v-model:current="current">
            <n-step title="I Me Mine" description="All through the day, I me mine I me mine, I me mine" />
            <n-step title="Let It Be" description="When I find myself in times of trouble Mother Mary comes to me" />
            <n-step title="Come Together" description="Here come old flat top He come grooving up slowly" />
            <n-step title="Something"
                description="Something in the way she moves Attracts me like no other lover" />
        </n-steps>
    </n-space>
</template>
<script setup lang='ts'>
const current: Ref<number | undefined> = ref(1)
</script>
<style scoped></style>