<template>
    <div id="router-content"
        class="dark:bg-gray-900 min-h-screen min-w-screen flex flex-col items-center justify-center">
        <LoginForm></LoginForm>
    </div>
</template>
<script setup lang='ts'>
import LoginForm from '../../components/auth/LoginFormComponent.vue';
</script>
<style scoped></style>