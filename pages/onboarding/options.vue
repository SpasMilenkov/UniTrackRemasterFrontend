<template>
    <div class="min-h-screen bg-[#101014] text-white relative">
        <!-- Full-page background decorations -->
        <div class="fixed inset-0 z-0">
            <div
                class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500 rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2" />
            <div
                class="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-blue-500 rounded-full filter blur-3xl opacity-5 transform translate-x-1/2" />
            <div
                class="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-emerald-500 rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2" />
        </div>

        <!-- Content wrapper -->
        <div class="relative z-10">
            <!-- Header Section -->
            <div class="py-16">
                <div class="mx-auto max-w-7xl px-6 lg:px-8">
                    <div class="mx-auto max-w-3xl text-center">
                        <h1
                            class="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text mb-6">
                            {{ showSchoolOptions ? 'School Integration Options' : 'Choose Your Institution Type' }}
                        </h1>
                        <p class="text-gray-400 max-w-2xl mx-auto">
                            {{ showSchoolOptions ? `Start a new integration application or check the status of an
                            existing one` : `Select the type of educational institution you want to integrate with
                            UniTrack` }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Cards Section -->
            <div class="py-12">
                <div class="mx-auto max-w-7xl px-6 lg:px-8">
                    <div class="grid md:grid-cols-2 gap-8">
                        <!-- Institution Type Selection Cards -->
                        <template v-if="!showSchoolOptions">
                            <!-- School Card -->
                            <div
                                class="bg-[#18181c]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 group hover:border-emerald-400/50 transition-all duration-300">
                                <div class="flex flex-col h-full">
                                    <!-- Icon -->
                                    <div class="mb-6">
                                        <div
                                            class="w-16 h-16 bg-emerald-400/10 rounded-full flex items-center justify-center group-hover:bg-emerald-400/20 transition-all duration-300">
                                            <Icon name="ph:book-open-bold" class="text-emerald-400 text-3xl" />
                                        </div>
                                    </div>

                                    <!-- Title -->
                                    <h2
                                        class="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
                                        K-12 School Integration
                                    </h2>

                                    <!-- Description -->
                                    <p class="text-gray-400 mb-6 flex-grow">
                                        Transform your school's administrative processes with a comprehensive solution
                                        designed
                                        specifically for K-12 education management.
                                    </p>

                                    <!-- Features List -->
                                    <ul class="space-y-3 mb-8">
                                        <li class="flex items-center text-gray-300">
                                            <Icon name="ph:check-circle-fill" class="text-emerald-400 mr-2" />
                                            Grade-specific curriculum management
                                        </li>
                                        <li class="flex items-center text-gray-300">
                                            <Icon name="ph:check-circle-fill" class="text-emerald-400 mr-2" />
                                            Parent-teacher communication tools
                                        </li>
                                        <li class="flex items-center text-gray-300">
                                            <Icon name="ph:check-circle-fill" class="text-emerald-400 mr-2" />
                                            Attendance and behavior tracking
                                        </li>
                                    </ul>

                                    <!-- Button -->
                                    <n-button type="primary" color="#4ade80" class="text-lg w-full"
                                        @click="showSchoolOptions = true">
                                        Start School Integration
                                        <template #icon>
                                            <Icon name="ph:arrow-right-bold" />
                                        </template>
                                    </n-button>
                                </div>
                            </div>

                            <!-- Higher Education Card -->
                            <div
                                class="bg-[#18181c]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 group hover:border-emerald-400/50 transition-all duration-300">
                                <div class="flex flex-col h-full">
                                    <!-- Icon -->
                                    <div class="mb-6">
                                        <div
                                            class="w-16 h-16 bg-emerald-400/10 rounded-full flex items-center justify-center group-hover:bg-emerald-400/20 transition-all duration-300">
                                            <Icon name="ph:graduation-cap-bold" class="text-emerald-400 text-3xl" />
                                        </div>
                                    </div>

                                    <!-- Title -->
                                    <h2
                                        class="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
                                        Higher Education Integration
                                    </h2>

                                    <!-- Description -->
                                    <p class="text-gray-400 mb-6 flex-grow">
                                        Elevate your college or university's educational management with our
                                        comprehensive
                                        platform designed for higher education institutions.
                                    </p>

                                    <!-- Features List -->
                                    <ul class="space-y-3 mb-8">
                                        <li class="flex items-center text-gray-300">
                                            <Icon name="ph:check-circle-fill" class="text-emerald-400 mr-2" />
                                            Course credit management
                                        </li>
                                        <li class="flex items-center text-gray-300">
                                            <Icon name="ph:check-circle-fill" class="text-emerald-400 mr-2" />
                                            Research program support
                                        </li>
                                        <li class="flex items-center text-gray-300">
                                            <Icon name="ph:check-circle-fill" class="text-emerald-400 mr-2" />
                                            Faculty collaboration tools
                                        </li>
                                    </ul>

                                    <!-- Button -->
                                    <n-button type="primary" color="#4ade80" class="text-lg w-full"
                                        @click="navigateTo('/onboarding/university')">
                                        Start Higher Ed Integration
                                        <template #icon>
                                            <Icon name="ph:arrow-right-bold" />
                                        </template>
                                    </n-button>
                                </div>
                            </div>
                        </template>

                        <!-- School Application Options -->
                        <template v-else>
                            <!-- New Application Card -->
                            <div
                                class="bg-[#18181c]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 group hover:border-emerald-400/50 transition-all duration-300">
                                <div class="flex flex-col h-full">
                                    <!-- Icon -->
                                    <div class="mb-6">
                                        <div
                                            class="w-16 h-16 bg-emerald-400/10 rounded-full flex items-center justify-center group-hover:bg-emerald-400/20 transition-all duration-300">
                                            <Icon name="ph:plus-circle-bold" class="text-emerald-400 text-3xl" />
                                        </div>
                                    </div>

                                    <!-- Title -->
                                    <h2
                                        class="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
                                        Start New Application
                                    </h2>

                                    <!-- Description -->
                                    <p class="text-gray-400 mb-6 flex-grow">
                                        Begin your journey to transform your school's administrative processes with
                                        UniTrack's
                                        comprehensive integration solution.
                                    </p>

                                    <!-- Features List -->
                                    <ul class="space-y-3 mb-8">
                                        <li class="flex items-center text-gray-300">
                                            <Icon name="ph:check-circle-fill" class="text-emerald-400 mr-2" />
                                            Step-by-step guided setup
                                        </li>
                                        <li class="flex items-center text-gray-300">
                                            <Icon name="ph:check-circle-fill" class="text-emerald-400 mr-2" />
                                            Customizable integration options
                                        </li>
                                        <li class="flex items-center text-gray-300">
                                            <Icon name="ph:check-circle-fill" class="text-emerald-400 mr-2" />
                                            24/7 support during setup
                                        </li>
                                    </ul>

                                    <!-- Button -->
                                    <n-button type="primary" color="#4ade80" class="text-lg w-full"
                                        @click="navigateTo('/onboarding/school')">
                                        Start Integration Process
                                        <template #icon>
                                            <Icon name="ph:arrow-right-bold" />
                                        </template>
                                    </n-button>
                                </div>
                            </div>

                            <!-- Check Progress Card -->
                            <div
                                class="bg-[#18181c]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 group hover:border-emerald-400/50 transition-all duration-300">
                                <div class="flex flex-col h-full">
                                    <!-- Icon -->
                                    <div class="mb-6">
                                        <div
                                            class="w-16 h-16 bg-emerald-400/10 rounded-full flex items-center justify-center group-hover:bg-emerald-400/20 transition-all duration-300">
                                            <Icon name="ph:clock-bold" class="text-emerald-400 text-3xl" />
                                        </div>
                                    </div>

                                    <!-- Title -->
                                    <h2
                                        class="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
                                        Check Application Status
                                    </h2>

                                    <!-- Description -->
                                    <p class="text-gray-400 mb-6 flex-grow">
                                        Already started your integration process? Track your application status and
                                        continue where
                                        you left off.
                                    </p>

                                    <!-- Features List -->
                                    <ul class="space-y-3 mb-8">
                                        <li class="flex items-center text-gray-300">
                                            <Icon name="ph:check-circle-fill" class="text-emerald-400 mr-2" />
                                            Real-time status updates
                                        </li>
                                        <li class="flex items-center text-gray-300">
                                            <Icon name="ph:check-circle-fill" class="text-emerald-400 mr-2" />
                                            Application timeline view
                                        </li>
                                        <li class="flex items-center text-gray-300">
                                            <Icon name="ph:check-circle-fill" class="text-emerald-400 mr-2" />
                                            Direct support access
                                        </li>
                                    </ul>

                                    <!-- Button -->
                                    <n-button type="primary" color="#4ade80" class="text-lg w-full"
                                        @click="navigateTo('/onboarding/auth')">
                                        Check Application Status
                                        <template #icon>
                                            <Icon name="ph:arrow-right-bold" />
                                        </template>
                                    </n-button>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <!-- Back Button (only shown when viewing school options) -->
            <div v-if="showSchoolOptions" class="text-center mt-8">
                <n-button class="text-gray-400" @click="showSchoolOptions = false">
                    <template #icon>
                        <Icon name="ph:arrow-left-bold" />
                    </template>
                    Back to Institution Selection
                </n-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const showSchoolOptions = ref(false);
</script>

<style scoped></style>