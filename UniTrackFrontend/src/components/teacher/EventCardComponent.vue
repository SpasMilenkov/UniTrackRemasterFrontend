<template>
    <div
        class="flex flex-col gap-4 p-8 w-full max-w-[40rem] shadow-lg dark:shadow-none bg-surface-200 dark:bg-surface-800 rounded-md h-[18rem]">
        <h1 class="text-surface-700 dark:text-surface-100 text-3xl pl-2">Events</h1>
        <div class="flex gap-4 items-center justify-center">
            <img src="/images/star.png" alt="profile-picture"
                class="rounded-full w-44 gap-4 bg-surface-400 dark:bg-surface-900">
            <div class="flex flex-col gap-8 w-full h-full justify-center">
                <h1 class="text-surface-700 dark:text-surface-100 text-2xl">No planned events soon</h1>
                <Button label="Create" @click="visible = true"></Button>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="visible" modal class="max-w-[30rem]">
        <form @submit.prevent="onSubmit" class="flex flex-col gap-8 justify-content-center">
            <h1 class="text-surface-700 dark:text-surface-100 text-xl">Create Event</h1>
            <div class="flex flex-col gap-4">
                <div class="flex-col flex gap-1">
                    <label class="text-surface-700 dark:text-surface-100 pl-1" for="eventName">Event name:</label>
                    <InputText class="w-full md:w-14rem" id="eventName" v-model="eventName" v-bind="eventAttrs" />
                    <span v-if="errors['eventName']" class="text-red-500">{{ errors.eventName }}</span>
                </div>
                <div class="flex-col flex gap-1">
                    <label class="text-surface-700 dark:text-surface-100 pl-1" for="eventTopic">Event Topic:</label>
                    <InputText class="w-full md:w-14rem" id="eventTopic" v-model="eventTopic"
                        v-bind="eventTopicAttrs" />
                    <span v-if="errors['eventTopic']" class="text-red-500">{{ errors.eventTopic }}</span>
                </div>
                <div class="flex-col flex gap-1">
                    <label class="text-surface-700 dark:text-surface-100 pl-1" for="eventSummary">Event Summary:</label>
                    <Textarea class="w-full md:w-14rem" rows="4" cols="30" id="eventSummary" v-model="eventSummary"
                        v-bind="eventSummaryAttrs" />
                    <span v-if="errors['eventSummary']" class="text-red-500">{{ errors.eventSummary }}</span>
                </div>
                <div class="flex-col flex gap-1">
                    <label class="text-surface-700 dark:text-surface-100 pl-1" for="eventLocation">Event
                        location:</label>

                    <InputText class="w-full md:w-14rem" id="eventLocation" v-model="eventLocation"
                        v-bind="eventLocationAttrs" />
                    <span v-if="errors['eventLocation']" class="text-red-500">{{ errors.eventLocation
                        }}</span>
                </div>
                <div class="flex-col flex gap-1">
                    <label class="text-surface-700 dark:text-surface-100 pl-1" v for="eventLocation">Event date:</label>

                    <Calendar class="w-full md:w-14rem" id="eventDate" v-model="eventDate" v-bind="eventDateAttrs" />
                    <span v-if="errors['eventLocation']" class="text-red-500">{{ errors.eventDate
                        }}</span>
                </div>
                <div class="flex-col flex gap-1">
                    <label class="text-surface-700 dark:text-surface-100 pl-1" for="eventLocation">Event time:</label>

                    <Calendar class="w-full md:w-14rem" id="eventTime" v-model="eventTime" v-bind="eventTimeAttrs"
                        timeOnly />
                    <span v-if="errors['eventLocation']" class="text-red-500">{{ errors.eventTime
                        }}</span>
                </div>
                <div class="flex-col flex gap-1">
                    <label class="text-surface-700 dark:text-surface-100 pl-1" for="eventParticipants">Invite
                        Participants</label>
                    <MultiSelect class="w-full md:w-14rem min-h-12" id="eventParticipants" v-model="eventParticipants"
                        v-bind="eventParticipantsAttrs" placeholder=" " :options="grades" optionLabel="name" />
                    <span v-if="errors['eventParticipants']" class="text-red-500">{{ errors.eventParticipants
                        }}</span>
                </div>
            </div>
            <Button label="Create event" @click="onSubmit"></Button>
        </form>
    </Dialog>
</template>
<script setup lang='ts'>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { useForm } from 'vee-validate';
import MultiSelect from 'primevue/multiselect';
import Textarea from 'primevue/textarea';
import Calendar from 'primevue/calendar';
import * as yup from 'yup';
import { ref } from 'vue'

const visible = ref(false)

const { errors, defineField, validate, resetForm } = useForm({
    validationSchema: yup.object({
        eventName: yup.string().required('*Event name is required'),
        eventTopic: yup.string().required('*Event topic is required'),
        eventSummary: yup.string().required('*Event summary is required'),
        eventLocation: yup.string().required('*Event location is required'),
        eventDate: yup.date()
            .typeError('*Event date should be a valid date')
            .required('*Event date is required'),
        eventTime: yup.date()
            .typeError('*Event time should be a valid date')
            .required('*Event time is required'),
        eventParticipants: yup.array()
            .of(
                yup.object({
                    name: yup.string().required('*Grade name is required'),
                    leadTeacherName: yup.string().required('*Lead teacher name is required'),
                    leadTeacherId: yup.string().required('*Lead teacher ID is required')
                })
            )
            .required('*Event participants are required')
    })
})

const onSubmit = async () => {
    const check = await validate().then((result) => result.valid)
    if (!check)
        return;
    console.log('We are making request with this one')

    visible.value = false
    resetForm()
};

const grades = ref([
    {
        name: '9A',
        leadTeacherName: 'Alex Trajkov',
        leadTeacherId: '1001'
    },
    {
        name: '9B',
        leadTeacherName: 'Alex Trajkov',
        leadTeacherId: '1001'
    },
    {
        name: '9C',
        leadTeacherName: 'Alex Trajkov',
        leadTeacherId: '1001'
    },
    {
        name: '9D',
        leadTeacherName: 'Alex Trajkov',
        leadTeacherId: '1001'
    },
])

const [eventName, eventAttrs] = defineField('eventName');
const [eventTopic, eventTopicAttrs] = defineField('eventTopic');
const [eventSummary, eventSummaryAttrs] = defineField('eventSummary')
const [eventLocation, eventLocationAttrs] = defineField('eventLocation');
const [eventParticipants, eventParticipantsAttrs] = defineField('eventParticipants')
const [eventDate, eventDateAttrs] = defineField('eventDate')
const [eventTime, eventTimeAttrs] = defineField('eventTime')
</script>
<style scoped></style>