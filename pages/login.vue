<template>
    <div
        class="min-h-screen flex items-center justify-center bg-[url('/img/green-blobs.svg')] bg-no-repeat bg-cover relative">
        <!-- Dark overlay for background image -->
        <div class="absolute inset-0 bg-black opacity-50" />

        <!-- Login Card -->
        <n-card size="huge"
            class="max-w-xl mx-auto p-6 bg-[#18181c] border border-gray-700 shadow-2xl relative z-10 rounded-xl">
            <!-- Gradient Divider -->
            <n-divider>
                <h2
                    class="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
                    Login
                </h2>
            </n-divider>

            <!-- Form -->
            <n-form class="sm:min-w-72 mt-6" @submit.prevent="onSubmit">
                <n-space vertical>
                    <!-- Email Field -->
                    <n-form-item label="Email" v-bind="emailProps" path="email"
                        label-style="text-gray-300 font-semibold">
                        <n-input v-model:value="email" class="bg-[#262629] text-white placeholder-gray-500" />
                    </n-form-item>

                    <!-- Password Field -->
                    <n-form-item label="Password" v-bind="passwordProps" path="password"
                        label-style="text-gray-300 font-semibold">
                        <n-input v-model:value="password" type="password"
                            class="bg-[#262629] text-white placeholder-gray-500" />
                    </n-form-item>
                </n-space>

                <!-- Login Button -->
                <n-space justify="center" class="mt-6">
                    <n-button n-button type="primary" attr-type="submit" color="#4ade80" class=" px-8 py-3">
                        Login
                    </n-button>
                </n-space>
            </n-form>
        </n-card>
    </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { NButton, NForm, NInput, NSpace, NCard, NFormItem, NDivider } from 'naive-ui'
import { loginSchema } from '~/schemas/login.schema'
import { useAuthStore } from '@/stores/auth'

// Stores
const authStore = useAuthStore()

// Form Handling
const { handleSubmit, defineField } = useForm({
    validationSchema: toTypedSchema(loginSchema),
})

// Correct destructuring for each field
const [email, emailProps] = defineField('email', naiveUiFormsConfig)
const [password, passwordProps] = defineField('password', naiveUiFormsConfig)

// Submit Handler
const onSubmit = handleSubmit((values) => {
    console.log(values)
    authStore.login(values)
})
</script>

<style scoped>
/* Scoped styles to enhance the card and form fields */
.bg-cover {
    position: relative;
    z-index: 0;
}

.bg-cover::after {
    content: "";
    background: rgba(0, 0, 0, 0.4);
}
</style>