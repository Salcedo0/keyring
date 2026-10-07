import { ref, type Ref } from 'vue'

import { describirError } from '@/services/http'

/**
 * Maneja los estados de una consulta al back: cargando, error y datos.
 * Evita repetir el mismo try/catch en cada vista.
 *
 * Uso:
 *   const { datos, cargando, error, cargar } = useConsulta(obtenerPropiedades, [])
 *   onMounted(cargar)
 */
export function useConsulta<T>(consultar: () => Promise<T>, valorInicial: T) {
  const datos = ref(valorInicial) as Ref<T>
  const cargando = ref(false)
  const error = ref('')

  async function cargar(): Promise<void> {
    cargando.value = true
    error.value = ''
    try {
      datos.value = await consultar()
    } catch (problema) {
      error.value = describirError(problema, 'No se pudieron cargar los datos.')
    } finally {
      cargando.value = false
    }
  }

  return { datos, cargando, error, cargar }
}
