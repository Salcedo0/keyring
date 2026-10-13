<script setup lang="ts">
import { ArcElement, Chart, Legend, Tooltip, type ChartData, type ChartOptions } from 'chart.js';
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';

import { formatearPesos } from '@/utils/formato';
import { PALETA_CATEGORIAS } from '@/utils/paleta';

Chart.register(ArcElement, Legend, Tooltip);

const props = defineProps<{
  etiquetas: string[];
  valores: number[];
}>();

const datos = computed<ChartData<'doughnut'>>(() => ({
  labels: props.etiquetas,
  datasets: [{ data: props.valores, backgroundColor: PALETA_CATEGORIAS, borderWidth: 2 }],
}));

const opciones: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    legend: { position: 'right', labels: { usePointStyle: true, boxHeight: 8 } },
    tooltip: { callbacks: { label: (parte) => `${parte.label}: ${formatearPesos(parte.parsed)}` } },
  },
};
</script>

<template>
  <div class="h-64">
    <Doughnut :data="datos" :options="opciones" />
  </div>
</template>
