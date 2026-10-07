<script setup lang="ts">
import {
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'

import { formatearPesos } from '@/utils/formato'
import { COLORES } from '@/utils/paleta'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip)

const { enPesos = true, ...props } = defineProps<{
  etiquetas: string[]
  valores: number[]
  /** Un color por barra, en el mismo orden de las etiquetas. */
  colores: string[]
  /** Falso para contar cosas (usuarios) en vez de dinero. */
  enPesos?: boolean
}>()

function formatearValor(valor: number): string {
  return enPesos ? formatearPesos(valor) : String(valor)
}

const datos = computed<ChartData<'bar'>>(() => ({
  labels: props.etiquetas,
  datasets: [
    { data: props.valores, backgroundColor: props.colores, borderRadius: 6, maxBarThickness: 26 },
  ],
}))

// Barras horizontales: los nombres de las categorías son largos y así se leen completos.
const opciones = computed<ChartOptions<'bar'>>(() => ({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (barra) => formatearValor(barra.parsed.x ?? 0) } },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: { color: COLORES.rejilla },
      ticks: {
        color: COLORES.apagado,
        precision: 0,
        callback: (valor) => formatearValor(Number(valor)),
      },
    },
    y: { grid: { display: false }, ticks: { color: COLORES.apagado } },
  },
}))

// La altura crece con la cantidad de barras para que no queden apretadas.
const alto = computed(() => `${Math.max(160, props.etiquetas.length * 40)}px`)
</script>

<template>
  <div :style="{ height: alto }">
    <Bar :data="datos" :options="opciones" />
  </div>
</template>
