<template>
    <DataTable :value="users" v-model:filters="filters" :globalFilterFields="['name', 'id', 'grade']" dataKey="id"
        scrollable scrollHeight="30rem" :loading="loading">
        <template #header>
            <div class="flex justify-content-end">
                <InputText v-model="filters['global'].value" placeholder="Search student" />
            </div>
        </template>
        <template #empty>No new applications</template>
        <template #loading>Loading student data. Please wait.</template>
        <Column field="name" header="name" sortable></Column>
        <Column field="userId" header="userId" sortable></Column>
        <Column field="role" header="Applied for" sortable></Column>
        <Column header="Assign Student">
            <template #body="slotProps">
                <Button label="Add student" @click="addStudent(slotProps.data.name, slotProps.data.userId)"></Button>
            </template>
        </Column>
        <Column header="Add Teacher">
            <template #body="slotProps">
                <Button label="Add teacher" @click="addTeacher(slotProps.data.name, slotProps.data.userId)"></Button>
            </template>
        </Column>
    </DataTable>
    <Dialog v-model:visible="visibleStudent" modal class="max-w-[30rem]">
        <form @submit.prevent="" class="flex flex-col gap-4 justify-content-center">
            <h1 class="text-surface-700 dark:text-surface-100 text-xl">Approve student application</h1>
            <label class="text-surface-700 dark:text-surface-100 " for="studentName">Student name:</label>
            <InputText id="studentName" :value="selectedStudent" disabled></InputText>
            <label class=" text-surface-700 dark:text-surface-100" for="studentId">User ID:</label>
            <InputText id="studentIdGrading" :value="selectedStudentId" disabled></InputText>
            <Dropdown v-model="selectedGrade" v-bind="selectedGradeAttrs" :options="grades" optionLabel="name"
                placeholder="Assign Grade" class="w-full md:w-14rem" />
            <span class="text-red-500">{{ errorsStudent.selectedGrade
                }}</span>
            <div class="flex justify-between items-center">
                <Button label="Cancel" outlined @click="visibleStudent = false"></Button>
                <Button label="Submit" @click="submitStudent"></Button>
            </div>
        </form>
    </Dialog>
    <Dialog v-model:visible="visibleTeacher" modal class="max-w-[30rem]">
        <form @submit.prevent="" class="flex flex-col gap-4 justify-content-center">
            <h1 class="text-surface-700 dark:text-surface-100 text-xl">Approve student application</h1>
            <label class="text-surface-700 dark:text-surface-100 " for="teacherName">Teacher name:</label>
            <InputText id="teacherNameGrading" :value="selectedTeacher" disabled></InputText>
            <label class=" text-surface-700 dark:text-surface-100" for="teacherId">User ID:</label>
            <InputText id="teacherId" :value="selectedTeacherId" disabled></InputText>

            <MultiSelect v-model="selectedGrades" v-bind="selectedGradesAttrs" :options="grades" optionLabel="name"
                placeholder="Select grades" :maxSelectedLabels="3" class="w-full md:w-20rem" />
            <span class="text-red-500">{{ errorsTeacher.selectedGrades
                }}</span>
            <MultiSelect v-model="selectedSubjects" v-bind="selectedSubjectsAttrs" :options="subjects"
                optionLabel="name" placeholder="Select subjects" :maxSelectedLabels="3" class="w-full md:w-20rem" />
            <span class="text-red-500">{{ errorsTeacher.selectedSubjects
                }}</span>
            <div class="flex justify-between items-center">
                <Button label="Cancel" outlined @click="visibleTeacher = false"></Button>
                <Button label="Submit" @click="submitTeacher"></Button>
            </div>
        </form>
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
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
const users = ref(
    [
        {
            name: 'John Doe',
            userId: '1001',
            role: 'Teacher',
            school: 'ABC High School',
            schoolId: 'SCH001'
        },
        {
            name: 'Jane Smith',
            userId: '1002',
            role: 'Student',
            school: 'XYZ School',
            schoolId: 'SCH002'
        },
        {
            name: 'Robert Johnson',
            userId: '1003',
            role: 'Teacher',
            school: 'DEF Academy',
            schoolId: 'SCH003'
        },
        {
            name: 'Emily Brown',
            userId: '1004',
            role: 'Student',
            school: 'GHI School',
            schoolId: 'SCH004'
        },
        {
            name: 'Michael Lee',
            userId: '1005',
            role: 'Teacher',
            school: 'JKL High',
            schoolId: 'SCH005'
        },
        {
            name: 'Jessica Garcia',
            userId: '1006',
            role: 'Student',
            school: 'MNO Academy',
            schoolId: 'SCH006'
        },
        {
            name: 'Christopher Martinez',
            userId: '1007',
            role: 'Teacher',
            school: 'PQR School',
            schoolId: 'SCH007'
        },
        {
            name: 'Sophia Nguyen',
            userId: '1008',
            role: 'Student',
            school: 'STU High',
            schoolId: 'SCH008'
        },
        {
            name: 'William Kim',
            userId: '1009',
            role: 'Teacher',
            school: 'VWX Academy',
            schoolId: 'SCH009'
        },
        {
            name: 'Olivia Hernandez',
            userId: '1010',
            role: 'Student',
            school: 'YZA School',
            schoolId: 'SCH010'
        }
    ])

const visibleStudent = ref(false)

const visibleTeacher = ref(false)

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});
const loading = ref(false);

const { errors: errorsStudent, defineField: defineFieldStudent, validate: validateStudent, resetForm: resetStudentForm } = useForm({
    validationSchema: yup.object({
        selectedGrade: yup.object().shape({
            name: yup.string().required('*Grade is required'),
            leadTeacherName: yup.string().required('*Lead teacher name is required'),
            leadTeacherId: yup.string().required('*Lead teacher ID is required')
        }).required('*Grade is required')
    })
})
const selectedStudent = ref('')
const selectedStudentId = ref('')
const [selectedGrade, selectedGradeAttrs] = defineFieldStudent('selectedGrade')

const grades = ref([
    {
        name: 'Grade 9A',
        leadTeacherName: 'Mr. Smith',
        leadTeacherId: '1001'
    },
    {
        name: 'Grade 9B',
        leadTeacherName: 'Ms. Johnson',
        leadTeacherId: '1002'
    },
    {
        name: 'Grade 10A',
        leadTeacherName: 'Mr. Brown',
        leadTeacherId: '1003'
    },
    {
        name: 'Grade 10B',
        leadTeacherName: 'Ms. Lee',
        leadTeacherId: '1004'
    },
    {
        name: 'Grade 11A',
        leadTeacherName: 'Mr. Garcia',
        leadTeacherId: '1005'
    },
    {
        name: 'Grade 11B',
        leadTeacherName: 'Ms. Martinez',
        leadTeacherId: '1006'
    }
])

const subjects = ref([
    {
        subjectId: 'SUB001',
        name: 'Mathematics'
    },
    {
        subjectId: 'SUB002',
        name: 'Science'
    },
    {
        subjectId: 'SUB003',
        name: 'English'
    },
    {
        subjectId: 'SUB004',
        name: 'History'
    },
    {
        subjectId: 'SUB005',
        name: 'Geography'
    },
    {
        subjectId: 'SUB006',
        name: 'Computer Science'
    },
    {
        subjectId: 'SUB007',
        name: 'Art'
    },
    {
        subjectId: 'SUB008',
        name: 'Music'
    },
    {
        subjectId: 'SUB009',
        name: 'Physical Education'
    },
    {
        subjectId: 'SUB010',
        name: 'Foreign Language'
    }
])


const addStudent = (name: string, id: string) => {
    visibleStudent.value = true

    selectedStudent.value = name
    selectedStudentId.value = id
}

const { errors: errorsTeacher, defineField: defineTeacherField, validate: validateTeacher, resetForm: resetTeacherForm } = useForm({
    validationSchema: yup.object({
        selectedGrades: yup.array().min(1, '*At least one grade must be selected').required('*Grades are required'),
        selectedSubjects: yup.array().min(1, '*At least one subject must be selected').required('*Subjects are required')
    })
})


const selectedTeacher = ref('')
const selectedTeacherId = ref('')
const [selectedGrades, selectedGradesAttrs] = defineTeacherField('selectedGrades')
const [selectedSubjects, selectedSubjectsAttrs] = defineTeacherField('selectedSubjects')

const addTeacher = async (name: string, id: string) => {
    visibleTeacher.value = true

    selectedTeacher.value = name
    selectedTeacherId.value = id
}

const submitStudent = async () => {
    const validation = await validateStudent()
    console.log(validation)
    console.log(selectedGrade.value)
    if (!validation.valid){
        console.log('are we returning now?')
        return
    }

    console.log('We are creating a student with this one 🗣️')

    resetStudentForm()
    visibleStudent.value = false
}

const submitTeacher = async () => {
    const validation = await validateTeacher()

    if (!validation.valid)
        return

    console.log('We are creating a teacher with this one 🗣️')

    resetTeacherForm()
    visibleTeacher.value = false
}

</script>