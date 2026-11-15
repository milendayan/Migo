import { peticion } from './api';
import { idUsuario } from './sesionService';

// AAAA-MM-DD (backend) -> DD/MM/AAAA (pantalla)
const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
};

// DD/MM/AAAA (pantalla) -> AAAA-MM-DD (backend)
const convertirFecha = (fecha) => {
  const texto = String(fecha || '').trim();
  if (!texto) return '';

  const partes = texto.split('/');
  if (partes.length !== 3) {
    throw new Error('La fecha debe tener el formato DD/MM/AAAA.');
  }

  const [dia, mes, anio] = partes;
  const fechaReal = new Date(Date.UTC(Number(anio), Number(mes) - 1, Number(dia)));

  if (
    !/^\d{2}$/.test(dia) ||
    !/^\d{2}$/.test(mes) ||
    !/^\d{4}$/.test(anio) ||
    fechaReal.getUTCFullYear() !== Number(anio) ||
    fechaReal.getUTCMonth() !== Number(mes) - 1 ||
    fechaReal.getUTCDate() !== Number(dia)
  ) {
    throw new Error('La fecha de nacimiento no es válida.');
  }

  return `${anio}-${mes}-${dia}`;
};

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return '—';

  const [anio, mes, dia] = fechaNacimiento.split('-').map(Number);
  const hoy = new Date();

  let anios = hoy.getFullYear() - anio;
  let meses = hoy.getMonth() + 1 - mes;

  if (hoy.getDate() < dia) meses--;
  if (meses < 0) {
    anios--;
    meses += 12;
  }

  if (anios < 0) return '—';
  if (anios === 0) return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  return `${anios} ${anios === 1 ? 'año' : 'años'}`;
};

const mostrarHora = (hora) => {
  if (!hora) return '';
  const [horasTexto, minutos] = hora.split(':');
  const horas = Number(horasTexto);
  return `${horas % 12 || 12}:${minutos} ${horas >= 12 ? 'p. m.' : 'a. m.'}`;
};

// Convierte una mascota del backend al formato de las pantallas
const adaptarMascota = (mascota) => ({
  id: mascota.id,
  nombre: mascota.nombre,
  especie: mascota.especie,
  raza: mascota.raza || '',
  emoji:
    mascota.especie === 'Perro' ? '🐶' :
    mascota.especie === 'Gato' ? '🐱' : '🐾',
  peso: mascota.peso != null ? `${mascota.peso} kg` : '',
  sexo: mascota.sexo || '',
  color: mascota.color || '',
  edad: calcularEdad(mascota.fechaNacimiento),
  fechaNacimiento: formatearFecha(mascota.fechaNacimiento),
  microchip: mascota.microchip || '',
  notas: mascota.notas || '',
  actividades: '0 de 0 actividades',
  progreso: 0,
  pendientes: '0 pendientes',
  proximaActividad: '',
  proximaEmoji: '',
  proximaHora: '',
  imagen: null,
});

// Convierte el formulario al formato del backend
const prepararMascota = (form) => {
  const pesoTexto = String(form.peso ?? '')
    .replace('kg', '')
    .replace(',', '.')
    .trim();
  const peso = pesoTexto ? Number(pesoTexto) : null;

  if (peso !== null && (!Number.isFinite(peso) || peso <= 0)) {
    throw new Error('Ingresa un peso válido. Ejemplo: 28.5');
  }

  const limpiar = (valor) => (valor && valor !== '—' ? String(valor).trim() : '');

  return {
    usuarioId: idUsuario(),
    nombre: limpiar(form.nombre),
    especie: limpiar(form.especie),
    raza: limpiar(form.raza),
    sexo: limpiar(form.sexo),
    fechaNacimiento: convertirFecha(form.fechaNacimiento),
    peso,
    color: limpiar(form.color),
    microchip: limpiar(form.microchip),
    notas: limpiar(form.notas),
  };
};

// GET /api/mascotas?usuarioId=...  y  GET /api/actividades?usuarioId=...
// Con las actividades se calcula el progreso del día de cada mascota.
export const obtenerMascotas = async () => {
  const usuarioId = idUsuario();

  const [mascotasData, actividadesData] = await Promise.all([
    peticion(`/mascotas?usuarioId=${usuarioId}`),
    peticion(`/actividades?usuarioId=${usuarioId}`),
  ]);

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

  return mascotasData.map((mascota) => {
    const datos = adaptarMascota(mascota);

    const actividadesMascota = actividadesData.filter(
      (actividad) => actividad.mascotaId === mascota.id
    );
    const actividadesHoy = actividadesMascota.filter(
      (actividad) => actividad.fecha === fechaHoy
    );

    const total = actividadesHoy.length;
    const completadas = actividadesHoy.filter((a) => a.completada).length;
    const pendientes = total - completadas;

    // Próxima actividad pendiente desde este momento
    const proxima = actividadesMascota.find(
      (a) =>
        !a.completada &&
        (a.fecha > fechaHoy || (a.fecha === fechaHoy && a.hora >= ahora))
    );

    return {
      ...datos,
      actividades: `${completadas} de ${total} actividades`,
      progreso: total > 0 ? Math.round((completadas / total) * 100) : 0,
      pendientes: `${pendientes} pendientes`,
      proximaActividad: proxima ? `${proxima.nombre} ${mostrarHora(proxima.hora)}` : '',
      proximaHora: proxima ? mostrarHora(proxima.hora) : '',
      proximaEmoji: proxima ? '📅' : '',
    };
  });
};

// POST /api/mascotas
export const guardarMascota = async (form) => {
  const datos = await peticion('/mascotas', 'POST', prepararMascota(form));
  return adaptarMascota(datos);
};

// PUT /api/mascotas/{id}
export const actualizarMascota = async (id, form) => {
  const datos = await peticion(`/mascotas/${id}`, 'PUT', prepararMascota(form));
  return adaptarMascota(datos);
};

// GET /api/mascotas/{id}/historial
// Devuelve { vacunas: [], citas: [], pesos: [] } como lo usa la pantalla
export const obtenerHistorial = async (mascotaId) => {
  const registros = await peticion(`/mascotas/${mascotaId}/historial`);

  return {
    vacunas: registros
      .filter((r) => r.categoria === 'vacuna')
      .map((r) => ({
        id: r.id,
        nombre: r.nombre,
        fecha: r.fecha,
        estado: r.estado || 'Al día',
        icono: '💉',
      })),
    citas: registros
      .filter((r) => r.categoria === 'cita')
      .map((r) => ({
        id: r.id,
        tipo: r.nombre,
        fecha: r.fecha,
        hora: r.hora,
        veterinario: r.veterinario || '—',
        estado: r.estado || 'Próxima',
        icono: '🩺',
      })),
    pesos: registros
      .filter((r) => r.categoria === 'peso')
      .map((r) => ({ id: r.id, mes: r.mes, valor: r.valor })),
  };
};

// POST /api/mascotas/{id}/historial
// categoria: 'vacuna' | 'cita' | 'peso'
export const agregarRegistroHistorial = async (mascotaId, categoria, form) => {
  const registro =
    categoria === 'vacuna'
      ? { categoria, nombre: form.nombre.trim(), fecha: form.fecha.trim(), estado: form.estado }
      : categoria === 'cita'
      ? {
          categoria,
          nombre: form.tipo.trim(),
          fecha: form.fecha.trim(),
          hora: form.hora.trim(),
          veterinario: form.veterinario.trim(),
          estado: 'Próxima',
        }
      : {
          categoria,
          mes: form.mes.trim(),
          valor: Number(String(form.valor).replace(',', '.')) || null,
        };

  return peticion(`/mascotas/${mascotaId}/historial`, 'POST', registro);
};
