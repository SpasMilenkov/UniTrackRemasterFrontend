<template>
    <div class="p-8 bg-[url('/img/blue-blobs.svg')] bg-no-repeat bg-cover">
        <n-card size="large" class="max-w-xl mx-auto p-4 flex">
            <h1 class="md:px-0 text-center text-3xl">Register</h1>
            <n-form @submit.prevent="onSubmit">
                <!-- Personal Information Section -->
                <n-divider>Personal Information</n-divider>
                <n-space vertical>
                    <n-form-item label="First Name" v-bind="firstNameProps" path="firstName">
                        <n-input v-model:value="firstName" />
                    </n-form-item>
                    <n-form-item label="Last Name" v-bind="lastNameProps" path="lastName">
                        <n-input v-model:value="lastName" />
                    </n-form-item>
                </n-space>

                <!-- Contact Information Section -->
                <n-divider>Contact Information</n-divider>
                <n-space vertical>
                    <n-form-item label="Email" v-bind="emailProps" path="email">
                        <n-input v-model:value="email" />
                    </n-form-item>
                    <n-form-item label="Phone Number" v-bind="phoneNumberProps" path="phoneNumber">
                        <n-input v-model:value="phoneNumber" />
                    </n-form-item>
                </n-space>

                <!-- Password Section -->
                <n-divider>Password</n-divider>
                <n-space vertical>
                    <n-form-item label="Password" v-bind="passwordProps" path="password">
                        <n-input v-model:value="password" type="password" />
                    </n-form-item>
                    <n-form-item label="Confirm Password" v-bind="confirmPasswordProps" path="confirmPassword">
                        <n-input v-model:value="confirmPassword" type="password" />
                    </n-form-item>
                </n-space>

                <!-- Organization Information Section -->
                <n-divider>Organization Information</n-divider>
                <n-space vertical>
                    <n-form-item label="Organization" v-bind="orgIdProps" path="orgId">
                        <n-select v-model:value="orgId" :options="schools" />
                    </n-form-item>
                    <n-form-item label="Organization Role" v-bind="orgRoleProps" path="orgRole">
                        <n-select v-model:value="orgRole" :options="orgRoles" />
                    </n-form-item>
                </n-space>

                <!-- Submit Button -->
                <n-space justify="center">
                    <n-button type="primary" attr-type="submit" size="large">Register</n-button>
                </n-space>
            </n-form>
        </n-card>
    </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { NButton, NForm, NInput, NSelect, NDivider, NSpace, NCard, NFormItem, type SelectOption } from 'naive-ui';
import { naiveUiFormsConfig } from '~/utils/naive-ui-forms.config';
import { registerSchema } from '~/schemas/register.schema';

// Store
const authStore = useAuthStore()
const schoolStore = useSchoolStore()
// Variables
const orgRoles: Ref<SelectOption[] | undefined> = ref()
const schools: Ref<SelectOption[] | undefined> = ref()

// Form Handling
const { handleSubmit, defineField, setFieldValue } = useForm({
    validationSchema: toTypedSchema(registerSchema),
})

// Form fields
const [firstName, firstNameProps] = defineField('firstName', naiveUiFormsConfig);
const [lastName, lastNameProps] = defineField('lastName', naiveUiFormsConfig);
const [email, emailProps] = defineField('email', naiveUiFormsConfig);
const [phoneNumber, phoneNumberProps] = defineField('phoneNumber', naiveUiFormsConfig);
const [password, passwordProps] = defineField('password', naiveUiFormsConfig);
const [confirmPassword, confirmPasswordProps] = defineField('confirmPassword', naiveUiFormsConfig);
const [orgId, orgIdProps] = defineField('orgId', naiveUiFormsConfig);
const [orgRole, orgRoleProps] = defineField('orgRole', naiveUiFormsConfig);
//Placeholder because the backend currently accepts schools only
setFieldValue('orgType', 0)
// const [orgType, orgTypeProps] = defineField('orgType', naiveUiFormsConfig);
//Methods
const onSubmit = handleSubmit((values) => {

    console.log(values)
    authStore.register(values)
});

// Lifecycle
onMounted(async () => {
    await authStore.getRoles()
    await schoolStore.getSchools()
    orgRoles.value = authStore.roles?.map(r => ({ label: r.name, value: r.id }))
    schools.value = schoolStore.schools?.map(s => ({ label: s.name, value: s.id }))
})
</script>
