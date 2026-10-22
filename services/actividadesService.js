const actividadesMock = [
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

export const obtenerActividades = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(actividadesMock), 300);
  });
};