// Datos simulados (preparado para futura API Ktor)
const mascotasMock = [
  {
    id: 1,
    nombre: 'Max',
    especie: 'Perro',
    raza: 'Golden Retriever',
    emoji: '🐶',
    actividades: '4 de 7 actividades',
    progreso: 57,
    pendientes: '3 pendientes',
    proximaActividad: 'Paseo 4:00 p. m.',
    proximaEmoji: '🐕',
    proximaHora: '4:00 p.m.',
    peso: '28.5 kg',
    edad: '3 años',
    sexo: 'Macho',
    color: 'Dorado',
    fechaNacimiento: '12/05/2023',
    microchip: '985 112 000 123',
    notas: 'Le gusta jugar con la pelota y es muy sociable.',
    imagen: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800',
  },
  {
    id: 2,
    nombre: 'Luna',
    especie: 'Gato',
    raza: 'Criollo',
    emoji: '🐱',
    actividades: '3 de 5 actividades',
    progreso: 60,
    pendientes: '2 pendientes',
    proximaActividad: 'Juego 7:00 p. m.',
    proximaEmoji: '🎯',
    proximaHora: '7:00 p.m.',
    peso: '4.2 kg',
    edad: '2 años',
    sexo: 'Hembra',
    color: 'Naranja atigrado',
    fechaNacimiento: '10/08/2023',
    microchip: '981 000 987 654',
    notas: 'Es un poco tímida con extraños pero muy cariñosa en casa.',
    imagen: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800',
  },
];

const historialMock = {
  1: {
    vacunas: [
      { id: 1, nombre: 'Rabia', fecha: '10/03/2026', estado: 'Al día', detalle: 'Aplicada: 10/03/2026', icono: '💉' },
      { id: 2, nombre: 'Moquillo y parvovirus', fecha: '15/11/2026', estado: 'Pendiente', detalle: 'Próxima: 15/11/2026', icono: '💉' },
      { id: 3, nombre: 'Desparasitación', fecha: '01/09/2026', estado: 'Al día', detalle: 'Aplicada: 01/09/2026', icono: '💊' },
    ],
    citas: [
      { id: 1, tipo: 'Control general', fecha: '23/10/2026', hora: '10:00 a. m.', veterinario: 'VetCare', estado: 'Próxima', icono: '🩺' },
      { id: 2, tipo: 'Limpieza dental', fecha: '05/08/2026', hora: '', veterinario: 'VetCare', estado: 'Realizada', icono: '🦷' },
    ],
    pesos: [
      { mes: 'May', valor: 26.0 },
      { mes: 'Jun', valor: 26.8 },
      { mes: 'Jul', valor: 27.2 },
      { mes: 'Ago', valor: 27.8 },
      { mes: 'Sep', valor: 28.2 },
      { mes: 'Oct', valor: 28.5 },
    ],
  },
  2: {
    vacunas: [
      { id: 1, nombre: 'Triple felina', fecha: '12/04/2025', estado: 'Al día', detalle: 'Aplicada: 12/04/2025', icono: '💉' },
      { id: 2, nombre: 'Rabia', fecha: '12/04/2025', estado: 'Al día', detalle: 'Aplicada: 12/04/2025', icono: '💉' },
      { id: 3, nombre: 'Leucemia felina', fecha: '01/09/2024', estado: 'Pendiente', detalle: 'Próxima: 01/09/2024', icono: '💊' },
    ],
    citas: [
      { id: 1, tipo: 'Control anual', fecha: '18/11/2025', hora: '11:30 a. m.', veterinario: 'Dra. Gómez', estado: 'Próxima', icono: '🩺' },
    ],
    pesos: [
      { mes: 'May', valor: 3.9 },
      { mes: 'Jun', valor: 4.0 },
      { mes: 'Jul', valor: 4.1 },
      { mes: 'Ago', valor: 4.1 },
      { mes: 'Sep', valor: 4.2 },
      { mes: 'Oct', valor: 4.2 },
    ],
  },
};

export const obtenerMascotas = async () => {
  // Simula llamada a API
  return new Promise((resolve) => {
    setTimeout(() => resolve(mascotasMock.map((m) => ({ ...m }))), 250);
  });
};

export const obtenerHistorial = async () => {
  // Simula llamada a API (copia para no mutar el mock)
  return new Promise((resolve) => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(historialMock))), 250);
  });
};