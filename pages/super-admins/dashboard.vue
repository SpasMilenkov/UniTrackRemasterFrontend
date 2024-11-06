<template>
    <div class="min-h-screen bg-[#101014] text-white">
        <!-- Header Section with Gradient Background -->
         <TitleComponent title="Hello Misho's admin"/>

        <!-- Quick Stats Cards -->
        <div class="mx-auto px-6 lg:px-8 py-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <n-card class="bg-[#262629] hover:border-emerald-400/50 transition-all duration-300">
                    <template #header>
                        <div class="flex items-center gap-3">
                            <div class="bg-emerald-400/10 p-2 rounded-lg">
                                <Icon name="ph:users-bold" class="text-emerald-400 text-xl" />
                            </div>
                            <span class="text-gray-400">Total Users</span>
                        </div>
                    </template>
                    <div class="text-2xl font-bold">24,521</div>
                    <div class="text-sm text-emerald-400">↑ 12% from last month</div>
                </n-card>

                <!-- Repeat for other quick stats -->
                <!-- You can add more stat cards here -->
            </div>
        </div>

        <!-- Action Cards -->
        <div class="mx-auto px-6 lg:px-8 py-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Loop through adminActions array -->
                <n-card v-for="action in adminActions" :key="action.title"
                    class="bg-[#262629] hover:border-emerald-400/50 transition-all duration-300 group">
                    <div class="flex flex-col h-full">
                        <div class="w-12 h-12 bg-emerald-400/10 rounded-full flex items-center justify-center mb-4 
                    group-hover:bg-emerald-400/20 transition-all duration-300">
                            <Icon :name="action.icon" class="text-emerald-400 text-xl" />
                        </div>
                        <h3 class="text-xl font-semibold mb-2">{{ action.title }}</h3>
                        <p class="text-gray-400 mb-4 flex-grow">{{ action.description }}</p>
                        <n-button type="primary" color="#4ade80" class="w-full" @click="action.primaryAction">
                            {{ action.primaryButtonContent }}
                        </n-button>
                        <n-button v-if="action.hasSecondary" secondary class="w-full mt-2">
                            {{ action.secondaryButtonButtonContent }}
                        </n-button>
                    </div>
                </n-card>
            </div>
        </div>

        <!-- Analytics Section -->
        <div class="mx-auto  px-6 lg:px-8 py-8">
            <h2
                class="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
                Analytics Overview
            </h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Charts -->
                <n-card class="bg-[#262629] hover:border-emerald-400/50 transition-all duration-300">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold">Monthly Active Users</h3>
                            <n-select v-model:value="timeRange" :options="timeRangeOptions" size="small" />
                        </div>
                    </template>
                    <div class="h-80">
                        <Bar :data="barChartData" :options="barChartOptions" />
                    </div>
                </n-card>

                <n-card class="bg-[#262629] hover:border-emerald-400/50 transition-all duration-300">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold">New Signups Trend</h3>
                            <n-select v-model:value="timeRange" :options="timeRangeOptions" size="small" />
                        </div>
                    </template>
                    <div class="h-80">
                        <Line :data="lineChartData" :options="lineChartOptions" />
                    </div>
                </n-card>

                <n-card class="bg-[#262629] hover:border-emerald-400/50 transition-all duration-300">
                    <template #header>
                        <h3 class="text-lg font-semibold">Session Duration Distribution</h3>
                    </template>
                    <div class="h-80">
                        <Bar :data="histogramData" :options="histogramOptions" />
                    </div>
                </n-card>

                <n-card class="bg-[#262629] hover:border-emerald-400/50 transition-all duration-300">
                    <template #header>
                        <h3 class="text-lg font-semibold">User Device Distribution</h3>
                    </template>
                    <div class="h-80">
                        <Doughnut :data="donutChartData" :options="donutChartOptions" />
                    </div>
                </n-card>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import type { AdminActionCard } from '~/types/admin-action-card.props';
import { ref, computed } from 'vue'
import { Bar, Line, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement } from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement)

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

// Time range selector
const timeRange = ref('7d')
const timeRangeOptions = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' }
]


const adminActions: AdminActionCard[] = [
    {
        title: 'Manage School Applications',
        icon: 'bx:bxs-school',
        primaryButtonContent: 'Manage',
        secondaryButtonButtonContent: 'Load from CSV',
        hasSecondary: false,
        description: 'Setup a new school for enrollment',
        primaryAction: () => navigateTo('/super-admins/school-applications')
    },
    {
        title: 'Manage University Applications',
        icon: 'hugeicons:university',
        primaryButtonContent: 'Add',
        hasSecondary: false,
        description: 'Setup a new university for enrollment'
    },
    {
        title: 'Manage Accounts',
        icon: 'eos-icons:admin',
        primaryButtonContent: 'Add',
        description: 'Create, read update or delete users on the platform',
        hasSecondary: false
    },
]

const createGradient = (ctx: CanvasRenderingContext2D, color: string) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.6)')
    return gradient
}

const barChartData = computed<ChartData<'bar'>>(() => ({
    labels: months,
    datasets: [{
        label: 'Monthly Active Users',
        data: [4000, 3000, 2000, 2780, 1890, 2390, 3490],
        backgroundColor: (context) => {
            const ctx = context.chart.ctx
            return createGradient(ctx, 'rgba(129, 140, 248, 0.8)')
        },
        borderRadius: 8,
    }]
}))

const lineChartData = computed<ChartData<'line'>>(() => ({
    labels: months,
    datasets: [{
        label: 'New Signups',
        data: [2400, 1398, 9800, 3908, 4800, 3800, 4300],
        borderColor: 'rgba(52, 211, 153, 1)',
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        fill: true,
        tension: 0.4,
    }]
}))

const histogramData = computed<ChartData<'bar'>>(() => ({
    labels: ['0-10', '11-20', '21-30', '31-40', '41-50', '51+'],
    datasets: [{
        label: 'Session Duration (minutes)',
        data: [10, 25, 35, 20, 7, 3],
        backgroundColor: (context) => {
            const ctx = context.chart.ctx
            return createGradient(ctx, 'rgba(249, 115, 22, 0.8)')
        },
        borderRadius: 8,
    }]
}))


const donutChartData = computed<ChartData<'doughnut'>>(() => ({
    labels: ['Mobile', 'Desktop', 'Tablet'],
    datasets: [{
        data: [55, 30, 15],
        backgroundColor: [
            'rgba(129, 140, 248, 0.8)',
            'rgba(52, 211, 153, 0.8)',
            'rgba(249, 115, 22, 0.8)',
        ],
        hoverBackgroundColor: [
            'rgba(129, 140, 248, 1)',
            'rgba(52, 211, 153, 1)',
            'rgba(249, 115, 22, 1)',
        ],
    }]
}))


const commonOptions: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'rgba(255, 255, 255, 1)',
            bodyColor: 'rgba(255, 255, 255, 0.8)',
            cornerRadius: 4,
            padding: 10,
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
        },
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(0, 0, 0, 0.1)',
            },
        },
    },
}
const donutChartOptions = ref<ChartOptions<'doughnut'>>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'rgba(255, 255, 255, 1)',
            bodyColor: 'rgba(255, 255, 255, 0.8)',
            cornerRadius: 4,
            padding: 10,
        },
    },
    cutout: '60%',
})
const barChartOptions = ref<ChartOptions<'bar'>>({
    ...commonOptions,
})

const lineChartOptions = ref<ChartOptions<'line'>>({
    ...commonOptions,
})

const histogramOptions = ref<ChartOptions<'bar'>>({
    ...commonOptions,
    scales: {
        ...commonOptions.scales,
        x: {
            ...commonOptions.scales?.x,
            title: {
                display: true,
                text: 'Session Duration (minutes)',
                font: {
                    size: 14,
                    weight: 'bold',
                },
            },
        },
        y: {
            ...commonOptions.scales?.y,
            title: {
                display: true,
                text: 'Number of Users',
                font: {
                    size: 14,
                    weight: 'bold',
                },
            },
        },
    },
})

definePageMeta({
    layout: 'dashboard-layout'
})


</script>
<style scoped></style>