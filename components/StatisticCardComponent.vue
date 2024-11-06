<template>
    <div
        class="group relative overflow-hidden rounded-xl border border-gray-700 bg-[#262629] px-6 py-8 transition-all duration-300 hover:border-emerald-400/50">
        <!-- Background decoration -->
        <div class="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div class="absolute -left-1/4 -top-1/4 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
            <div class="absolute -bottom-1/4 -right-1/4 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />
        </div>

        <div class="flex flex-col items-center justify-center">
            <!-- Icon container with animated background -->
            <div
                class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 transition-all duration-300 group-hover:bg-emerald-400/20">
                <Icon :name="icon" :size="iconSize || 32"
                    class="text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
            </div>

            <!-- Label with gradient text -->
            <h2
                class="mb-2 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-lg font-semibold text-transparent">
                {{ label }}
            </h2>

            <!-- Value display -->
            <div
                class="flex items-baseline text-4xl font-bold text-white transition-all duration-300 group-hover:text-emerald-400">
                <span class="mr-1">{{ value }}</span>
                <span v-if="suffix" class="text-lg text-gray-400">{{ suffix }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface StatisticCardProps {
    icon: string;
    label: string;
    value: number | string;
    suffix?: string;
    iconSize?: number;
}

defineProps<StatisticCardProps>();
</script>