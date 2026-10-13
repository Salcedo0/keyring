import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { onBeforeUnmount, onMounted } from 'vue'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll suave con Lenis solo mientras la vista que lo usa está montada. Las páginas internas se
 * quedan con el scroll nativo porque sus tablas, mapas y formularios dependen de él.
 */
export function useDesplazamientoSuave(): void {
  let lenis: Lenis | null = null

  // El ticker de GSAP entrega segundos y Lenis espera milisegundos.
  function avanzar(tiempo: number): void {
    lenis?.raf(tiempo * 1000)
  }

  // Se captura el clic para que el enlace no salte de golpe ni cambie la URL: el router tiene
  // scrollBehavior y, con un cambio de hash, podría devolver la página al inicio.
  function irAlAncla(evento: MouseEvent): void {
    const enlace = (evento.target as Element | null)?.closest('a[href^="#"]')
    const destino = enlace?.getAttribute('href')
    if (!lenis || !destino || destino === '#') return
    evento.preventDefault()
    lenis.scrollTo(destino)
  }

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(avanzar)
    // Sin esto, cuando un cuadro tarda GSAP compensa el tiempo y el scroll da saltos.
    gsap.ticker.lagSmoothing(0)
    document.addEventListener('click', irAlAncla)
  })

  onBeforeUnmount(() => {
    if (!lenis) return
    document.removeEventListener('click', irAlAncla)
    gsap.ticker.remove(avanzar)
    // Se devuelven los valores por defecto de GSAP para las demás páginas.
    gsap.ticker.lagSmoothing(500, 33)
    lenis.destroy()
    lenis = null
  })
}
