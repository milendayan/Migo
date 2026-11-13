
import { supabase } from './supabaseClient';

// Convertir fecha de Supabase al formato de MIGO
const formatearFecha = (fecha) => {
  if (!fecha) return '';

  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
};

// Convertir una mascota de Supabase al formato
// que utilizan las pantallas actuales de MIGO.

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return '—';

  const [anio, mes, dia] = fechaNacimiento.split('-').map(Number);

  const hoy = new Date();

  let anios = hoy.getFullYear() - anio;
  let meses = hoy.getMonth() + 1 - mes;

  if (hoy.getDate() < dia) {
    meses--;
  }

  if (meses < 0) {
    anios--;
    meses += 12;
  }

  if (anios < 0) return '—';

  if (anios === 0) {
    return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  }

  return `${anios} ${anios === 1 ? 'año' : 'años'}`;
};

const adaptarMascota = (mascota) => {
  return {
    id: mascota.id,
    nombre: mascota.nombre,
    especie: mascota.especie,
    raza: mascota.raza || '',
    emoji:
      mascota.emoji ||
      (mascota.especie === 'Perro' ? '🐶' :
       mascota.especie === 'Gato' ? '🐱' : '🐾'),

    peso: mascota.peso != null ? `${mascota.peso} kg` : '',
    sexo: mascota.sexo || '',
    color: mascota.color || '',
    edad: calcularEdad(mascota.fecha_nacimiento),
    fechaNacimiento: formatearFecha(mascota.fecha_nacimiento),
    microchip: mascota.microchip || '',
    notas: mascota.notas || '',

    // Valores iniciales hasta conectar actividades.
    actividades: '0 de 0 actividades',
    progreso: 0,
    pendientes: '0 pendientes',
    proximaActividad: '',
    proximaEmoji: '',
    proximaHora: '',

    imagen: null,
  };
};

// Obtener las mascotas del usuario autenticado

export const obtenerMascotas = async () => {
  const {
    data: { user },
    error: errorUsuario,
  } = await supabase.auth.getUser();

  if (errorUsuario) throw errorUsuario;
  if (!user) return [];

  // Consultar mascotas del usuario
  const { data: mascotasData, error: errorMascotas } =
    await supabase
      .from('mascotas')
      .select('*')
      .eq('usuario_id', user.id)
      .order('creado_en', { ascending: false });

  if (errorMascotas) throw errorMascotas;

  // Consultar actividades del mismo usuario
  const { data: actividadesData, error: errorActividades } =
    await supabase
      .from('actividades')
      .select('*')
      .eq('usuario_id', user.id)
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true });

  if (errorActividades) throw errorActividades;

  const hoy = new Date();

  const fechaHoy = [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, '0'),
    String(hoy.getDate()).padStart(2, '0'),
  ].join('-');

  const ahora = [
    String(hoy.getHours()).padStart(2, '0'),
    String(hoy.getMinutes()).padStart(2, '0'),
  ].join(':');

  const mostrarHora = (hora) => {
    if (!hora) return '';

    const [horasTexto, minutos] = hora.split(':');
    const horas = Number(horasTexto);

    return `${horas % 12 || 12}:${minutos} ${
      horas >= 12 ? 'p. m.' : 'a. m.'
    }`;
  };

  return (mascotasData || []).map((mascota) => {
    const datos = adaptarMascota(mascota);

    // Actividades que pertenecen a esta mascota
    const actividadesMascota = (actividadesData || []).filter(
      (actividad) => actividad.mascota_id === mascota.id
    );

    // Actividades programadas para hoy
    const actividadesHoy = actividadesMascota.filter(
      (actividad) => actividad.fecha === fechaHoy
    );

    const total = actividadesHoy.length;

    const completadas = actividadesHoy.filter(
      (actividad) => actividad.completada
    ).length;

    const pendientes = total - completadas;

    // Próxima actividad pendiente, desde este momento
    const proxima = actividadesMascota.find(
      (actividad) =>
        !actividad.completada &&
        (
          actividad.fecha > fechaHoy ||
          (
            actividad.fecha === fechaHoy &&
            actividad.hora.slice(0, 5) >= ahora
          )
        )
    );

    return {
      ...datos,

      actividades: `${completadas} de ${total} actividades`,

      progreso:
        total > 0
          ? Math.round((completadas / total) * 100)
          : 0,

      pendientes: `${pendientes} pendientes`,

      proximaActividad: proxima
        ? `${proxima.nombre} ${mostrarHora(proxima.hora)}`
        : '',

      proximaHora: proxima
        ? mostrarHora(proxima.hora)
        : '',

      proximaEmoji: proxima ? '📅' : '',
    };
  });
};


// Guardar una mascota nueva en Supabase
export const guardarMascota = async (mascota) => {
  const {
    data: { user },
    error: errorUsuario,
  } = await supabase.auth.getUser();

  if (errorUsuario) throw errorUsuario;

  if (!user) {
    throw new Error('Debes iniciar sesión para registrar una mascota.');
  }

  const nombre = mascota.nombre?.trim();
  const especie = mascota.especie?.trim();

  if (!nombre || !especie) {
    throw new Error('El nombre y la especie son obligatorios.');
  }

  // El formulario utiliza DD/MM/AAAA.
  // Supabase guarda fechas como AAAA-MM-DD.
  let fechaNacimiento = null;

  if (mascota.fechaNacimiento?.trim()) {
    const partes = mascota.fechaNacimiento.trim().split('/');

    if (partes.length !== 3) {
      throw new Error('La fecha debe tener el formato DD/MM/AAAA.');
    }

    const [dia, mes, anio] = partes;
    const fecha = new Date(Date.UTC(
      Number(anio),
      Number(mes) - 1,
      Number(dia)
    ));

    if (
      !/^\d{2}$/.test(dia) ||
      !/^\d{2}$/.test(mes) ||
      !/^\d{4}$/.test(anio) ||
      fecha.getUTCFullYear() !== Number(anio) ||
      fecha.getUTCMonth() !== Number(mes) - 1 ||
      fecha.getUTCDate() !== Number(dia)
    ) {
      throw new Error('La fecha de nacimiento no es válida.');
    }

    fechaNacimiento = `${anio}-${mes}-${dia}`;
  }

  const pesoTexto = String(mascota.peso ?? '')
    .replace('kg', '')
    .replace(',', '.')
    .trim();

  const peso = pesoTexto ? Number(pesoTexto) : null;

  if (peso !== null && (!Number.isFinite(peso) || peso <= 0)) {
    throw new Error('El peso debe ser un número mayor que cero.');
  }

  const { data, error } = await supabase
    .from('mascotas')
    .insert({
      usuario_id: user.id,
      nombre,
      especie,
      raza: mascota.raza?.trim() || null,
      sexo: mascota.sexo || null,
      fecha_nacimiento: fechaNacimiento,
      peso,
      color: mascota.color?.trim() || null,
      microchip: mascota.microchip?.trim() || null,
      notas: mascota.notas?.trim() || null,
      emoji: mascota.emoji || null,
    })
    .select()
    .single();

  if (error) throw error;

  return adaptarMascota(data);
};

// Historial vacío temporalmente.
// Después conectaremos vacunas, citas y peso.
export const obtenerHistorial = async () => {
  return {};
};
