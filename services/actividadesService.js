// Datos simulados de actividades (preparado para futura API Ktor)

// Resumen para InicioScreen
const actividadesResumenMock = [
  {
    id: 1,
    nombre: 'Paseo',
    tipo: 'Actividad física',
    mascota: 'Max',
    hora: '4:00 p.m.',
    emoji: '🐕',
  },
  {
    id: 2,
    nombre: 'Thyro Tabs',
    tipo: 'Medicamento',
    mascota: 'Max',
    hora: '7:00 p.m.',
    emoji: '💊',
  },
  {
    id: 3,
    nombre: 'Juego',
    tipo: 'Entrenamiento',
    mascota: 'Luna',
    hora: '7:00 p.m.',
    emoji: '🎯',
  },
  {
    id: 4,
    nombre: 'Cepillado',
    tipo: 'Higiene',
    mascota: 'Luna',
    hora: '8:00 p.m.',
    emoji: '🧼',
  },
  {
    id: 5,
    nombre: 'Medicamento X',
    tipo: 'Medicamento',
    mascota: 'Max',
    hora: '8:30 p.m.',
    emoji: '💊',
  },
];

// Lista completa para HorarioScreen
const actividadesHorarioMock = [
  // Max - hoy
  { id: 1, mascotaId: 1, nombre: 'Thyro Tabs', tipo: 'Medicamento', hora: '7:00 a. m.', completada: true, dia: 'hoy' },
  { id: 2, mascotaId: 1, nombre: 'Desayuno', tipo: 'Alimentación', hora: '8:00 a. m.', completada: true, dia: 'hoy' },
  { id: 3, mascotaId: 1, nombre: 'Cuidado', tipo: 'Medicamento', hora: '12:00 p. m.', completada: true, dia: 'hoy' },
  { id: 4, mascotaId: 1, nombre: 'Almuerzo', tipo: 'Alimentación', hora: '1:00 p. m.', completada: true, dia: 'hoy' },
  { id: 5, mascotaId: 1, nombre: 'Paseo', tipo: 'Paseo', hora: '4:00 p. m.', completada: false, dia: 'hoy' },
  { id: 6, mascotaId: 1, nombre: 'Thyro Tabs', tipo: 'Medicamento', hora: '7:00 p. m.', completada: false, dia: 'hoy' },
  { id: 7, mascotaId: 1, nombre: 'Medicamento X', tipo: 'Medicamento', hora: '8:30 p. m.', completada: false, dia: 'hoy' },

  // Luna - hoy
  { id: 8, mascotaId: 2, nombre: 'Desayuno', tipo: 'Alimentación', hora: '8:00 a. m.', completada: true, dia: 'hoy' },
  { id: 9, mascotaId: 2, nombre: 'Juego', tipo: 'Entrenamiento', hora: '11:00 a. m.', completada: true, dia: 'hoy' },
  { id: 10, mascotaId: 2, nombre: 'Cepillado', tipo: 'Higiene', hora: '5:00 p. m.', completada: false, dia: 'hoy' },
  { id: 11, mascotaId: 2, nombre: 'Cena', tipo: 'Alimentación', hora: '7:00 p. m.', completada: false, dia: 'hoy' },
  { id: 12, mascotaId: 2, nombre: 'Juego nocturno', tipo: 'Entrenamiento', hora: '9:00 p. m.', completada: false, dia: 'hoy' },

  // Semana
  { id: 13, mascotaId: 1, nombre: 'Vacuna anual', tipo: 'Cita veterinaria', hora: '10:00 a. m.', completada: false, dia: 'semana', diaSemana: 'Miércoles' },
  { id: 14, mascotaId: 1, nombre: 'Baño', tipo: 'Higiene', hora: '4:00 p. m.', completada: false, dia: 'semana', diaSemana: 'Sábado' },
  { id: 15, mascotaId: 2, nombre: 'Control veterinario', tipo: 'Cita veterinaria', hora: '11:00 a. m.', completada: false, dia: 'semana', diaSemana: 'Jueves' },
];

// Tipos de actividad (opciones del formulario)
export const TIPOS_ACTIVIDAD = [
  'Medicamento',
  'Alimentación',
  'Paseo',
  'Higiene',
  'Cita veterinaria',
];

export const obtenerActividades = async () => {
  // Para Inicio (resumen)
  return new Promise((resolve) => {
    setTimeout(() => resolve(actividadesResumenMock.map((a) => ({ ...a }))), 200);
  });
};

export const obtenerActividadesHorario = async () => {
  // Para Horario (lista completa)
  return new Promise((resolve) => {
    setTimeout(() => resolve(actividadesHorarioMock.map((a) => ({ ...a }))), 250);
  });
};