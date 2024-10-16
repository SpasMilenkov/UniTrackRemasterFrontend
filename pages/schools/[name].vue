<template>
    <n-space vertical size="large" class="min-h-screen xl:px-80 px-16 py-4">
        <!-- University Name -->
        <h1 class="text-4xl font-bold text-center mb-4">{{ school.name }}</h1>

        <!-- Image Carousel -->
        <n-carousel autoplay draggable class="mx-auto">
            <img v-for="(image, index) in school.images" :key="index" :src="image"
                class="w-full max-h-[30rem] object-cover rounded-lg">
        </n-carousel>

        <!-- General Info -->
        <n-card class=" mx-auto">
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
        <n-card title="About Us" class="mt-4 mx-auto">
            <p class="text-gray-200">{{ school.description }}</p>
        </n-card>

        <!-- Programs -->
        <n-card title="Featured Programs" class="mt-4 mx-auto">
            <n-list>
                <n-list-item v-for="program in school.programs" :key="program">
                    {{ program }}
                </n-list-item>
            </n-list>
        </n-card>

        <!-- Contact Information -->
        <n-card title="Contact Us" class="mt-4 mx-auto">
            <n-space vertical>
                <n-input-group>
                    <n-input-group-label class="min-w-20">Email</n-input-group-label>
                    <n-input :value="school.email" readonly />
                </n-input-group>
                <n-input-group>
                    <n-input-group-label class="min-w-20">Phone</n-input-group-label>
                    <n-input :value="school.phone" readonly />
                </n-input-group>
                <n-input-group>
                    <n-input-group-label class="min-w-20">Address</n-input-group-label>
                    <n-input :value="school.address" readonly />
                </n-input-group>
            </n-space>
        </n-card>
    </n-space>
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

<style scoped>
/* Add any additional styles here */
</style>