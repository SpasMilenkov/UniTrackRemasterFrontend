<template>
    <div class="flex flex-col items-center content-center p-4 gap-4">
        <LoginForm />
        <RegisterFormComponent />
    </div>
</template>
<script setup lang='ts'>
import RegisterFormComponent from '../../components/RegisterFormComponent.vue';
import LoginForm from '../../components/LoginFormComponent.vue';
</script>
<style scoped></style>