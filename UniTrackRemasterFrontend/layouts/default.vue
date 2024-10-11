<template>
    <n-layout>
        <n-layout-header>
            <n-menu mode="horizontal" :options="menuOptions" />
        </n-layout-header>
        <n-layout-content class="min-h-screen">
            <slot />
        </n-layout-content>
    </n-layout>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { NIcon, NLayout, NLayoutHeader, NLayoutContent, NMenu } from 'naive-ui'
import { HomeOutline, LogInOutline, PersonAddOutline } from '@vicons/ionicons5'

// Menu options
//Nuxt Icons has issues with render functions so with those We rely on naive icons and vicons
const menuOptions = ref([
    {
        label: () =>
            h(
                'a',
                {
                    href: '/',
                    class: 'flex items-center',
                },
                [
                    h(NIcon, { size: 24 }, { default: () => h(HomeOutline) }),
                    h('span', { class: 'ml-2' }, 'Home')
                ]
            ),
        key: 'home',
    },
    {
        label: () =>
            h(
                'a',
                {
                    href: '/login',
                    class: 'flex items-center',
                },
                [
                    h(NIcon, { size: 24 }, { default: () => h(LogInOutline) }),
                    h('span', { class: 'ml-2' }, 'Login')
                ]
            ),
        key: 'login',
    },
    {
        label: () =>
            h(
                'a',
                {
                    href: '/register',
                    class: 'flex items-center',
                },
                [
                    h(NIcon, { size: 24 }, { default: () => h(PersonAddOutline) }),
                    h('span', { class: 'ml-2' }, 'Register')
                ]
            ),
        key: 'register',
    },
])

</script>

<style scoped>
/* Add any additional custom styles here if needed */
</style>