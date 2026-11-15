// Conexión con el backend Ktor.
// La URL se configura en el archivo .env (EXPO_PUBLIC_API_URL).
// Emulador Android: http://10.0.2.2:8080/api
// Celular físico con Expo Go: http://IP-DEL-COMPUTADOR:8080/api
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8080/api';

// Hace una petición HTTP y devuelve el JSON de la respuesta.
// Si el servidor responde con error, lanza un Error con su mensaje.
export const peticion = async (ruta, metodo = 'GET', cuerpo) => {
  let respuesta;

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
  } catch (e) {
    throw new Error(
      'No se pudo conectar con el servidor. Revisa que el backend esté encendido.'
    );
  }

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new Error(datos?.mensaje || `Error del servidor (${respuesta.status})`);
  }

  return datos;
};
