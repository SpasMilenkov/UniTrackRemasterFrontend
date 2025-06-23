<!-- PerformanceCorrelationChart.vue -->
<template>
  <div class="w-full h-full">
    <!-- SSR-safe: Only render chart on client -->
    <ClientOnly>
      <div v-if="hasData" class="w-full h-full">
        <Scatter
          :data="chartData"
          :options="chartOptions"
          :plugins="chartPlugins"
        />
      </div>

      <!-- Empty state when no data -->
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg"
      >
        <div class="text-center">
          <Icon
            name="heroicons:chart-bar"
            class="mx-auto h-12 w-12 text-gray-400"
          />
          <p class="mt-2 text-sm text-gray-500">
            No correlation data available
          </p>
        </div>
      </div>

      <!-- Loading fallback for SSR -->
      <template #fallback>
        <div
          class="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg animate-pulse"
        >
          <div class="text-center">
            <div class="mx-auto h-12 w-12 bg-gray-300 rounded"></div>
            <p class="mt-2 text-sm text-gray-400">Loading chart...</p>
          </div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem,
} from 'chart.js';
import { Scatter } from 'vue-chartjs';
import type { SubjectAttendanceInsightDto } from '~/interfaces/student';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  subjectInsights: SubjectAttendanceInsightDto[];
}

interface ChartDataPoint {
  x: number;
  y: number;
  subject: string;
  correlation: number;
}

const props = defineProps<Props>();

// Helper function to get color based on correlation strength
const getColorByCorrelation = (correlation: number): string => {
  const abs = Math.abs(correlation);
  if (abs >= 0.7) return 'rgba(34, 197, 94, 0.8)'; // Strong - Green
  if (abs >= 0.5) return 'rgba(59, 130, 246, 0.8)'; // Moderate - Blue
  if (abs >= 0.3) return 'rgba(245, 158, 11, 0.8)'; // Weak - Yellow
  return 'rgba(239, 68, 68, 0.8)'; // Very weak - Red
};

const getBorderColor = (correlation: number): string => {
  return getColorByCorrelation(correlation).replace('0.8', '1');
};

// Check if we have data to display
const hasData = computed(() => {
  return props.subjectInsights && props.subjectInsights.length > 0;
});

// Transform data for Chart.js
const transformedData = computed((): ChartDataPoint[] => {
  if (!hasData.value) return [];

  return props.subjectInsights.map((insight) => ({
    x: insight.studentAttendanceRate * 100, // Convert to percentage
    y: insight.studentAverageScore,
    subject: insight.subjectName,
    correlation: insight.attendanceScoreCorrelation,
  }));
});

// Chart data configuration
const chartData = computed(() => {
  const data = transformedData.value;

  return {
    datasets: [
      {
        label: 'Subject Performance',
        data: data,
        backgroundColor: data.map((point) =>
          getColorByCorrelation(point.correlation)
        ),
        borderColor: data.map((point) => getBorderColor(point.correlation)),
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBorderWidth: 3,
      },
    ],
  };
});

// Chart options configuration
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      displayColors: false,
      callbacks: {
        title: function (context: TooltipItem<'scatter'>[]) {
          const point = context[0].raw as ChartDataPoint;
          return point.subject;
        },
        label: function (context: TooltipItem<'scatter'>) {
          const point = context.raw as ChartDataPoint;
          return [
            `Attendance: ${point.x.toFixed(1)}%`,
            `Average Score: ${point.y.toFixed(1)}`,
            `Correlation: ${(point.correlation * 100).toFixed(0)}%`,
          ];
        },
        footer: function (context: TooltipItem<'scatter'>[]) {
          const point = context[0].raw as ChartDataPoint;
          const abs = Math.abs(point.correlation);

          if (abs >= 0.7) return 'Strong correlation';
          if (abs >= 0.5) return 'Moderate correlation';
          if (abs >= 0.3) return 'Weak correlation';
          return 'Very weak correlation';
        },
      },
    },
  },
  scales: {
    x: {
      type: 'linear' as const,
      position: 'bottom' as const,
      title: {
        display: true,
        text: 'Attendance Rate (%)',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
        color: '#374151',
      },
      min: 0,
      max: 100,
      ticks: {
        callback: function (value: any) {
          return value + '%';
        },
        font: {
          size: 12,
        },
        color: '#6B7280',
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        lineWidth: 1,
      },
    },
    y: {
      type: 'linear' as const,
      title: {
        display: true,
        text: 'Average Score',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
        color: '#374151',
      },
      min: 0,
      max: 100,
      ticks: {
        font: {
          size: 12,
        },
        color: '#6B7280',
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        lineWidth: 1,
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'point' as const,
  },
  animation: {
    duration: 750,
    easing: 'easeInOutQuart' as const,
  },
}));

// Chart plugins for additional functionality
const chartPlugins = computed(() => [
  {
    id: 'correlationLegend',
    afterDraw: (chart: any) => {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;

      // Draw correlation strength legend
      const legendItems = [
        { color: 'rgba(34, 197, 94, 0.8)', label: 'Strong (≥70%)' },
        { color: 'rgba(59, 130, 246, 0.8)', label: 'Moderate (≥50%)' },
        { color: 'rgba(245, 158, 11, 0.8)', label: 'Weak (≥30%)' },
        { color: 'rgba(239, 68, 68, 0.8)', label: 'Very Weak (<30%)' },
      ];

      const legendX = chartArea.right - 160;
      const legendY = chartArea.top + 10;

      ctx.save();
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#374151';
      ctx.fillText('Correlation Strength:', legendX, legendY);

      legendItems.forEach((item, index) => {
        const y = legendY + 20 + index * 18;

        // Draw colored circle
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(legendX + 8, y - 3, 6, 0, 2 * Math.PI);
        ctx.fill();

        // Draw label
        ctx.fillStyle = '#6B7280';
        ctx.fillText(item.label, legendX + 20, y);
      });

      ctx.restore();
    },
  },
]);
</script>
