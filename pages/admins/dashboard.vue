<template>
    <n-space vertical :size="12" class="min-h-screen md:px-6 px-2 py-4">
        <h1 class="md:px-0 text-3xl text-center lg:text-left">Good evening, Mihail's admin</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 py-8 px-8 md:px-0">
            <AdminActionCardComponent v-for="(action, i) in adminActions" :key="i" :data="action" />
        </div>
    </n-space>
</template>
<script setup lang='ts'>
import type { AdminActionCard } from '~/types/adminActionCard';

definePageMeta({
    layout: 'dashboard-layout'
})

const adminActions: AdminActionCard[] = [
    {
        title: 'Manually add student',
        icon: 'material-symbols:school-outline',
        primaryButtonContent: 'Add',
        secondaryButtonButtonContent: 'Load from CSV',
        hasSecondary: true,
        description: 'Manually Fill out a form for creating a new student account into the system'
    },
    {
        title: 'Manually add Teacher',
        icon: 'hugeicons:teacher',
        primaryButtonContent: 'Add',
        hasSecondary: true,
        secondaryButtonButtonContent: 'Load from CSV',
        description: 'Manually Fill out a form for creating a new teacher account into the system'
    },
    {
        title: 'Manually add admin',
        icon: 'eos-icons:admin',
        primaryButtonContent: 'Add',
        hasSecondary: true,
        secondaryButtonButtonContent: 'Load from CSV',
        description: 'Manually Fill out a form for creating a new admin account into the system'
    },
    {
        title: 'Remove teacher accounts',
        icon: 'material-symbols:delete-outline',
        primaryButtonContent: 'Remove',
        hasSecondary: false,
        description: 'Select teacher accounts you wish to deactivate'
    },
    {
        title: 'Remove student accounts',
        icon: 'material-symbols:delete-outline',
        primaryButtonContent: 'Remove',
        hasSecondary: false,
        description: 'Select student accounts you wish to deactivate'
    },
    {
        title: 'Remove admin accounts',
        icon: 'material-symbols:delete-outline',
        primaryButtonContent: 'Remove',
        hasSecondary: false,
        description: 'Select admin accounts you wish to deactivate'
    },
    {
        title: 'Generate report',
        icon: 'material-symbols:picture-as-pdf',
        primaryButtonContent: 'Generate',
        hasSecondary: false,
        description: 'Generate a report for a class or the entire school for a selected period of time'
    },
    {
        title: 'Events',
        icon: 'material-symbols:calendar-add-on',
        primaryButtonContent: 'Manage',
        hasSecondary: true,
        secondaryButtonButtonContent: 'Review',
        description: 'Manage school events or select the review option to open the event viewer'
    },
    {
        title: 'Weekly schedule',
        icon: 'mdi:timetable',
        primaryButtonContent: 'Create',
        hasSecondary: true,
        secondaryButtonButtonContent: 'Edit',
        description: 'Create or edit a version of the weekly timetable for a given class/course'
    },
    {
        title: 'Approve account creation',
        icon: 'material-symbols:order-approve',
        primaryButtonContent: 'Approve',
        hasSecondary: false,
        description: 'Go through account requests and approve them'
    },
    {
        title: 'Manage parent accounts',
        icon: 'ri:parent-fill',
        primaryButtonContent: 'Manage',
        hasSecondary: false,
        description: 'Load admin data from a csv file for creating multiple accounts in bulk'
    },
    {
        title: 'Manage school page',
        icon: 'bx:bxs-school',
        primaryButtonContent: 'Manage',
        hasSecondary: false,
        description: 'Load admin data from a csv file for creating multiple accounts in bulk'
    },

]

</script>
<style scoped></style>