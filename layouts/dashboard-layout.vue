<template>
    <div class="flex">
        <!-- Sidebar -->
        <div v-if="!isMobile" class="fixed top-0 left-0 h-screen transition-all duration-300"
            :class="{ 'w-[240px]': !collapsed, 'w-[64px]': collapsed }">
            <div class="h-full bg-[#18181c] border-r border-[#262629]">
                <!-- Logo Section -->
                <div class="flex items-center px-4 h-16 border-b border-[#262629]">
                    <img src="/img/UniTrack.png" alt="UniTrack Logo" class="h-8 w-auto mr-4"
                        :class="{ 'mr-0': collapsed }">
                    <span v-if="!collapsed"
                        class="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
                        UniTrack
                    </span>
                </div>

                <!-- Sidebar Menu -->
                <div class="py-4">
                    <n-menu mode="vertical" :options="sidebarOptions" :collapsed="collapsed" class="!bg-transparent" />
                </div>
            </div>
        </div>

        <!-- Custom Collapse Trigger -->
        <div v-if="!isMobile" class="fixed left-[240px] top-1/2 -translate-y-1/2 z-50 transition-all duration-300"
            :class="{ 'left-[64px]': collapsed }">
            <n-button circle secondary size="small"
                class="transform -translate-x-1/2 shadow-lg hover:border-emerald-400" @click="collapsed = !collapsed">
                <template #icon>
                    <n-icon :component="collapsed ? ChevronForwardOutline : ChevronBackOutline" />
                </template>
            </n-button>
        </div>

        <!-- Main Content Wrapper -->
        <div class="min-h-screen w-full transition-all duration-300"
            :class="{ 'ml-[240px]': !collapsed && !isMobile, 'ml-[64px]': collapsed && !isMobile }">
            <!-- Header -->
            <div class="sticky top-0 z-40">
                <div class="bg-[#18181c] border-b border-[#262629]">
                    <div class="max-w-7xl mx-auto px-6 lg:px-8">
                        <div class="flex items-center justify-between h-16">
                            <!-- Mobile Logo Section -->
                            <div class="flex items-center lg:hidden">
                                <img src="/img/UniTrack.png" alt="UniTrack Logo" class="h-8 w-auto mr-4">
                                <span
                                    class="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
                                    UniTrack
                                </span>
                            </div>

                            <!-- Desktop Menu -->
                            <div class="hidden lg:flex lg:items-center lg:ml-auto">
                                <n-menu mode="horizontal" :options="menuOptions" class="desktop-menu !bg-transparent" />
                            </div>

                            <!-- Mobile Menu Button -->
                            <n-button v-if="isMobile" class="mobile-menu-toggle" secondary size="large"
                                @click="toggleMobileMenu">
                                <template #icon>
                                    <n-icon>
                                        <menu-outline v-if="!isMobileMenuOpen" />
                                        <close-outline v-else />
                                    </n-icon>
                                </template>
                            </n-button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mobile Drawer -->
            <n-drawer v-model:show="isMobileMenuOpen" :width="280" placement="left" class="!bg-[#18181c]">
                <n-drawer-content class="!bg-[#18181c] pt-6">
                    <div class="flex items-center mb-8 px-4">
                        <img src="/img/UniTrack.png" alt="UniTrack Logo" class="h-8 w-auto mr-4">
                        <span
                            class="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
                            UniTrack
                        </span>
                    </div>
                    <n-menu :options="combinedMobileOptions" :indent="18" class="!bg-transparent" />
                </n-drawer-content>
            </n-drawer>

            <!-- Main Content -->
            <div class="bg-[#18181c] text-gray-100">
                <slot />
            </div>

            <!-- Footer -->
            <div class="bg-[#18181c] border-t border-[#262629]">
                <FooterComponent />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { h, ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'nuxt/app'
import {
    NIcon,
    NMenu,
    NDrawer,
    NDrawerContent,
    NButton,
    type MenuOption
} from 'naive-ui'
import {
    HomeOutline,
    LogInOutline,
    PersonAddOutline,
    MenuOutline,
    CloseOutline,
    BookOutline as BookIcon,
    DocumentTextOutline,
    CalendarOutline,
    ChevronBackOutline,
    ChevronForwardOutline
} from '@vicons/ionicons5'

const router = useRouter()
const isMobileMenuOpen = ref(false)
const isMobile = ref(false)
const collapsed = ref(false)

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const checkMobile = () => {
    isMobile.value = window.innerWidth < 1280
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
                class: 'flex items-center transition-colors duration-200 hover:text-emerald-400',
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
:deep(.n-menu) {
    background-color: transparent !important;
}

:deep(.n-menu-item) {
    color: #9ca3af !important;
}

:deep(.n-menu-item:hover) {
    color: #4ade80 !important;
}

:deep(.n-menu-item-content__icon) {
    color: inherit !important;
}

:deep(.n-menu-item-content--selected) {
    color: #4ade80 !important;
    background-color: #262629 !important;
}

:deep(.n-drawer) {
    background-color: #18181c !important;
}

:deep(.n-drawer-content) {
    background-color: #18181c !important;
}

:deep(.n-button.n-button--secondary-type) {
    background-color: #262629 !important;
    border-color: #374151 !important;
}

:deep(.n-button.n-button--secondary-type:hover) {
    border-color: #4ade80 !important;
}

@media (min-width: 1000px) {

    /* Changed from 768px to 1000px */
    .mobile-menu-toggle {
        display: none;
    }
}
</style>