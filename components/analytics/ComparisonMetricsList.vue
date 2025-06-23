<!-- components/analytics/ComparisonMetricsList.vue -->
<template>
  <div class="space-y-4">
    <div
      v-for="metric in metrics"
      :key="metric"
      class="flex items-center justify-between p-3 rounded-lg bg-background-soft"
    >
      <div class="flex items-center space-x-3">
        <Icon :name="getMetricIcon(metric)" class="text-primary" />
        <span class="text-sm font-medium text-text-primary">{{ metric }}</span>
      </div>

      <div class="flex items-center space-x-4">
        <div class="text-right">
          <div class="text-sm font-medium text-text-primary">
            {{ getMetricValue(metric, institution1) }}
          </div>
          <div class="text-xs text-text-secondary">{{ institution1.name }}</div>
        </div>

        <div class="w-px h-8 bg-border"></div>

        <div class="text-right">
          <div class="text-sm font-medium text-text-primary">
            {{ getMetricValue(metric, institution2) }}
          </div>
          <div class="text-xs text-text-secondary">{{ institution2.name }}</div>
        </div>

        <div class="w-6 h-6 flex items-center justify-center">
          <Icon :name="getWinnerIcon(metric)" :class="getWinnerColor(metric)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '#components';
import type { InstitutionSummaryDto } from '~/stores/analytics';

interface Props {
  metrics: string[];
  institution1: InstitutionSummaryDto;
  institution2: InstitutionSummaryDto;
}

defineProps<Props>();

const getMetricIcon = (metric: string) => {
  const icons: Record<string, string> = {
    'Academic Score': 'ph:chart-line-up',
    'Year-over-Year Growth': 'ph:trend-up',
    'Subject Performance': 'ph:books',
    'Student Achievement Rate': 'ph:medal',
    'Attendance Rate': 'ph:calendar-check',
    'Teacher Retention': 'ph:users',
    'Student-Teacher Ratio': 'ph:users-three',
    'Resource Utilization': 'ph:chart-pie',
  };
  return icons[metric] || 'ph:chart-bar';
};

const getMetricValue = (metric: string, institution: InstitutionSummaryDto) => {
  // This would be replaced with actual metric values from the institution data
  const mockValues: Record<string, Record<string, string>> = {
    'Academic Score': {
      [institution.institutionId]: `${institution.overallScore.toFixed(1)}/100`,
    },
    'Year-over-Year Growth': { [institution.institutionId]: '+5.2%' },
    'Subject Performance': { [institution.institutionId]: '8.5/10' },
    'Student Achievement Rate': { [institution.institutionId]: '87%' },
    'Attendance Rate': { [institution.institutionId]: '94%' },
    'Teacher Retention': { [institution.institutionId]: '89%' },
    'Student-Teacher Ratio': { [institution.institutionId]: '15:1' },
    'Resource Utilization': { [institution.institutionId]: '78%' },
  };

  return mockValues[metric]?.[institution.institutionId] || 'N/A';
};

const getWinnerIcon = (metric: string) => {
  // This would determine the winner based on actual values
  return 'ph:crown';
};

const getWinnerColor = (metric: string) => {
  // This would determine color based on which institution wins
  return 'text-warning';
};
</script>
