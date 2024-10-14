<template>
    <n-space vertical :size="12" class="min-h-screen md:px-6 px-2 py-4">
        <h1 class="md:px-0 text-3xl text-center lg:text-left">Good evening, Mihail</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8 px-8 md:px-0">
            <n-card
                class=" dark:hover:bg-[hsl(240,8%,13%)] duration-150 dark:bg-[#18181c] dark:text-white rounded min-h-32;"
                title="Next Class">
                <template #header-extra>
                    <Icon name="material-symbols:school-outline" class="text-rose-600" :size="36" />
                </template>
                <div class="mt-2">
                    <p class="font-bold">Mathematics</p>
                    <p>Class: 10A</p>
                    <p>Room: 301</p>
                    <n-time :time="nextClassTime" type="relative" />
                </div>
            </n-card>

            <n-card
                class=" dark:hover:bg-[hsl(240,8%,13%)] duration-150 dark:bg-[#18181c] dark:text-white rounded min-h-32;"
                title="Upcoming Exam">
                <template #header-extra>
                    <Icon name="mdi:file-document-edit-outline" class="text-rose-600" :size="36" />
                </template>
                <div class="mt-2">
                    <p class="font-bold">Physics Mid-term</p>
                    <p>Class: 11B</p>
                    <p>Topic: Mechanics</p>
                    <n-time :time="upcomingExamTime" type="relative" />
                </div>
            </n-card>

            <n-card
                class=" dark:hover:bg-[hsl(240,8%,13%)] duration-150 dark:bg-[#18181c] dark:text-white rounded min-h-32;"
                title="School Events">
                <template #header-extra>
                    <Icon name="mdi:calendar-star" class="text-rose-600" :size="36" />
                </template>
                <div class="mt-2">
                    <p class="font-bold">Science Fair</p>
                    <p>Location: School Auditorium</p>
                    <n-time :time="schoolEventTime" type="relative" />
                    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Click for more events</p>
                </div>
            </n-card>
        </div>
        <!-- Remove client only when implementing fetching from the server, the random generation is currently causing hydration errors -->

        <div class="table-container">
            <client-only>
                <n-data-table :bordered="false" :single-line="false" :columns="columns" :data="data" size="large" />
            </client-only>
            <!-- Pagination -->
            <div class="flex justify-center mt-4">
                <n-pagination v-model:page="page" :page-count="pageCount" />
            </div>
        </div>
        <n-modal :show="showModal" style="width: 600px" title="Modal" :bordered="false" size="huge" role="dialog"
            aria-modal="true" @mask-click="showModal = false">
            <GradeFormComponent form-type="edit" />
        </n-modal>
    </n-space>
</template>

<script lang="ts" setup>
import { NButton, type DataTableColumns, NModal, NPagination } from 'naive-ui'

const { createTags } = useTags()

definePageMeta({
    layout: 'dashboard-layout'
})

interface RowData {
    key: string
    student: string
    firstTerm: number[]
    firstTermGrade: number
    secondTerm: number[]
    secondTermGrade: number
    yearlyGrade: number
}

//Methods
const createColumns = (): DataTableColumns<RowData> => {
    return [
        {
            title: 'Student',
            key: 'student',
        },
        {
            title: 'Term I',
            key: 'firstTerm',
            render(row) {
                return createTags(row.firstTerm)
            }
        },
        {
            title: 'Term I Grade',
            key: 'firstTermGrade',
            render(row) {
                return createTags(row.firstTermGrade)
            }
        },
        {
            title: 'Term II',
            key: 'secondTerm',
            render(row) {
                return createTags(row.secondTerm)
            }
        },
        {
            title: 'Term II Grade',
            key: 'secondTermGrade',
            render(row) {
                return createTags(row.secondTermGrade)
            }
        },
        {
            title: 'Year Grade',
            key: 'yearlyGrade',
            render(row) {
                return createTags(row.yearlyGrade)
            }
        },
        {
            title: 'Action',
            key: 'actions',
            render() {
                return h(
                    NButton,
                    {
                        strong: true,
                        tertiary: true,
                        size: 'small',
                        onClick: () => showModal.value = true
                    },
                    { default: () => 'Grade' }
                )
            }
        }
    ]
}

const generateData = (): RowData[] => {
    // Helper function to generate a random grade between 2 and 6
    const randomGrade = (): number => Math.floor(Math.random() * (6 - 2 + 1)) + 2;

    // Helper function to calculate average grade
    const calculateAverage = (grades: number[]): number => {
        const sum = grades.reduce((acc, grade) => acc + grade, 0);
        return Number((sum / grades.length).toFixed(0));
    };

    return [
        {
            key: '0',
            student: 'Elden Mesho',
            firstTerm: [randomGrade(), randomGrade(), randomGrade()],
            firstTermGrade: 0, // Will be calculated
            secondTerm: [randomGrade(), randomGrade(), randomGrade()],
            secondTermGrade: 0, // Will be calculated
            yearlyGrade: 0 // Will be calculated
        },
        {
            key: '1',
            student: 'K. Honda',
            firstTerm: [randomGrade(), randomGrade(), randomGrade()],
            firstTermGrade: 0,
            secondTerm: [randomGrade(), randomGrade(), randomGrade()],
            secondTermGrade: 0,
            yearlyGrade: 0
        },
        {
            key: '2',
            student: 'Almond Lover',
            firstTerm: [randomGrade(), randomGrade(), randomGrade()],
            firstTermGrade: 0,
            secondTerm: [randomGrade(), randomGrade(), randomGrade()],
            secondTermGrade: 0,
            yearlyGrade: 0
        },
        {
            key: '3',
            student: 'Marto Koleff',
            firstTerm: [randomGrade(), randomGrade(), randomGrade()],
            firstTermGrade: 0,
            secondTerm: [randomGrade(), randomGrade(), randomGrade()],
            secondTermGrade: 0,
            yearlyGrade: 0
        },
        {
            key: '4',
            student: 'Marto Borisov',
            firstTerm: [randomGrade(), randomGrade(), randomGrade()],
            firstTermGrade: 0,
            secondTerm: [randomGrade(), randomGrade(), randomGrade()],
            secondTermGrade: 0,
            yearlyGrade: 0
        }
    ].map(row => {
        const firstTermGrade = calculateAverage(row.firstTerm);
        const secondTermGrade = calculateAverage(row.secondTerm);
        const yearlyGrade = Number(((firstTermGrade + secondTermGrade) / 2).toFixed(0));
        return {
            ...row,
            firstTermGrade,
            secondTermGrade,
            yearlyGrade
        };
    });
};



// Variables
const columns = createColumns()
const data = generateData()
const showModal = ref(false)
const page = ref(1)
const pageCount = ref(5)

// Example times 
const nextClassTime = new Date(Date.now() + 30 * 60 * 1000).getTime()
const upcomingExamTime = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).getTime()
const schoolEventTime = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).getTime()
</script>

<style>
.n-statistic .n-statistic__label {
    color: var(--n-value-suffix-text-color);
    font-size: 1.125rem;
}

.n-statistic-value {
    display: flex;
    align-items: center;
}

.n-statistic .n-statistic-value .n-statistic-value__prefix {
    margin-right: 0.5rem;
    font-size: 1.5rem
}

.n-statistic .n-statistic-value .n-statistic-value__suffix {
    font-size: 1.5rem
}

.n-data-table:not(.n-data-table--single-line) .n-data-table-td {
    font-size: 1.25rem;
}
</style>