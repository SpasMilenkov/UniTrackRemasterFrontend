<template>
    <div class="min-h-screen bg-[#101014] text-white relative">
        <!-- Background decorations -->
        <div class="fixed inset-0 z-0">
            <div
                class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500 rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2" />
        </div>

        <!-- Content wrapper -->
        <n-space vertical size="large" class="relative z-10 xl:px-80 px-16 py-8">
            <!-- University Name -->
            <h1
                class="text-4xl font-bold text-center bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
                {{ school.name }}
            </h1>

            <!-- Image Carousel -->
            <n-carousel autoplay draggable class="mx-auto rounded-xl overflow-hidden border border-gray-700/50">
                <img v-for="(image, index) in school.images" :key="index" :src="image"
                    class="w-full max-h-[30rem] object-cover">
            </n-carousel>

            <!-- General Info -->
            <n-card class="mx-auto bg-[#18181c]/80 backdrop-blur-sm border-gray-700/50">
                <n-descriptions bordered>
                    <n-descriptions-item label="Location">
                        {{ school.location }}
                    </n-descriptions-item>
                    <n-descriptions-item label="Founded">
                        {{ school.founded }}
                    </n-descriptions-item>
                    <n-descriptions-item label="Type">
                        {{ school.type }}
                    </n-descriptions-item>
                    <n-descriptions-item label="Student Body">
                        {{ school.studentCount }}
                    </n-descriptions-item>
                </n-descriptions>
            </n-card>

            <!-- Description -->
            <n-card title="About Us"
                class="mx-auto bg-[#18181c]/80 backdrop-blur-sm border-gray-700/50 hover:border-emerald-400/50 transition-all duration-300"
                header-style="color: rgb(74 222 128);">
                <p class="text-gray-300">{{ school.description }}</p>
            </n-card>

            <!-- Programs -->
            <n-card title="Featured Programs"
                class="mx-auto bg-[#18181c]/80 backdrop-blur-sm border-gray-700/50 hover:border-emerald-400/50 transition-all duration-300"
                header-style="color: rgb(74 222 128);">
                <n-list class="bg-transparent">
                    <n-list-item v-for="program in school.programs" :key="program" class="text-gray-300">
                        <template #prefix>
                            <Icon name="ph:graduation-cap" class="text-emerald-400 mr-2" />
                        </template>
                        {{ program }}
                    </n-list-item>
                </n-list>
            </n-card>

            <!-- Contact Information -->
            <n-card title="Contact Us"
                class="mx-auto bg-[#18181c]/80 backdrop-blur-sm border-gray-700/50 hover:border-emerald-400/50 transition-all duration-300"
                header-style="color: rgb(74 222 128);">
                <n-space vertical>
                    <n-input-group>
                        <n-input-group-label class="min-w-20 bg-[#18181c] text-gray-300 border-gray-700">
                            Email
                        </n-input-group-label>
                        <n-input :value="school.email" readonly class="bg-[#18181c] text-gray-300" />
                    </n-input-group>
                    <n-input-group>
                        <n-input-group-label class="min-w-20 bg-[#18181c] text-gray-300 border-gray-700">
                            Phone
                        </n-input-group-label>
                        <n-input :value="school.phone" readonly class="bg-[#18181c] text-gray-300" />
                    </n-input-group>
                    <n-input-group>
                        <n-input-group-label class="min-w-20 bg-[#18181c] text-gray-300 border-gray-700">
                            Address
                        </n-input-group-label>
                        <n-input :value="school.address" readonly class="bg-[#18181c] text-gray-300" />
                    </n-input-group>
                </n-space>
            </n-card>
        </n-space>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const school = ref({
    name: "Greenfield University",
    images: [
        "https://mdl.fcst.tu-sofia.bg/pluginfile.php/1/theme_academi/slide1image/1725901354/TUS.jpg",
        "https://static.bnr.bg/gallery/cr/e40a9905def26d177d85a0f3a9fc8723.JPG",
        "https://photos.wikimapia.org/p/00/02/33/88/81_full.jpeg"
    ],
    location: "Greenfield, CA",
    founded: "1965",
    type: "Public Research University",
    studentCount: "25,000+",
    description: "Greenfield University is a leading institution dedicated to academic excellence, innovative research, and community engagement. Our diverse campus fosters a vibrant learning environment where students are encouraged to explore, create, and grow.",
    programs: [
        "Computer Science",
        "Environmental Studies",
        "Business Administration",
        "Biomedical Engineering",
        "Psychology"
    ],
    email: "info@greenfield.edu",
    phone: "(555) 123-4567",
    address: "1234 University Ave, Greenfield, CA 90210"
})
</script>