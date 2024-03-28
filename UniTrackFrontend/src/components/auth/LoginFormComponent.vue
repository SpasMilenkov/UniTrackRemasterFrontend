<template>
    <form @submit="onSubmit" class="lg:w-[32rem] overflow-hidden flex flex-col items-center justify-center
             gap-8 p-8 border border-surface-300 dark:border-surface-600 rounded-lg backdrop">


        <h1 class="text-surface-200 text-2xl self-start">Login</h1>
        <div class="flex flex-col items-start justify-start w-full gap-4 flex-wrap">
            <div class="flex flex-col text-surface-200 gap-2 w-full">
                <label for="email">Email</label>
                <InputText name="email" v-model="email" v-bind="emailAttrs" id="email" aria-describedby="email-help" />
                <small v-if="!errors.email" id="email-help">Enter your email</small>
                <p class="text-red-500 text-sm">{{ errors.email }}</p>
            </div>
            <div class="flex flex-col text-surface-200 gap-2 w-full">
                <label for="last-name">Password</label>
                <Password name="password" v-model="password" v-bind="passwordAttrs" id="password"
                    aria-describedby="password-help" />
                <small id="password-help">Enter your password</small>
                <p class="text-red-500 text-sm">{{ errors.password }}</p>
            </div>
            <a class=" text-surface-200 self-start underline" href="#">Forgot your password?</a>
        </div>
        <div class="flex items-center justify-between w-full">
            <Button label="Register" outlined @click="toRegister" />
            <Button label="Login" @click="onSubmit" />
        </div>


    </form>
</template>
<script setup lang='ts'>
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import router from '../../router';

// const email = ref('')
// const password = ref('')


const { handleSubmit, errors, defineField } = useForm({

    validationSchema: yup.object({
        email: yup.string()
            .required('*The email field is required')
            .email('*Enter format is incorrect'),
        password: yup.string()
            .required('*Password is required')
            .min(8, '*Password is too simple, minimum of 8 characters required'),
    })
})

const onSubmit = () => {
    console.log('validation goes here')

    handleSubmit(values => {
        alert(JSON.stringify(values, null, 2));
    })
};
const toRegister = () => {
    router.push('/register')
}
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
</script>
<style scoped></style>