<template>
    <Menubar :model="items" class="z-50">
        <template #item="{ item, props, hasSubmenu }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                </a>
            </router-link>
            <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
                <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
            </a>
        </template>
    </Menubar>
    <div>
        <router-view></router-view>
    </div>
</template>
<script setup lang='ts'>
const items = ref([
    {
        label: 'Home',
        icon: 'pi pi-home',
        command: async () => {
            await navigateTo({ path: '/' })
        }
    },
    {
        label: 'Login',
        icon: 'pi pi-star',
        command: async () => {
            await navigateTo('login')
        }
    },
    {
        label: 'Register',
        icon: 'pi pi-search',
        command: async () => {
            await navigateTo('register')
        }
    },
]);
</script>
<style scoped></style>