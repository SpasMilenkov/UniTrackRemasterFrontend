<template>
    <n-config-provider :theme="darkTheme">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme, NConfigProvider } from 'naive-ui'
</script>
