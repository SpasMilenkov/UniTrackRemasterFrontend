<template>
  <n-card class="hover-elevate" size="small">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div :class="`rounded-full p-3 bg-${color}-500/10`">
          <Icon :name="icon" :class="`text-xl text-${color}-500`" />
        </div>
        <div>
          <h3 class="text-base font-medium">{{ title }}</h3>
          <div class="text-2xl font-semibold">
            {{
              typeof value === 'number' && formatter ? formatter(value) : value
            }}
          </div>
          <p v-if="subtitle" class="text-sm text-text-secondary">
            {{ subtitle }}
          </p>
        </div>
      </div>

      <div v-if="trendValue !== undefined" class="flex flex-col items-end">
        <div
          class="flex items-center"
          :class="trendValue >= 0 ? 'text-green-500' : 'text-red-500'"
        >
          <Icon
            :name="trendValue >= 0 ? 'ph:trend-up' : 'ph:trend-down'"
            class="mr-1"
          />
          <span>{{ Math.abs(trendValue) }}%</span>
        </div>
        <span class="text-xs text-text-secondary">{{
          trendLabel || 'vs last period'
        }}</span>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { NCard } from 'naive-ui';

interface Props {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
  subtitle?: string;
  trendValue?: number;
  trendLabel?: string;
  formatter?: (value: number) => string;
}

withDefaults(defineProps<Props>(), {
  color: 'primary',
  subtitle: '',
  trendValue: undefined,
  trendLabel: '',
  formatter: undefined,
});
</script>

<style scoped>
.hover-elevate {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.hover-elevate:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>
