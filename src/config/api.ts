import { File, Paths } from 'expo-file-system';

// Puerto que se agrega cuando el usuario escribe solo la IP (ej. 192.168.1.15)
const PUERTO_API = 3000;

// Archivo donde se guarda la dirección que el usuario escribió en el login
const archivoServidor = () => new File(Paths.document, 'servidor.txt');

// Dirección activa. Empieza vacía: la escribe el usuario en el login (o se lee del archivo guardado).
let urlActual = '';

type Escucha = (url: string) => void;
const escuchas = new Set<Escucha>();

// "192.168.1.15"            -> "http://192.168.1.15:3000"
// "192.168.1.15:4000"       -> "http://192.168.1.15:4000"
// "https://miapi.com/"      -> "https://miapi.com"
export const normalizarApiUrl = (texto: string): string => {
  let url = texto.trim().replace(/\/+$/, '');
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) {
    if (!/:\d+$/.test(url)) url += `:${PUERTO_API}`;
    url = `http://${url}`;
  }
  return url;
};

// Valida el formato: protocolo + IP o dominio + puerto opcional
export const apiUrlValida = (texto: string): boolean =>
  /^https?:\/\/[^\s/:]+(:\d{1,5})?$/i.test(normalizarApiUrl(texto));

export const obtenerApiUrlActual = () => urlActual;

// Lee la dirección guardada (se llama al abrir el login)
export const cargarApiUrl = async (): Promise<string> => {
  try {
    const archivo = archivoServidor();
    if (archivo.exists) {
      urlActual = normalizarApiUrl(await archivo.text());
      escuchas.forEach(fn => fn(urlActual));
    }
  } catch (e) {
    if (__DEV__) console.log('No se pudo leer la dirección guardada:', e);
  }
  return urlActual;
};

// Guarda la dirección en memoria y en el archivo, y avisa a todas las pantallas
export const guardarApiUrl = async (texto: string): Promise<string> => {
  const url = normalizarApiUrl(texto);
  urlActual = url;
  try {
    const archivo = archivoServidor();
    if (!archivo.exists) archivo.create();
    archivo.write(url);
  } catch (e) {
    if (__DEV__) console.log('No se pudo guardar la dirección:', e);
  }
  escuchas.forEach(fn => fn(url));
  return url;
};

// Devuelve una función para cancelar la suscripción
export const suscribirApiUrl = (fn: Escucha) => {
  escuchas.add(fn);
  return () => {
    escuchas.delete(fn);
  };
};
