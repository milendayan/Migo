
import { supabase } from './supabaseClient';

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

  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:00`;
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

const adaptarActividad = (actividad) => {
  const fecha = mostrarFecha(actividad.fecha);
  const hoy = new Date();
  const fechaHoy = [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, '0'),
    String(hoy.getDate()).padStart(2, '0'),
  ].join('-');

  return {
    id: actividad.id,
    mascotaId: actividad.mascota_id,
    mascota: actividad.mascotas?.nombre || '',
    nombre: actividad.nombre,
    tipo: actividad.tipo,
    hora: mostrarHora(actividad.hora),
    fecha,
    repeticion: actividad.repetir,
    recordatorioOn: actividad.recordatorio_activo,
    recordatorio: actividad.minutos_antes === 60
      ? '1 hora antes'
      : `${actividad.minutos_antes || 15} minutos antes`,
    notas: actividad.notas || '',
    completada: actividad.completada,
    dia: actividad.fecha === fechaHoy ? 'hoy' : 'semana',
    diaSemana: '',
    emoji: emojiPorTipo(actividad.tipo),
  };
};

const obtenerUsuario = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error('Debes iniciar sesión.');

  return user;
};

export const obtenerActividadesHorario = async () => {
  const user = await obtenerUsuario();

  const { data, error } = await supabase
    .from('actividades')
    .select('*, mascotas(nombre)')
    .eq('usuario_id', user.id)
    .order('fecha', { ascending: true })
    .order('hora', { ascending: true });

  if (error) throw error;

  return (data || []).map(adaptarActividad);
};

export const obtenerActividades = async () => {
  const actividades = await obtenerActividadesHorario();

  return actividades
    .filter((actividad) => actividad.dia === 'hoy')
    .map((actividad) => ({
      id: actividad.id,
      nombre: actividad.nombre,
      tipo: actividad.tipo,
      mascota: actividad.mascota,
      hora: actividad.hora,
      emoji: actividad.emoji,
      completada: actividad.completada,
    }));
};

export const guardarActividadSupabase = async (form) => {
  const user = await obtenerUsuario();

  if (!form.mascotaId) {
    throw new Error('Selecciona una mascota.');
  }

  const minutos = form.recordatorio === '1 hora antes'
    ? 60
    : Number.parseInt(form.recordatorio, 10) || 15;

  const valores = {
    usuario_id: user.id,
    mascota_id: form.mascotaId,
    nombre: form.nombre.trim(),
    tipo: form.tipo.trim(),
    fecha: convertirFecha(form.fecha),
    hora: convertirHora(form.hora),
    repetir: form.repeticion || 'Una vez',
    recordatorio_activo: form.recordatorioOn,
    minutos_antes: minutos,
    notas: form.notas?.trim() || null,
  };

  const { data, error } = await supabase
    .from('actividades')
    .insert(valores)
    .select('*, mascotas(nombre)')
    .single();

  if (error) throw error;

  return adaptarActividad(data);
};

export const actualizarActividadSupabase = async (id, form) => {
  const user = await obtenerUsuario();

  const minutos = form.recordatorio === '1 hora antes'
    ? 60
    : Number.parseInt(form.recordatorio, 10) || 15;

  const { data, error } = await supabase
    .from('actividades')
    .update({
      mascota_id: form.mascotaId,
      nombre: form.nombre.trim(),
      tipo: form.tipo.trim(),
      fecha: convertirFecha(form.fecha),
      hora: convertirHora(form.hora),
      repetir: form.repeticion || 'Una vez',
      recordatorio_activo: form.recordatorioOn,
      minutos_antes: minutos,
      notas: form.notas?.trim() || null,
    })
    .eq('id', id)
    .eq('usuario_id', user.id)
    .select('*, mascotas(nombre)')
    .single();

  if (error) throw error;

  return adaptarActividad(data);
};

export const cambiarCompletadaSupabase = async (id, completada) => {
  const user = await obtenerUsuario();

  const { error } = await supabase
    .from('actividades')
    .update({ completada })
    .eq('id', id)
    .eq('usuario_id', user.id);

  if (error) throw error;
};

export const eliminarActividadSupabase = async (id) => {
  const user = await obtenerUsuario();

  const { error } = await supabase
    .from('actividades')
    .delete()
    .eq('id', id)
    .eq('usuario_id', user.id);

  if (error) throw error;
};
