<template>
    <form action="" class="lg:w-[32rem] overflow-hidden flex flex-col items-center justify-center
             gap-8 p-8 border border-surface-300 dark:border-surface-600 rounded-lg backdrop">


        <h1 class="text-surface-200 text-2xl self-start">Login</h1>
        <div class="flex flex-col items-start justify-start w-full gap-4 flex-wrap">
            <div class="flex flex-col text-surface-200 gap-2 w-full">
                <label for="email">Email</label>
                <InputText v-model="email" id="email" aria-describedby="email-help" />
                <small id="email-help">Enter your email</small>
            </div>
            <div class="flex flex-col text-surface-200 gap-2 w-full">
                <label for="last-name">Password</label>
                <Password v-model="password" id="password" aria-describedby="password-help" />
                <small id="password-help">Enter your password</small>
            </div>
            <a class=" text-surface-200 self-start" href="#">Forgot your password?</a>
        </div>
        <div class="flex items-center justify-between w-full">
            <Button label="Register" outlined />
            <Button label="Login" />
        </div>


    </form>
</template>
<script setup lang='ts'>
import { ref } from 'vue'
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

// import { useForm } from 'vee-validate';
// import * as yup from 'yup';

const email = ref('')
const password = ref('')
</script>
<style scoped></style>