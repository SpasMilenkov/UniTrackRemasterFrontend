<template>
    <form @submit="onSubmit">
        <div class="lg:w-[40rem] overflow-hidden flex flex-col items-center justify-center
             gap-8 p-4 border border-surface-300 dark:border-surface-600 rounded-lg backdrop" v-if="activePage === 1">

            <h1 class=" text-surface-200 text-2xl self-start px-8">Register</h1>
            <div
                class="flex flex-col items-center justify-center border border-surface-300 dark:border-surface-600 w-11/12 p-4 rounded-lg gap-4">
                <h2 class="text-surface-200 self-start text-lg">Personal information</h2>

                <div class="flex items-center justify-start w-full gap-4 flex-wrap">
                    <div class="flex flex-col text-surface-200 gap-2 max-lg:w-full">
                        <label for="first-name">First name</label>
                        <InputText v-model="firstName" v-bind="firstNameAttrs" id="first-name"
                            aria-describedby="first-name-help" />
                        <small id="first-name-help">Enter your first name.</small>
                        <pre>{{ errors.firstName }}</pre>
                    </div>
                    <div class="flex flex-col text-surface-200 gap-2 max-lg:w-full">
                        <label for="last-name">Last name</label>
                        <InputText v-model="lastName" v-bind="lastNameAttrs" id="last-name"
                            aria-describedby="username-help" />
                        <small id="last-name-help">Enter your last name</small>
                    </div>

                </div>
                <div class="flex items-center justify-start w-full gap-4 flex-wrap">
                    <div class="flex flex-col text-surface-200 gap-2 max-lg:w-full">
                        <label for="email">Email</label>
                        <InputText v-model="email" v-bind="emailAttrs" type="email" id="first-name"
                            aria-describedby="email-help" />
                        <small id="email-help">Enter your email.</small>
                    </div>
                    <div class="flex flex-col text-surface-200 gap-2 max-lg:w-full">
                        <label for="phone-number">Phone number</label>
                        <InputNumber v-model="phoneNumber" v-bind="phoneNumberAttrs" id="phone-number"
                            aria-describedby="phone-number-help" />
                        <small id="phone-number-help">Enter your phone number</small>
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-center justify-center border border-surface-300 dark:border-surface-600
                 w-11/12 p-4 rounded-lg gap-4">
                <h2 class="text-surface-200 self-start text-lg">Password</h2>
                <div class="flex items-center justify-start w-full gap-4 flex-wrap">
                    <div class="flex flex-col text-surface-200 gap-2 max-lg:w-full">
                        <label for="password">Password</label>
                        <InputPassword v-model="password" v-bind="passwordAttrs" id="password"
                            aria-describedby="password-help" toggleMask />
                        <small id="password-help">Enter your password</small>
                    </div>
                    <div class="flex flex-col text-surface-200 gap-2 max-lg:w-full">
                        <label for="username">Confirm password</label>
                        <InputPassword v-model="confirmedPassword" v-bind="confirmedPasswordAttrs" id="confirm-password"
                            aria-describedby="confirm-password-help" toggleMask />
                        <small id="confirm-password-help">Confirm your password</small>
                    </div>
                </div>

            </div>
            <div class="flex flex-row-reverse items-center justify-between w-full px-8">
                <!-- <Button label="Previous" /> -->
                <Button label="Next" @click="navigate(2)" />
            </div>
        </div>
        <div class=" lg:w-[40rem] overflow-hidden flex flex-col items-center justify-center
             gap-8 p-4 border border-surface-300 dark:border-surface-600 rounded-lg backdrop" v-if="activePage === 2">

            <h1 class=" text-surface-200 text-2xl self-start px-8">Register-2</h1>
            <div
                class="flex flex-col items-center justify-center border border-surface-300 dark:border-surface-600 w-11/12 p-4 rounded-lg gap-4">
                <h2 class="text-surface-200 self-start text-lg">Academical information</h2>

                <div class="flex items-center justify-start w-full gap-4 flex-wrap">
                    <div class="flex flex-col text-surface-200 gap-2 w-full">
                        <label for="organization">Organization type</label>
                        <Dropdown v-model="orgType" v-bind="orgTypeAttrs" id="organization"
                            aria-describedby="organization-help" />
                        <small id="organization-help">Select the type of organization you are attending</small>
                    </div>
                    <div class="flex flex-col text-surface-200 gap-2 w-full">
                        <label for="organization-name">Organization name</label>
                        <InputText v-model="orgName" v-bind="orgNameAttrs" id="organization-name"
                            aria-describedby="organization-help" />
                        <small id="organization-name-help">Enter the organization name</small>
                    </div>

                </div>
                <div class="flex items-center justify-start w-full gap-4 flex-wrap">
                    <div class="flex flex-col text-surface-200 gap-2 w-full">
                        <label for="role">Role</label>
                        <Dropdown v-model="orgRole" v-bind="orgRoleAttrs" id="role" aria-describedby="role-help" />
                        <small id="role-help">Enter your position in the organization.</small>
                    </div>

                </div>
            </div>

            <div class="flex items-center justify-between w-full px-8">
                <Button label="Previous" @click="navigate(1)" />
                <Button label="Next" @click="navigate(3)" />
            </div>
        </div>
        <div class=" lg:w-[40rem] overflow-hidden flex flex-col items-center justify-center
             gap-8 p-4 border border-surface-300 dark:border-surface-600 rounded-lg backdrop" v-if="activePage === 3">

            <h1 class=" text-surface-200 text-2xl self-start px-8">Information Preview</h1>
            <div
                class="flex flex-col items-center justify-center border border-surface-300 dark:border-surface-600 w-11/12 p-4 rounded-lg gap-4">
                <h2 class="text-surface-200 self-start text-lg">Account information</h2>
                <div class="flex flex-col items-start justify-center text-surface-200 w-full gap-4 text-base">
                    <h2>First name: {{ firstName }}</h2>
                    <h2>Last name: {{ lastName }}</h2>

                    <h2>Phone number: {{ phoneNumber }}</h2>
                    <h2>Organization type: {{ orgType }}</h2>
                    <h2>Organization name: {{ orgName }}</h2>
                    <h2>Role: {{ orgRole }}</h2>
                </div>

            </div>

            <div class="flex items-center justify-between w-full px-8">
                <Button label="Previous" @click="navigate(2)" />
                <Button label="Submit" @click="formSubmit()" type="submit" />
            </div>
        </div>
        <div class=" lg:w-[40rem] overflow-hidden flex flex-col items-center justify-center
             gap-8 p-4 border border-surface-300 dark:border-surface-600 rounded-lg backdrop" v-if="activePage === 4">
            <h1 class=" text-surface-200 text-2xl self-start px-8">Request submitted successfully!</h1>
            <h2 class=" text-surface-200 text-lg self-start px-8">When the request is approved you can start using your
                account</h2>
            <Button label="Back to home" @click="navigate(1)"></Button>
        </div>
    </form>
</template>
<script setup lang='ts'>
import InputText from 'primevue/inputtext';
import InputPassword from 'primevue/password'
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { ref, computed } from 'vue';

const activePage = ref(1)

const formSubmit = () => {
    console.log('Placeholder')
    activePage.value = 4
}

// Each step should have its own validation schema
const schemas = [
    yup.object({
        firstName: yup.string().required(),
        LastName: yup.string().required(),
        phoneNumber: yup.number().required(),
        email: yup.string().required().email(),
        password: yup.string().required().min(8),
        confirmPassword: yup
            .string()
            .required()
            .min(8)
            .oneOf([yup.ref('password')], 'Passwords must match'),
    }),
    yup.object({
        orgName: yup.string().required(),
        orgType: yup.string().required(),
        orgRole: yup.string().required()
    })
];

const currentSchema = computed(() => {
    return schemas[activePage.value];
});

const { validate, errors, defineField, handleSubmit } = useForm({
    validationSchema: currentSchema,
});
const onSubmit = () => {
    console.log('validation goes here')

    handleSubmit(values => {
        alert(JSON.stringify(values, null, 2));
    })
};
const [firstName, firstNameAttrs] = defineField('firstName')
const [lastName, lastNameAttrs] = defineField('lastName')
const [email, emailAttrs] = defineField('email')
const [phoneNumber, phoneNumberAttrs] = defineField('phoneNumber')
const [password, passwordAttrs] = defineField('password')
const [confirmedPassword, confirmedPasswordAttrs] = defineField('confirmedPassword')
const [orgType, orgTypeAttrs] = defineField('orgType')
const [orgName, orgNameAttrs] = defineField('orgName')
const [orgRole, orgRoleAttrs] = defineField('orgRole')

const navigate = async (page: number) => {

    const isValid = await validate();
    console.log(isValid)
    if (!isValid.valid) {
        console.error('Validation errors', errors.value);
        return; // Stop navigation if validation fails
    }
    activePage.value = page;
};

</script>
<style scoped></style>