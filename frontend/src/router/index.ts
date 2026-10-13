import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import { useSesion } from '@/composables/useSesion';
import InicioView from '@/views/InicioView.vue';
import IngresoView from '@/views/IngresoView.vue';

declare module 'vue-router' {
  interface RouteMeta {
    /** Título que se muestra en la barra superior. */
    titulo?: string;
    /** Se ve sin iniciar sesión y sin menú lateral. */
    publica?: boolean;
    /** Solo la puede abrir un usuario con rol ADMIN. */
    soloAdmin?: boolean;
  }
}

const rutas: RouteRecordRaw[] = [
  { path: '/', name: 'inicio', component: InicioView, meta: { publica: true } },
  { path: '/ingresar', name: 'ingreso', component: IngresoView, meta: { publica: true } },
  {
    path: '/registrarse',
    name: 'registro',
    component: () => import('@/views/RegistroView.vue'),
    meta: { publica: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { titulo: 'Dashboard' },
  },
  {
    path: '/propiedades',
    name: 'propiedades',
    component: () => import('@/views/propiedades/PropiedadesView.vue'),
    meta: { titulo: 'Propiedades' },
  },
  {
    path: '/propiedades/nueva',
    name: 'propiedad-nueva',
    component: () => import('@/views/propiedades/PropiedadFormularioView.vue'),
    meta: { titulo: 'Nueva propiedad' },
  },
  {
    path: '/propiedades/:id/editar',
    name: 'propiedad-editar',
    component: () => import('@/views/propiedades/PropiedadFormularioView.vue'),
    meta: { titulo: 'Editar propiedad' },
  },
  {
    path: '/contratos',
    name: 'contratos',
    component: () => import('@/views/contratos/ContratosView.vue'),
    meta: { titulo: 'Contratos' },
  },
  {
    path: '/contratos/nuevo',
    name: 'contrato-nuevo',
    component: () => import('@/views/contratos/ContratoFormularioView.vue'),
    meta: { titulo: 'Nuevo contrato' },
  },
  {
    path: '/contratos/:id/editar',
    name: 'contrato-editar',
    component: () => import('@/views/contratos/ContratoFormularioView.vue'),
    meta: { titulo: 'Editar contrato' },
  },
  {
    path: '/transacciones',
    name: 'transacciones',
    component: () => import('@/views/transacciones/TransaccionesView.vue'),
    meta: { titulo: 'Transacciones' },
  },
  {
    path: '/transacciones/nueva',
    name: 'transaccion-nueva',
    component: () => import('@/views/transacciones/TransaccionFormularioView.vue'),
    meta: { titulo: 'Nueva transacción' },
  },
  {
    path: '/transacciones/:id/editar',
    name: 'transaccion-editar',
    component: () => import('@/views/transacciones/TransaccionFormularioView.vue'),
    meta: { titulo: 'Editar transacción' },
  },
  {
    path: '/admin/usuarios',
    name: 'admin-usuarios',
    component: () => import('@/views/admin/UsuariosView.vue'),
    meta: { titulo: 'Usuarios', soloAdmin: true },
  },
  {
    path: '/admin/reporte',
    name: 'admin-reporte',
    component: () => import('@/views/admin/ReporteView.vue'),
    meta: { titulo: 'Reporte global', soloAdmin: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'no-encontrada',
    component: () => import('@/views/NoEncontradaView.vue'),
    meta: { publica: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: rutas,
  scrollBehavior: () => ({ top: 0 }),
});

// Protege las páginas internas: sin sesión se va al login; sin rol ADMIN no se entra a admin.
router.beforeEach((destino) => {
  const { estaAutenticado, esAdmin } = useSesion();

  if (destino.meta.publica) return true;
  if (!estaAutenticado.value) return { name: 'ingreso', query: { volver: destino.fullPath } };
  if (destino.meta.soloAdmin && !esAdmin.value) return { name: 'dashboard' };
  return true;
});

export default router;
