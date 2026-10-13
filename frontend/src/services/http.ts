import axios from 'axios';

import { borrarSesion, leerSesion } from '@/utils/almacenSesion';

/*
 * Único lugar que sabe dónde está la API. Los servicios usan `http` y solo escriben la ruta
 * ('/propiedades'); nunca la dirección completa.
 */
export const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'}/api`,
  timeout: 10_000,
});

// Agrega el token de la sesión a cada petición.
http.interceptors.request.use((configuracion) => {
  const sesion = leerSesion();
  if (sesion) configuracion.headers.Authorization = `Bearer ${sesion.token}`;
  return configuracion;
});

// Si el back dice que la sesión ya no es válida, se cierra y se vuelve al login.
// El login se excluye porque ahí un 401 solo significa "credenciales incorrectas".
http.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const esLogin = error.config?.url === '/auth/ingresar';
    if (axios.isAxiosError(error) && error.response?.status === 401 && !esLogin) {
      borrarSesion();
      window.location.assign('/ingresar');
    }
    return Promise.reject(error);
  },
);

/** Convierte cualquier error de una petición en una frase en español para mostrarle al usuario. */
export function describirError(
  error: unknown,
  mensajePorDefecto = 'Algo salió mal. Inténtalo de nuevo.',
): string {
  if (!axios.isAxiosError(error)) return mensajePorDefecto;

  if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
    return 'No se pudo conectar con el servidor. Revisa que el backend esté corriendo.';
  }

  const mensaje = (error.response?.data as { message?: string | string[] } | undefined)?.message;
  if (Array.isArray(mensaje)) return mensaje.join('. ');
  return mensaje ?? mensajePorDefecto;
}
