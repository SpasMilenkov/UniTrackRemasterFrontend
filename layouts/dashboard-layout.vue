<template>
    <n-layout has-sider>
        <n-layout-sider v-if="!isMobile" v-model:collapsed="collapsed" class="py-8" bordered collapse-mode="width"
            :collapsed-width="64" :width="240" show-trigger>
            <n-menu mode="vertical" :options="sidebarOptions" :collapsed="collapsed" />
        </n-layout-sider>
        <n-layout>
            <n-layout-header class="md:p-0 p-2">
                <n-menu v-if="!isMobile" mode="horizontal" :options="menuOptions" />
                <n-button v-else class="mobile-menu-toggle" @click="toggleMobileMenu">
                    <template #icon>
                        <n-icon>
                            <menu-outline v-if="!isMobileMenuOpen" />
                            <close-outline v-else />
                        </n-icon>
                    </template>
                </n-button>
                <n-drawer v-model:show="isMobileMenuOpen" :width="240" placement="left">
                    <n-drawer-content>
                        <n-menu :options="combinedMobileOptions" />
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
    </n-layout>
</template>

<script setup lang="ts">
import { h, ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'nuxt/app'
import { NIcon, NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, NLayoutFooter, NMenu, NDrawer, NDrawerContent, NButton, type MenuOption } from 'naive-ui' 
import {
    HomeOutline,
    LogInOutline,
    PersonAddOutline,
    MenuOutline,
    CloseOutline,
    BookOutline as BookIcon,
    DocumentTextOutline,
    CalendarOutline
} from '@vicons/ionicons5'

const router = useRouter()
const isMobileMenuOpen = ref(false)
const isMobile = ref(false)
const collapsed = ref(false)

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
    if (!isMobile.value) {
        isMobileMenuOpen.value = false
    }
}

onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
})

const renderIcon = (icon: Component) => {
    return () => h(NIcon, null, { default: () => h(icon) })
}

const createMenuOption = (label: string, route: string, icon: Component): MenuOption => ({
    label: () =>
        h(
            'a',
            {
                onClick: (e: Event) => {
                    e.preventDefault()
                    router.push(route)
                    isMobileMenuOpen.value = false
                },
            },
            label
        ),
    key: route,
    icon: renderIcon(icon)
})

const menuOptions = [
    createMenuOption('Home', '/', HomeOutline),
    createMenuOption('Login', '/login', LogInOutline),
    createMenuOption('Register', '/register', PersonAddOutline),
]

const sidebarOptions: MenuOption[] = [
    createMenuOption('Timetable', '/timetable', BookIcon),
    createMenuOption('Plan Examination', '/exams', DocumentTextOutline),
    createMenuOption('Calendar', '/calendar', CalendarOutline),
]

const combinedMobileOptions = computed(() => [...menuOptions, ...sidebarOptions])
</script>

<style scoped>
@media (min-width: 768px) {
    .mobile-menu-toggle {
        display: none;
    }
}
</style>