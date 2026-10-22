// Datos simulados (mientras no exista backend Ktor)
const mascotasMock = [
  {
    id: 1,
    nombre: 'Max',
    especie: 'Perro',
    raza: 'Golden Retriever',
    emoji: '🐶',
    actividades: '4 de 7 actividades',
    progreso: '57%',
    proximaActividad: 'Paseo',
    proximaEmoji: '🐕',
    proximaHora: '4:00 p.m.',
    // Datos extra para el modal
    peso: '32 kg',
    edad: '3 años',
    sexo: 'Macho',
    color: 'Dorado',
    fechaNacimiento: '15/03/2022',
    microchip: '981000123456789',
    notas: 'Le gusta jugar con la pelota y es muy sociable.',
  },
  {
    id: 2,
    nombre: 'Luna',
    especie: 'Gato',
    raza: 'Criollo',
    emoji: '🐱',
    actividades: '3 de 5 actividades',
    progreso: '60%',
    proximaActividad: 'Juego',
    proximaEmoji: '🎯',
    proximaHora: '7:00 p.m.',
    // Datos extra para el modal
    peso: '4.2 kg',
    edad: '2 años',
    sexo: 'Hembra',
    color: 'Naranja',
    fechaNacimiento: '10/08/2023',
    microchip: '981000987654321',
    notas: 'Es un poco tímida con extraños pero muy cariñosa en casa.',
  },
];

export const obtenerMascotas = async () => {
  // Simula llamada a API
  return new Promise((resolve) => {
    setTimeout(() => resolve(mascotasMock), 300);
  });
};