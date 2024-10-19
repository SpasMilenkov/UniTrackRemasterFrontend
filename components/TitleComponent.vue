<template>
    <h1 class="md:px-0 text-center lg:text-left" :class="{
        'text-3xl': size === 'large',
        'text-2xl': size === 'medium',
        'text-xl': size === 'small'
    }">{{ title }}</h1>
</template>
<script setup lang='ts'>
defineProps(
    {
        title: {
            type: String,
            required: true
        },
        size: {
            type: String as () => 'large' | 'medium' | 'small',
            default: () => 'large'
        }
    }
)
</script>
<style scoped></style>