import { peticion } from './api';

// POST /api/ia/chat
// mensajes: [{ rol: 'usuario' | 'migo', texto: '...' }]
export const preguntarMigoIA = async (mensajes) => {
  const datos = await peticion('/ia/chat', 'POST', { mensajes });
  return datos.respuesta;
};
