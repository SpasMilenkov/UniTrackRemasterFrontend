<template>
    <n-layout>
        <n-layout-header class="md:p-0 p-2">
            <n-menu mode="horizontal" :options="menuOptions" class="desktop-menu" />
            <n-button class="mobile-menu-toggle" @click="toggleMobileMenu">
                <template #icon>
                    <n-icon>
                        <menu-outline v-if="!isMobileMenuOpen" />
                        <close-outline v-else />
                    </n-icon>
                </template>
            </n-button>
            <n-drawer v-model:show="isMobileMenuOpen" :width="240" placement="left">
                <n-drawer-content>
                    <n-menu :options="menuOptions" />
                </n-drawer-content>
            </n-drawer>
        </n-layout-header>
        <n-layout-content>
            <slot />
        </n-layout-content>
        <n-layout-footer bordered>
            <FooterComponent />
        </n-layout-footer>
    </n-layout>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { NIcon, NLayout, NLayoutHeader, NLayoutContent, NMenu, NDrawer, NDrawerContent, NButton } from 'naive-ui'
import { HomeOutline, LogInOutline, PersonAddOutline, MenuOutline, CloseOutline } from '@vicons/ionicons5'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const menuOptions = [
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
]
</script>

<style scoped>
.desktop-menu {
    display: none;
}

@media (min-width: 768px) {
    .desktop-menu {
        display: flex;
    }

    .mobile-menu-toggle {
        display: none;
    }
}
</style>