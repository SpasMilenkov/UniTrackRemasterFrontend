<template>
    <div class="flex flex-col">
        <Hero></Hero>
        <div
            class=" flex items-center justify-evenly flex-wrap bg-surface-0 dark:bg-surface-900 w-full min-h-[30rem] gap-8 p-8">
            <FeatureCard v-for="(card, i) in cards" :key="i" :content="card"></FeatureCard>
        </div>
    </div>
</template>
<script setup lang='ts'>
import Hero from '../../components/landing/HeroComponent.vue'
import FeatureCard from '../../components/landing/FeatureCardComponent.vue';
import FeatureCardInterface from '../../interfaces/FeatureCard';

const cards: FeatureCardInterface[] = [
    {
        icon: 'bx:brain',
        iconWidth: 100,
        cardTitle: 'Lipsum',
        cardText: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
    },
    {
        icon: 'material-symbols:school-outline',
        iconWidth: 100,
        cardTitle: 'Lipsum',
        cardText: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
    }, 
    {
        icon: 'ic:round-list',
        iconWidth: 100,
        cardTitle: 'Lipsum',
        cardText: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
    }, 
    {
        icon: 'teenyicons:pdf-outline',
        iconWidth: 100,
        cardTitle: 'Lipsum',
        cardText: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
    },
    {
        icon: 'clarity:organization-line',
        iconWidth: 100,
        cardTitle: 'Lipsum',
        cardText: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
    },
    {
        icon: 'material-symbols:globe',
        iconWidth: 100,
        cardTitle: 'Lipsum',
        cardText: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
    },
]

</script>
<style scoped></style>