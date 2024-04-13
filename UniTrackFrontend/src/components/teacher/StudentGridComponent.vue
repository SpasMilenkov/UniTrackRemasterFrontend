<template>
    <DataTable :value="students" v-model:filters="filters" :globalFilterFields="['name', 'id', 'grade']" dataKey="id"
        scrollable scrollHeight="30rem" :loading="loading">
        <template #header>
            <div class="flex justify-content-end">
                <InputText v-model="filters['global'].value" placeholder="Search student" />
            </div>
        </template>
        <template #empty>No students found.</template>
        <template #loading>Loading student data. Please wait.</template>
        <Column field="name" header="name" sortable></Column>
        <Column field="id" header="Student id" sortable></Column>
        <Column field="grade" header="Grade" sortable></Column>
        <Column header="Assign grades">
            <template #body="slotProps">
                <Button label="Add grade" @click="grade(slotProps.data.name, slotProps.data.id)"></Button>
            </template>
        </Column>
        <Column header="Add Absence">
            <template #body="slotProps">
                <Button label="Add absence" @click="addAbsence(slotProps.data.name, slotProps.data.id)"></Button>
            </template>
        </Column>
    </DataTable>
    <Dialog v-model:visible="visible" modal class="max-w-[30rem]">
        <div class="flex flex-col gap-4 justify-content-center">
            <h1 class="text-surface-700 dark:text-surface-100 text-xl">Submit Grade</h1>
            <label class="text-surface-700 dark:text-surface-100 " for="studentName">Student name:</label>
            <InputText id="studentNameGrading" :value="selectedStudent" disabled></InputText>
            <label class=" text-surface-700 dark:text-surface-100" for="studentId">Student
                ID:</label>
            <InputText id="studentIdGrading" :value=" selectedStudentId" disabled></InputText>
            <Dropdown v-model="selectedGrade" :options="grades" optionLabel="name" placeholder="Assign"
                class="w-full md:w-14rem" />
            <label class="text-surface-700 dark:text-surface-100" for="examinedOn">Material examined on:</label>
            <InputText id="examinedOn" :value="examinationMaterial"></InputText>
            <label class="text-surface-700 dark:text-surface-100" for="remarks">Remarks:</label>
            <InputText id="remarks" :value="remarks"></InputText>
            <div class="flex justify-between items-center">
                <Button label="Cancel" outlined @click="visible = false"></Button>
                <Button label="Submit"></Button>
            </div>
        </div>
    </Dialog>
    <Dialog v-model:visible="visibleAbsence" modal class="max-w-[30rem]">
        <div class="flex flex-col gap-4 justify-content-center">
            <h1 class="text-surface-700 dark:text-surface-100 text-xl">Add Absence</h1>
            <label class="text-surface-700 dark:text-surface-100 " for="studentName">Student name:</label>
            <InputText id="studentName" :value="selectedStudent" disabled></InputText>
            <label class="text-surface-700 dark:text-surface-100" for="studentId">Student ID:</label>
            <InputText id="studentId" :value="selectedStudentId" disabled></InputText>
            <Dropdown v-model="selectedGrade" :options="grades" optionLabel="name" placeholder="Assign absence"
                class="w-full md:w-14rem" />
            <div class="flex justify-between items-center">
                <Button label="Cancel" outlined @click="visibleAbsence = false"></Button>
                <Button label="Confirm"></Button>
            </div>
        </div>
    </Dialog>
</template>
<script setup lang='ts'>
import { ref } from 'vue';

import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from 'primevue/api';
import Button from 'primevue/button';

import Dropdown from 'primevue/dropdown';

const students = [
    { name: 'Student 9', id: '1009', grade: 'A' },
    { name: 'Student 10', id: '1010', grade: 'C' },
    { name: 'Student 11', id: '1011', grade: 'B' },
    { name: 'Student 12', id: '1012', grade: 'A' },
    { name: 'Student 9', id: '1009', grade: 'A' },
    { name: 'Student 10', id: '1010', grade: 'C' },
    { name: 'Student 11', id: '1011', grade: 'B' },
    { name: 'Student 9', id: '1009', grade: 'A' },
    { name: 'Student 10', id: '1010', grade: 'C' },
    { name: 'Student 11', id: '1011', grade: 'B' },
    { name: 'Student 9', id: '1009', grade: 'A' },
    { name: 'Student 10', id: '1010', grade: 'C' },
    { name: 'Student 11', id: '1011', grade: 'B' },
];

const visible = ref(false)
const selectedStudent = ref('')
const selectedStudentId = ref('')
const examinationMaterial = ref('')
const remarks = ref('')
const grade = (name: string, studentId: string) => {

    visible.value = true
    selectedStudent.value = name
    selectedStudentId.value = studentId
}
const selectedGrade = ref(2)
const grades = ref([
    {
        value: 2,
        name: 'Poor, 2'
    },
    {
        value: 3,
        name: 'Average, 3'
    },
    {
        value: 4,
        name: 'Good, 4'
    },
    {
        value: 5,
        name: 'Very good, 5'
    },
    {
        value: 6,
        name: 'Excellent, 6'
    },
])

const visibleAbsence = ref(false)

const addAbsence = (name: string, studentId: string) => {
    visibleAbsence.value = true
    selectedStudent.value = name,
    selectedStudentId.value = studentId
}



const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});
const loading = ref(false);


</script>
<style scoped></style>