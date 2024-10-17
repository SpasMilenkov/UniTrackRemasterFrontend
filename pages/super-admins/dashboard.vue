<template>
    <n-space vertical :size="12" class="min-h-screen md:px-6 px-2 py-4">
        <h1 class="md:px-0 text-3xl text-center lg:text-left">Good evening, Mihail's super admin</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 py-8 px-8 md:px-0">
            <AdminActionCardComponent v-for="(action, i) in adminActions" :key="i" :data="action" />
        </div>
        <div>
            <h1 class="md:px-0 text-3xl text-center lg:text-left">Analytics</h1>
            <n-divider />
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
            <div class="bg-white rounded-lg shadow-lg p-6 max-h-[30rem] max-w-4xl">
                <h2 class="text-2xl font-semibold mb-4 text-gray-700">Monthly Active Users</h2>
                <Bar :data="barChartData" :options="barChartOptions" class="h-80" />
            </div>
            <div class="bg-white rounded-lg shadow-lg p-6 max-h-[30rem] max-w-4xl">
                <h2 class="text-2xl font-semibold mb-4 text-gray-700">New Signups Trend</h2>
                <Line :data="lineChartData" :options="lineChartOptions" class="h-80" />
            </div>
            <div class="bg-white rounded-lg shadow-lg p-6 max-h-[30rem] max-w-4xl">
                <h2 class="text-2xl font-semibold mb-4 text-gray-700">Session Duration Distribution</h2>
                <Bar :data="histogramData" :options="histogramOptions" class="h-80" />
            </div>
            <div class="bg-white rounded-lg shadow-lg p-6 max-h-[30rem] max-w-4xl">
                <h2 class="text-2xl font-semibold mb-4 text-gray-700">User Device Distribution</h2>
                <Doughnut :data="donutChartData" :options="donutChartOptions" class="h-80" />
            </div>
        </div>
    </n-space>
</template>

<script setup lang='ts'>
import type { AdminActionCard } from '~/types/adminActionCard';
import { ref, computed } from 'vue'
import { Bar, Line, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement } from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement)

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

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

const adminActions: AdminActionCard[] = [
    {
        title: 'Add School',
        icon: 'bx:bxs-school',
        primaryButtonContent: 'Add',
        secondaryButtonButtonContent: 'Load from CSV',
        hasSecondary: false,
        description: 'Setup a new school for enrollment'
    },
    {
        title: 'Add University',
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

</script>
<style scoped></style>