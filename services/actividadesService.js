import { peticion } from './api';
import { idUsuario } from './sesionService';

export const TIPOS_ACTIVIDAD = [
  'Medicamento',
  'Alimentación',
  'Paseo',
  'Higiene',
  'Cita veterinaria',
];

const convertirFecha = (fecha) => {
  const partes = String(fecha || '').trim().split('/');

  if (partes.length !== 3) {
    throw new Error('La fecha debe tener el formato DD/MM/AAAA.');
  }

  const [dia, mes, anio] = partes;
  const fechaReal = new Date(Date.UTC(
    Number(anio),
    Number(mes) - 1,
    Number(dia)
  ));

  if (
    !/^\d{2}$/.test(dia) ||
    !/^\d{2}$/.test(mes) ||
    !/^\d{4}$/.test(anio) ||
    fechaReal.getUTCFullYear() !== Number(anio) ||
    fechaReal.getUTCMonth() !== Number(mes) - 1 ||
    fechaReal.getUTCDate() !== Number(dia)
  ) {
    throw new Error('La fecha ingresada no es válida.');
  }

  return `${anio}-${mes}-${dia}`;
};

const mostrarFecha = (fecha) => {
  if (!fecha) return '';
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
};

const convertirHora = (hora) => {
  const texto = String(hora || '').trim().toLowerCase();
  const coincidencia = texto.match(
    /^(\d{1,2}):(\d{2})(?:\s*([ap])\.?\s*m\.?)?$/
  );

  if (!coincidencia) {
    throw new Error('Usa una hora como 7:00 p. m. o 19:00.');
  }

  let horas = Number(coincidencia[1]);
  const minutos = Number(coincidencia[2]);
  const periodo = coincidencia[3];

  if (minutos > 59 || horas < 0 || horas > (periodo ? 12 : 23)) {
    throw new Error('La hora ingresada no es válida.');
  }

  if (periodo) {
    if (horas === 0) throw new Error('La hora no es válida.');
    horas = (horas % 12) + (periodo === 'p' ? 12 : 0);
  }

  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
};

const mostrarHora = (hora) => {
  if (!hora) return '';

  const [horasTexto, minutos] = hora.split(':');
  const horas = Number(horasTexto);

  return `${horas % 12 || 12}:${minutos} ${horas >= 12 ? 'p. m.' : 'a. m.'}`;
};

const emojiPorTipo = (tipo) => ({
  Medicamento: '💊',
  Alimentación: '🍽️',
  Paseo: '🐕',
  Higiene: '🧼',
  'Cita veterinaria': '🩺',
}[tipo] || '🐾');

// Convierte una actividad del backend al formato que usan las pantallas
const adaptarActividad = (actividad) => {
  const hoy = new Date();
  const fechaHoy = [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, '0'),
    String(hoy.getDate()).padStart(2, '0'),
  ].join('-');

  return {
    id: actividad.id,
    mascotaId: actividad.mascotaId,
    mascota: actividad.mascotaNombre || '',
    nombre: actividad.nombre,
    tipo: actividad.tipo,
    hora: mostrarHora(actividad.hora),
    fecha: mostrarFecha(actividad.fecha),
    repeticion: actividad.repetir,
    recordatorioOn: actividad.recordatorioActivo,
    recordatorio: actividad.minutosAntes === 60
      ? '1 hora antes'
      : `${actividad.minutosAntes || 15} minutos antes`,
    notas: actividad.notas || '',
    completada: actividad.completada,
    dia: actividad.fecha === fechaHoy ? 'hoy' : 'semana',
    diaSemana: '',
    emoji: emojiPorTipo(actividad.tipo),
  };
};

// Convierte el formulario de la pantalla al formato del backend
const prepararActividad = (form) => {
  if (!form.mascotaId) {
    throw new Error('Selecciona una mascota.');
  }

  const minutos = form.recordatorio === '1 hora antes'
    ? 60
    : Number.parseInt(form.recordatorio, 10) || 15;

  return {
    usuarioId: idUsuario(),
    mascotaId: form.mascotaId,
    nombre: form.nombre.trim(),
    tipo: form.tipo.trim(),
    fecha: convertirFecha(form.fecha),
    hora: convertirHora(form.hora),
    repetir: form.repeticion || 'Una vez',
    recordatorioActivo: form.recordatorioOn,
    minutosAntes: minutos,
    notas: form.notas?.trim() || '',
  };
};

// GET /api/actividades?usuarioId=...
export const obtenerActividadesHorario = async () => {
  const datos = await peticion(`/actividades?usuarioId=${idUsuario()}`);
  return datos.map(adaptarActividad);
};

// Actividades de hoy (pantalla de Inicio)
export const obtenerActividades = async () => {
  const actividades = await obtenerActividadesHorario();
  return actividades.filter((actividad) => actividad.dia === 'hoy');
};

// POST /api/actividades
export const crearActividadApi = async (form) => {
  const datos = await peticion('/actividades', 'POST', prepararActividad(form));
  return adaptarActividad(datos);
};

// PUT /api/actividades/{id}
export const actualizarActividadApi = async (id, form) => {
  const datos = await peticion(`/actividades/${id}`, 'PUT', prepararActividad(form));
  return adaptarActividad(datos);
};

// PUT /api/actividades/{id}/completada?usuarioId=...
export const cambiarCompletadaApi = async (id, completada) => {
  await peticion(
    `/actividades/${id}/completada?usuarioId=${idUsuario()}`,
    'PUT',
    { completada }
  );
};

// DELETE /api/actividades/{id}?usuarioId=...
export const eliminarActividadApi = async (id) => {
  await peticion(`/actividades/${id}?usuarioId=${idUsuario()}`, 'DELETE');
};
