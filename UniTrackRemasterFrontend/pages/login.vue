<template>
    <n-card title="Login" size="large" class="max-w-3xl mx-auto p-4">
        <n-form @submit.prevent="onSubmit">
            <n-space vertical>
                <n-form-item label="Email" v-bind="emailProps" path="email">
                    <n-input v-model:value="email" />
                </n-form-item>
                <n-form-item label="Password" v-bind="passwordProps" path="password">
                    <n-input v-model:value="password" type="password" />
                </n-form-item>
            </n-space>

            <!-- Submit Button -->
            <n-space justify="center">
                <n-button type="primary" attr-type="submit" size="large">Login</n-button>
            </n-space>
        </n-form>
    </n-card>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { NButton, NForm, NInput, NSpace, NCard, NFormItem } from 'naive-ui';
import * as z from 'zod'
import { validatePassword } from '~/utils/password.util';

const zodSchema = z.object({
    email: z.string().email(),
    password: z.string().min(10, { message: 'The password cannot be less than 10 characters long' }).refine((pass) => {
        return validatePassword(pass)
    }, { message: 'Password must contain at least one upper case letter, one lower case letter, one number and one special character' }),
})


// Form Handling
const { handleSubmit, defineField } = useForm({
    validationSchema: toTypedSchema(zodSchema),
});

// Correct destructuring for each field
const [email, emailProps] = defineField('email', naiveUiFormsConfig);
const [password, passwordProps] = defineField('password', naiveUiFormsConfig);

// Submit Handler
const onSubmit = handleSubmit((values) => {
    console.log('Form Submitted:', values);
}) 
</script>

<style scoped>
/* You can add any additional custom styles here if needed */
</style>
