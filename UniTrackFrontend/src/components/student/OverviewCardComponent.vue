<template>
    <div class="flex items-center p-2 w-[30%] gap-8 flex-wrap rounded-md min-h-60 max-sm:min-w-[20rem] min-w-[36rem]"
        :class="cardContent.color">
        <Knob v-model="cardContent.value" readonly :min="cardContent.knobMinValue"
            :class="cardContent.knobStrokeColor, cardContent.knobStrokeColor" :max="cardContent.knobMaxValue"
            :valueColor="cardContent.knobStrokeColor" :rangeColor="cardContent.knobEmptyColor" :size="125"></Knob>
        <div class="flex flex-col gap-2">
            <h2 class="text-surface-100 dark:text-surface-200 text-3xl mb-8">{{ cardContent.cardTitle }}</h2>
            <h3 class="text-surface-100 dark:text-surface-200 text-xl">{{ cardContent.cardDataMain }}</h3>
            <h3 class="text-surface-100 dark:text-surface-200 text-xl">{{ cardContent.cardDataSecondary }}</h3>
            <h3 class="text-surface-100 dark:text-surface-200 text-xl">{{ cardContent.cardDataTertiary }}</h3>

        </div>
    </div>

</template>
<script setup lang='ts'>
import Knob from 'primevue/knob'
import OverviewCard from '../../interfaces/OverViewCard'
defineProps<{cardContent: OverviewCard}>()
</script>
<style scoped></style>