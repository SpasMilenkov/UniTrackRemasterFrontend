<template>
    <div class="rounded-md  p">
        <DataTable :value="marks" showGridlines tableStyle="min-width: 50rem">
            <template #header>
                <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                    <span class="text-xl text-900 font-bold">Grades</span>
                </div>
            </template>
            <Column field="subject" header="Subject">
                <template #body="slotProps">
                    <h3>{{ slotProps.data.subject }}</h3>
                </template>
            </Column>
            <Column field="firstTerm" header="Term I">
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <Tag v-for="(mark, i ) in slotProps.data.firstTerm" :key="i" :value="mark.value"
                            :severity="calculateSeverity(mark.value)"></Tag>
                    </div>
                </template>
            </Column>
            <Column field="termGradeOne" header="Term Grade I">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.firstTermGrade"
                        :severity="calculateSeverity(slotProps.data.firstTermGrade)">{{ slotProps.data.firstTermGrade }}
                    </Tag>
                </template>
            </Column>
            <Column field="secondTerm" header="Term II">
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <Tag v-for="(mark, i ) in slotProps.data.secondTerm" :key="i" :value="mark.value"
                            :severity="calculateSeverity(mark.value)"></Tag>
                    </div>
                </template>
            </Column>
            <Column field="termGradeTwo" header="Term Grade II">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.secondTermGrade"
                        :severity="calculateSeverity(slotProps.data.secondTermGrade)"></Tag>
                </template>
            </Column>
            <Column field="yearlyGrade" header="Yearly Grade">
                <template #body="slotProps">
                    <Tag>{{ slotProps.data.yearlyGrade }}</Tag>
                </template>
            </Column>
            <template #footer> In total there are {{ marks ? marks.length : 0 }} subjects with grades. </template>
        </DataTable>
    </div>
</template>
<script setup lang='ts'>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Mark from '../../interfaces/Mark'
import Tag from 'primevue/tag';
import { ref } from 'vue'
interface MarkGridItem {
    subject: string,
    firstTerm: Mark[],
    secondTerm: Mark[],
    firstTermGrade: number,
    secondTermGrade: number,
    yearlyGrade: number
}

const calculateSeverity = (mark: number) => {
    switch (mark) {
        case 2:
            return 'danger'
        case 3:
            return 'warning'
        case 4:
            return 'normal'
        case 5:
            return 'info'
        case 6:
            return 'success'
    }

}

const marks = ref<MarkGridItem[]>([
    {
        subject: 'Math',
        firstTerm: [{
            value: 2,
            subject: 'Math',
            student: 'John',
            teacher: 'Smith',
            studentId: 1,
            teacherId: 1,
            date: new Date()
        },
        {
            value: 4,
            subject: 'Math',
            student: 'John',
            teacher: 'Smith',
            studentId: 1,
            teacherId: 1,
            date: new Date()
        }
        ],
        secondTerm: [{
            value: 3,
            subject: 'Math',
            student: 'John',
            teacher: 'Smith',
            studentId: 1,
            teacherId: 1,
            date: new Date()
        }],
        firstTermGrade: 4,
        secondTermGrade: 6,
        yearlyGrade: 5
    },
    {
        subject: 'Bulgarian',
        firstTerm: [{
            value: 5,
            subject: 'Math',
            student: 'John',
            teacher: 'Smith',
            studentId: 1,
            teacherId: 1,
            date: new Date()
        }],
        secondTerm: [{
            value: 6,
            subject: 'Math',
            student: 'John',
            teacher: 'Smith',
            studentId: 1,
            teacherId: 1,
            date: new Date()
        }],
        firstTermGrade: 85,
        secondTermGrade: 90,
        yearlyGrade: 88
    },
    {
        subject: 'Math',
        firstTerm: [{
            value: 2,
            subject: 'Math',
            student: 'John',
            teacher: 'Smith',
            studentId: 1,
            teacherId: 1,
            date: new Date()
        }],
        secondTerm: [{
            value: 95,
            subject: 'Math',
            student: 'John',
            teacher: 'Smith',
            studentId: 1,
            teacherId: 1,
            date: new Date()
        }],
        firstTermGrade: 85,
        secondTermGrade: 90,
        yearlyGrade: 88
    },
    {
        subject: 'Math',
        firstTerm: [{
            value: 90,
            subject: 'Math',
            student: 'John',
            teacher: 'Smith',
            studentId: 1,
            teacherId: 1,
            date: new Date()
        }],
        secondTerm: [{
            value: 95,
            subject: 'Math',
            student: 'John',
            teacher: 'Smith',
            studentId: 1,
            teacherId: 1,
            date: new Date()
        }],
        firstTermGrade: 85,
        secondTermGrade: 90,
        yearlyGrade: 88
    },
]);
</script>
<style scoped></style>