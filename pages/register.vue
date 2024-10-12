<template>
    <div class="p-8">
        <n-card title="Register" size="large" class="max-w-xl mx-auto p-4 flex">
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
                    <n-form-item label="Organization Type" v-bind="orgTypeProps" path="orgType">
                        <n-select v-model="orgType" :options="orgTypes" />
                    </n-form-item>
                    <n-form-item label="Organization ID" v-bind="orgIdProps" path="orgId">
                        <n-input v-model:value="orgId" />
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
import { NButton, NForm, NInput, NSelect, NDivider, NSpace, NCard, NFormItem } from 'naive-ui';
import { naiveUiFormsConfig } from '~/utils/naive-ui-forms.config';
import * as z from 'zod';
import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { validatePassword } from '~/utils/password.util';

// Variables
const orgTypes = [
    { label: 'Corporation', value: 'corporation' },
    { label: 'Non-Profit', value: 'non-profit' },
    { label: 'Government', value: 'government' },
];

const orgRoles = [
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
    { label: 'Manager', value: 'manager' },
];

// Form Schema
const zodSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string().refine((number) => {
        return isPossiblePhoneNumber(number, 'BG')
    }, { message: 'Invalid phone number format' }),
    password: z.string().min(10, { message: 'The password cannot be less than 10 characters long' }).refine((pass) => {
        return validatePassword(pass)
    }, { message: 'Password must contain at least one upper case letter, one lower case letter, one number and one special character' }),
    confirmPassword: z.string().min(10, { message: 'The password cannot be less than 10 characters long' }).refine((pass) => {

        return validatePassword(pass)
    }, { message: 'Password must contain at least one upper case letter, one lower case letter, one number and one special character' }),
    orgType: z.string(),
    orgId: z.string(),
    orgRole: z.string()
}).refine((ctx) => {
    return ctx.password === ctx.confirmPassword
}, { message: "Password should match confirm Password", path: ["confirmPassword"] })


// Form Handling
const { handleSubmit, defineField } = useForm({
    validationSchema: toTypedSchema(zodSchema),
})

// Form fields
const [firstName, firstNameProps] = defineField('firstName', naiveUiFormsConfig);
const [lastName, lastNameProps] = defineField('lastName', naiveUiFormsConfig);
const [email, emailProps] = defineField('email', naiveUiFormsConfig);
const [phoneNumber, phoneNumberProps] = defineField('phoneNumber', naiveUiFormsConfig);
const [password, passwordProps] = defineField('password', naiveUiFormsConfig);
const [confirmPassword, confirmPasswordProps] = defineField('confirmPassword', naiveUiFormsConfig);
const [orgType, orgTypeProps] = defineField('orgType', naiveUiFormsConfig);
const [orgId, orgIdProps] = defineField('orgId', naiveUiFormsConfig);
const [orgRole, orgRoleProps] = defineField('orgRole', naiveUiFormsConfig);


//Methods
const onSubmit = handleSubmit((values) => {
    console.log('Form Submitted:', values);
});
</script>
