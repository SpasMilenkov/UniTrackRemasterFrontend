<template>
  <n-space>
    <n-calendar
      v-model:value="value"
      class="p-4 w-screen min-h-screen"
      #="{ year, month, date }"
      :is-date-disabled="isDateDisabled"
      @update:value="handleUpdateValue"
    >
      {{ year }}-{{ month }}-{{ date }}
    </n-calendar>
  </n-space>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import { addDays, isYesterday } from 'date-fns';

const message = useMessage();

const value = ref(addDays(Date.now(), 1).valueOf());

const handleUpdateValue = (
  _: number,
  { year, month, date }: { year: number; month: number; date: number }
) => {
  message.success(`${year}-${month}-${date}`);
};

const isDateDisabled = (timestamp: number): boolean => {
  return isYesterday(timestamp);
};
</script>
