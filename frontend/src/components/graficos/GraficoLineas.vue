<script setup lang="ts">
import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { computed } from 'vue'
import { Line } from 'vue-chartjs'

import type { SerieLinea } from '@/interfaces/GraficoInterface'
import { formatearPesos } from '@/utils/formato'
import { COLORES } from '@/utils/paleta'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Legend, Tooltip)

const props = defineProps<{
  etiquetas: string[]
  series: SerieLinea[]
}>()

const datos = computed<ChartData<'line'>>(() => ({
  labels: props.etiquetas,
  datasets: props.series.map((serie) => ({
    label: serie.nombre,
    data: serie.valores,
    borderColor: serie.color,
    backgroundColor: serie.color,
    tension: 0.3,
    pointRadius: 4,
  })),
}))

const opciones: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top', align: 'end', labels: { usePointStyle: true, boxHeight: 6 } },
    tooltip: {
      callbacks: {
        label: (punto) => `${punto.dataset.label}: ${formatearPesos(punto.parsed.y ?? 0)}`,
      },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: COLORES.apagado } },
    y: {
      beginAtZero: true,
      grid: { color: COLORES.rejilla },
      ticks: { color: COLORES.apagado, callback: (valor) => formatearPesos(Number(valor)) },
    },
  },
}
</script>

<template>
  <div class="h-72">
    <Line :data="datos" :options="opciones" />
  </div>
</template>
